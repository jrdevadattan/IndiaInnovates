import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false
});

// Attach access token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lifeline_access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('lifeline_refresh_token');
        if (!refreshToken) throw new Error('No refresh token');
        const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
        localStorage.setItem('lifeline_access_token', data.accessToken);
        localStorage.setItem('lifeline_refresh_token', data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem('lifeline_access_token');
        localStorage.removeItem('lifeline_refresh_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
