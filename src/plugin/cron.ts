import type Hapi from '@hapi/hapi';
import { isTesting } from '@nscode/config';
import { logger } from '@nscode/logger';
import { schedule } from 'node-cron';

export const CronPlugin: Hapi.Plugin<never> = {
  name: 'cron',
  multiple: false,
  register: (server) => {
    if (isTesting()) {
      logger.warn(`Cron is disabled on testing environment.`);
    }

    if (!isTesting()) {
      schedule(
        '0 0 1 * *',
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async () => {
          await server.app.db.$queryRaw`DELETE FROM movie_api.session_track;`;
          logger.debug('Clear session_track');
        }
      );
    }
  },
};
