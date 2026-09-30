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
    <nav className="pagination" aria-label="페이지 이동">
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={
            currentPage === page
              ? "pagination__button pagination__button--active"
              : "pagination__button"
          }
          onClick={() => onChangePage(page)}
        >
          {page}
        </button>
      ))}
    </nav>
  );
}