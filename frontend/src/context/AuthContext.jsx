import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('passiton_token');
    const stored = localStorage.getItem('passiton_user');
    if (token && stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('passiton_token');
        localStorage.removeItem('passiton_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const user = await api.login({ email, password });
    localStorage.setItem('passiton_token', user.token);
    localStorage.setItem('passiton_user', JSON.stringify(user));
    setUser(user);
  };

  const register = async (name, email, password, location) => {
    const user = await api.register({ name, email, password, location });
    localStorage.setItem('passiton_token', user.token);
    localStorage.setItem('passiton_user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('passiton_token');
    localStorage.removeItem('passiton_user');
    setUser(null);
  };

  const updateUser = (updated) => {
    localStorage.setItem('passiton_user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
