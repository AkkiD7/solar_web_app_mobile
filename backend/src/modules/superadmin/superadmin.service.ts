import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { env } from '../../config/env';
import { PlatformAdmin } from './platform-admin.model';
import { PlanConfig } from './plan-config.model';
import { Company } from '../companies/company.model';
import { QuoteSettings } from '../companies/quoteSettings.model';
import { PricingConfig } from '../companies/pricingConfig.model';
import { Settings } from '../companies/settings.model';
import { User } from '../users/user.model';
import { Lead } from '../leads/lead.model';
import { Quote } from '../quotations/quote.model';
import { AuditLog } from '../audit/audit-log.model';
import { assertUserLimit } from '../../utils/planGate';

const toObjId = (id: string) => new mongoose.Types.ObjectId(id);

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

export const changePassword = async (
  adminId: string,
  currentPassword: string,
  newPassword: string
) => {
  const admin = await PlatformAdmin.findById(adminId);
  if (!admin) throw new Error('Admin not found');

  const isMatch = await admin.comparePassword(currentPassword);
  if (!isMatch) throw new Error('Current password is incorrect');

  admin.password = newPassword; // hashed by pre-save hook
  await admin.save();
  return { message: 'Password changed successfully' };
};

// ── Super Admin Management ──────────────────────────────────────────────────

export const listAdmins = async () => {
  return PlatformAdmin.find({}).select('-password').lean();
};

export const createAdmin = async (email: string, password: string) => {
  const existing = await PlatformAdmin.findOne({ email: email.toLowerCase() });
  if (existing) throw new Error('Admin with this email already exists');

  const admin = await PlatformAdmin.create({ email, password });
  return { id: admin._id, email: admin.email };
};

export const deleteAdmin = async (adminId: string, currentAdminId: string) => {
  if (adminId === currentAdminId) throw new Error('Cannot delete yourself');

  const count = await PlatformAdmin.countDocuments();
  if (count <= 1) throw new Error('Cannot delete the last remaining admin');

  const admin = await PlatformAdmin.findByIdAndDelete(adminId);
  if (!admin) throw new Error('Admin not found');
  return { message: 'Admin deleted' };
};

// ── Company Management ───────────────────────────────────────────────────────

