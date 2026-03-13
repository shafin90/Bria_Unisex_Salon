import apiClient, { API_ENDPOINTS } from '../../config/api.js';

export const chatService = {
  // Get chat history between two users
  getChatHistory: async (user1, user2) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CHAT.HISTORY(user1, user2));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
