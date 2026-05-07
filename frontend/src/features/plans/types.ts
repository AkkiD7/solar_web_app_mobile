export const PLANS = ['FREE', 'STARTER', 'PRO'] as const;
export type Plan = (typeof PLANS)[number];

export interface PlanConfig {
  _id?: string;
  plan: Plan;
  maxLeads: number;
  maxQuotes: number;
  maxUsers: number;
  features: string[];
}
