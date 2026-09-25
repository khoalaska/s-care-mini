import React from 'react';

export function Card({ children, className = '', ...props }) {
  // Bỏ bg-white cứng để không ghi đè bg-black ở nơi khác
  return (
    <div className={`border border-gray-400 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  // Bỏ bg-gray-50
  return (
    <div className={`px-5 py-3 border-b border-gray-400 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  // Bỏ text-gray-900
  return (
    <h3 className={`text-sm font-bold uppercase tracking-wide ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  );
}
