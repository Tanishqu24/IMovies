import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('imovies_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('imovies_token') || null);
  const [loading, setLoading] = useState(true);

  // Check current session validity
  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await API.get('/auth/me');
          setUser(res.data.user);
          localStorage.setItem('imovies_user', JSON.stringify(res.data.user));
        } catch (err) {
          console.error('Session expired or invalid', err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data;
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('imovies_token', newToken);
    localStorage.setItem('imovies_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (formData) => {
    const res = await API.post('/auth/register', formData);
    const { token: newToken, user: userData } = res.data;
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('imovies_token', newToken);
    localStorage.setItem('imovies_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('imovies_token');
    localStorage.removeItem('imovies_user');
  };

  const updateUser = (updatedData) => {
    setUser(prev => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem('imovies_user', JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isManager: user?.role === 'manager',
        isCustomer: user?.role === 'customer',
        login,
        register,
        logout,
        updateUser
      }}
    >
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

