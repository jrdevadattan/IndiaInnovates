import api from './api';

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const logout = (refreshToken) => api.post('/auth/logout', { refreshToken });
export const refreshToken = (token) => api.post('/auth/refresh', { refreshToken: token });
export const getMe = () => api.get('/auth/me');
export const verifyEmail = (otp) => api.post('/auth/verify-email', { otp });
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => api.post('/auth/reset-password', { token, password });
export const updateFcmToken = (fcmToken) => api.patch('/auth/fcm-token', { fcmToken });
