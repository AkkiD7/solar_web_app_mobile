// IMPORTANT CONSTRAINT: Single-user application
// Every query is scoped to the logged-in userId.
// No multi-tenant, no roles, no company system.

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  SITE_VISIT = 'SITE_VISIT',
  QUOTE_SENT = 'QUOTE_SENT',
  WON = 'WON',
  LOST = 'LOST',
}
