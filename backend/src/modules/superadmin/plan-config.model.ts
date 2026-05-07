import mongoose, { Document, Schema } from 'mongoose';
import { CompanyPlan } from '../companies/company.model';

export interface IPlanConfig extends Document {
  plan: CompanyPlan;
  maxLeads: number;
  maxQuotes: number;
  maxUsers: number;
  features: string[];
}

const planConfigSchema = new Schema<IPlanConfig>(
  {
    plan: {
      type: String,
      enum: ['FREE', 'STARTER', 'PRO'] as CompanyPlan[],
      required: true,
      unique: true,
    },
    maxLeads: { type: Number, required: true, default: 50 },
    maxQuotes: { type: Number, required: true, default: 100 },
    maxUsers: { type: Number, required: true, default: 2 },
    features: [{ type: String }],
  },
  { timestamps: true }
);

export const PlanConfig = mongoose.model<IPlanConfig>('PlanConfig', planConfigSchema);

/**
 * Seed default plan configs if none exist.
 */
export const seedPlanConfigs = async (): Promise<void> => {
  const count = await PlanConfig.countDocuments();
  if (count > 0) return;

  await PlanConfig.insertMany([
    { plan: 'FREE', maxLeads: 50, maxQuotes: 100, maxUsers: 2, features: ['leads', 'quotes'] },
    { plan: 'STARTER', maxLeads: 500, maxQuotes: 1000, maxUsers: 10, features: ['leads', 'quotes', 'pdf_branding'] },
    { plan: 'PRO', maxLeads: -1, maxQuotes: -1, maxUsers: -1, features: ['leads', 'quotes', 'pdf_branding', 'analytics', 'export'] },
  ]);
  console.log('✅ Plan configs seeded');
};
