import Boom from '@hapi/boom';
import type Hapi from '@hapi/hapi';

declare module '@hapi/hapi' {
  interface AuthCredentials {
    readonly token: string;
    readonly userId: number;
  }
}

export const AuthPlugin: Hapi.Plugin<never> = {
  name: 'auth',
  multiple: false,
  register: (server) => {
    const schema = () => ({
      authenticate: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
        const authorization = request.headers.authorization;

        if (!authorization) {
          throw Boom.unauthorized('Api key is missing.');
        }

        const [prefix, token] = authorization.split(' ');

        if (prefix !== 'Bearer') {
          throw Boom.unauthorized('Wrong token format.');
        }

        const count = await request.server.app.db.token.count({ where: { id: token } });

        if (!count) {
          throw Boom.unauthorized("Key doesn't exist.");
        }

        const user = await request.server.app.db.token.findUnique({ where: { id: token } });
        const userType = await request.server.app.db.account.findUnique({
          where: { id: user!.user_id },
        });

        return h.authenticated({
          credentials: {
            scope: [userType!.type ? 'premium' : 'basic'],
            token,
            userId: user!.user_id,
          },
        });
      },
    });

    server.auth.scheme('custom', schema);
    server.auth.strategy('token', 'custom');
    server.auth.default({ strategy: 'token', mode: 'required' });
  },
};
