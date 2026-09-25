import React from 'react';

export function Table({ children, className = '' }) {
  return (
    <div className={`w-full overflow-x-auto bg-white ${className}`}>
      <table className="min-w-full text-sm border-collapse">
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }) {
  return (
    <thead className="border-b-2 border-black">
      {children}
    </thead>
  );
}

export function TableHeader({ children, className = '' }) {
  return (
    <th className={`px-2 py-2 text-left font-bold text-black uppercase tracking-wide ${className}`}>
      {children}
    </th>
  );
}

export function TableBody({ children }) {
  return (
    <tbody className="divide-y divide-gray-300 bg-white">
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = '' }) {
  return (
    <tr className={`hover:bg-blue-50 transition-colors ${className}`}>
      {children}
    </tr>
  );
}

export function TableCell({ children, className = '' }) {
  return (
    <td className={`px-2 py-2 whitespace-nowrap text-gray-900 ${className}`}>
      {children}
    </td>
  );
}
