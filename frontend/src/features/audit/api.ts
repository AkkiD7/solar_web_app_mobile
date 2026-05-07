import { api, authHeaders, envelope, asParams } from '../shared/api/client';
import type { Paginated } from '../shared/types';
import type { AuditLog, AuditQuery } from './types';

export function fetchAuditLogs(token: string, query: AuditQuery) {
  return envelope<Paginated<AuditLog>>(
    api.get('/audit-logs', {
      headers: authHeaders(token),
      params: asParams({ action: query.action, page: query.page, limit: query.limit }),
    })
  );
}

export function fetchActivityLogs(token: string, companyId?: string) {
  return envelope<Paginated<AuditLog>>(
    api.get('/audit-logs', {
      headers: authHeaders(token),
      params: asParams({ page: 1, limit: 30, companyId }),
    })
  );
}
