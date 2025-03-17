
import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 40, 
  color = "#0496FF",
  className = ""
}) => {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 50 50" 
        xmlns="http://www.w3.org/2000/svg" 
        className="animate-loading-rotate"
      >
        <circle 
          cx="25" 
          cy="25" 
          r="20" 
          fill="none" 
          stroke={color} 
          strokeWidth="4" 
          strokeLinecap="round" 
          className="animate-loading-circle" 
        />
      </svg>
    </div>
  );
};

export default LoadingSpinner;
