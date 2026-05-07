import axios from 'axios';
import type { ApiEnvelope } from '../types';

export const SUPERADMIN_TOKEN_KEY = 'sa_token';
export const SUPERADMIN_THEME_KEY = 'sa_theme';
export const BASE = '/api/superadmin';

const api = axios.create({ baseURL: BASE });

// ── 401 interceptor — auto-logout on expired token ─────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem(SUPERADMIN_TOKEN_KEY);
      // Only redirect if we're on a protected page (not already on login)
      if (!window.location.pathname.includes('/login')) {
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export { api };

export function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export function envelope<T>(promise: Promise<{ data: ApiEnvelope<T> }>): Promise<T> {
  return promise.then((response) => response.data.data);
}

export function asParams(values: Record<string, string | number | undefined>) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined && value !== '')
  );
}

export function cleanPayload(data: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined && value !== '')
  );
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}
