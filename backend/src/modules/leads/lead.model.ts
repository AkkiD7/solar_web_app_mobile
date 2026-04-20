import mongoose, { Document, Schema } from 'mongoose';
import { LeadStatus } from './leads.types';

export interface ILead extends Document {
  companyId: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  email?: string;
  location?: string;
  status: LeadStatus;
  systemSizeKW?: number;
  notes?: string;
  followUpDate?: Date;
  deletedAt: Date | null;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
}

const leadSchema = new Schema<ILead>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, 'Phone must be exactly 10 digits'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    location: { type: String, trim: true },
    status: {
      type: String,
      enum: Object.values(LeadStatus),
      default: LeadStatus.NEW,
    },
    systemSizeKW: { type: Number, min: 0 },
    notes: { type: String, trim: true },
    followUpDate: { type: Date, default: null },
    deletedAt: { type: Date, default: null, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Compound indexes for query performance
leadSchema.index({ companyId: 1, status: 1 });
leadSchema.index({ companyId: 1, deletedAt: 1 });
leadSchema.index({ companyId: 1, createdAt: -1 });

export const Lead = mongoose.model<ILead>('Lead', leadSchema);
