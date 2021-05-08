import type Hapi from '@hapi/hapi';

import { getServerWithPlugins } from '../src/main';

describe('Database Plugin', () => {
  let server: Hapi.Server;

  beforeAll(async () => {
    server = await getServerWithPlugins();
  });

  afterAll(async () => {
    await server.stop();
  });

  it('Should establish connection with database', async () => {
    const [{ ready }] = await server.app.db.$queryRaw<
      readonly { readonly ready: number }[]
    >`SELECT 1+1 as ready;`;

    expect(ready).toBeTruthy();
  });
});
