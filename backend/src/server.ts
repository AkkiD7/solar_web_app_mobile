import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { seedSuperAdmin } from './modules/superadmin/seed';
import { seedPlanConfigs } from './modules/superadmin/plan-config.model';
import { logger } from './utils/logger';

const serializeError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack,
    };
  }

  return { error };
};

const start = async (): Promise<void> => {
  await connectDB();
  await seedSuperAdmin();
  await seedPlanConfigs();
  app.listen(env.port, () => {
    logger.info(`Solar Contractor API running on http://localhost:${env.port}`);
    logger.info(`Environment: ${env.nodeEnv}`);
  });
};

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled promise rejection', serializeError(error));
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', serializeError(error));
  process.exit(1);
});

start().catch((error) => {
  logger.error('Failed to start server', serializeError(error));
  process.exit(1);
});
