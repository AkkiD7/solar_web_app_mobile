import { Request, Response } from 'express';
import { sendSuccess } from '../../utils/response';
import * as dashboardService from './dashboard.service';

export const getStats = async (req: Request, res: Response) => {
  const stats = await dashboardService.getDashboardStats(req.user!.companyId);
  sendSuccess(res, stats);
};
