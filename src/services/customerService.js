import api from './api';

export const customerService = {
    getAll: () => api.get('/customers'),
    create: (data) => api.post('/customers', data),
    getById: (id) => api.get(`/customers/${id}`),

    // Tambahkan dua ini:
    update: (id, data) => api.put(`/customers/${id}`, data),
    delete: (id) => api.delete(`/customers/${id}`),
};