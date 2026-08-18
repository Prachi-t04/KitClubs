import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});


// Add Bearer Token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kit_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercept 401 Unauthorized errors
api.interceptors.response.use((response) => response, (error) => {
  if (error.response && error.response.status === 401) {
    // If not already on auth page, clear token
    if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
      localStorage.removeItem('kit_token');
      localStorage.removeItem('kit_user');
    }
  }
  return Promise.reject(error);
});

export default api;
