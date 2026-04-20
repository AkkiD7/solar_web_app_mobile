export type LeadStatus = 'NEW' | 'CONTACTED' | 'SITE_VISIT' | 'QUOTE_SENT' | 'WON' | 'LOST';

export const LEAD_STATUS_OPTIONS: Array<{ value: LeadStatus; label: string }> = [
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'SITE_VISIT', label: 'Site Visit' },
  { value: 'QUOTE_SENT', label: 'Quote Sent' },
  { value: 'WON', label: 'Won' },
  { value: 'LOST', label: 'Lost' },
];

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: '#2d7df6',
  CONTACTED: '#2aa6d9',
  SITE_VISIT: '#9b7a65',
  QUOTE_SENT: '#f97316',
  WON: '#2ea56c',
  LOST: '#d45c4a',
};

export function getLeadStatusLabel(status: LeadStatus) {
  return LEAD_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}
