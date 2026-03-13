import apiClient, { API_ENDPOINTS } from '../../config/api.js';

export const portfolioService = {
  // Get all portfolio work
  getGallery: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PORTFOLIO.GALLERY);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add portfolio work
  addWork: async (workData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.PORTFOLIO.CREATE, workData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
