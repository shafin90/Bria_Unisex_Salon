import apiClient, { API_ENDPOINTS } from '../../config/api';

export const platformService = {
  // Get all tenants
  getTenants: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PLATFORM.TENANTS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get global audit logs
  getAuditLogs: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PLATFORM.AUDIT_LOGS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update tenant active status
  updateTenantStatus: async (id, active) => {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.PLATFORM.UPDATE_TENANT_STATUS(id), { active });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
