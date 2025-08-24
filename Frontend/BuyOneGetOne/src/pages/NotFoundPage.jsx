import React from 'react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-500 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <a 
          href="/" 
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}