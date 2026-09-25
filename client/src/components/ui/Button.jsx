import React from 'react';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  ...props 
}) {
  const baseStyle = "inline-flex items-center justify-center font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#0a2540] text-white hover:bg-[#113a63] focus:ring-[#0a2540]",
    secondary: "bg-white text-gray-800 border border-gray-400 hover:bg-gray-100 focus:ring-gray-400",
    danger: "bg-red-700 text-white hover:bg-red-800 focus:ring-red-700",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-200 hover:text-black focus:ring-gray-400",
  };
  
  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-1.5 text-sm",
    lg: "px-6 py-2 text-base",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
