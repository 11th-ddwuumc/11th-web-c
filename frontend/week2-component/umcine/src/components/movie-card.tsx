import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className="movie-card">
    <div className="movie-card__poster-wrapper">
        <img
        className="movie-card__poster"
        src={movie.posterPath}
        alt={`${movie.title} 포스터`}
        />

        <button
        className="movie-card__bookmark"
        type="button"
        aria-label={
            movie.isBookmarked ? "북마크 해제" : "북마크 추가"
        }
        aria-pressed={movie.isBookmarked}
        onClick={() => onToggleBookmark(movie.id)}
        >
        <img
            src={
            movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
        />
        </button>
    </div>

    <div className="movie-card__content">
        <h2>{movie.title}</h2>
        <p>{movie.releaseDate}</p>
    </div>
    </article>
  );
}