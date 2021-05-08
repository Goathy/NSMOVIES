import Hapi from '@hapi/hapi';
import { PrismaClient } from '@prisma/client';

declare module '@hapi/hapi' {
  interface ServerApplicationState {
    readonly db: PrismaClient;
  }
}

export const DatabasePlugin: Hapi.Plugin<never> = {
  name: 'database',
  multiple: false,
  register: (server) => {
    // @ts-ignore
    server.app.db = new PrismaClient();

    server.ext({
      type: 'onPreStart',
      method: async (server) => await server.app.db.$connect(),
    });

    server.ext({
      type: 'onPostStop',
      method: async (server) => await server.app.db.$disconnect(),
    });
  },
};
