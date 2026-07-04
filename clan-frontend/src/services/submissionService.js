import api from './api';

export const submissionService = {
  getAll: () => api.get('/submissions'),

  upload: (eventId, file) => {
    const formData = new FormData();
    formData.append('eventId', eventId);
    formData.append('file', file);
    return api.post('/submissions/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  delete: (id) => api.delete(`/submissions/${id}`),
};
