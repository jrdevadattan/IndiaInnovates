import api from './api';

export const getMyRewards = () => api.get('/rewards/me');
export const getLeaderboard = (params) => api.get('/rewards/leaderboard', { params });
export const getCatalog = () => api.get('/rewards/catalog');
export const redeem = (itemId) => api.post('/rewards/redeem', { itemId });
export const downloadCertificate = () => api.get('/rewards/certificates/download', { responseType: 'blob' });
