import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { sendError } from '../utils/response';

interface CompanyJwtPayload {
  id: string;
  email: string;
  companyId: string;
  role: 'ADMIN' | 'MANAGER' | 'SALES_REP' | 'VIEWER';
}

interface SuperAdminJwtPayload {
  id: string;
  email: string;
  role: 'SUPER_ADMIN';
}

function getBearerToken(authHeader?: string) {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.split(' ')[1];
}

export const protect = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const queryToken =
    req.method === 'GET' && typeof req.query.token === 'string' ? req.query.token : null;
  const token = getBearerToken(authHeader) ?? queryToken;

  if (!token) {
    sendError(res, 'Unauthorized - no token provided', 401);
    return;
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as CompanyJwtPayload;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      companyId: decoded.companyId,
      role: decoded.role,
    };
    next();
  } catch {
    sendError(res, 'Unauthorized - invalid or expired token', 401);
  }
};

export const requireSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = getBearerToken(authHeader);

  if (!token) {
    sendError(res, 'Unauthorized - no token provided', 401);
    return;
  }

  try {
    const decoded = jwt.verify(token, env.superAdminJwtSecret) as SuperAdminJwtPayload;
    if (decoded.role !== 'SUPER_ADMIN') {
      sendError(res, 'Forbidden - super admin access required', 403);
      return;
    }

    req.superAdmin = {
      id: decoded.id,
      email: decoded.email,
      role: 'SUPER_ADMIN',
    };
    next();
  } catch {
    sendError(res, 'Unauthorized - invalid or expired super admin token', 401);
  }
};
