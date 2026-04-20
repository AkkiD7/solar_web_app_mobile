export interface CompanyProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  logoUrl?: string | null;
  gstNumber?: string | null;
  website?: string | null;
  plan?: string;
  status?: string;
}

export interface QuoteBrandingSettings {
  _id?: string;
  headerText?: string;
  footerText?: string;
  logoUrl?: string;
  signatureUrl?: string;
}

export interface PricingConfig {
  _id?: string;
  defaultPanelCostPerKW?: number;
  defaultInverterCost?: number;
  defaultInstallationCost?: number;
}

export interface CompanyPreferences {
  _id?: string;
  currency: string;
  dateFormat: string;
  language: string;
}

export interface UpdateCompanyProfileDto {
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber?: string;
  website?: string;
}

export interface UpdateQuoteBrandingDto {
  headerText?: string;
  footerText?: string;
}

export interface UpdatePricingConfigDto {
  defaultPanelCostPerKW: number;
  defaultInverterCost: number;
  defaultInstallationCost: number;
}

export interface UpdatePreferencesDto {
  currency: string;
  dateFormat: string;
  language: string;
}
