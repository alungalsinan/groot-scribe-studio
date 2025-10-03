import React from 'react';
import { Loader2, Zap, Coffee, Rocket } from 'lucide-react';

interface LoadingFallbackProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'page' | 'minimal' | 'fun';
}

const loadingMessages = [
  'Loading your content...',
  'Preparing something amazing...',
  'Almost there...',
  'Getting things ready...',
  'Loading with ❤️...',
  'Brewing fresh content...',
  'Assembling the magic...',
];

const funIcons = [Zap, Coffee, Rocket, Loader2];

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  message,
  size = 'md',
  variant = 'default'
}) => {
  const randomMessage = message || loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
  const RandomIcon = funIcons[Math.floor(Math.random() * funIcons.length)];

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const containerClasses = {
    sm: 'gap-2 text-sm',
    md: 'gap-3 text-base',
    lg: 'gap-4 text-lg'
  };

  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
      </div>
    );
  }

  if (variant === 'page') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          {/* Animated Logo */}
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <span className="text-white font-bold text-2xl">G</span>
            </div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-blue-200 rounded-full mx-auto animate-spin" style={{
              borderTopColor: 'transparent',
              animationDuration: '2s'
            }} />
          </div>
          
          {/* Loading Text */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">
              {randomMessage}
            </h2>
            <p className="text-gray-600">
              Please wait a moment...
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'fun') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className={`flex flex-col items-center ${containerClasses[size]}`}>
          <div className="relative mb-4">
            <RandomIcon className={`${sizeClasses[size]} text-blue-600 animate-bounce`} />
            <div className="absolute -inset-2 bg-blue-100 rounded-full opacity-30 animate-ping" />
          </div>
          <p className="text-gray-700 font-medium text-center">
            {randomMessage}
          </p>
          <div className="mt-2 flex space-x-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.8s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="flex items-center justify-center p-6">
      <div className={`flex flex-col items-center ${containerClasses[size]}`}>
        <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600 mb-3`} />
        <p className="text-gray-700 font-medium text-center">
          {randomMessage}
        </p>
      </div>
    </div>
  );
};

// Skeleton loader for content
export const SkeletonLoader: React.FC<{
  lines?: number;
  width?: string;
  height?: string;
  className?: string;
}> = ({ 
  lines = 3, 
  width = 'w-full', 
  height = 'h-4', 
  className = '' 
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${height} ${i === lines - 1 ? 'w-3/4' : width} bg-gray-200 rounded animate-pulse`}
        />
      ))}
    </div>
  );
};

// Card skeleton
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm ${className}`}>
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
        <div className="h-32 bg-gray-200 rounded" />
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/6" />
        </div>
      </div>
    </div>
  );
};

// Loading button
export const LoadingButton: React.FC<{
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}> = ({ children, loading = false, disabled = false, className = '', onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`
        inline-flex items-center justify-center px-4 py-2 rounded-md font-medium
        text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200 ${className}
      `}
    >
      {loading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {children}
    </button>
  );
};
