import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { sendSuccess, sendError } from '../../utils/response';
import * as leadsService from './leads.service';

const cid = (req: Request) => req.user!.companyId;
const uid = (req: Request) => req.user!.id;

export const getLeads = async (req: Request, res: Response) => {
  const leads = await leadsService.getLeads(cid(req));
  sendSuccess(res, leads);
};

export const getLeadById = async (req: Request, res: Response) => {
  const lead = await leadsService.getLeadById(cid(req), req.params.id);
  sendSuccess(res, lead);
};

export const createLead = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, errors.array()[0].msg as string, 422);
  }
  const lead = await leadsService.createLead(cid(req), uid(req), req.body);
  sendSuccess(res, lead, 'Lead created successfully', 201);
};

export const updateLead = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, errors.array()[0].msg as string, 422);
  }
  const lead = await leadsService.updateLead(cid(req), uid(req), req.params.id, req.body);
  sendSuccess(res, lead, 'Lead updated successfully');
};

export const deleteLead = async (req: Request, res: Response) => {
  await leadsService.deleteLead(cid(req), uid(req), req.params.id);
  sendSuccess(res, null, 'Lead deleted successfully');
};
