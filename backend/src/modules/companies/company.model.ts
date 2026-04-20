import mongoose, { Document, Schema } from 'mongoose';

export type CompanyPlan = 'FREE' | 'STARTER' | 'PRO';
export type CompanyStatus = 'ACTIVE' | 'SUSPENDED';

export interface ICompany extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  logoUrl?: string;
  gstNumber?: string;
  website?: string;
  plan: CompanyPlan;
  status: CompanyStatus;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    logoUrl: { type: String, trim: true },
    gstNumber: { type: String, trim: true },
    website: { type: String, trim: true },
    plan: {
      type: String,
      enum: ['FREE', 'STARTER', 'PRO'] as CompanyPlan[],
      default: 'FREE' as CompanyPlan,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED'] as CompanyStatus[],
      default: 'ACTIVE' as CompanyStatus,
    },
  },
  { timestamps: true }
);

export const Company = mongoose.model<ICompany>('Company', companySchema);
