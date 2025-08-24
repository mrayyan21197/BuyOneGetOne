import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function BusinessDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Business Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Welcome to your business dashboard, {user?.name}!
      </p>
      <p className="text-gray-600 dark:text-gray-400">
        Business dashboard coming soon...
      </p>
    </div>
  );
}