import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  onChangePage: (page: number) => void;
}

export default function Pagination({
  currentPage,
  onChangePage,
}: PaginationProps) {
  const pages = [1, 2, 3, 4, 5];

  return (
    <nav
      className="mt-14 flex justify-center gap-2"
      aria-label="페이지 이동"
    >
      {pages.map((page) => (
        <button
          key={page}
          type="button"
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
    </nav>
  );
}