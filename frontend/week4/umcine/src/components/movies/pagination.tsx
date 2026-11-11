import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onChangePage,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));

  const pages = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => start + index,
  );

  return (
    <nav
      className="mt-14 flex flex-wrap justify-center gap-2"
      aria-label="페이지 이동"
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onChangePage(currentPage - 1)}
        className="rounded-lg border px-3 disabled:cursor-not-allowed disabled:opacity-40"
      >
        이전
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-label={`${page}페이지`}
          aria-current={currentPage === page ? "page" : undefined}
          className={cn(
            "h-10 w-10 cursor-pointer rounded-lg border",
            currentPage === page
              ? "border-[#111] bg-[#111] text-white"
              : "border-[#ddd] bg-white",
          )}
          onClick={() => onChangePage(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onChangePage(currentPage + 1)}
        className="rounded-lg border px-3 disabled:cursor-not-allowed disabled:opacity-40"
      >
        다음
      </button>
    </nav>
  );
}
