import type { Movie } from '../types/movie'
import './movie-card.css'

interface MovieCardProps {
  movie: Movie
  onToggleBookmark: (id: number) => void
}

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  const { id, title, releaseDate, posterPath, isBookmarked } = movie

  return (
    <article className="movie-card">
      <div className="movie-poster">
        <img src={posterPath} alt={`${title} 포스터`} />
        <button
          type="button"
          className={isBookmarked ? 'bookmark-button is-bookmarked' : 'bookmark-button'}
          aria-label={`${title} 즐겨찾기`}
          aria-pressed={isBookmarked}
          onClick={() => onToggleBookmark(id)}
        >
          <img
            className="icon-white"
            src={isBookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'}
            alt=""
            width={24}
            height={24}
          />
        </button>
      </div>
      <h2 className="movie-title">{title}</h2>
      <p className="movie-meta">{releaseDate}</p>
    </article>
  )
}

export default MovieCard
