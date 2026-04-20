import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../../utils/response';
import * as superAdminService from './superadmin.service';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    sendError(res, 'Email and password are required', 400);
    return;
  }
  const result = await superAdminService.superAdminLogin(email, password);
  sendSuccess(res, result, 'Super admin login successful');
};

export const getCompanies = async (_req: Request, res: Response): Promise<void> => {
  const companies = await superAdminService.listCompanies();
  sendSuccess(res, companies);
};

export const createCompany = async (req: Request, res: Response): Promise<void> => {
  const company = await superAdminService.createCompany(req.body);
  sendSuccess(res, company, 'Company created successfully', 201);
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const user = await superAdminService.createCompanyUser(req.params.id, req.body);
  sendSuccess(res, user, 'Admin user created successfully', 201);
};

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  const { status } = req.body;
  if (!['ACTIVE', 'SUSPENDED'].includes(status)) {
    sendError(res, 'Invalid status value', 400);
    return;
  }
  const company = await superAdminService.updateCompanyStatus(req.params.id, status);
  sendSuccess(res, company, `Company ${status.toLowerCase()} successfully`);
};

export const updatePlan = async (req: Request, res: Response): Promise<void> => {
  const { plan } = req.body;
  if (!['FREE', 'STARTER', 'PRO'].includes(plan)) {
    sendError(res, 'Invalid plan value', 400);
    return;
  }
  const company = await superAdminService.updateCompanyPlan(req.params.id, plan);
  sendSuccess(res, company, 'Plan updated successfully');
};

export const getStats = async (_req: Request, res: Response): Promise<void> => {
  const stats = await superAdminService.getGlobalStats();
  sendSuccess(res, stats);
};

export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
  const limit = parseInt(req.query.limit as string) || 100;
  const logs = await superAdminService.getPlatformAuditLogs(limit);
  sendSuccess(res, logs);
};
