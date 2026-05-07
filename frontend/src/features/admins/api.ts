import { api, authHeaders, envelope } from '../shared/api/client';
import type { PlatformAdmin } from './types';

export function listAdmins(token: string) {
  return envelope<PlatformAdmin[]>(api.get('/admins', { headers: authHeaders(token) }));
}

export function createAdmin(token: string, email: string, password: string) {
  return envelope<PlatformAdmin>(api.post('/admins', { email, password }, { headers: authHeaders(token) }));
}

export function deleteAdmin(token: string, id: string) {
  return envelope<{ message: string }>(api.delete(`/admins/${id}`, { headers: authHeaders(token) }));
}
