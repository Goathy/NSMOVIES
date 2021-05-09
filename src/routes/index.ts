import qs from 'querystring';

import Boom from '@hapi/boom';
import type Hapi from '@hapi/hapi';
import { getConfig } from '@nscode/config';
import type { account } from '@prisma/client';
import axios from 'axios';

import { hash, hashPassword, verify } from '../hash';
import { AddMoviePayloadSchema, LoginPayloadSchema, RegisterPayloadSchema } from '../schema';

export type TRegisterPayload = Pick<account, 'email' | 'username' | 'password' | 'type'>;

export type TLoginPayload = Pick<account, 'email' | 'password'>;

export type TAddMoviePayload = { readonly title: string };

export type TAxiosMovieResponse = {
  readonly Title: string;
  readonly Genre: string;
  readonly Released: string;
  readonly Director: string;
};

export const register: Hapi.ServerRoute = {
  method: 'POST',
  path: '/auth/register',
  options: { validate: { payload: RegisterPayloadSchema }, auth: { mode: 'try' } },
  handler: async (request) => {
    const { email, password, type, username } = request.payload as TRegisterPayload;

    const count = await request.server.app.db.account.count({ where: { email } });

    if (count) {
      throw Boom.conflict(`Email ${email} already exist.`);
    }

    const passwdHash = hashPassword(password);

    await request.server.app.db.account.create({
      data: { email, password: passwdHash, type, username },
    });

    return { status: 'success' };
  },
};

export const login: Hapi.ServerRoute = {
  method: 'POST',
  path: '/auth/login',
  options: { validate: { payload: LoginPayloadSchema }, auth: { mode: 'try' } },
  handler: async (request) => {
    const { email, password } = request.payload as TLoginPayload;

    const count = await request.server.app.db.account.count({ where: { email } });

    if (!count) {
      throw Boom.notFound(`User don't exist.`);
    }

    const user = await request.server.app.db.account.findUnique({
      where: { email },
      select: { password: true, id: true },
    });

    const verifiedPasswd = verify(password, user!.password);

    if (!verifiedPasswd) {
      throw Boom.teapot('Wrong password');
    }

    const token = hash(30);

    const tokenExist = await request.server.app.db.token.count({
      where: { user_id: user!.id },
    });

    if (tokenExist) {
      const token = await request.server.app.db.token.findUnique({ where: { user_id: user!.id } });
      return { token: `Bearer ${token!.id}` };
    }

    const session = await request.server.app.db.token.create({
      data: { id: token, user_id: user!.id },
      select: { id: true },
    });

    return { token: `Bearer ${session.id}` };
  },
};

export const auth: Hapi.ServerRoute = {
  method: 'POST',
  path: '/auth',
  handler: (request) => {
    const userId = request.auth.credentials.userId;
    const token = request.auth.credentials.token;

    return { token, userId };
  },
};

export const addMovie: Hapi.ServerRoute = {
  method: 'POST',
  path: '/movies',
  options: { validate: { payload: AddMoviePayloadSchema } },
  handler: async (request) => {
    const { title } = request.payload as TAddMoviePayload;
    const { userId, scope } = request.auth.credentials;
    const parsedTitle = qs.stringify({ t: title });

    const count = await request.server.app.db.session_track.count({ where: { user_id: userId } });

    if (scope?.includes('basic') && count >= 5) {
      throw Boom.badRequest('Reached limit for free tier.');
    }

    const { data } = await axios.get<TAxiosMovieResponse>(
      `http://www.omdbapi.com/?apiKey=${getConfig('API_KEY')}&${parsedTitle}`
    );

    await request.server.app.db.movie.create({
      data: {
        director: data.Director,
        genre: data.Genre,
        title: data.Title,
        released: data.Released,
        user_id: userId,
      },
    });

    if (scope?.includes('basic')) {
      await request.server.app.db.session_track.create({ data: { user_id: userId } });
    }

    return { status: 'success' };
  },
};

export const getMovie: Hapi.ServerRoute = {
  method: 'GET',
  path: '/movies',
  handler: async (request) => {
    const { userId } = request.auth.credentials;

    const movies = await request.server.app.db.movie.findMany({
      where: { user_id: userId },
      select: { title: true, director: true, released: true, genre: true },
    });

    return { data: movies };
  },
};
