import fs from 'fs';
import path from 'path';
import winston from 'winston';
import { env } from '../config/env';

const logsDirectory = path.resolve(process.cwd(), 'logs');

fs.mkdirSync(logsDirectory, { recursive: true });

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const metadata = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    if (stack) {
      return `${timestamp} ${level}: ${message}${metadata}\n${stack}`;
    }

    return `${timestamp} ${level}: ${message}${metadata}`;
  })
);

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: env.nodeEnv === 'development' ? 'debug' : 'http',
  levels: winston.config.npm.levels,
  defaultMeta: { service: 'solar-contractor-backend' },
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({
      filename: path.join(logsDirectory, 'error.log'),
      level: 'error',
      format: fileFormat,
    }),
    new winston.transports.File({
      filename: path.join(logsDirectory, 'combined.log'),
      format: fileFormat,
    }),
  ],
});

export const requestLogStream = {
  write: (message: string): void => {
    logger.log('http', message.trim());
  },
};
