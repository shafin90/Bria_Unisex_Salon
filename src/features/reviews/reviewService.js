import apiClient, { API_ENDPOINTS } from '../../config/api.js';

export const reviewService = {
  // Get all reviews
  getReviews: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.REVIEWS.LIST, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get approved reviews
  getApprovedReviews: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.REVIEWS.APPROVED);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Submit review (public/admin)
  submitReview: async (reviewData) => {
    try {
      // Use FormData if reviewData contains a photo
      const response = await apiClient.post(API_ENDPOINTS.REVIEWS.CREATE, reviewData, {
        headers: {
          'Content-Type': reviewData instanceof FormData ? 'multipart/form-data' : 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update/Approve review
  approveReview: async (id) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.REVIEWS.APPROVE(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete review
  deleteReview: async (id) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.REVIEWS.DELETE(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get review stats
  getReviewStats: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.REVIEWS.STATS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
