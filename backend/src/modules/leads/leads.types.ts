// Multi-tenant: every query is scoped to companyId for data isolation.

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  SITE_VISIT = 'SITE_VISIT',
  QUOTE_SENT = 'QUOTE_SENT',
  WON = 'WON',
  LOST = 'LOST',
}
