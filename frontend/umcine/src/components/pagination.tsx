import { cn } from '../lib/cn'

interface PaginationProps {
  currentPage: number
  totalPages: number
}

function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className="flex items-center justify-center gap-3" aria-label="영화 목록 페이지">
      <button type="button" className="size-6 border-0 bg-transparent p-0" aria-label="이전 페이지">
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
            >
              {page}
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className="size-6 border-0 bg-transparent p-0" aria-label="다음 페이지">
        <img src="/icons/chevron-right.svg" alt="" width={24} height={24} />
      </button>
    </nav>
  )
}

export default Pagination
