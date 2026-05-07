export interface AuditLog {
  _id: string;
  companyId?: string;
  action: string;
  entityId?: string;
  performedBy: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface AuditQuery {
  action: string;
  page: number;
  limit: number;
}

export const auditActions = [
  'USER_LOGIN',
  'LEAD_CREATED',
  'LEAD_UPDATED',
  'LEAD_DELETED',
  'QUOTE_GENERATED',
  'SETTINGS_UPDATED',
  'LOGO_UPLOADED',
  'PLAN_CHANGED',
  'COMPANY_SUSPENDED',
  'COMPANY_ACTIVATED',
  'COMPANY_UPDATED',
  'COMPANY_DELETED',
  'USER_CREATED',
  'USER_UPDATED',
  'USER_DELETED',
  'PASSWORD_RESET',
  'IMPERSONATION',
];
