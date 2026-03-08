import api from './api';

export const createSos = (formData) => api.post('/sos', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const respondToSos = (id) => api.patch(`/sos/${id}/respond`);
export const resolveSos = (id) => api.patch(`/sos/${id}/resolve`);
export const cancelSos = (id) => api.patch(`/sos/${id}/cancel`);
export const updateSosLocation = (id, coordinates) => api.post(`/sos/${id}/location`, { coordinates });
export const getSosChat = (id) => api.get(`/sos/${id}/chat`);
export const sendSosMessage = (id, text) => api.post(`/sos/${id}/chat`, { text });
export const getMySosAlerts = () => api.get('/sos/mine');
