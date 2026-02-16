import api from './api';

export const transactionService = {
    // POST /transactions
    create: (payload) => api.post('/transactions', payload),

    // GET /transactions
    getAll: () => api.get('/transactions'),

    // GET /transactions/:id
    getById: (id) => api.get(`/transactions/${id}`),

    updateStatus: (id, payload) => api.put(`/transactions/${id}/status`, payload),
};