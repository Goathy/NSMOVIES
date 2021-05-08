import { getConfig } from '@nscode/config';
import Dotenv from 'dotenv';

import { getServerWithPlugins } from './main';

Dotenv.config();

const port = getConfig('PORT');
const host = getConfig('HOST');

const start = async () => {
  const server = getServerWithPlugins();

  await server.start();
  console.info(`Server is running on http://${host}:${port} 🚀`);
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
