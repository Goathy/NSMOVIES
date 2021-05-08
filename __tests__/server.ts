import type Hapi from '@hapi/hapi';

import { getServerWithPlugins } from '../src/main';

describe('Server Module', () => {
  let server: Hapi.Server;

  beforeAll(async () => {
    server = await getServerWithPlugins();
  });

  afterAll(async () => {
    await server.stop();
  });

  describe('[GET] /', () => {
    it('Should Be Happy 😊', async () => {
      server.route({ method: 'GET', path: '/', handler: () => 'Be Happy 😊' });

      const injection = await server.inject({ method: 'GET', url: '/' });

      expect(injection.result).toBe('Be Happy 😊');
    });
  });
});
