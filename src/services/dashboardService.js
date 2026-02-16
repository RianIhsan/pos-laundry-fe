import api from './api';

export const dashboardService = {
    // Sesuai screenshot Postman kamu: /api/v1/dashboard/activity-logs?page=1
    getActivityLogs: (page = 1) => api.get(`/dashboard/activity-logs?page=${page}`),
    getStats: () => api.get('/dashboard/stats'),
    getActivities: () => api.get('/dashboard/activities'),
    getInventoryAlerts: () => api.get('/inventory/alerts'),
};