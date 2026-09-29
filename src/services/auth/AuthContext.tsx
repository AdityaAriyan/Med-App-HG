import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from './authService';
import type { UserProfile, UserRole } from '../../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  register: (params: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    department?: string;
    jobTitle?: string;
  }) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const current = await AuthService.getCurrentUser();
      setUser(current);
    } catch (err) {
      console.error('Session check failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const result = await AuthService.login(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    setLoading(false);
    return result;
  };

  const register = async (params: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    department?: string;
    jobTitle?: string;
  }) => {
    setLoading(true);
    const result = await AuthService.register(params);
    if (result.success && result.user) {
      setUser(result.user);
    }
    setLoading(false);
    return result;
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
