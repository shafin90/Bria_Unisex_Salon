import apiClient, { API_ENDPOINTS } from '../../config/api.js';

export const dashboardService = {
  // Get dashboard statistics
  getDashboardData: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.DATA);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get graph data
  getGraphData: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.GRAPH);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Initiate Stripe Connect
  createStripeConnect: async (refreshUrl, returnUrl) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.PAYMENTS.CONNECT, { refreshUrl, returnUrl });
      return response.data; // should contain { url: '...' }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verify Stripe Connect Status
  verifyStripeConnect: async () => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.PAYMENTS.VERIFY_CONNECT);
      return response.data; // should contain { status: 'active' | 'pending' }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
