import React, { createContext, useContext, useState, useEffect } from 'react';
import { Admin, Student } from '../types/sblms';
import { api } from '../services/api';

interface AuthContextType {
  token: string | null;
  userType: 'admin' | 'student' | null;
  user: Admin | Student | null;
  isLoading: boolean;
  login: (token: string, userType: 'admin' | 'student', user: Admin | Student) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('sblms_token'));
  const [userType, setUserType] = useState<'admin' | 'student' | null>(
    localStorage.getItem('sblms_user_type') as 'admin' | 'student' | null
  );
  const [user, setUser] = useState<Admin | Student | null>(() => {
    const saved = localStorage.getItem('sblms_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await api.getCurrentUser();
          if (res.success) {
            setUser(res.user);
            setUserType(res.type);
            localStorage.setItem('sblms_user', JSON.stringify(res.user));
            localStorage.setItem('sblms_user_type', res.type);
          }
        } catch (err) {
          console.error('Session restore failed:', err);
          logout();
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, [token]);

  const login = (newToken: string, newUserType: 'admin' | 'student', newUser: Admin | Student) => {
    setToken(newToken);
    setUserType(newUserType);
    setUser(newUser);
    localStorage.setItem('sblms_token', newToken);
    localStorage.setItem('sblms_user_type', newUserType);
    localStorage.setItem('sblms_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUserType(null);
    setUser(null);
    localStorage.removeItem('sblms_token');
    localStorage.removeItem('sblms_user_type');
    localStorage.removeItem('sblms_user');
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const res = await api.getCurrentUser();
        if (res.success) {
          setUser(res.user);
          localStorage.setItem('sblms_user', JSON.stringify(res.user));
        }
      } catch (e) {
        console.error('Failed to refresh user:', e);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ token, userType, user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
