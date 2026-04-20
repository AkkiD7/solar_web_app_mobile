export interface Quote {
  _id: string;
  leadId: string;
  systemSizeKW: number;
  panelCostPerKW: number;
  inverterCost: number;
  installationCost: number;
  panelCost: number;
  totalCost: number;
  createdAt: string;
}

export interface CreateQuoteRequest {
  leadId: string;
  systemSizeKW: number;
  panelCostPerKW: number;
  inverterCost: number;
  installationCost: number;
}

export interface QuoteCalculation {
  panelCost: number;
  total: number;
}
