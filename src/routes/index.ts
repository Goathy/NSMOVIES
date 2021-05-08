import Boom from '@hapi/boom';
import type Hapi from '@hapi/hapi';
import type { account } from '@prisma/client';

import { hashPassword } from '../hash';
import { RegisterPayloadSchema } from '../schema';

export type TRegisterPayload = Pick<account, 'email' | 'username' | 'password' | 'type'>;

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
