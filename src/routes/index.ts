import Boom from '@hapi/boom';
import type Hapi from '@hapi/hapi';
import type { account } from '@prisma/client';

import { hash, hashPassword, verify } from '../hash';
import { LoginPayloadSchema, RegisterPayloadSchema } from '../schema';

export type TRegisterPayload = Pick<account, 'email' | 'username' | 'password' | 'type'>;

export type TLoginPayload = Pick<account, 'email' | 'password'>;

export const register: Hapi.ServerRoute = {
  method: 'POST',
  path: '/auth/register',
  options: { validate: { payload: RegisterPayloadSchema } },
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
  options: { validate: { payload: LoginPayloadSchema } },
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

    const session = await request.server.app.db.token.create({
      data: { id: token, user_id: user!.id },
      select: { id: true },
    });

    return { token: `Bearer ${session.id}` };
  },
};
