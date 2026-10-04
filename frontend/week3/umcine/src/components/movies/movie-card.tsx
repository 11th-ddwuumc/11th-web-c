import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import type { Movie } from "../../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className="min-w-0 w-full">
      <div className="relative w-full overflow-hidden rounded-[10px]">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          <img
            className="block w-full aspect-[2/3] object-cover"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>

        <button
          className={cn(
            "absolute top-2 right-2 flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border p-0",
            movie.isBookmarked
              ? "border-[#2563eb] bg-[#2563eb]"
              : "border-white/90 bg-transparent",
          )}
          type="button"
          aria-label={
            movie.isBookmarked ? "북마크 해제" : "북마크 추가"
          }
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            className="h-4 w-4 brightness-0 invert"
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>

      <div className="pt-2">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          <h2 className="m-0 mb-1 overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-semibold">
            {movie.title}
          </h2>
        </Link>

        <p className="m-0 text-[12px] text-[#8a8f98]">
          {movie.releaseDate}
        </p>
      </div>
    </article>
  );
}