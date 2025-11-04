import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  setToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  },

  login: (email, password) => 
    api.post('/usuarios/login', { email, password }),

  register: (userData) => 
    api.post('/usuarios', userData),
};


export const vehicleService = {
  create: (vehicleData) => 
    api.post('/veiculos', vehicleData),

  getAll: () => 
    api.get('/veiculos'),

  getById: (id) => 
    api.get(`/veiculos/${id}`),

  update: (id, vehicleData) => 
    api.put(`/veiculos/${id}`, vehicleData),

  delete: (id) => 
    api.delete(`/veiculos/${id}`),
};



export const controlService = {
  registerEntry: (data) => 
    api.post('/lista-controle', data),

  registerExit: (id) => 
    api.patch(`/lista-controle/${id}/saida`),

  getAll: () => 
    api.get('/lista-controle'),
};

export const userService = {
  create: (userData) =>
    api.post('/usuarios', userData),

  getAll: () => 
    api.get('/usuarios'),

  getById: (id) => 
    api.get(`/usuarios/${id}`),

  update: (id, userData) => 
    api.put(`/usuarios/${id}`, userData),

  delete: (id) => 
    api.delete(`/usuarios/${id}`),
};




export default api;