import api from './api';

export const getProducts = (params) => api.get('/marketplace/products', { params });
export const getProduct = (id) => api.get(`/marketplace/products/${id}`);
export const createProduct = (formData) => api.post('/marketplace/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const initiateCheckout = (data) => api.post('/marketplace/cart/checkout', data);
export const createOrder = (data) => api.post('/marketplace/orders', data);
export const getMyOrders = () => api.get('/marketplace/orders/mine');
export const markShipped = (id, trackingNumber) => api.patch(`/marketplace/orders/${id}/ship`, { trackingNumber });
