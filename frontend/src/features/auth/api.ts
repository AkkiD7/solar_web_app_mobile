import { api, authHeaders, envelope } from '../shared/api/client';
import type { LoginResponse } from './types';

export function login(email: string, password: string) {
  return envelope<LoginResponse>(api.post('/login', { email, password }));
}

export function changePassword(token: string, currentPassword: string, newPassword: string) {
  return envelope<{ message: string }>(
    api.put('/profile/password', { currentPassword, newPassword }, { headers: authHeaders(token) })
  );
}
