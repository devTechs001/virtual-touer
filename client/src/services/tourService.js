import apiClient from './api';

const tourService = {
  // Get all tours
  getAllTours: async (params = {}) => {
    const response = await apiClient.get('/tours', { params });
    return response.data;
  },

  // Get tour by ID
  getTourById: async (id) => {
    const response = await apiClient.get(`/tours/${id}`);
    return response.data;
  },

  // Get featured tours
  getFeaturedTours: async () => {
    const response = await apiClient.get('/tours/featured');
    return response.data;
  },

  // Get tours by category
  getToursByCategory: async (category) => {
    const response = await apiClient.get(`/tours/category/${category}`);
    return response.data;
  },

  // Search tours
  searchTours: async (query) => {
    const response = await apiClient.get('/tours/search', { params: { q: query } });
    return response.data;
  },

  // Create tour (admin)
  createTour: async (tourData) => {
    const response = await apiClient.post('/tours', tourData);
    return response.data;
  },

  // Update tour (admin)
  updateTour: async (id, tourData) => {
    const response = await apiClient.put(`/tours/${id}`, tourData);
    return response.data;
  },

  // Delete tour (admin)
  deleteTour: async (id) => {
    const response = await apiClient.delete(`/tours/${id}`);
    return response.data;
  },

  // Get tour reviews
  getTourReviews: async (id) => {
    const response = await apiClient.get(`/tours/${id}/reviews`);
    return response.data;
  },

  // Add tour review
  addReview: async (tourId, reviewData) => {
    const response = await apiClient.post(`/tours/${tourId}/reviews`, reviewData);
    return response.data;
  },
};

export default tourService;
