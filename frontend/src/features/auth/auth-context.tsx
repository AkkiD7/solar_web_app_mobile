import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { SUPERADMIN_TOKEN_KEY } from '../shared/api/client';

type SuperAdminAuthContextValue = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

const SuperAdminAuthContext = createContext<SuperAdminAuthContextValue | null>(null);

export function SuperAdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(SUPERADMIN_TOKEN_KEY));

  const value = useMemo(
    () => ({
      token,
      login: (nextToken: string) => {
        localStorage.setItem(SUPERADMIN_TOKEN_KEY, nextToken);
        setToken(nextToken);
      },
      logout: () => {
        localStorage.removeItem(SUPERADMIN_TOKEN_KEY);
        setToken(null);
      },
    }),
    [token]
  );

  return <SuperAdminAuthContext.Provider value={value}>{children}</SuperAdminAuthContext.Provider>;
}

export function useSuperAdminAuth() {
  const context = useContext(SuperAdminAuthContext);
  if (!context) {
    throw new Error('useSuperAdminAuth must be used within SuperAdminAuthProvider.');
  }
  return context;
}
