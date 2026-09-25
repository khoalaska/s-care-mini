import React from 'react';

export function Badge({ children, variant = 'gray', className = '' }) {
  const variants = {
    gray: "text-gray-600",
    sky: "text-sky-700",
    amber: "text-amber-600",
    blue: "text-blue-700",
    emerald: "text-emerald-700",
    rose: "text-rose-700",
    slate: "text-slate-600",
  };

  return (
    <span className={`font-bold text-sm ${variants[variant] || variants.gray} ${className}`}>
      {children}
    </span>
  );
}
