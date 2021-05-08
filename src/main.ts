import Hapi from '@hapi/hapi';
import { getConfig } from '@nscode/config';
import Joi from 'joi';

const Server = () => new Hapi.Server({ host: getConfig('HOST'), port: getConfig('PORT') });

export const getServerWithPlugins = () => {
  const server = Server();

  server.validator(Joi);

  return server;
};
