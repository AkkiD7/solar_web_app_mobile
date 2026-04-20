import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { AuthUser } from './types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (token: string, user: AuthUser) => Promise<void>;
  patchUser: (updates: Partial<AuthUser>) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

async function persistUser(user: AuthUser | null) {
  if (!user) {
    await SecureStore.deleteItemAsync('solar_user');
    return;
  }

  await SecureStore.setItemAsync('solar_user', JSON.stringify(user));
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,

  setAuth: async (token, user) => {
    await SecureStore.setItemAsync('solar_token', token);
    await persistUser(user);
    set({ token, user, isLoading: false });
  },

  patchUser: async (updates) => {
    const currentUser = get().user;
    if (!currentUser) {
      return;
    }

    const nextUser = { ...currentUser, ...updates };
    await persistUser(nextUser);
    set({ user: nextUser });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('solar_token');
    await SecureStore.deleteItemAsync('solar_user');
    set({ token: null, user: null, isLoading: false });
  },

  loadFromStorage: async () => {
    try {
      const [token, userStr] = await Promise.all([
        SecureStore.getItemAsync('solar_token'),
        SecureStore.getItemAsync('solar_user'),
      ]);

      if (token && userStr) {
        set({ token, user: JSON.parse(userStr) as AuthUser });
      } else {
        set({ token: null, user: null });
      }
    } catch {
      set({ token: null, user: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
