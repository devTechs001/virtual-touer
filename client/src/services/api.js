import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Request interceptor with caching
api.interceptors.request.use(
  (config) => {
    // Only cache GET requests
    if (config.method === 'get') {
      const cached = cache.get(config.url);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        // Return cached data if still valid
        return Promise.reject({ __cached: true, data: cached.data });
      }
    }

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
  (response) => {
    // Cache GET responses
    if (response.config.method === 'get') {
      cache.set(response.config.url, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    return response;
  },
  (error) => {
    // Handle cached responses
    if (error.__cached) {
      return Promise.resolve({ data: error.data, fromCache: true });
    }

    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      // Only redirect if not already on login page
      if (currentPath !== '/login') {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        window.location.href = '/login';
      }
    }

    // Handle rate limiting
    if (error.response?.status === 429) {
      console.warn('Rate limit exceeded. Consider slowing down requests.');
      const retryAfter = error.response.headers['retry-after'] ||
                        error.response.data?.retryAfter || 60;
      console.warn(`Retry after: ${retryAfter} seconds`);
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

export const notificationService = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`)
};

export const socialService = {
  followUser: (userId) => api.post(`/users/${userId}/follow`),
  unfollowUser: (userId) => api.delete(`/users/${userId}/follow`),
  checkFollowing: (userId) => api.get(`/users/${userId}/follow/check`),
  getFollowers: (userId) => api.get(`/users/${userId}/followers`),
  getFollowing: (userId) => api.get(`/users/${userId}/following`),
  getFeed: () => api.get('/social/feed'),
  shareTour: (tourId, data) => api.post(`/tours/${tourId}/share`, data),
  getComments: (tourId) => api.get(`/tours/${tourId}/comments`),
  addComment: (tourId, data) => api.post(`/tours/${tourId}/comments`, data),
  deleteComment: (tourId, commentId) => api.delete(`/tours/${tourId}/comments/${commentId}`)
};

export const uploadService = {
  uploadImage: (formData) => api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadImages: (formData) => api.post('/upload/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadPanorama: (formData) => api.post('/upload/panorama', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteFile: (fileId) => api.delete(`/upload/${fileId}`)
};

export const userService = {
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  getBookings: (userId) => api.get(`/users/${userId}/bookings`),
  getFavorites: (userId) => api.get(`/users/${userId}/favorites`),
  getReviews: (userId) => api.get(`/users/${userId}/reviews`),
  getStats: (userId) => api.get(`/users/${userId}/stats`),
  getDashboard: () => api.get('/users/dashboard'),
  getAchievements: () => api.get('/users/achievements'),
  getRecommendations: () => api.get('/users/recommendations'),
  getContinueWatching: () => api.get('/users/continue-watching'),
  getRecentActivity: () => api.get('/users/activity')
};

export const paymentService = {
  createPaymentIntent: (bookingId) => api.post(`/payments/${bookingId}/payment-intent`),
  confirmPayment: (paymentMethodId, data) => api.post('/payments/confirm', { paymentMethodId, ...data }),
  getPaymentStatus: (paymentId) => api.get(`/payments/${paymentId}/status`),
  refund: (paymentId) => api.post(`/payments/${paymentId}/refund`)
};

// System & Maintenance Service
export const systemService = {
  getMaintenanceStatus: () => api.get('/system/maintenance/status'),
  getAnnouncements: () => api.get('/announcements'),
  subscribeMaintenanceNotification: (email) =>
    api.post('/system/maintenance/subscribe', { email }),
  getFeatures: () => api.get('/system/features')
};

// Extended admin service with system management
export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getRecentActivity: () => api.get('/admin/activity'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAllTours: (params) => api.get('/admin/tours', { params }),
  getTour: (id) => api.get(`/admin/tours/${id}`),
  createTour: (data) => api.post('/admin/tours', data),
  updateTour: (id, data) => api.put(`/admin/tours/${id}`, data),
  deleteTour: (id) => api.delete(`/admin/tours/${id}`),
  getBookings: (params) => api.get('/admin/bookings', { params }),
  updateBooking: (id, data) => api.put(`/admin/bookings/${id}`, data),
  deleteBooking: (id) => api.delete(`/admin/bookings/${id}`),
  getReviews: (params) => api.get('/admin/reviews', { params }),
  deleteReview: (id) => api.delete(`/admin/reviews/${id}`),

  // System management
  getSystemConfig: () => api.get('/system/config'),
  updateSystemConfig: (key, value) => api.put(`/system/config/${key}`, { value }),
  toggleMaintenance: (data) => api.post('/system/maintenance/toggle', data),
  scheduleMaintenance: (data) => api.post('/system/maintenance/schedule', data),
  cancelScheduledMaintenance: () => api.delete('/system/maintenance/schedule'),
  toggleFeature: (feature, enabled) => api.put(`/system/features/${feature}`, { enabled }),
  createAnnouncement: (data) => api.post('/system/announcements', data),
  deleteAnnouncement: (id) => api.delete(`/system/announcements/${id}`),
  getSystemHealth: () => api.get('/system/health')
};