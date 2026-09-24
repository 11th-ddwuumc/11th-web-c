import {Link} from "@tanstack/react-router";
import type {Movie} from "../../types/movie.ts";
import {cn} from "../../utils/cn.ts";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

export default function MovieCard({movie, onToggleBookmark}: MovieCardProps) {
  return (
    <article className={cn("relative flex flex-col gap-[4px]")}>
      <Link
        to="/movies/$movieId"
        params={{movieId: String(movie.id)}}
        className={cn("flex flex-col gap-[4px]")}
      >
        <div className={cn(
          "relative h-[274px] w-full",
          "overflow-hidden rounded-[10px]",
          "bg-(--color-bg-page)",
        )}>
          <img
            className={cn("block h-full w-full object-cover")}
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </div>
        <div className={cn(
          "h-[22px] pt-[5px]",
          "text-[14px] leading-[100%] font-[800] align-middle",
          "text-(--color-text-primary)",
        )}>
          {movie.title}
        </div>
        <div className={cn(
          "h-[14px]",
          "text-[12px] font-[400] align-middle",
          "text-(--color-text-tertiary)",
        )}>
          {movie.releaseDate}
        </div>
      </Link>
      <button
        type="button"
        className={cn(
          "absolute right-2 top-2 z-10",
          "grid size-[34px] place-items-center",
          "rounded-lg p-0",
          "cursor-pointer border text-white",
          "transition-colors",
          movie.isBookmarked
            ? "border-blue-600 bg-blue-600"
            : "border-white bg-(--color-text-primary)",
        )}
        aria-pressed={movie.isBookmarked}
        aria-label={
          movie.isBookmarked
            ? `${movie.title} 북마크 해제`
            : `${movie.title} 북마크 추가`
        }
        onClick={() => onToggleBookmark(movie.id)}
      >
        <svg
          className="size-6 fill-current"
          viewBox={movie.isBookmarked ? "80 32 24 24" : "32 32 24 24"}
        >
          <path
            d={`${movie.isBookmarked
              ? "M97 35H87C85.9 35 85.01 35.9 85.01 37L85 53L92 50L99 53V37C99 35.9 98.1 35 97 35Z"
              : "M49 35H39C37.9 35 37.01 35.9 37.01 37L37 53L44 50L51 53V37C51 35.9 50.1 35 49 35ZM49 50L44 47.82L39 50V37H49V50Z"} `}
          />
        </svg>
      </button>
    </article>
  );
}
