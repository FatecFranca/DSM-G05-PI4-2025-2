import api from './api.js';

export const userService = {
  // Buscar todos os usuários (apenas para porteiro/admin)
  getAll: async () => {
    const response = await api.get('/usuarios');
    return response.data;
  },

  // Buscar usuário por ID
  getById: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  // Atualizar usuário
  update: async (id, userData) => {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data;
  },

  // Deletar usuário
  delete: async (id) => {
    await api.delete(`/usuarios/${id}`);
  },

  // Buscar usuários por tipo (morador, porteiro, admin)
  getByType: async (tipo) => {
    const users = await userService.getAll();
    return users.filter(user => user.tipo === tipo);
  },

  // Buscar apenas moradores (útil para cadastro de veículos)
  getMoradores: async () => {
    return await userService.getByType('morador');
  }
};