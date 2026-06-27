import api from './api';

export const userService = {
  getPending: () => api.get('/users/pending'),
  getAll: () => api.get('/users'),
  approve: (id) => api.put(`/users/${id}/approve`),
  delete: (id) => api.delete(`/users/${id}`),
};
