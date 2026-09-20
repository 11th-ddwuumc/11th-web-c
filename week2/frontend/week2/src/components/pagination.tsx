import React from 'react';

export const Pagination: React.FC = () => {
  return (
    <div className="flex justify-center items-center space-x-2 mt-8 py-4">
      <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-600">
        &lt;
      </button>
      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded font-medium">
        1
      </button>
      <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-600">
        2
      </button>
      <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-600">
        &gt;
      </button>
    </div>
  );
};