import apiClient, { API_ENDPOINTS } from '../../config/api.js';

export const stylistService = {
  // Get all stylists
  getAllStylists: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.STYLISTS.LIST);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add new stylist
  addStylist: async (stylistData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.STYLISTS.CREATE, stylistData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update stylist
  updateStylist: async (id, stylistData) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.STYLISTS.UPDATE(id), stylistData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
