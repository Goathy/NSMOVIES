import { getConfig } from '@nscode/config';
import { logger } from '@nscode/logger';
import Dotenv from 'dotenv';

import { getServerWithPlugins } from './main';

Dotenv.config();

const port = getConfig('PORT');
const host = getConfig('HOST');

const start = async () => {
  const server = getServerWithPlugins();

  await server.start();
  logger.verbose(`Server is running on http://${host}:${port} 🚀`);
};

start().catch((err) => {
  logger.error(err);
  process.exit(1);
});
