import type { Movie } from '../types/movie'
import { cn } from '../lib/cn'

interface MovieCardProps {
  movie: Movie
  onToggleBookmark: (id: number) => void
}

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  const { id, title, releaseDate, posterPath, isBookmarked } = movie

  return (
    <article className="flex min-w-0 flex-col gap-1">
      <div className="relative h-[274px] overflow-hidden rounded-10 bg-bg-page">
        <img src={posterPath} alt={`${title} 포스터`} className="size-full object-cover" />
        <button
          type="button"
          className={cn(
            'absolute top-2.5 right-2.5 flex size-[34px] items-center justify-center rounded-8 border',
            isBookmarked
              ? 'border-action-primary bg-action-primary'
              : 'border-bg-surface bg-text-primary',
          )}
          aria-label={`${title} 즐겨찾기`}
          aria-pressed={isBookmarked}
          onClick={() => onToggleBookmark(id)}
        >
          <img
            className="brightness-0 invert"
            src={isBookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'}
            alt=""
            width={24}
            height={24}
          />
        </button>
      </div>
      <h2 className="overflow-hidden pt-[5px] text-[14px] font-extrabold text-ellipsis whitespace-nowrap text-text-primary">
        {title}
      </h2>
      <p className="text-[12px] text-text-tertiary">{releaseDate}</p>
    </article>
  )
}

export default MovieCard
