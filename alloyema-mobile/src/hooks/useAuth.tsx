import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';

interface User {
  uid: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>({ uid: 'demo', email: 'demo@yemma.com' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Auth désactivée pour le build - mode démo
    setUser({ uid: 'demo', email: 'demo@yemma.com' });
  }, []);

  const login = async (email: string, password: string) => {
    setUser({ uid: 'demo', email });
  };

  const register = async (email: string, password: string) => {
    setUser({ uid: 'demo', email });
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
