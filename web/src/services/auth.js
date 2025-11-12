import api from './api.js';

export const authService = {
  login: async (email, senha) => {
    const response = await api.post('/usuarios/login', { email, senha });  // ← CORRETO
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/usuarios', userData);
    return response.data;
  }
};