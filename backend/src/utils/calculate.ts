export interface QuoteInput {
  systemSizeKW: number;
  panelCostPerKW: number;
  inverterCost: number;
  installationCost: number;
}

export interface QuoteOutput {
  panelCost: number;
  total: number;
}

export function calculateQuote(data: QuoteInput): QuoteOutput {
  const panelCost = data.systemSizeKW * data.panelCostPerKW;
  const total = panelCost + data.inverterCost + data.installationCost;
  return { panelCost, total };
}
