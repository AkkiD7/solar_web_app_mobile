import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../../utils/response';
import * as companiesService from './companies.service';

const getCompanyId = (req: Request): string => req.user!.companyId;
const getUserId = (req: Request): string => req.user!.id;

// ── Company Profile ──────────────────────────────────────────────────────────

export const getMyCompany = async (req: Request, res: Response): Promise<void> => {
  const company = await companiesService.getCompany(getCompanyId(req));
  sendSuccess(res, company);
};

export const updateMyCompany = async (req: Request, res: Response): Promise<void> => {
  const company = await companiesService.updateCompany(getCompanyId(req), getUserId(req), req.body);
  sendSuccess(res, company, 'Company updated successfully');
};

export const uploadLogo = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    sendError(res, 'No file uploaded', 400);
    return;
  }
  const result = await companiesService.uploadLogo(
    getCompanyId(req),
    getUserId(req),
    req.file.buffer,
    req.file.mimetype
  );
  sendSuccess(res, result, 'Logo uploaded successfully');
};

// ── Quote Settings ───────────────────────────────────────────────────────────

export const getQuoteSettings = async (req: Request, res: Response): Promise<void> => {
  const settings = await companiesService.getQuoteSettings(getCompanyId(req));
  sendSuccess(res, settings);
};

export const updateQuoteSettings = async (req: Request, res: Response): Promise<void> => {
  const settings = await companiesService.updateQuoteSettings(getCompanyId(req), getUserId(req), req.body);
  sendSuccess(res, settings, 'Quote settings updated');
};

export const uploadSignature = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    sendError(res, 'No file uploaded', 400);
    return;
  }
  const result = await companiesService.uploadSignature(
    getCompanyId(req),
    getUserId(req),
    req.file.buffer,
    req.file.mimetype
  );
  sendSuccess(res, result, 'Signature uploaded successfully');
};

// ── Pricing Config ───────────────────────────────────────────────────────────

export const getPricingConfig = async (req: Request, res: Response): Promise<void> => {
  const config = await companiesService.getPricingConfig(getCompanyId(req));
  sendSuccess(res, config);
};

export const updatePricingConfig = async (req: Request, res: Response): Promise<void> => {
  const config = await companiesService.updatePricingConfig(getCompanyId(req), getUserId(req), req.body);
  sendSuccess(res, config, 'Pricing config updated');
};

// ── Locale Settings ──────────────────────────────────────────────────────────

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  const settings = await companiesService.getSettings(getCompanyId(req));
  sendSuccess(res, settings);
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  const settings = await companiesService.updateSettings(getCompanyId(req), getUserId(req), req.body);
  sendSuccess(res, settings, 'Settings updated');
};
