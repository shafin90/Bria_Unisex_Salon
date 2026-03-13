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
  }
};
