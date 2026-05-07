import { api, authHeaders, envelope } from '../shared/api/client';
import type { Plan, PlanConfig } from './types';

export function fetchPlanConfigs(token: string) {
  return envelope<PlanConfig[]>(api.get('/plan-config', { headers: authHeaders(token) }));
}

export function updatePlanConfig(token: string, plan: Plan, data: Omit<PlanConfig, 'plan' | '_id'>) {
  return envelope<PlanConfig>(api.put(`/plan-config/${plan}`, data, { headers: authHeaders(token) }));
}
