import { api, authHeaders, envelope } from '../shared/api/client';
import type { GlobalStats } from './types';

export function fetchStats(token: string) {
  return envelope<GlobalStats>(api.get('/stats', { headers: authHeaders(token) }));
}
