import api from './api.js';

export const visitorService = {
  getAll: async () => {
    const response = await api.get('/visitantes');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/visitantes/${id}`);
    return response.data;
  },

  create: async (visitorData) => {
    const response = await api.post('/visitantes', visitorData);
    return response.data;
  },

  update: async (id, visitorData) => {
    const response = await api.put(`/visitantes/${id}`, visitorData);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/visitantes/${id}`);
  },

  addVeiculo: async (visitanteId, veiculoData) => {
    const response = await api.post(`/visitantes/${visitanteId}/veiculos`, veiculoData);
    return response.data;
  }
};

