import api from './api';

export const getNgos = (params) => api.get('/ngos', { params });
export const getNgo = (id) => api.get(`/ngos/${id}`);
export const getNgoDashboard = (id) => api.get(`/ngos/${id}/dashboard`);
export const registerNgo = (formData) => api.post('/ngos/register', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateCaseStatus = (ngoId, caseId, status, notes) => api.patch(`/ngos/${ngoId}/cases/${caseId}`, { status, notes });
export const assignVolunteer = (ngoId, volunteerId, reportId) => api.post(`/ngos/${ngoId}/volunteers`, { volunteerId, reportId });
export const getNearbyNgos = (lng, lat) => api.get('/ngos/nearby', { params: { lng, lat } });
