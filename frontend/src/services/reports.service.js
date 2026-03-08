import api from './api';

export const getReports = (params) => api.get('/reports', { params });
export const getReport = (id) => api.get(`/reports/${id}`);
export const createReport = (formData) => api.post('/reports', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateReportStatus = (id, status, notes) => api.patch(`/reports/${id}/status`, { status, notes });
export const upvoteReport = (id) => api.post(`/reports/${id}/upvote`);
export const addComment = (id, text) => api.post(`/reports/${id}/comments`, { text });
export const resolveReport = (id, formData) => api.post(`/reports/${id}/resolve`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getNearbyReports = (lng, lat, radius) => api.get('/reports/nearby', { params: { lng, lat, radius } });
export const getMyReports = () => api.get('/reports/mine');
