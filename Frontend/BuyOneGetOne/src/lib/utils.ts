import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

// Merge Tailwind classes with clsx
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date using date-fns
export function formatDate(date: string | Date, formatString: string = 'PPP'): string {
  return format(new Date(date), formatString);
}

// Format relative time (e.g., "2 days ago")
export function formatRelativeDate(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

// Calculate time remaining until a date
export function getTimeRemaining(endDate: string | Date): string {
  const end = new Date(endDate);
  const now = new Date();
  
  if (end <= now) {
    return 'Expired';
  }
  
  const totalSeconds = Math.floor((end.getTime() - now.getTime()) / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  
  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''} left`;
  }
  
  return `${hours} hour${hours !== 1 ? 's' : ''} left`;
}

// Format price with currency symbol
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}

// Get user initials from name
export function getInitials(name: string): string {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part[0]?.toUpperCase() || '')
    .join('')
    .substring(0, 2);
}

// Get discount percentage
export function calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

// Detect device type
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}