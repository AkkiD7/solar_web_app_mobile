import { Lead } from '../modules/leads/lead.model';
import { Quote } from '../modules/quotations/quote.model';
import { CompanyPlan } from '../modules/companies/company.model';

const PLAN_LIMITS: Record<CompanyPlan, { leads: number; quotes: number }> = {
  FREE:    { leads: 50,       quotes: 100 },
  STARTER: { leads: 500,      quotes: 1000 },
  PRO:     { leads: Infinity, quotes: Infinity },
};

export const assertLeadLimit = async (companyId: string, plan: CompanyPlan): Promise<void> => {
  const limit = PLAN_LIMITS[plan]?.leads ?? 50;
  if (limit === Infinity) return;

  const count = await Lead.countDocuments({ companyId, deletedAt: null });
  if (count >= limit) {
    throw new Error(
      `Lead limit reached for ${plan} plan (${limit} max). Please upgrade your plan.`
    );
  }
};

export const assertQuoteLimit = async (companyId: string, plan: CompanyPlan): Promise<void> => {
  const limit = PLAN_LIMITS[plan]?.quotes ?? 100;
  if (limit === Infinity) return;

  const count = await Quote.countDocuments({ companyId, deletedAt: null });
  if (count >= limit) {
    throw new Error(
      `Quote limit reached for ${plan} plan (${limit} max). Please upgrade your plan.`
    );
  }
};
