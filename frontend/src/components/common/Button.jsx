import React from 'react';
import classNames from 'classnames';
import Loading from './Loading';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none transition-colors';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const buttonClasses = classNames(
    baseStyles,
    variants[variant],
    sizes[size],
    className,
    {
      'opacity-50 cursor-not-allowed': isLoading,
    }
  );

  return (
    <button 
      {...props} 
      disabled={isLoading || props.disabled}
      className={`relative ${buttonClasses}`}
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loading size="sm" />
        </div>
      ) : null}
      <span className={isLoading ? 'invisible' : ''}>{children}</span>
    </button>
  );
};

export default Button; 