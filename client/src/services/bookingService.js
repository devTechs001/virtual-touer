import apiClient from './api';

const bookingService = {
  // Get all bookings for current user
  getAllBookings: async () => {
    const response = await apiClient.get('/bookings');
    return response.data;
  },

  // Get booking by ID
  getBookingById: async (id) => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  },

  // Create booking
  createBooking: async (bookingData) => {
    const response = await apiClient.post('/bookings', bookingData);
    return response.data;
  },

  // Update booking
  updateBooking: async (id, updates) => {
    const response = await apiClient.put(`/bookings/${id}`, updates);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id) => {
    const response = await apiClient.put(`/bookings/${id}/cancel`);
    return response.data;
  },

  // Confirm booking (admin)
  confirmBooking: async (id) => {
    const response = await apiClient.put(`/bookings/${id}/confirm`);
    return response.data;
  },

  // Get bookings by status
  getBookingsByStatus: async (status) => {
    const response = await apiClient.get('/bookings', { params: { status } });
    return response.data;
  },

  // Get upcoming bookings
  getUpcomingBookings: async () => {
    const response = await apiClient.get('/bookings/upcoming');
    return response.data;
  },

  // Get past bookings
  getPastBookings: async () => {
    const response = await apiClient.get('/bookings/past');
    return response.data;
  },
};

export default bookingService;
