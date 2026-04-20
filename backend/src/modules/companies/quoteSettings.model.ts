import mongoose, { Document, Schema } from 'mongoose';

export interface IQuoteSettings extends Document {
  companyId: mongoose.Types.ObjectId;
  headerText?: string;
  footerText?: string;
  logoUrl?: string;       // overrides company.logoUrl if set
  signatureUrl?: string;
}

const quoteSettingsSchema = new Schema<IQuoteSettings>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      unique: true,
      index: true,
    },
    headerText: { type: String, trim: true },
    footerText: { type: String, trim: true },
    logoUrl: { type: String, trim: true },
    signatureUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

export const QuoteSettings = mongoose.model<IQuoteSettings>('QuoteSettings', quoteSettingsSchema);
