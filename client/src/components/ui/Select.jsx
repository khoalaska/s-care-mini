import React from 'react';

export function Select({ 
  label, 
  options, 
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
      <select
        className={`w-full border px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-0 bg-white
          ${error ? 'border-red-600' : 'border-gray-400'}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
