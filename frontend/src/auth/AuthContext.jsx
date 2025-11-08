import React, { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('campusnetUser')) || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If we have a token, try to fetch profile
    const token = localStorage.getItem('campusnet_token');
    if (token && !user) {
      (async () => {
        setLoading(true);
        try {
          const res = await api.getProfile();
          setUser(res.user || res);
          localStorage.setItem('campusnetUser', JSON.stringify(res.user || res));
        } catch (err) {
          console.warn('Profile load failed', err);
          localStorage.removeItem('campusnet_token');
          localStorage.removeItem('campusnetUser');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, []);

  async function login({ id, password }) {
    setLoading(true);
    setError(null);
    try {
      const res = await api.login({ email: id, password });
      if (res.token) {
        localStorage.setItem('campusnet_token', res.token);
      }
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('campusnetUser', JSON.stringify(res.user));
      }
      setLoading(false);
      return res;
    } catch (err) {
      setError(err.message || JSON.stringify(err));
      setLoading(false);
      throw err;
    }
  }

  async function register(payload) {
    setLoading(true);
    setError(null);
    try {
      const res = await api.register(payload);
      if (res.token) localStorage.setItem('campusnet_token', res.token);
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('campusnetUser', JSON.stringify(res.user));
      }
      setLoading(false);
      return res;
    } catch (err) {
      setError(err.message || JSON.stringify(err));
      setLoading(false);
      throw err;
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await api.logout();
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('campusnet_token');
    localStorage.removeItem('campusnetUser');
    setUser(null);
    setLoading(false);
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
