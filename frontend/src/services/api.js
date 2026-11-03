import axios from 'axios';
import { getAccessToken, setAccessToken } from './accessToken';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const isAuthEndpoint = /\/auth\/(login|register|refresh|logout)$/.test(request?.url || '');
    if (error.response?.status !== 401 || !request || request._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    request._retry = true;
    refreshPromise ||= axios
      .post(`${api.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true })
      .then(({ data }) => {
        setAccessToken(data.accessToken);
        return data.accessToken;
      })
      .catch((refreshError) => {
        setAccessToken(null);
        window.dispatchEvent(new Event('auth:expired'));
        throw refreshError;
      })
      .finally(() => {
        refreshPromise = null;
      });

    try {
      const token = await refreshPromise;
      request.headers.Authorization = `Bearer ${token}`;
      return api(request);
    } catch {
      return Promise.reject(error);
    }
  },
);

export default api;
