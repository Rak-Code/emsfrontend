import React from 'react';

const Loader = ({ 
  size = 'medium', 
  color = 'primary', 
  fullscreen = false,
  text = 'Loading...' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-primary-600',
    white: 'border-white',
    gray: 'border-gray-600'
  };

  const spinnerClasses = `
    inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]
    ${sizeClasses[size]} ${colorClasses[color]}
  `;

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        <div className="text-center">
          <div className={spinnerClasses} role="status">
            <span className="sr-only">Loading...</span>
          </div>
          {text && (
            <p className="mt-4 text-gray-600 text-sm">{text}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="text-center">
        <div className={spinnerClasses} role="status">
          <span className="sr-only">Loading...</span>
        </div>
        {text && (
          <p className="mt-2 text-gray-600 text-sm">{text}</p>
        )}
      </div>
    </div>
  );
};

// Skeleton loader component for lists
export const SkeletonLoader = ({ rows = 3, height = 'h-4' }) => {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className={`bg-gray-200 rounded ${height} w-full`}></div>
        </div>
      ))}
    </div>
  );
};

// Card skeleton loader
export const CardSkeleton = () => {
  return (
    <div className="animate-pulse bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
};

export default Loader;