
// src/services/access.js
import api from './api.js';

export const accessService = {
  getAll: async () => {
    const response = await api.get('/lista-controle');
    return response.data;
  },

  registerEntry: async (accessData) => {
    const response = await api.post('/lista-controle', accessData);
    return response.data;
  },

  registerExit: async (id) => {
    await api.patch(`/lista-controle/${id}/saida`);
  },

  getStatistics: async (data) => {
    const response = await api.post('/estatisticas', data);
    return response.data;
  }
};