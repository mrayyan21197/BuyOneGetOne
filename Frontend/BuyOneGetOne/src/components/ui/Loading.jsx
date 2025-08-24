import React from 'react';
import { cn } from '../../utils';

export function LoadingSpinner({ size = 'md', className }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  return (
    <svg
      className={cn(
        'animate-spin text-blue-600',
        sizeClasses[size],
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export function LoadingCard() {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 dark:bg-gray-700"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded dark:bg-gray-700"></div>
      </div>
    </div>
  );
}

export function LoadingTable({ rows = 5, columns = 4 }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-6 py-3">
                <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

export function FullPageLoading() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}