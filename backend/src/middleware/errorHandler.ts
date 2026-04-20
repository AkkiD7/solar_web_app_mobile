import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { sendError } from '../utils/response';

interface ErrorWithStatusCode extends Error {
  code?: number;
  status?: number;
  statusCode?: number;
}

const sensitiveKeys = ['password', 'token', 'authorization', 'secret', 'cookie'];

const sanitizeForLogs = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(sanitizeForLogs);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nestedValue]) => {
        const isSensitive = sensitiveKeys.some((sensitiveKey) =>
          key.toLowerCase().includes(sensitiveKey)
        );

        return [key, isSensitive ? '[REDACTED]' : sanitizeForLogs(nestedValue)];
      })
    );
  }

  return value;
};

const getStatusCode = (err: ErrorWithStatusCode): number => {
  if (err.code === 11000) {
    return 409;
  }

  if (err.name === 'ValidationError') {
    return 422;
  }

  if (typeof err.statusCode === 'number') {
    return err.statusCode;
  }

  if (typeof err.status === 'number') {
    return err.status;
  }

  return 500;
};

const getErrorMessage = (err: ErrorWithStatusCode): string => {
  if (err.code === 11000) {
    return 'A record with this value already exists';
  }

  if (err.name === 'ValidationError') {
    return err.message;
  }

  return err.message || 'Internal server error';
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    next(err);
    return;
  }

  const normalizedError = err as ErrorWithStatusCode;
  const statusCode = getStatusCode(normalizedError);
  const message = getErrorMessage(normalizedError);

  logger.error('Request processing failed', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    statusCode,
    userId: req.user?.id,
    companyId: req.user?.companyId,
    superAdminId: req.superAdmin?.id,
    params: sanitizeForLogs(req.params),
    query: sanitizeForLogs(req.query),
    body: sanitizeForLogs(req.body),
    file: req.file
      ? {
          fieldname: req.file.fieldname,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
        }
      : undefined,
    errorName: normalizedError.name,
    errorMessage: normalizedError.message,
    stack: normalizedError.stack,
  });

  sendError(res, message, statusCode, normalizedError.stack);
};
