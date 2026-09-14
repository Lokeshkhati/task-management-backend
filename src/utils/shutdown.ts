import { Server } from 'http';
import logger from '../lib/logger.js';
import { pool } from '../db/pool.js';

export const setupGracefulShutdown = (server: Server) => {
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);

    try {
      await new Promise<void>((resolve) => {
        server.close(() => {
          logger.info('Server closed');
          resolve();
        });
      });
        
      await pool.end();
      logger.info('Database connection closed');

      logger.info(
        'Graceful shutdown completed\n--------------------------------',
      );
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    shutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    shutdown('unhandledRejection');
  });
};