import React, { createContext, useContext, useState, useEffect } from 'react';

// Mock auth directement ici pour éviter les imports problématiques
const mockAuth = {
  currentUser: { uid: 'demo', email: 'demo@yemma.com' },
  onAuthStateChanged: (callback: (user: any) => void) => {
    callback({ uid: 'demo', email: 'demo@yemma.com' });
    return () => {};
  },
  signInWithEmailAndPassword: async () => ({ 
    user: { uid: 'demo', email: 'demo@yemma.com' } 
  }),
  createUserWithEmailAndPassword: async () => ({ 
    user: { uid: 'demo', email: 'demo@yemma.com' } 
  }),
  signOut: async () => {},
};

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
    // Auth mode démo - utilisateur déjà connecté
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
