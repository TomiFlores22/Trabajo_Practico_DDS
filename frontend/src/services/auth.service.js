import api from './api.js';

export const authService = {
  login: async (correo, password) => {
    const response = await api.post('/auth/login', { correo, password });
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};