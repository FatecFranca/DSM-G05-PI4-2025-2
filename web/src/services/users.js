import api from './api.js';

export const userService = {
  getAll: async () => {
    const response = await api.get('/usuarios');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  update: async (id, userData) => {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/usuarios/${id}`);
  },

  getByType: async (tipo) => {
    const users = await userService.getAll();
    return users.filter(user => user.tipo === tipo);
  },

  getMoradores: async () => {
    return await userService.getByType('morador');
  }
};