import Hapi from '@hapi/hapi';
import { getConfig } from '@nscode/config';
import Joi from 'joi';

import { DatabasePlugin } from './plugin/database';
import { register } from './routes';

const Server = () => new Hapi.Server({ host: getConfig('HOST'), port: getConfig('PORT') });

export const getServerWithPlugins = async () => {
  const server = Server();

  server.validator(Joi);

  await server.register({ plugin: DatabasePlugin });
  server.route([register]);
  return server;
};
