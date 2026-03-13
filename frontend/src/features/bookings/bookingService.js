import apiClient, { API_ENDPOINTS } from '../../config/api.js';

export const bookingService = {
  // Get all bookings
  getBookings: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BOOKINGS.LIST, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get recent bookings
  getRecentBookings: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BOOKINGS.RECENT);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new booking
  createBooking: async (bookingData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.BOOKINGS.CREATE, bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Book appointment (public endpoint)
  bookAppointment: async (appointmentData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.PUBLIC.BOOK_APPOINTMENT, appointmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get booking by phone
  getBookingByPhone: async (phone) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BOOKINGS.GET_BY_PHONE(phone));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Generate ticket
  generateTicket: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BOOKINGS.GENERATE_TICKET(id), {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
