import { authAPI } from './api';

export interface LoginResponse {
  success: boolean;
  token?: string;
  requires2FA?: boolean;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
}

export const authService = {
  // Admin login
  adminLogin: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await authAPI.adminLogin(email, password);
      
      // Handle the actual backend response format
      const token = response.data?.access_token || response.access_token;
      const requires2FA = response.data?.requires_2fa || response.requires_2fa;
      
      if (requires2FA) {
        return { success: true, requires2FA: true };
      }
      
      if (token) {
        // Don't store token yet, return it for slider verification
        return { success: true, token };
      }
      
      return { success: false, error: 'No token received' };
    } catch (error) {
      console.error('Admin login failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  },

  // User login
  userLogin: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await authAPI.userLogin(email, password);
      
      // Handle the actual backend response format
      const token = response.data?.access_token || response.access_token;
      const requires2FA = response.data?.requires_2fa || response.requires_2fa;
      
      if (requires2FA) {
        return { success: true, requires2FA: true };
      }
      
      if (token) {
        // Don't store token yet, return it for slider verification
        console.log('💾 User login successful, token ready for slider verification');
        return { success: true, token };
      }
      
      return { success: false, error: 'No token received' };
    } catch (error) {
      console.error('User login failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  },

  // Admin 2FA verification
  adminVerify2FA: async (token: string): Promise<LoginResponse> => {
    try {
      const response = await authAPI.adminVerify2FA(token);
      
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('user_role', 'admin');
      
      return { success: true, token: response.access_token };
    } catch (error) {
      console.error('Admin 2FA verification failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '2FA verification failed' 
      };
    }
  },

  // User 2FA verification
  userVerify2FA: async (token: string): Promise<LoginResponse> => {
    try {
      const response = await authAPI.userVerify2FA(token);
      
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('user_role', 'user');
      
      return { success: true, token: response.access_token };
    } catch (error) {
      console.error('User 2FA verification failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '2FA verification failed' 
      };
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;
      
      const user = await authAPI.getCurrentUser();
      return user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      // Clear invalid token
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_email');
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },

  // Get user role
  getUserRole: (): 'admin' | 'user' | null => {
    const role = localStorage.getItem('user_role');
    return role as 'admin' | 'user' | null;
  },

  // Get user email (for user role)
  getUserEmail: (): string | null => {
    return localStorage.getItem('user_email');
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
  }
};