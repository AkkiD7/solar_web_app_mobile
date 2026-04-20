import api from '../../shared/api/api';
import type {
  CompanyPreferences,
  CompanyProfile,
  PricingConfig,
  QuoteBrandingSettings,
  UpdateCompanyProfileDto,
  UpdatePreferencesDto,
  UpdatePricingConfigDto,
  UpdateQuoteBrandingDto,
} from './types';

export const settingsApi = {
  getCompanyProfile: async (): Promise<CompanyProfile> => {
    const res = await api.get('/companies/me');
    return res.data.data;
  },

  updateCompanyProfile: async (data: UpdateCompanyProfileDto): Promise<CompanyProfile> => {
    const res = await api.put('/companies/me', data);
    return res.data.data;
  },

  getQuoteSettings: async (): Promise<QuoteBrandingSettings> => {
    const res = await api.get('/companies/me/quote-settings');
    return res.data.data;
  },

  updateQuoteSettings: async (data: UpdateQuoteBrandingDto): Promise<QuoteBrandingSettings> => {
    const res = await api.put('/companies/me/quote-settings', data);
    return res.data.data;
  },

  getPricingConfig: async (): Promise<PricingConfig> => {
    const res = await api.get('/companies/me/pricing-config');
    return res.data.data;
  },

  updatePricingConfig: async (data: UpdatePricingConfigDto): Promise<PricingConfig> => {
    const res = await api.put('/companies/me/pricing-config', data);
    return res.data.data;
  },

  getPreferences: async (): Promise<CompanyPreferences> => {
    const res = await api.get('/companies/me/settings');
    return res.data.data;
  },

  updatePreferences: async (data: UpdatePreferencesDto): Promise<CompanyPreferences> => {
    const res = await api.put('/companies/me/settings', data);
    return res.data.data;
  },
};
