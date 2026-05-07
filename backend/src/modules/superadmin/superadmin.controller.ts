import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { sendSuccess, sendError } from '../../utils/response';
import * as superAdminService from './superadmin.service';
import * as exportService from './export.service';
import { getSystemHealth } from './health.service';

// ── Validation helper ────────────────────────────────────────────────────────
function assertValid(req: Request, res: Response): boolean {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, errors.array().map((e) => e.msg).join(', '), 400);
    return false;
  }
  return true;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    sendError(res, 'Email and password are required', 400);
    return;
  }
  const result = await superAdminService.superAdminLogin(email, password);
  sendSuccess(res, result, 'Super admin login successful');
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  if (!assertValid(req, res)) return;
  const adminId = req.superAdmin!.id;
  const { currentPassword, newPassword } = req.body;
  const result = await superAdminService.changePassword(adminId, currentPassword, newPassword);
  sendSuccess(res, result);
};

// ── Super Admin Management ──────────────────────────────────────────────────

export const listAdmins = async (_req: Request, res: Response): Promise<void> => {
  const admins = await superAdminService.listAdmins();
  sendSuccess(res, admins);
};

export const createAdminUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    sendError(res, 'Email and password are required', 400);
    return;
  }
  const admin = await superAdminService.createAdmin(email, password);
  sendSuccess(res, admin, 'Admin created', 201);
};

export const deleteAdminUser = async (req: Request, res: Response): Promise<void> => {
  const result = await superAdminService.deleteAdmin(req.params.id, req.superAdmin!.id);
  sendSuccess(res, result);
};

// ── Companies ────────────────────────────────────────────────────────────────

export const getCompanies = async (req: Request, res: Response): Promise<void> => {
  if (!assertValid(req, res)) return;
  const query = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 20,
    search: req.query.search as string | undefined,
    status: req.query.status as 'ACTIVE' | 'SUSPENDED' | undefined,
    plan: req.query.plan as 'FREE' | 'STARTER' | 'PRO' | undefined,
    sortBy: (req.query.sortBy as string) || 'createdAt',
    sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
  };
  const result = await superAdminService.listCompanies(query);
  sendSuccess(res, result);
};

export const getCompanyDetail = async (req: Request, res: Response): Promise<void> => {
  const company = await superAdminService.getCompanyDetail(req.params.id);
  sendSuccess(res, company);
};

export const createCompany = async (req: Request, res: Response): Promise<void> => {
  if (!assertValid(req, res)) return;
  const company = await superAdminService.createCompany(req.body);
  sendSuccess(res, company, 'Company created successfully', 201);
};

export const updateCompany = async (req: Request, res: Response): Promise<void> => {
  if (!assertValid(req, res)) return;
  const company = await superAdminService.updateCompany(req.params.id, req.body);
  sendSuccess(res, company, 'Company updated successfully');
};

export const deleteCompany = async (req: Request, res: Response): Promise<void> => {
  const company = await superAdminService.deleteCompany(req.params.id);
  sendSuccess(res, company, 'Company deleted successfully');
};

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  if (!assertValid(req, res)) return;
  const company = await superAdminService.updateCompanyStatus(req.params.id, req.body.status);
  sendSuccess(res, company, `Company ${req.body.status.toLowerCase()} successfully`);
};

export const updatePlan = async (req: Request, res: Response): Promise<void> => {
  if (!assertValid(req, res)) return;
  const company = await superAdminService.updateCompanyPlan(req.params.id, req.body.plan);
  sendSuccess(res, company, 'Plan updated successfully');
};

// ── Company Users ────────────────────────────────────────────────────────────

