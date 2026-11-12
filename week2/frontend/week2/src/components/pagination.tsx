import React from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const GROUP_SIZE = 5;

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onChange,
}) => {
  // 현재 페이지가 속한 묶음(5개씩)의 시작/끝 번호
  const start = Math.floor((page - 1) / GROUP_SIZE) * GROUP_SIZE + 1;
  const end = Math.min(start + GROUP_SIZE - 1, totalPages);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex justify-center items-center space-x-2 mt-8 py-4">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:hover:bg-white"
      >
        &lt;
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={
            p === page
              ? 'px-3 py-1 text-sm bg-blue-600 text-white rounded font-medium'
              : 'px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-600'
          }
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:hover:bg-white"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;