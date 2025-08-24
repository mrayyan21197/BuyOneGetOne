// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'business' | 'user';
  avatar?: string;
  phone?: string;
  address?: Address;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

// Business types
export interface Business {
  id: string;
  name: string;
  owner: string | User;
  logo: string;
  coverImage?: string;
  description: string;
  category: Category;
  subcategory?: string;
  website?: string;
  socialMedia?: SocialMedia;
  contactEmail?: string;
  contactPhone?: string;
  address?: Address;
  location?: Location;
  businessHours?: BusinessHour[];
  isVerified: boolean;
  status: 'active' | 'pending' | 'suspended';
  rating: number;
  reviewCount: number;
  promotionCount: number;
  impressions: number;
  clicks: number;
  createdAt: string;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

export interface Location {
  type: string;
  coordinates: [number, number];
}

export interface BusinessHour {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  open: string;
  close: string;
  isClosed: boolean;
}

// Promotion types
export interface Promotion {
  id: string;
  title: string;
  description: string;
  business: string | Business;
  category: Category;
  type: PromotionType;
  discountPercentage?: number;
  originalPrice: number;
  discountedPrice: number;
  images: string[];
  redirectUrl: string;
  tags: string[];
  terms?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isFeatured: boolean;
  code?: string;
  impressions: number;
  clicks: number;
  conversionRate: number;
  createdAt: string;
}

export type Category = 'food' | 'fashion' | 'electronics' | 'home' | 'beauty' | 'sports' | 'travel' | 'entertainment' | 'other';

export type PromotionType = 'discount' | 'bogo' | 'gift' | 'freeShipping' | 'bundle' | 'other';

// Analytics types
export interface AnalyticEvent {
  id: string;
  eventType: 'view' | 'click' | 'conversion' | 'signup' | 'login' | 'search';
  user?: string | User;
  promotion?: string | Promotion;
  business?: string | Business;
  searchQuery?: string;
  device: 'desktop' | 'mobile' | 'tablet' | 'other';
  browser: string;
  os: string;
  ip: string;
  referer: string;
  timestamp: string;
}

// Dashboard stats
export interface DashboardStats {
  totalUsers: number;
  newUsers: number;
  totalBusinesses: number;
  pendingBusinesses: number;
  totalPromotions: number;
  activePromotions: number;
  totalClicks: number;
  totalImpressions: number;
  averageConversionRate: number;
}

export interface BusinessStats {
  totalPromotions: number;
  activePromotions: number;
  totalClicks: number;
  totalImpressions: number;
  conversionRate: number;
  promotionsChange: number;
  activePromotionsChange: number;
  clicksChange: number;
  conversionRateChange: number;
  dailyAnalytics: DailyAnalytic[];
}

export interface DailyAnalytic {
  date: string;
  clicks: number;
  views: number;
  conversionRate: number;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'business' | 'user';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  totalPages: number;
  currentPage: number;
  data: T[];
}