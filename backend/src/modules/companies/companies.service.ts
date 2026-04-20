import { Company } from './company.model';
import { QuoteSettings } from './quoteSettings.model';
import { PricingConfig } from './pricingConfig.model';
import { Settings } from './settings.model';
import { auditLog } from '../audit/audit.service';
import { uploadToCloudinary } from '../../utils/cloudinary';

// ── Company Profile ──────────────────────────────────────────────────────────

export const getCompany = async (companyId: string) => {
  const company = await Company.findById(companyId).lean();
  if (!company) throw new Error('Company not found');
  return company;
};

export const updateCompany = async (
  companyId: string,
  userId: string,
  data: Partial<{
    name: string;
    email: string;
    phone: string;
    address: string;
    gstNumber: string;
    website: string;
  }>
) => {
  const company = await Company.findByIdAndUpdate(companyId, data, {
    new: true,
    runValidators: true,
  }).lean();
  if (!company) throw new Error('Company not found');

  auditLog({ companyId, action: 'SETTINGS_UPDATED', performedBy: userId });
  return company;
};

export const uploadLogo = async (
  companyId: string,
  userId: string,
  fileBuffer: Buffer,
  mimeType: string
) => {
  const logoUrl = await uploadToCloudinary(fileBuffer, mimeType, `solar/logos/${companyId}`);

  const company = await Company.findByIdAndUpdate(
    companyId,
    { logoUrl },
    { new: true }
  ).lean();
  if (!company) throw new Error('Company not found');

  auditLog({ companyId, action: 'LOGO_UPLOADED', performedBy: userId });
  return { logoUrl };
};

// ── Quote Settings ───────────────────────────────────────────────────────────

export const getQuoteSettings = async (companyId: string) => {
  const settings = await QuoteSettings.findOne({ companyId }).lean();
  return settings ?? {};
};

export const updateQuoteSettings = async (
  companyId: string,
  userId: string,
  data: Partial<{
    headerText: string;
    footerText: string;
    logoUrl: string;
  }>
) => {
  const settings = await QuoteSettings.findOneAndUpdate(
    { companyId },
    data,
    { new: true, upsert: true, runValidators: true }
  ).lean();

  auditLog({ companyId, action: 'SETTINGS_UPDATED', performedBy: userId });
  return settings;
};

export const uploadSignature = async (
  companyId: string,
  userId: string,
  fileBuffer: Buffer,
  mimeType: string
) => {
  const signatureUrl = await uploadToCloudinary(
    fileBuffer,
    mimeType,
    `solar/signatures/${companyId}`
  );

  const settings = await QuoteSettings.findOneAndUpdate(
    { companyId },
    { signatureUrl },
    { new: true, upsert: true }
  ).lean();

  auditLog({ companyId, action: 'LOGO_UPLOADED', performedBy: userId, metadata: { type: 'signature' } });
  return { signatureUrl, settings };
};

// ── Pricing Config ───────────────────────────────────────────────────────────

export const getPricingConfig = async (companyId: string) => {
  const config = await PricingConfig.findOne({ companyId }).lean();
  return config ?? {};
};

export const updatePricingConfig = async (
  companyId: string,
  userId: string,
  data: Partial<{
    defaultPanelCostPerKW: number;
    defaultInverterCost: number;
    defaultInstallationCost: number;
  }>
) => {
  const config = await PricingConfig.findOneAndUpdate(
    { companyId },
    data,
    { new: true, upsert: true, runValidators: true }
  ).lean();

  auditLog({ companyId, action: 'SETTINGS_UPDATED', performedBy: userId });
  return config;
};

// ── Company Settings (locale) ────────────────────────────────────────────────

export const getSettings = async (companyId: string) => {
  const settings = await Settings.findOne({ companyId }).lean();
  return settings ?? { currency: 'INR', dateFormat: 'DD/MM/YYYY', language: 'en' };
};

export const updateSettings = async (
  companyId: string,
  userId: string,
  data: Partial<{ currency: string; dateFormat: string; language: string }>
) => {
  const settings = await Settings.findOneAndUpdate(
    { companyId },
    data,
    { new: true, upsert: true, runValidators: true }
  ).lean();

  auditLog({ companyId, action: 'SETTINGS_UPDATED', performedBy: userId });
  return settings;
};