interface ListCompaniesQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'ACTIVE' | 'SUSPENDED';
  plan?: 'FREE' | 'STARTER' | 'PRO';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const listCompanies = async (query: ListCompaniesQuery = {}) => {
  const {
    page = 1,
    limit = 20,
    search,
    status,
    plan,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = query;

  const filter: Record<string, unknown> = { deletedAt: null };
  if (status) filter.status = status;
  if (plan) filter.plan = plan;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
  const skip = (page - 1) * limit;

  const [companies, total] = await Promise.all([
    Company.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Company.countDocuments(filter),
  ]);

  const enriched = await Promise.all(
    companies.map(async (c) => {
      const [userCount, leadCount, quoteCount] = await Promise.all([
        User.countDocuments({ companyId: c._id }),
        Lead.countDocuments({ companyId: c._id, deletedAt: null }),
        Quote.countDocuments({ companyId: c._id, deletedAt: null }),
      ]);

      // Onboarding progress
      const [hasLogo, hasLead, hasQuote, hasPricing] = await Promise.all([
        Company.exists({ _id: c._id, logoUrl: { $nin: [null, ''] } }),
        Lead.exists({ companyId: c._id, deletedAt: null }),
        Quote.exists({ companyId: c._id, deletedAt: null }),
        PricingConfig.exists({ companyId: c._id, defaultPanelCostPerKW: { $gt: 0 } }),
      ]);

      const onboardingSteps = {
        profileComplete: !!(c.name && c.email && c.phone && c.address),
        logoUploaded: !!hasLogo,
        firstLeadCreated: !!hasLead,
        firstQuoteGenerated: !!hasQuote,
        pricingConfigured: !!hasPricing,
      };
      const onboardingProgress = Object.values(onboardingSteps).filter(Boolean).length;

      return { ...c, userCount, leadCount, quoteCount, onboardingSteps, onboardingProgress };
    })
  );

  return {
    data: enriched,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getCompanyDetail = async (companyId: string) => {
  const company = await Company.findOne({ _id: companyId, deletedAt: null }).lean();
  if (!company) throw new Error('Company not found');

  const [users, leadsByStatus, quoteStats, recentLogs, settings, pricingConfig, quoteSettings] =
    await Promise.all([
      User.find({ companyId }).select('-password').lean(),
      Lead.aggregate([
        { $match: { companyId: toObjId(companyId), deletedAt: null } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Quote.aggregate([
        { $match: { companyId: toObjId(companyId), deletedAt: null } },
        {
          $group: {
            _id: null,
            totalQuotes: { $sum: 1 },
            totalRevenue: { $sum: '$totalCost' },
            avgDealSize: { $avg: '$totalCost' },
          },
        },
      ]),
      AuditLog.find({ companyId }).sort({ createdAt: -1 }).limit(20).lean(),
      Settings.findOne({ companyId }).lean(),
      PricingConfig.findOne({ companyId }).lean(),
      QuoteSettings.findOne({ companyId }).lean(),
    ]);

  return {
    ...company,
    users,
    leadsByStatus: leadsByStatus.reduce(
      (acc, { _id, count }) => ({ ...acc, [_id]: count }),
      {} as Record<string, number>
    ),
    totalLeads: leadsByStatus.reduce((sum, { count }) => sum + count, 0),
    quoteStats: quoteStats[0] ?? { totalQuotes: 0, totalRevenue: 0, avgDealSize: 0 },
    recentLogs,
    settings: settings ?? { currency: 'INR', dateFormat: 'DD/MM/YYYY', language: 'en' },
    pricingConfig: pricingConfig ?? {},
    quoteSettings: quoteSettings ?? {},
  };
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

export const updateCompany = async (
  companyId: string,
  data: Partial<{
    name: string;
    email: string;
    phone: string;
    address: string;
    gstNumber: string;
    website: string;
  }>
) => {
  const company = await Company.findOneAndUpdate(
    { _id: companyId, deletedAt: null },
    data,
    { new: true, runValidators: true }
  ).lean();
  if (!company) throw new Error('Company not found');

  await AuditLog.create({
    companyId,
    action: 'COMPANY_UPDATED',
    performedBy: 'SUPER_ADMIN',
    metadata: { updatedFields: Object.keys(data) },
  });

  return company;
};

export const deleteCompany = async (companyId: string) => {
  const company = await Company.findOneAndUpdate(
    { _id: companyId, deletedAt: null },
    { deletedAt: new Date(), status: 'SUSPENDED' },
    { new: true }
  ).lean();
  if (!company) throw new Error('Company not found');

  // Soft-delete all related data
  await Promise.all([
    User.updateMany({ companyId }, { isActive: false }),
    Lead.updateMany({ companyId, deletedAt: null }, { deletedAt: new Date() }),
    Quote.updateMany({ companyId, deletedAt: null }, { deletedAt: new Date() }),
  ]);

  await AuditLog.create({
    companyId,
    action: 'COMPANY_DELETED',
    performedBy: 'SUPER_ADMIN',
  });

  return company;
};

export const createCompanyUser = async (
  companyId: string,
  data: { name: string; email: string; password: string; role?: string }
) => {
  const company = await Company.findOne({ _id: companyId, deletedAt: null });
  if (!company) throw new Error('Company not found');
  await assertUserLimit(companyId, company.plan);

  const role = data.role ?? 'ADMIN';
  const user = await User.create({ ...data, companyId, role });

  await AuditLog.create({
    companyId,
    action: 'USER_CREATED',
    performedBy: 'SUPER_ADMIN',
    entityId: user._id.toString(),
    metadata: { role },
  });

  return { id: user._id, name: user.name, email: user.email, role: user.role };
};

export const updateCompanyStatus = async (
  companyId: string,
  status: 'ACTIVE' | 'SUSPENDED'
) => {
  const company = await Company.findOneAndUpdate(
    { _id: companyId, deletedAt: null },
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
  const company = await Company.findOneAndUpdate(
    { _id: companyId, deletedAt: null },
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

// ── User Management ──────────────────────────────────────────────────────────

export const listCompanyUsers = async (companyId: string) => {
  const company = await Company.findOne({ _id: companyId, deletedAt: null });
  if (!company) throw new Error('Company not found');
  return User.find({ companyId }).select('-password').lean();
};

export const updateCompanyUser = async (
  companyId: string,
  userId: string,
  data: Partial<{ name: string; email: string; role: string; isActive: boolean }>
) => {
  const user = await User.findOneAndUpdate(
    { _id: userId, companyId },
    data,
    { new: true, runValidators: true }
  ).select('-password').lean();
  if (!user) throw new Error('User not found');

  await AuditLog.create({
    companyId,
    action: 'USER_UPDATED',
    performedBy: 'SUPER_ADMIN',
    entityId: userId,
    metadata: { updatedFields: Object.keys(data) },
  });

  return user;
};

export const deleteCompanyUser = async (companyId: string, userId: string) => {
  const user = await User.findOneAndUpdate(
    { _id: userId, companyId },
    { isActive: false },
    { new: true }
  ).select('-password').lean();
  if (!user) throw new Error('User not found');

  await AuditLog.create({
    companyId,
    action: 'USER_DELETED',
    performedBy: 'SUPER_ADMIN',
    entityId: userId,
  });

  return user;
};

export const resetUserPassword = async (
  companyId: string,
  userId: string,
  newPassword: string
) => {
  const user = await User.findOne({ _id: userId, companyId });
  if (!user) throw new Error('User not found');

  user.password = newPassword; // hashed by pre-save hook
  await user.save();

  await AuditLog.create({
    companyId,
    action: 'PASSWORD_RESET',
    performedBy: 'SUPER_ADMIN',
    entityId: userId,
  });

  return { message: 'Password reset successfully' };
};

// ── Bulk Actions ─────────────────────────────────────────────────────────────

export const bulkUpdateStatus = async (
  companyIds: string[],
  status: 'ACTIVE' | 'SUSPENDED'
) => {
  const result = await Company.updateMany(
    { _id: { $in: companyIds }, deletedAt: null },
    { status }
  );

  // Audit each
  await Promise.all(
    companyIds.map((id) =>
      AuditLog.create({
        companyId: id,
        action: status === 'ACTIVE' ? 'COMPANY_ACTIVATED' : 'COMPANY_SUSPENDED',
        performedBy: 'SUPER_ADMIN',
        metadata: { bulk: true },
      })
    )
  );

  return { modifiedCount: result.modifiedCount };
};

export const bulkUpdatePlan = async (
  companyIds: string[],
  plan: 'FREE' | 'STARTER' | 'PRO'
) => {
  const result = await Company.updateMany(
    { _id: { $in: companyIds }, deletedAt: null },
    { plan }
  );

  await Promise.all(
    companyIds.map((id) =>
      AuditLog.create({
        companyId: id,
        action: 'PLAN_CHANGED',
        performedBy: 'SUPER_ADMIN',
        metadata: { newPlan: plan, bulk: true },
      })
    )
  );

  return { modifiedCount: result.modifiedCount };
};

// ── Impersonate ──────────────────────────────────────────────────────────────

export const impersonateCompany = async (companyId: string) => {
  const company = await Company.findOne({ _id: companyId, deletedAt: null });
  if (!company) throw new Error('Company not found');
  if (company.status === 'SUSPENDED') throw new Error('Cannot impersonate a suspended company');

  const user = await User.findOne({ companyId, role: 'ADMIN', isActive: true });
  if (!user) throw new Error('No active admin user found for this company');

  const token = jwt.sign(
    { id: user._id.toString(), email: user.email, companyId, role: user.role },
    env.jwtSecret,
    { expiresIn: '2h' } // shorter expiry for impersonation
  );

  await AuditLog.create({
    companyId,
    action: 'IMPERSONATION',
    performedBy: 'SUPER_ADMIN',
    entityId: user._id.toString(),
  });

  return { token, companyName: company.name, userName: user.name };
};

// ── Company Analytics ────────────────────────────────────────────────────────

export const getCompanyAnalytics = async (companyId: string) => {
  const companyObjId = toObjId(companyId);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [leadsByStatus, leadsByMonth, quotesByMonth, revenueByMonth] = await Promise.all([
    Lead.aggregate([
      { $match: { companyId: companyObjId, deletedAt: null } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Lead.aggregate([
      { $match: { companyId: companyObjId, deletedAt: null, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
    Quote.aggregate([
      { $match: { companyId: companyObjId, deletedAt: null, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$totalCost' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
    Quote.aggregate([
      { $match: { companyId: companyObjId, deletedAt: null } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalCost' },
          avgDealSize: { $avg: '$totalCost' },
          totalQuotes: { $sum: 1 },
        },
      },
    ]),
  ]);

  const totalLeads = leadsByStatus.reduce((s, { count }) => s + count, 0);
  const totalQuotes = revenueByMonth[0]?.totalQuotes ?? 0;

  return {
    leadsByStatus: leadsByStatus.reduce(
      (acc, { _id, count }) => ({ ...acc, [_id]: count }),
      {} as Record<string, number>
    ),
    leadsByMonth: leadsByMonth.map((m) => ({
      month: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
      count: m.count,
    })),
    quotesByMonth: quotesByMonth.map((m) => ({
      month: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
      count: m.count,
      revenue: m.revenue,
    })),
    totalLeads,
    totalQuotes,
    totalRevenue: revenueByMonth[0]?.totalRevenue ?? 0,
    avgDealSize: Math.round(revenueByMonth[0]?.avgDealSize ?? 0),
    conversionRate: totalLeads > 0 ? Math.round((totalQuotes / totalLeads) * 100) : 0,
  };
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
    totalUsers,
  ] = await Promise.all([
    Company.countDocuments({ deletedAt: null }),
    Company.countDocuments({ status: 'ACTIVE', deletedAt: null }),
    Company.countDocuments({ status: 'SUSPENDED', deletedAt: null }),
    Company.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: '$plan', count: { $sum: 1 } } },
    ]),
    Lead.countDocuments({ deletedAt: null }),
    Quote.countDocuments({ deletedAt: null }),
    User.countDocuments({ isActive: true }),
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
    totalUsers,
    totalRevenue: revenueData[0]?.totalRevenue ?? 0,
    recentLeads,
  };
};

// ── Audit Logs ───────────────────────────────────────────────────────────────

export const getPlatformAuditLogs = async (
  options: { limit?: number; page?: number; action?: string; companyId?: string } = {}
) => {
  const { limit = 50, page = 1, action, companyId } = options;
  const filter: Record<string, unknown> = {};
  if (action) filter.action = action;
  if (companyId) filter.companyId = companyId;

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    AuditLog.countDocuments(filter),
  ]);

  return { data: logs, total, page, totalPages: Math.ceil(total / limit) };
};

// ── Plan Config ──────────────────────────────────────────────────────────────

export const getPlanConfigs = async () => {
  return PlanConfig.find({}).lean();
};

export const updatePlanConfig = async (
  plan: string,
  data: Partial<{ maxLeads: number; maxQuotes: number; maxUsers: number; features: string[] }>
) => {
  const config = await PlanConfig.findOneAndUpdate({ plan }, data, {
    new: true,
    upsert: true,
    runValidators: true,
  }).lean();
  return config;
};
