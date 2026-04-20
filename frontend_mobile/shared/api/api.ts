import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { useAuthStore } from '../../features/auth/authStore';

const API_PORT = '5000';
const API_PATH = '/api';

function getExpoHostBaseUrl(): string | null {
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri) {
    return null;
  }

  const host = hostUri.split(':')[0];
  if (!host) {
    return null;
  }

  return `http://${host}:${API_PORT}${API_PATH}`;
}

function resolveBaseUrl(): string {
  const envBaseUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (envBaseUrl) {
    return envBaseUrl.replace(/\/$/, '');
  }

  return getExpoHostBaseUrl() ?? `http://localhost:${API_PORT}${API_PATH}`;
}

export const BASE_URL = resolveBaseUrl();

if (__DEV__) {
  console.log(`[api] Using base URL: ${BASE_URL}`);
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

let lastGlobalErrorAt = 0;

function shouldShowGlobalError() {
  const now = Date.now();
  if (now - lastGlobalErrorAt < 1500) {
    return false;
  }

  lastGlobalErrorAt = now;
  return true;
}

api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('solar_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // SecureStore is not always available in previews.
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await useAuthStore.getState().logout();
    } else if (shouldShowGlobalError()) {
      if (!error.response) {
        Alert.alert(
          'Network Error',
          'We could not reach the server. Please check your connection and try again.'
        );
      } else if (error.response.status >= 500) {
        Alert.alert(
          'Server Error',
          error.response.data?.message ?? 'Something went wrong on the server.'
        );
      }
    }

    return Promise.reject(error);
  }
);

export default api;
