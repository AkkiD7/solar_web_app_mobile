import type { LeadStatus } from '../leads/types';

export interface QuoteLeadSummary {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  location?: string;
  systemSizeKW?: number;
  notes?: string;
  status?: LeadStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Quote {
  _id: string;
  quoteNumber: number;
  leadId: string | QuoteLeadSummary;
  systemSizeKW: number;
  panelCostPerKW: number;
  panelCost: number;
  inverterCost: number;
  installationCost: number;
  totalCost: number;
  validTill: string;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

export interface CreateQuoteDto {
  leadId: string;
  systemSizeKW: number;
  panelCostPerKW: number;
  inverterCost: number;
  installationCost: number;
  notes?: string;
}

export interface QuoteCalculation {
  panelCost: number;
  total: number;
}

export function calculateQuote(data: {
  systemSizeKW: number;
  panelCostPerKW: number;
  inverterCost: number;
  installationCost: number;
}): QuoteCalculation {
  const panelCost = (data.systemSizeKW || 0) * (data.panelCostPerKW || 0);
  const total = panelCost + (data.inverterCost || 0) + (data.installationCost || 0);
  return { panelCost, total };
}

export function getQuoteLead(quote: Quote): QuoteLeadSummary | null {
  return typeof quote.leadId === 'string' ? null : quote.leadId;
}
