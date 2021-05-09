import type Hapi from '@hapi/hapi';

import { getServerWithPlugins } from '../src/main';

describe('Routes', () => {
  let server: Hapi.Server;

  beforeAll(async () => {
    server = await getServerWithPlugins();
  });

  afterAll(async () => {
    await server.stop();
  });

  describe('[POST] /auth/register', () => {
    it('Should create user', async () => {
      const injection = await server.inject({
        method: 'POST',
        url: '/auth/register',
        payload: {
          username: 'example',
          email: 'email@example.com',
          password: 'password',
          type: 1,
        },
      });

      expect(injection.statusCode).toBe(200);
    });
    it('Should throw 409 if user with provided email already exist', async () => {
      await server.inject({
        method: 'POST',
        url: '/auth/register',
        payload: {
          username: 'anotherExample',
          email: 'another.example@example.com',
          password: 'password',
          type: 0,
        },
      });

      const injection = await server.inject({
        method: 'POST',
        url: '/auth/register',
        payload: {
          username: 'anotherExample',
          email: 'another.example@example.com',
          password: 'password',
          type: 1,
        },
      });

      expect(injection.statusCode).toBe(409);
    });
  });
  describe('[POST] /auth/login', () => {
    it('Should login user', async () => {
      const injection = await server.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'nscode@example.com',
          password: 'P@ssw0rd!11',
        },
      });

      expect(injection.statusCode).toBe(200);
      expect(
        (injection.result as { readonly token: string }).token.includes('Bearer')
      ).toBeTruthy();
    });

    it('Should throw 418 if user provide wrong password', async () => {
      const injection = await server.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'nscode@example.com',
          password: 'P@ssw0rd!11dd',
        },
      });

      expect(injection.statusCode).toBe(418);
    });

    it("Should throw 404 if user don't exist ", async () => {
      const injection = await server.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'notexisting@email.com',
          password: 'password',
        },
      });

      expect(injection.statusCode).toBe(404);
    });
  });
  describe('[POST] /auth', () => {
    it('Should login user', async () => {
      const loginUser = await server.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'nscode@example.com',
          password: 'P@ssw0rd!11',
        },
      });

      const { token } = loginUser.result as { readonly token: string };

      const injection = await server.inject({
        method: 'POST',
        url: '/auth',
        headers: {
          authorization: token,
        },
      });

      expect(injection.statusCode).toBe(200);
      expect(injection.result).toHaveProperty('token');
      expect(injection.result).toHaveProperty('userId');
    });
  });
  describe('[POST] /movies', () => {
    it('Add movie to database', async () => {
      const loginUser = await server.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'nscode@example.com',
          password: 'P@ssw0rd!11',
        },
      });

      const { token } = loginUser.result as { readonly token: string };

      const injection = await server.inject({
        method: 'POST',
        url: '/movies',
        headers: {
          authorization: token,
        },
        payload: {
          title: 'joker',
        },
      });

      expect(injection.statusCode).toBe(200);
    });
    it('Should add & increase session_track from basic users', async () => {
      const email = 'basic@exmaple.com';
      const password = 'password';

      await server.inject({
        method: 'POST',
        url: '/auth/register',
        payload: {
          username: 'basic',
          email,
          password,
          type: 0,
        },
      });

      const loginUser = await server.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email,
          password,
        },
      });

      const { token } = loginUser.result as { readonly token: string };

      const user = await server.inject({
        method: 'POST',
        url: '/auth',
        headers: {
          authorization: token,
        },
      });

      const { userId } = user.result as { readonly userId: number };

      const injection = await server.inject({
        method: 'POST',
        url: '/movies',
        headers: {
          authorization: token,
        },
        payload: {
          title: 'joker',
        },
      });

      const count = await server.app.db.session_track.count({ where: { user_id: userId } });

      expect(count).toBeGreaterThan(0);
      expect(injection.statusCode).toBe(200);
    });
    it('Should return 400 for basic users when try to add more then 5 movies', async () => {
      const email = 'basic@exmaple.com';
      const password = 'password';

      const loginUser = await server.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email,
          password,
        },
      });

      const { token } = loginUser.result as { readonly token: string };

      await server.inject({
        method: 'POST',
        url: '/movies',
        headers: {
          authorization: token,
        },
        payload: {
          title: 'joker',
        },
      });

      await server.inject({
        method: 'POST',
        url: '/movies',
        headers: {
          authorization: token,
        },
        payload: {
          title: 'joker',
        },
      });

      await server.inject({
        method: 'POST',
        url: '/movies',
        headers: {
          authorization: token,
        },
        payload: {
          title: 'joker',
        },
      });

      await server.inject({
        method: 'POST',
        url: '/movies',
        headers: {
          authorization: token,
        },
        payload: {
          title: 'joker',
        },
      });

      await server.inject({
        method: 'POST',
        url: '/movies',
        headers: {
          authorization: token,
        },
        payload: {
          title: 'joker',
        },
      });

      const injection = await server.inject({
        method: 'POST',
        url: '/movies',
        headers: {
          authorization: token,
        },
        payload: {
          title: 'joker',
        },
      });

      expect(injection.statusCode).toBe(400);
    });
  });
});
