import axios from 'axios';

// API Configuration
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    'Content-Type': 'application/json',
  }
};

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    // Log error for debugging
    console.error('API Error:', error.response?.data || error.message);
    
    return Promise.reject(error);
  }
);

// API endpoints configuration
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/adminLogin/adminLogin',
    LOGOUT: '/adminLogout', // Note: backend router/admin.js doesn't have logout, but index.js doesn't show it either. Usually handled by clearing token on client.
    FORGET_PASS_MAIL: '/adminLogin/submitForgetPassMail',
    FORGET_PASS_OTP: '/adminLogin/submitForgetPassOTP',
    RESET_PASS: '/adminLogin/resetPass',
  },
  
  // Services endpoints
  SERVICES: {
    LIST: '/service/getAllService',
    TOP: '/service/getTopServices',
    CREATE: '/service/addService',
    GET_BY_ID: (id) => `/service/getParticularServiceById/${id}`,
    UPDATE: (id) => `/service/editService/${id}`,
    DELETE: (id) => `/service/deleteService/${id}`,
  },
  
  // Bookings endpoints
  BOOKINGS: {
    LIST: '/booking/getAllBooking',
    RECENT: '/booking/getRecentBooking',
    CREATE: '/booking/addBooking',
    GET_BY_PHONE: (phone) => `/booking/getParticularBooking/${phone}`,
    GENERATE_TICKET: (id) => `/booking/generateTicket/${id}`,
    MY_APPOINTMENTS: '/booking/my-appointments',
  },
  
  // Offers endpoints
  OFFERS: {
    LIST: '/offer/getAllOffer',
    ACTIVE: '/offer/getAllActiveOffer',
    INACTIVE: '/offer/getAllInactiveOffer',
    CREATE: '/offer/addOffer',
    GET_BY_ID: (id) => `/offer/getParticularOfferById/${id}`,
    UPDATE: (id) => `/offer/editOffer/${id}`,
  },
  
  // Reviews endpoints
  REVIEWS: {
    LIST: '/review/getAllReviews',
    APPROVED: '/review/getApprovedReviews',
    CREATE: '/review/addReview',
    APPROVE: (id) => `/review/approveReview/${id}`,
    DELETE: (id) => `/review/deleteReview/${id}`,
    STATS: '/review/getReviewStats',
  },
  
  // Users endpoints
  USERS: {
    LIST: '/user/getFrequentlyUser', // Backend only has this for now
  },
  
  // Dashboard endpoints
  DASHBOARD: {
    DATA: '/dashboard/dashboard',
    GRAPH: '/dashboard/graphData',
  },

  // Inventory endpoints
  INVENTORY: {
    LIST: '/inventory/all',
    CREATE: '/inventory/add',
    UPDATE_STOCK: (id) => `/inventory/update-stock/${id}`,
  },

  // Portfolio endpoints
  PORTFOLIO: {
    GALLERY: '/portfolio/gallery',
    CREATE: '/portfolio/add',
  },

  // Package endpoints
  PACKAGES: {
    ACTIVE: '/package/active',
    CREATE: '/package/add',
  },

  // Waitlist endpoints
  WAITLIST: {
    JOIN: '/waitlist/join',
    BY_DATE: (date) => `/waitlist/date/${date}`,
  },

  // Chat endpoints
  CHAT: {
    HISTORY: (u1, u2) => `/chat/history/${u1}/${u2}`,
  },

  // Stylist endpoints
  STYLISTS: {
    LIST: '/stylist/all',
    CREATE: '/stylist/add',
    UPDATE: (id) => `/stylist/update/${id}`,
  },
  
  // Public endpoints (Note: backend doesn't have a distinct /public prefix in routes, these are usually shared or separate)
  PUBLIC: {
    SERVICES: '/service/getAllService',
    BOOK_APPOINTMENT: '/booking/addBooking',
    SUBMIT_REVIEW: '/review/addReview',
  }
};

// Export the configured axios instance
export default apiClient;

// Export API configuration for reference
export { API_CONFIG };
