import apiClient, { API_ENDPOINTS } from '../../config/api.js';

export const inventoryService = {
  // Get all inventory items
  getAllItems: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.INVENTORY.LIST);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add new inventory item
  addItem: async (itemData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.INVENTORY.CREATE, itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update stock quantity
  updateStock: async (id, adjustment) => {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.INVENTORY.UPDATE_STOCK(id), { adjustment });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
