import api from './api';

export const eventService = {
  getAll: () => api.get('/events'),
  create: (data) => api.post('/events', data),
  delete: (id) => api.delete(`/events/${id}`),
};
