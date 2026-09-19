import type {Movie} from "../../types/movie.ts";
import "./movie-card.css"

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({movie}: MovieCardProps) {
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
          className="bookmark-button"
          aria-label="즐겨찾기"
        >
          <img
            className="bookmark-icon"
            src="/icons/bookmark-outline.svg"
            alt="북마크 아이콘"
          />
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