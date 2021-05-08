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
});
