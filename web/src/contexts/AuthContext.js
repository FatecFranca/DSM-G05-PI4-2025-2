import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth.js';
import { getToken, setToken, removeToken, getUsuarioFromToken } from '../utils/auth.js';


const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const usuario = getUsuarioFromToken();
      setUser(usuario);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    if (response.token) {
      setToken(response.token);
      const usuario = getUsuarioFromToken();
      setUser(usuario);
    }
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    return response;
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};