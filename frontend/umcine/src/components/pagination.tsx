import { cn } from '../lib/cn'

// TMDB는 total_pages가 매우 크므로 화면에는 최대 10개 번호만 보여 준다.
const MAX_VISIBLE_PAGES = 10

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange?: (page: number) => void
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const visibleCount = Math.min(totalPages, MAX_VISIBLE_PAGES)
  const startPage = Math.max(
    1,
    Math.min(currentPage - Math.floor(visibleCount / 2), totalPages - visibleCount + 1),
  )
  const pages = Array.from({ length: visibleCount }, (_, index) => startPage + index)

  return (
    <nav className="flex items-center justify-center gap-3" aria-label="영화 목록 페이지">
      <button
        type="button"
        className="size-6 border-0 bg-transparent p-0"
        aria-label="이전 페이지"
        disabled={currentPage <= 1}
        onClick={() => onPageChange?.(currentPage - 1)}
      >
        <img src="/icons/chevron-left.svg" alt="" width={24} height={24} />
      </button>
      <ol className="flex items-center gap-1">
        {pages.map((page) => (
          <li key={page}>
            <button
              type="button"
              className={cn(
                'size-9 rounded-7 border-0 bg-transparent text-[13px] font-bold text-text-secondary',
                page === currentPage && 'bg-text-primary text-bg-surface',
              )}
              aria-current={page === currentPage ? 'page' : undefined}
              onClick={() => onPageChange?.(page)}
            >
              {page}
            </button>
          </li>
        ))}
      </ol>
      <button
        type="button"
        className="size-6 border-0 bg-transparent p-0"
        aria-label="다음 페이지"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange?.(currentPage + 1)}
      >
        <img src="/icons/chevron-right.svg" alt="" width={24} height={24} />
      </button>
    </nav>
  )
}

export default Pagination
