
import api from './api.js';

export const vehicleService = {
  getAll: async () => {
    const response = await api.get('/veiculos');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/veiculos/${id}`);
    return response.data;
  },

  create: async (vehicleData) => {
    const response = await api.post('/veiculos', vehicleData);
    return response.data;
  },

  update: async (id, vehicleData) => {
    const response = await api.put(`/veiculos/${id}`, vehicleData);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/veiculos/${id}`);
  }
};
