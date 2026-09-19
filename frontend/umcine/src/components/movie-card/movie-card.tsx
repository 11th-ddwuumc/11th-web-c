import type {Movie} from "../../types/movie.ts";
import "./movie-card.css"

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

export default function MovieCard({movie, onToggleBookmark}: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster">
        <img
          className="poster-image"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />
        <button
          type="button"
          className={`bookmark-button ${movie.isBookmarked ? "bookmarked" : "not-bookmarked"}`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <svg viewBox={movie.isBookmarked ? "80 32 24 24" : "32 32 24 24"}>
            <path
              d={`${movie.isBookmarked
                ? "M97 35H87C85.9 35 85.01 35.9 85.01 37L85 53L92 50L99 53V37C99 35.9 98.1 35 97 35Z"
                : "M49 35H39C37.9 35 37.01 35.9 37.01 37L37 53L44 50L51 53V37C51 35.9 50.1 35 49 35ZM49 50L44 47.82L39 50V37H49V50Z"} `}
            />
          </svg>
        </button>
      </div>

      <div className="movie-title">
        {movie.title}
      </div>

      <div className="movie-meta">
        {movie.releaseDate}
      </div>
    </article>
  );
}