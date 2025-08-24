
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Layout components
import Layout from './components/layout/Layout';

// Public pages
import HomePage from './pages/public/HomePage';
import BrowsePage from './pages/public/BrowsePage';
import PromotionDetailPage from './pages/public/PromotionDetailPage';
import SearchPage from './pages/public/SearchPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Dashboard pages
import UserDashboard from './pages/dashboard/UserDashboard';
import BusinessDashboard from './pages/dashboard/BusinessDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

// Error pages
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="browse" element={<BrowsePage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="promotion/:id" element={<PromotionDetailPage />} />
              <Route path="category/:category" element={<BrowsePage />} />
              
              {/* Auth routes */}
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="reset-password/:token" element={<ResetPasswordPage />} />
              
              {/* Protected routes */}
              <Route 
                path="dashboard/*" 
                element={
                  <ProtectedRoute roles={['user', 'business', 'admin']}>
                    <UserDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="business/*" 
                element={
                  <ProtectedRoute roles={['business', 'admin']}>
                    <BusinessDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="admin/*" 
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
