import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Admin Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Welcome to the admin dashboard, {user?.name}!
      </p>
      <p className="text-gray-600 dark:text-gray-400">
        Admin dashboard coming soon...
      </p>
    </div>
  );
}