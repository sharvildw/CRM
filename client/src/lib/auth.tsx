'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
  department?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('crm_token');
    const savedUser = localStorage.getItem('crm_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { user: userData, token: authToken } = res.data.data;
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('crm_token', authToken);
    localStorage.setItem('crm_user', JSON.stringify(userData));
  }, []);

  const register = useCallback(async (data: { name: string; email: string; password: string }) => {
    const res = await api.post('/auth/register', data);
    const { user: userData, token: authToken } = res.data.data;
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('crm_token', authToken);
    localStorage.setItem('crm_user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_user');
    window.location.href = '/login';
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      localStorage.setItem('crm_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      user, token, login, register, logout, updateUser,
      isLoading, isAuthenticated: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
