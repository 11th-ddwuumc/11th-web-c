import './pagination.css'

interface PaginationProps {
  currentPage: number
  totalPages: number
}

function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className="pagination" aria-label="영화 목록 페이지">
      <button type="button" className="page-arrow" aria-label="이전 페이지">
        <img src="/icons/chevron-left.svg" alt="" width={24} height={24} />
      </button>
      <ol className="page-list">
        {pages.map((page) => (
          <li key={page}>
            <button
              type="button"
              className={page === currentPage ? 'page-button is-current' : 'page-button'}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className="page-arrow" aria-label="다음 페이지">
        <img src="/icons/chevron-right.svg" alt="" width={24} height={24} />
      </button>
    </nav>
  )
}

export default Pagination
