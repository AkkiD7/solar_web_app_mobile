import mongoose, { Document, Schema } from 'mongoose';

export interface IQuote extends Document {
  companyId: mongoose.Types.ObjectId;
  leadId: mongoose.Types.ObjectId;
  quoteNumber: number;
  systemSizeKW: number;
  panelCostPerKW: number;
  inverterCost: number;
  installationCost: number;
  panelCost: number;
  totalCost: number;
  validTill: Date;
  notes?: string;
  deletedAt: Date | null;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const quoteSchema = new Schema<IQuote>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    leadId: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
      index: true,
    },
    quoteNumber: { type: Number, required: true },
    systemSizeKW: { type: Number, required: true, min: 0.1 },
    panelCostPerKW: { type: Number, required: true, min: 0 },
    inverterCost: { type: Number, required: true, min: 0 },
    installationCost: { type: Number, required: true, min: 0 },
    panelCost: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    validTill: { type: Date, required: true },
    notes: { type: String, trim: true },
    deletedAt: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Compound indexes for dashboard + listing performance
quoteSchema.index({ companyId: 1, createdAt: -1 });
quoteSchema.index({ companyId: 1, leadId: 1 });

export const Quote = mongoose.model<IQuote>('Quote', quoteSchema);