export const listUsers = async (req: Request, res: Response): Promise<void> => {
  const users = await superAdminService.listCompanyUsers(req.params.id);
  sendSuccess(res, users);
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  if (!assertValid(req, res)) return;
  const user = await superAdminService.createCompanyUser(req.params.id, req.body);
  sendSuccess(res, user, 'User created successfully', 201);
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  if (!assertValid(req, res)) return;
  const user = await superAdminService.updateCompanyUser(req.params.id, req.params.userId, req.body);
  sendSuccess(res, user, 'User updated successfully');
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const user = await superAdminService.deleteCompanyUser(req.params.id, req.params.userId);
  sendSuccess(res, user, 'User deactivated successfully');
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  if (!assertValid(req, res)) return;
  const result = await superAdminService.resetUserPassword(
    req.params.id,
    req.params.userId,
    req.body.newPassword
  );
  sendSuccess(res, result);
};

// ── Bulk Actions ─────────────────────────────────────────────────────────────

export const bulkStatus = async (req: Request, res: Response): Promise<void> => {
  if (!assertValid(req, res)) return;
  const result = await superAdminService.bulkUpdateStatus(req.body.companyIds, req.body.status);
  sendSuccess(res, result, 'Bulk status update complete');
};

export const bulkPlan = async (req: Request, res: Response): Promise<void> => {
  if (!assertValid(req, res)) return;
  const result = await superAdminService.bulkUpdatePlan(req.body.companyIds, req.body.plan);
  sendSuccess(res, result, 'Bulk plan update complete');
};

// ── Impersonate ──────────────────────────────────────────────────────────────

export const impersonate = async (req: Request, res: Response): Promise<void> => {
  const result = await superAdminService.impersonateCompany(req.params.id);
  sendSuccess(res, result, 'Impersonation token generated');
};

// ── Analytics ────────────────────────────────────────────────────────────────

export const getCompanyAnalytics = async (req: Request, res: Response): Promise<void> => {
  const analytics = await superAdminService.getCompanyAnalytics(req.params.id);
  sendSuccess(res, analytics);
};

// ── Stats & Audit ────────────────────────────────────────────────────────────

export const getStats = async (_req: Request, res: Response): Promise<void> => {
  const stats = await superAdminService.getGlobalStats();
  sendSuccess(res, stats);
};

export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
  const options = {
    limit: parseInt(req.query.limit as string) || 50,
    page: parseInt(req.query.page as string) || 1,
    action: req.query.action as string | undefined,
    companyId: req.query.companyId as string | undefined,
  };
  const logs = await superAdminService.getPlatformAuditLogs(options);
  sendSuccess(res, logs);
};

// ── Plan Config ──────────────────────────────────────────────────────────────

export const getPlanConfigs = async (_req: Request, res: Response): Promise<void> => {
  const configs = await superAdminService.getPlanConfigs();
  sendSuccess(res, configs);
};

export const updatePlanConfig = async (req: Request, res: Response): Promise<void> => {
  if (!assertValid(req, res)) return;
  const config = await superAdminService.updatePlanConfig(req.params.plan, req.body);
  sendSuccess(res, config, 'Plan config updated');
};

// ── Export ────────────────────────────────────────────────────────────────────

export const exportCompanies = async (_req: Request, res: Response): Promise<void> => {
  const csv = await exportService.exportCompaniesCSV();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=companies.csv');
  res.send(csv);
};

export const exportAuditLogs = async (req: Request, res: Response): Promise<void> => {
  const limit = parseInt(req.query.limit as string) || 1000;
  const csv = await exportService.exportAuditLogsCSV({
    limit,
    action: req.query.action as string | undefined,
    companyId: req.query.companyId as string | undefined,
  });
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.csv');
  res.send(csv);
};

export const exportCompanyData = async (req: Request, res: Response): Promise<void> => {
  const csv = await exportService.exportCompanyDataCSV(req.params.id);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=company-${req.params.id}.csv`);
  res.send(csv);
};

// ── System Health ────────────────────────────────────────────────────────────

export const systemHealth = async (_req: Request, res: Response): Promise<void> => {
  const health = await getSystemHealth();
  sendSuccess(res, health);
};
