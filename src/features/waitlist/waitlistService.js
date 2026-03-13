import apiClient, { API_ENDPOINTS } from '../../config/api.js';

export const waitlistService = {
  // Join waitlist
  joinWaitlist: async (waitlistData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.WAITLIST.JOIN, waitlistData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get waitlist for a specific date
  getWaitlistByDate: async (date) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.WAITLIST.BY_DATE(date));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
