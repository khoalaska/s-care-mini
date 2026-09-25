import React from 'react';

export function Input({ 
  label, 
  error, 
  className = '', 
  ...props 
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-bold text-gray-900 mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full border px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-0 placeholder:text-gray-400
          ${error ? 'border-red-600' : 'border-gray-400'}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
