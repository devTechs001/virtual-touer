import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API Service Functions
export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password })
};

export const tourService = {
  getAll: (params) => api.get('/tours', { params }),
  getById: (id) => api.get(`/tours/${id}`),
  getFeatured: () => api.get('/tours/featured'),
  getPopular: () => api.get('/tours/popular'),
  search: (query) => api.get('/tours/search', { params: { q: query } }),
  getByDestination: (destinationId) => api.get(`/tours/destination/${destinationId}`),
  addReview: (id, data) => api.post(`/tours/${id}/reviews`, data)
};

export const destinationService = {
  getAll: (params) => api.get('/destinations', { params }),
  getById: (id) => api.get(`/destinations/${id}`),
  getFeatured: () => api.get('/destinations/featured'),
  getPopular: () => api.get('/destinations/popular'),
  search: (query) => api.get('/destinations/search', { params: { q: query } })
};

export const bookingService = {
  create: (data) => api.post('/bookings', data),
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  getPaymentIntent: (bookingId) => api.post(`/bookings/${bookingId}/payment-intent`)
};

export const favoriteService = {
  getAll: () => api.get('/favorites'),
  add: (tourId) => api.post('/favorites', { tourId }),
  remove: (tourId) => api.delete(`/favorites/${tourId}`),
  check: (tourId) => api.get(`/favorites/check/${tourId}`)
};