import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { sendSuccess, sendError } from '../../utils/response';
import * as authService from './auth.service';

// register() is removed — users are created invite-only via Super Admin panel.

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, errors.array()[0].msg as string, 422);
  }

  const { email, password } = req.body;
  const result = await authService.login(email, password);
  sendSuccess(res, result, 'Login successful');
};
