import { Lead } from '../modules/leads/lead.model';
import { Quote } from '../modules/quotations/quote.model';
import { User } from '../modules/users/user.model';
import { Company, CompanyPlan } from '../modules/companies/company.model';
import { PlanConfig } from '../modules/superadmin/plan-config.model';

// Fallback limits if DB config not yet seeded
const FALLBACK_LIMITS: Record<CompanyPlan, { leads: number; quotes: number; users: number }> = {
  FREE: { leads: 50, quotes: 100, users: 2 },
  STARTER: { leads: 500, quotes: 1000, users: 10 },
  PRO: { leads: -1, quotes: -1, users: -1 },
};

async function getPlanLimits(companyId: string, plan: CompanyPlan) {
  const [company, config] = await Promise.all([
    Company.findById(companyId).select('customLimits').lean(),
    PlanConfig.findOne({ plan }).lean(),
  ]);
  const defaults = config
    ? { leads: config.maxLeads, quotes: config.maxQuotes, users: config.maxUsers }
    : FALLBACK_LIMITS[plan] ?? FALLBACK_LIMITS.FREE;

  return {
    leads: company?.customLimits?.maxLeads ?? defaults.leads,
    quotes: company?.customLimits?.maxQuotes ?? defaults.quotes,
    users: company?.customLimits?.maxUsers ?? defaults.users,
  };
}

export const assertLeadLimit = async (companyId: string, plan: CompanyPlan): Promise<void> => {
  const limits = await getPlanLimits(companyId, plan);
  if (limits.leads === -1) return; // unlimited

  const count = await Lead.countDocuments({ companyId, deletedAt: null });
  if (count >= limits.leads) {
    throw new Error(
      `Lead limit reached for ${plan} plan (${limits.leads} max). Please upgrade your plan.`
    );
  }
};

export const assertQuoteLimit = async (companyId: string, plan: CompanyPlan): Promise<void> => {
  const limits = await getPlanLimits(companyId, plan);
  if (limits.quotes === -1) return; // unlimited

  const count = await Quote.countDocuments({ companyId, deletedAt: null });
  if (count >= limits.quotes) {
    throw new Error(
      `Quote limit reached for ${plan} plan (${limits.quotes} max). Please upgrade your plan.`
    );
  }
};

export const assertUserLimit = async (companyId: string, plan: CompanyPlan): Promise<void> => {
  const limits = await getPlanLimits(companyId, plan);
  if (limits.users === -1) return; // unlimited

  const count = await User.countDocuments({ companyId, isActive: true });
  if (count >= limits.users) {
    throw new Error(
      `User limit reached for ${plan} plan (${limits.users} max). Please upgrade your plan.`
    );
  }
};
