import api from './api';

export const userService = {
  getPending: () => api.get('/users/pending'),
  getAll: () => api.get('/users'),
  approve: (id) => api.put(`/users/${id}/approve`),
  delete: (id) => api.delete(`/users/${id}`),
  resetPassword: (id, data) => api.put(`/users/${id}/reset-password`, data),
  updatePassword: (data) => api.put('/users/profile/password', data),
  updateUsername: (data) => api.put('/users/profile/username', data),
};
