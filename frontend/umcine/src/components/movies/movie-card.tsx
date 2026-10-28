import {Link} from "@tanstack/react-router";
import {cn} from "../../utils/cn.ts";
import {BookmarkButton} from "../bookmark-button.tsx";
import type {TmdbMovieListItem} from "../../api/movies/models.ts";
import {getTmdbPosterUrl} from "../../utils/movies/tmdb-image.ts";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export function MovieCard({movie}: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <article className={cn("relative flex flex-col gap-1")}>
      <Link
        to="/movies/$movieId"
        params={{movieId: String(movie.id)}}
        className={cn("flex flex-col gap-1")}
      >
        <div className={cn(
          "relative h-68.5 w-full",
          "overflow-hidden rounded-[10px]",
          "bg-(--color-bg-page)",
        )}>
          <img
            className={cn("block h-full w-full object-cover")}
            src={posterUrl}
            alt={`${movie.title} 포스터`}
          />
        </div>
        <div
          title={movie.title}
          className={cn(
            "h-5.5 pt-1.25 truncate",
            "text-[14px] leading-[100%] font-extrabold align-middle",
            "text-(--color-text-primary)",
          )}
        >
          {movie.title}
        </div>
        <div className={cn(
          "h-3.5",
          "text-[12px] font-normal align-middle",
          "text-(--color-text-tertiary)",
        )}>
          {movie.release_date}
        </div>
      </Link>
      <BookmarkButton variant={"card"} movieId={movie.id}/>
    </article>
  );
}
