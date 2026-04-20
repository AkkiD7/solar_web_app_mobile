import type { QuoteCalculation } from '../types';

export interface QuoteInput {
  systemSizeKW: number;
  panelCostPerKW: number;
  inverterCost: number;
  installationCost: number;
}

export function calculateQuote(data: QuoteInput): QuoteCalculation {
  const panelCost = (data.systemSizeKW || 0) * (data.panelCostPerKW || 0);
  const total = panelCost + (data.inverterCost || 0) + (data.installationCost || 0);
  return { panelCost, total };
}
