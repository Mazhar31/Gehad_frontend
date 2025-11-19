// API Configuration
// All backend URLs should be managed through this configuration file

const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_API_BASE_URL || 'https://initial-sonja-akivaemail-c48d22a5.koyeb.app/api';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  
  // Specific endpoints
  ENDPOINTS: {
    // Auth endpoints
    ADMIN_LOGIN: '/auth/admin/login',
    USER_LOGIN: '/auth/user/login',
    ADMIN_VERIFY_2FA: '/auth/admin/verify-2fa',
    USER_VERIFY_2FA: '/auth/user/verify-2fa',
    GET_CURRENT_USER: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    
    // Admin endpoints
    ADMIN_PROFILE: '/admin/firebase/profile',
    DASHBOARD_STATS: '/admin/dashboard/stats',
    RECENT_PROJECTS: '/admin/dashboard/recent-projects',
    CLIENTS: '/admin/clients',
    PROJECTS: '/admin/projects',
    
    // User endpoints
    USER_PROJECTS: '/user/projects',
    
    // Upload endpoints
    UPLOAD_IMAGE: '/upload/image',
  }
};

// Helper function to get full URL
export const getFullUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function for upload endpoint (used in multiple places)
export const getUploadUrl = (): string => {
  return getFullUrl(API_CONFIG.ENDPOINTS.UPLOAD_IMAGE);
};

// Helper function for admin profile endpoint
export const getAdminProfileUrl = (): string => {
  return getFullUrl(API_CONFIG.ENDPOINTS.ADMIN_PROFILE);
};