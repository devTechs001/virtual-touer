import { create } from 'zustand';

const useBookingStore = create((set, get) => ({
  bookings: [],
  selectedBooking: null,
  loading: false,
  error: null,

  setBookings: (bookings) => set({ bookings }),
  
  addBooking: (booking) => {
    set((state) => ({
      bookings: [...state.bookings, booking],
    }));
  },

  updateBooking: (id, updates) => {
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === id ? { ...booking, ...updates } : booking
      ),
    }));
  },

  removeBooking: (id) => {
    set((state) => ({
      bookings: state.bookings.filter((booking) => booking.id !== id),
    }));
  },

  setSelectedBooking: (booking) => set({ selectedBooking: booking }),

  clearSelectedBooking: () => set({ selectedBooking: null }),

  getBookingsByStatus: (status) => {
    return get().bookings.filter((booking) => booking.status === status);
  },

  getUpcomingBookings: () => {
    const now = new Date();
    return get().bookings.filter(
      (booking) => new Date(booking.date) > now && booking.status === 'confirmed'
    );
  },
}));

export default useBookingStore;
