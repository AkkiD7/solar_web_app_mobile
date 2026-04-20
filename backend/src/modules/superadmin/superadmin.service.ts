import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { PlatformAdmin } from './platform-admin.model';
import { Company } from '../companies/company.model';
import { QuoteSettings } from '../companies/quoteSettings.model';
import { PricingConfig } from '../companies/pricingConfig.model';
import { Settings } from '../companies/settings.model';
import { User } from '../users/user.model';
import { Lead } from '../leads/lead.model';
import { Quote } from '../quotations/quote.model';
import { AuditLog } from '../audit/audit-log.model';
import { LeadStatus } from '../leads/leads.types';

// ── Auth ────────────────────────────────────────────────────────────────────

export const superAdminLogin = async (email: string, password: string) => {
  const admin = await PlatformAdmin.findOne({ email: email.toLowerCase() });
  if (!admin) throw new Error('Invalid credentials');

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { id: admin._id.toString(), email: admin.email, role: 'SUPER_ADMIN' },
    env.superAdminJwtSecret,
    { expiresIn: '12h' }
  );

  return { token, admin: { id: admin._id, email: admin.email } };
};

// ── Company Management ───────────────────────────────────────────────────────

export const listCompanies = async () => {
  const companies = await Company.find({}).sort({ createdAt: -1 }).lean();

  const enriched = await Promise.all(
    companies.map(async (c) => {
      const [userCount, leadCount] = await Promise.all([
        User.countDocuments({ companyId: c._id }),
        Lead.countDocuments({ companyId: c._id, deletedAt: null }),
      ]);
      return { ...c, userCount, leadCount };
    })
  );

  return enriched;
};

export const createCompany = async (data: {
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber?: string;
  website?: string;
  plan?: 'FREE' | 'STARTER' | 'PRO';
}) => {
  const company = await Company.create({ ...data, status: 'ACTIVE' });

  // Bootstrap companion records
  await Promise.all([
    QuoteSettings.create({ companyId: company._id }),
    PricingConfig.create({ companyId: company._id }),
    Settings.create({ companyId: company._id }),
  ]);

  await AuditLog.create({
    companyId: company._id,
    action: 'COMPANY_ACTIVATED',
    performedBy: 'SUPER_ADMIN',
    metadata: { plan: company.plan },
  });

  return company.toObject();
};

export const createCompanyUser = async (
  companyId: string,
  data: { name: string; email: string; password: string }
) => {
  const company = await Company.findById(companyId);
  if (!company) throw new Error('Company not found');

  const user = await User.create({ ...data, companyId, role: 'ADMIN' });
  return { id: user._id, name: user.name, email: user.email, role: user.role };
};

export const updateCompanyStatus = async (
  companyId: string,
  status: 'ACTIVE' | 'SUSPENDED'
) => {
  const company = await Company.findByIdAndUpdate(
    companyId,
    { status },
    { new: true }
  ).lean();
  if (!company) throw new Error('Company not found');

  await AuditLog.create({
    companyId,
    action: status === 'ACTIVE' ? 'COMPANY_ACTIVATED' : 'COMPANY_SUSPENDED',
    performedBy: 'SUPER_ADMIN',
  });

  return company;
};

export const updateCompanyPlan = async (
  companyId: string,
  plan: 'FREE' | 'STARTER' | 'PRO'
) => {
  const company = await Company.findByIdAndUpdate(
    companyId,
    { plan },
    { new: true }
  ).lean();
  if (!company) throw new Error('Company not found');

  await AuditLog.create({
    companyId,
    action: 'PLAN_CHANGED',
    performedBy: 'SUPER_ADMIN',
    metadata: { newPlan: plan },
  });

  return company;
};

// ── Global Stats ─────────────────────────────────────────────────────────────

export const getGlobalStats = async () => {
  const [
    totalCompanies,
    activeCompanies,
    suspendedCompanies,
    planBreakdown,
    totalLeads,
    totalQuotes,
  ] = await Promise.all([
    Company.countDocuments({}),
    Company.countDocuments({ status: 'ACTIVE' }),
    Company.countDocuments({ status: 'SUSPENDED' }),
    Company.aggregate([
      { $group: { _id: '$plan', count: { $sum: 1 } } },
    ]),
    Lead.countDocuments({ deletedAt: null }),
    Quote.countDocuments({ deletedAt: null }),
  ]);

  const revenueData = await Quote.aggregate([
    { $match: { deletedAt: null } },
    { $group: { _id: null, totalRevenue: { $sum: '$totalCost' } } },
  ]);

  const recentLeads = await Lead.find({ deletedAt: null })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  return {
    totalCompanies,
    activeCompanies,
    suspendedCompanies,
    planBreakdown: planBreakdown.reduce(
      (acc, { _id, count }) => ({ ...acc, [_id]: count }),
      {} as Record<string, number>
    ),
    totalLeads,
    totalQuotes,
    totalRevenue: revenueData[0]?.totalRevenue ?? 0,
    recentLeads,
  };
};

// ── Audit Logs ───────────────────────────────────────────────────────────────

export const getPlatformAuditLogs = async (limit = 100) => {
  return AuditLog.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};
