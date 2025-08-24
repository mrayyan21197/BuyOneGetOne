// API base URL - adjust based on environment
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  BUSINESS: 'business',
  USER: 'user'
};

// Business statuses
export const BUSINESS_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended'
};

// Promotion types
export const PROMOTION_TYPES = {
  BOGO: 'bogo',
  DISCOUNT: 'discount', 
  DEAL: 'deal',
  COUPON: 'coupon'
};

// Categories
export const CATEGORIES = [
  'Electronics',
  'Fashion', 
  'Home & Garden',
  'Health & Beauty',
  'Sports & Outdoors',
  'Automotive',
  'Books & Media',
  'Toys & Games',
  'Food & Beverages',
  'Travel & Leisure',
  'Services',
  'Other'
];

// Sort options
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'ending-soon', label: 'Ending Soon' },
  { value: 'highest-discount', label: 'Highest Discount' },
  { value: 'most-popular', label: 'Most Popular' }
];

// Pagination
export const DEFAULT_PAGE_SIZE = 12;

// File upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Theme options
export const THEME_OPTIONS = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// Navigation menu items
export const NAVIGATION_ITEMS = {
  PUBLIC: [
    { name: 'Home', path: '/' },
    { name: 'Browse Deals', path: '/browse' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' }
  ],
  USER: [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Profile', path: '/dashboard/profile' },
    { name: 'Saved Deals', path: '/dashboard/saved' },
    { name: 'Settings', path: '/dashboard/settings' }
  ],
  BUSINESS: [
    { name: 'Dashboard', path: '/business' },
    { name: 'My Business', path: '/business/profile' },
    { name: 'Promotions', path: '/business/promotions' },
    { name: 'Analytics', path: '/business/analytics' },
    { name: 'Settings', path: '/business/settings' }
  ],
  ADMIN: [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Users', path: '/admin/users' },
    { name: 'Businesses', path: '/admin/businesses' },
    { name: 'Promotions', path: '/admin/promotions' },
    { name: 'Analytics', path: '/admin/analytics' }
  ]
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_TOO_LARGE: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
  INVALID_FILE_TYPE: 'Please select a valid image file (JPEG, PNG, WebP)',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in!',
  LOGOUT: 'Successfully logged out!',
  REGISTER: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  BUSINESS_CREATED: 'Business created successfully!',
  BUSINESS_UPDATED: 'Business updated successfully!',
  PROMOTION_CREATED: 'Promotion created successfully!',
  PROMOTION_UPDATED: 'Promotion updated successfully!',
  PROMOTION_DELETED: 'Promotion deleted successfully!',
  PASSWORD_UPDATED: 'Password updated successfully!'
};