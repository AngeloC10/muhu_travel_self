import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { db } from '../services/backend-db';

interface AuthContextType {
  user: User | null;
  login: (e: string, p: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check persistence
    const stored = localStorage.getItem('muhu_session');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    const userFound = await db.login(email, pass);
    if (userFound) {
      setUser(userFound);
      localStorage.setItem('muhu_session', JSON.stringify(userFound));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('muhu_session');
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-900 text-white">Cargando Muhu Travel...</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
