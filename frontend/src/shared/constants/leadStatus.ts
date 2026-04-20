// Single source of truth for LeadStatus — synced with backend enum
export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  SITE_VISIT = 'SITE_VISIT',
  QUOTE_SENT = 'QUOTE_SENT',
  WON = 'WON',
  LOST = 'LOST',
}

export const LEAD_STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; variant: 'blue' | 'warning' | 'purple' | 'default' | 'success' | 'destructive' }
> = {
  [LeadStatus.NEW]: { label: 'New', variant: 'blue' },
  [LeadStatus.CONTACTED]: { label: 'Contacted', variant: 'warning' },
  [LeadStatus.SITE_VISIT]: { label: 'Site Visit', variant: 'purple' },
  [LeadStatus.QUOTE_SENT]: { label: 'Quote Sent', variant: 'default' },
  [LeadStatus.WON]: { label: 'Won', variant: 'success' },
  [LeadStatus.LOST]: { label: 'Lost', variant: 'destructive' },
};

export const LEAD_STATUS_OPTIONS = Object.values(LeadStatus).map((status) => ({
  value: status,
  label: LEAD_STATUS_CONFIG[status].label,
}));
