import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authApi } from '../services/api';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirm_password?: string;
  phone?: string;
  city?: string;
  state?: string;
  device_type?: string;
  primary_concern?: string;
  antivirus_plan?: string;
  emergency_alert_phone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  updateUser: (user: User) => void;
  loginAsDemo: (role: 'ADMIN' | 'USER' | 'MASTER_ADMIN') => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('cyber_suraksha_token');
    const savedUser = localStorage.getItem('cyber_suraksha_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('cyber_suraksha_token');
        localStorage.removeItem('cyber_suraksha_user');
      }
    } else {
      // Default demo login for instant seamless judging experience if desired
      // We can also let the user browse or sign in
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      setToken(res.access_token);
      setUser(res.user);
      localStorage.setItem('cyber_suraksha_token', res.access_token);
      localStorage.setItem('cyber_suraksha_user', JSON.stringify(res.user));
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    try {
      const res = await authApi.register(payload);
      setToken(res.access_token);
      setUser(res.user);
      localStorage.setItem('cyber_suraksha_token', res.access_token);
      localStorage.setItem('cyber_suraksha_user', JSON.stringify(res.user));
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('cyber_suraksha_user', JSON.stringify(updatedUser));
  };

  const loginAsDemo = async (role: 'ADMIN' | 'USER' | 'MASTER_ADMIN') => {
    let email = 'officer.sharma@cybercell.gov.in';
    if (role === 'MASTER_ADMIN') {
      email = 'rahulsingh241177@gmail.com';
    } else if (role === 'ADMIN') {
      email = 'admin@cybersuraksha.gov.in';
    }
    const password = 'demoPassword123!';
    await login(email, password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('cyber_suraksha_token');
    localStorage.removeItem('cyber_suraksha_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        updateUser,
        loginAsDemo,
        logout,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'ADMIN',
      }}
    >
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
