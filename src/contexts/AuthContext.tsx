'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import type { User, LoginPayload, RegisterPayload, AuthResponse } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getInitialToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function getInitialUser(): User | null {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem('user');
  return saved ? (JSON.parse(saved) as User) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [token, setToken] = useState<string | null>(getInitialToken);
  const [loading] = useState(() => typeof window === 'undefined');
  const router = useRouter();

  const saveAuth = (data: AuthResponse) => {
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    document.cookie = `token=${data.access_token}; path=/`;
    setToken(data.access_token);
    setUser(data.user);
  };

  const login = useCallback(async (payload: LoginPayload) => {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    saveAuth(data);
    router.push('/orders');
  }, [router]);

  const register = useCallback(async (payload: RegisterPayload) => {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    saveAuth(data);
    router.push('/orders');
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; max-age=0';
    setToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
