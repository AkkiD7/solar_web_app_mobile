import mongoose, { Document, Schema } from 'mongoose';

export interface IPricingConfig extends Document {
  companyId: mongoose.Types.ObjectId;
  defaultPanelCostPerKW: number;
  defaultInverterCost: number;
  defaultInstallationCost: number;
}

const pricingConfigSchema = new Schema<IPricingConfig>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      unique: true,
      index: true,
    },
    defaultPanelCostPerKW: { type: Number, default: 0, min: 0 },
    defaultInverterCost: { type: Number, default: 0, min: 0 },
    defaultInstallationCost: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export const PricingConfig = mongoose.model<IPricingConfig>('PricingConfig', pricingConfigSchema);
