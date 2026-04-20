// All queries scoped to companyId — multi-tenant data isolation
import mongoose from 'mongoose';
import { Lead } from './lead.model';
import { Company } from '../companies/company.model';
import { auditLog } from '../audit/audit.service';
import { assertLeadLimit } from '../../utils/planGate';
import { CompanyPlan } from '../companies/company.model';

const toObjId = (id: string) => new mongoose.Types.ObjectId(id);

async function getCompanyPlan(companyId: string): Promise<CompanyPlan> {
  const company = await Company.findById(companyId).select('plan').lean();
  return (company?.plan ?? 'FREE') as CompanyPlan;
}

export const getLeads = async (companyId: string) => {
  return Lead.find({ companyId: toObjId(companyId), deletedAt: null })
    .sort({ createdAt: -1 })
    .lean();
};

export const getLeadById = async (companyId: string, leadId: string) => {
  const lead = await Lead.findOne({
    _id: leadId,
    companyId: toObjId(companyId),
    deletedAt: null,
  }).lean();

  if (!lead) throw new Error('Lead not found');
  return lead;
};

export const createLead = async (
  companyId: string,
  userId: string,
  data: Record<string, unknown>
) => {
  const plan = await getCompanyPlan(companyId);
  await assertLeadLimit(companyId, plan);

  const lead = await Lead.create({
    ...data,
    companyId: toObjId(companyId),
    createdBy: toObjId(userId),
    updatedBy: toObjId(userId),
  });

  auditLog({
    companyId,
    action: 'LEAD_CREATED',
    entityId: lead._id.toString(),
    performedBy: userId,
  });

  return lead.toObject();
};

export const updateLead = async (
  companyId: string,
  userId: string,
  leadId: string,
  data: Record<string, unknown>
) => {
  const lead = await Lead.findOneAndUpdate(
    { _id: leadId, companyId: toObjId(companyId), deletedAt: null },
    { ...data, updatedBy: toObjId(userId) },
    { new: true, runValidators: true }
  ).lean();

  if (!lead) throw new Error('Lead not found');

  auditLog({
    companyId,
    action: 'LEAD_UPDATED',
    entityId: leadId,
    performedBy: userId,
  });

  return lead;
};

export const deleteLead = async (
  companyId: string,
  userId: string,
  leadId: string
) => {
  const lead = await Lead.findOneAndUpdate(
    { _id: leadId, companyId: toObjId(companyId), deletedAt: null },
    { deletedAt: new Date(), updatedBy: toObjId(userId) },
    { new: true }
  );

  if (!lead) throw new Error('Lead not found');

  auditLog({
    companyId,
    action: 'LEAD_DELETED',
    entityId: leadId,
    performedBy: userId,
  });

  return true;
};
