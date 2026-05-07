import { api, authHeaders, envelope } from '../shared/api/client';
import type { SystemHealth } from './types';

export function fetchHealth(token: string) {
  return envelope<SystemHealth>(api.get('/system/health', { headers: authHeaders(token) }));
}
