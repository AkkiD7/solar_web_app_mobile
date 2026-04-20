import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from './settingsApi';
import type {
  UpdateCompanyProfileDto,
  UpdatePreferencesDto,
  UpdatePricingConfigDto,
  UpdateQuoteBrandingDto,
} from './types';

export const settingsKeys = {
  root: ['settings'] as const,
  companyProfile: () => [...settingsKeys.root, 'company-profile'] as const,
  quoteBranding: () => [...settingsKeys.root, 'quote-branding'] as const,
  pricingConfig: () => [...settingsKeys.root, 'pricing-config'] as const,
  preferences: () => [...settingsKeys.root, 'preferences'] as const,
};

export function useCompanyProfile() {
  return useQuery({
    queryKey: settingsKeys.companyProfile(),
    queryFn: settingsApi.getCompanyProfile,
  });
}

export function useUpdateCompanyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCompanyProfileDto) => settingsApi.updateCompanyProfile(data),
    onSuccess: (profile) => {
      queryClient.setQueryData(settingsKeys.companyProfile(), profile);
    },
  });
}

export function useQuoteSettings() {
  return useQuery({
    queryKey: settingsKeys.quoteBranding(),
    queryFn: settingsApi.getQuoteSettings,
  });
}

export function useUpdateQuoteSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateQuoteBrandingDto) => settingsApi.updateQuoteSettings(data),
    onSuccess: (settings) => {
      queryClient.setQueryData(settingsKeys.quoteBranding(), settings);
    },
  });
}

export function usePricingConfig() {
  return useQuery({
    queryKey: settingsKeys.pricingConfig(),
    queryFn: settingsApi.getPricingConfig,
  });
}

export function useUpdatePricingConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePricingConfigDto) => settingsApi.updatePricingConfig(data),
    onSuccess: (pricingConfig) => {
      queryClient.setQueryData(settingsKeys.pricingConfig(), pricingConfig);
    },
  });
}

export function usePreferences() {
  return useQuery({
    queryKey: settingsKeys.preferences(),
    queryFn: settingsApi.getPreferences,
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePreferencesDto) => settingsApi.updatePreferences(data),
    onSuccess: (preferences) => {
      queryClient.setQueryData(settingsKeys.preferences(), preferences);
    },
  });
}
