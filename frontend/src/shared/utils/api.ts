// Shared API axios instance with JWT interceptor
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token from Zustand persist store
api.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('solar_auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      const token = parsed?.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    // ignore parse errors
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('solar_auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
