import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('admin' | 'business' | 'user')[];
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = ['user', 'business', 'admin'] 
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page and save the location they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (user && !allowedRoles.includes(user.role)) {
    // If user doesn't have permission, redirect to a forbidden page or dashboard
    return <Navigate to="/forbidden" replace />;
  }

  // If authenticated and authorized, render the children
  return <>{children}</>;
}