import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  companyId: mongoose.Types.ObjectId;
  currency: string;
  dateFormat: string;
  language: string;
}

const settingsSchema = new Schema<ISettings>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      unique: true,
      index: true,
    },
    currency: { type: String, default: 'INR', trim: true },
    dateFormat: { type: String, default: 'DD/MM/YYYY', trim: true },
    language: { type: String, default: 'en', trim: true },
  },
  { timestamps: true }
);

export const Settings = mongoose.model<ISettings>('Settings', settingsSchema);
