import React, { createContext, useContext, useMemo, useState } from 'react';
import { clearStoredAuth, getStoredToken, getStoredUser, setStoredToken, setStoredUser } from './authStorage';
import { login, signup } from '../services/api';

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(false);

  const isAuthed = !!token;

  const signIn = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await login(email, password);
      setToken(res.token);
      setUser(res.user);
      setStoredToken(res.token);
      setStoredUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const res = await signup(name, email, password);
      // Auto-login after signup (common UX)
      setToken(res.token);
      setUser(res.user);
      setStoredToken(res.token);
      setStoredUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setToken('');
    setUser(null);
    clearStoredAuth();
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthed,
      loading,
      signIn,
      signUp,
      signOut,
    }),
    [token, user, isAuthed, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

