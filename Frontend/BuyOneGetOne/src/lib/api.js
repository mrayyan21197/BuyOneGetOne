import axios from 'axios';
import { API_BASE_URL } from '../constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true, // Include cookies for authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // The backend uses HTTP-only cookies for auth, so we don't need to add tokens manually
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response } = error;
    
    if (response?.status === 401) {
      // Token expired, try to refresh
      try {
        await api.post('/auth/refresh-token');
        // Retry the original request
        return api.request(error.config);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  register: (userData) => 
    api.post('/auth/register', userData),
  
  logout: () => 
    api.post('/auth/logout'),
  
  getMe: () => 
    api.get('/auth/me'),
  
  updateProfile: (userData) => 
    api.put('/auth/update-profile', userData),
  
  updatePassword: (passwordData) => 
    api.put('/auth/update-password', passwordData),
  
  forgotPassword: (email) => 
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token, password) => 
    api.post(`/auth/reset-password/${token}`, { password }),
  
  refreshToken: () => 
    api.post('/auth/refresh-token')
};

// Business API calls
export const businessAPI = {
  create: (businessData) => {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(businessData).forEach(key => {
      if (key !== 'logo' && key !== 'coverImage') {
        if (typeof businessData[key] === 'object') {
          formData.append(key, JSON.stringify(businessData[key]));
        } else {
          formData.append(key, businessData[key]);
        }
      }
    });
    
    // Append files
    if (businessData.logo) {
      formData.append('logo', businessData.logo);
    }
    if (businessData.coverImage) {
      formData.append('coverImage', businessData.coverImage);
    }
    
    return api.post('/business', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  getMyBusinesses: () => 
    api.get('/business/my-businesses'),
  
  getById: (id) => 
    api.get(`/business/${id}`),
  
  update: (id, businessData) => {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(businessData).forEach(key => {
      if (key !== 'logo' && key !== 'coverImage') {
        if (typeof businessData[key] === 'object') {
          formData.append(key, JSON.stringify(businessData[key]));
        } else {
          formData.append(key, businessData[key]);
        }
      }
    });
    
    // Append files
    if (businessData.logo) {
      formData.append('logo', businessData.logo);
    }
    if (businessData.coverImage) {
      formData.append('coverImage', businessData.coverImage);
    }
    
    return api.put(`/business/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  delete: (id) => 
    api.delete(`/business/${id}`),
  
  getPromotions: (id, params = {}) => 
    api.get(`/business/my-businesses/${id}/promotions`, { params }),
  
  getAnalytics: (id, params = {}) => 
    api.get(`/business/my-businesses/${id}/analytics`, { params })
};

// Promotions API calls
export const promotionsAPI = {
  getAll: (params = {}) => 
    api.get('/promotions', { params }),
  
  getFeatured: () => 
    api.get('/promotions/featured'),
  
  getByCategory: (category, params = {}) => 
    api.get(`/promotions/category/${category}`, { params }),
  
  search: (params = {}) => 
    api.get('/promotions/search', { params }),
  
  getById: (id) => 
    api.get(`/promotions/${id}`),
  
  create: (promotionData) => {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(promotionData).forEach(key => {
      if (key !== 'images') {
        formData.append(key, promotionData[key]);
      }
    });
    
    // Append image files
    if (promotionData.images && promotionData.images.length > 0) {
      promotionData.images.forEach(image => {
        formData.append('images', image);
      });
    }
    
    return api.post('/promotions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  update: (id, promotionData) => {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(promotionData).forEach(key => {
      if (key !== 'images') {
        formData.append(key, promotionData[key]);
      }
    });
    
    // Append image files
    if (promotionData.images && promotionData.images.length > 0) {
      promotionData.images.forEach(image => {
        formData.append('images', image);
      });
    }
    
    return api.put(`/promotions/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  delete: (id) => 
    api.delete(`/promotions/${id}`),
  
  recordClick: (id) => 
    api.post(`/promotions/${id}/click`)
};

// Admin API calls
export const adminAPI = {
  getDashboardStats: () => 
    api.get('/admin/dashboard'),
  
  getAnalytics: (params = {}) => 
    api.get('/admin/analytics', { params }),
  
  // Users
  getAllUsers: (params = {}) => 
    api.get('/admin/users', { params }),
  
  getUserById: (id) => 
    api.get(`/admin/users/${id}`),
  
  updateUser: (id, userData) => 
    api.put(`/admin/users/${id}`, userData),
  
  deleteUser: (id) => 
    api.delete(`/admin/users/${id}`),
  
  // Businesses
  getAllBusinesses: (params = {}) => 
    api.get('/admin/businesses', { params }),
  
  verifyBusiness: (id, status) => 
    api.patch(`/admin/businesses/${id}/verify`, { status }),
  
  // Promotions
  getAllPromotions: (params = {}) => 
    api.get('/admin/promotions', { params }),
  
  togglePromotionFeatured: (id, isFeatured) => 
    api.patch(`/admin/promotions/${id}/featured`, { isFeatured })
};

export default api;