import apiClient, { API_ENDPOINTS } from '../../config/api.js';

export const packageService = {
  // Get all active packages
  getActivePackages: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PACKAGES.ACTIVE);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add new package
  addPackage: async (packageData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.PACKAGES.CREATE, packageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
