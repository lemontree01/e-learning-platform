import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { $api } from '~/shared/api/instance';

interface User { id: string; name: string; email: string }
interface Credentials { name?: string; email: string; password: string }
interface AccountContextValue {
  user: User | null;
  loading: boolean;
  error: boolean;
  refresh: () => Promise<void>;
  authenticate: (mode: 'register' | 'login', input: Credentials) => Promise<void>;
  logout: () => Promise<void>;
}
const AccountContext = createContext<AccountContextValue | null>(null);
const headers = { 'X-Requested-With': 'learning-platform', };

export function AccountProvider ({ children, }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const stateVersion = useRef(0);

  const refresh = async () => {
    const version = ++stateVersion.current;
    setLoading(true);
    setError(false);
    try {
      const response = await $api.get<{ user: User }>('/auth/me');
      if (version === stateVersion.current) setUser(response.data.user);
    } catch (cause) {
      if (version !== stateVersion.current) return;
      setUser(null);
      if (!isAxiosError(cause) || cause.response?.status !== 401) setError(true);
    } finally {
      if (version === stateVersion.current) setLoading(false);
    }
  };

  useEffect(() => { void refresh(); }, []);

  const authenticate = async (mode: 'register' | 'login', input: Credentials) => {
    const response = await $api.post<{ user: User }>(`/auth/${mode}`, input, { headers, });
    ++stateVersion.current;
    setUser(response.data.user);
    setLoading(false);
    setError(false);
  };
  const logout = async () => {
    await $api.post('/auth/logout', {}, { headers, });
    ++stateVersion.current;
    setUser(null);
    setLoading(false);
    setError(false);
  };

  return <AccountContext.Provider value={{ user, loading, error, refresh, authenticate, logout, }}>
    {children}
  </AccountContext.Provider>;
}

export function useAccount () {
  const account = useContext(AccountContext);
  if (!account) throw new Error('AccountProvider is required.');
  return account;
}

export function accountErrorKey (cause: unknown) {
  if (isAxiosError(cause)) {
    switch (cause.response?.status) {
      case 400: return 'account-invalid';
      case 401: return 'account-credentials';
      case 409: return 'account-duplicate';
      case 429: return 'account-limited';
    }
  }
  return 'account-unavailable';
}
