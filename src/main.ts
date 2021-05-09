import Hapi from '@hapi/hapi';
import { getConfig } from '@nscode/config';
import Joi from 'joi';

import { AuthPlugin } from './plugin/auth';
import { DatabasePlugin } from './plugin/database';
import { addMovie, auth, getMovie, login, register } from './routes';

const Server = () => new Hapi.Server({ host: getConfig('HOST'), port: getConfig('PORT') });

export const getServerWithPlugins = async () => {
  const server = Server();

  server.validator(Joi);

  await server.register({ plugin: DatabasePlugin });
  await server.register({ plugin: AuthPlugin });
  server.route([register, login, auth, addMovie, getMovie]);
  return server;
};
