import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import { cn } from "../../lib/cn";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));
  const [isBookmarked, setIsBookmarked] = useState(movie?.isBookmarked ?? false);

  if (!movie) {
    return (
      <main className="flex justify-center px-20 py-24 text-text-secondary">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center pb-15">
      <div className="relative h-[360px] w-full overflow-hidden">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-between px-20 py-6">
          <Link to="/" className="flex items-center gap-1 text-[13px] font-bold text-bg-surface">
            <img src="/icons/chevron-left.svg" alt="" width={24} height={24} className="brightness-0 invert" />
            영화 목록
          </Link>
          <div className="flex w-[800px] flex-col gap-2">
            <h1 className="text-[46px] leading-[49.68px] font-bold tracking-[-2.3px] text-bg-surface">
              {movie.title}
            </h1>
            <p className="text-[14px] text-bg-surface">{movie.originalTitle}</p>
            <div className="flex items-center gap-2 text-[13px] font-bold text-bg-surface">
              <span>{movie.releaseDate}</span>
              <span>{movie.genres.join(" · ")}</span>
              <span>{movie.runtime}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full gap-8 px-20 py-6">
        <div className="h-[286px] w-[200px] shrink-0 overflow-hidden rounded-10 shadow-[0px_12px_30px_0px_rgba(12,15,20,0.12)]">
          <img src={movie.posterPath} alt={`${movie.title} 포스터`} className="size-full object-cover" />
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <h2 className="text-[21px] font-bold tracking-[-0.63px] text-text-primary">
            {movie.tagline}
          </h2>
          <p className="text-[14px] leading-[24px] text-text-secondary">{movie.overview}</p>
          <button
            type="button"
            onClick={() => setIsBookmarked((prev) => !prev)}
            aria-pressed={isBookmarked}
            className={cn(
              "flex h-10.5 w-fit items-center gap-2 rounded-8 border border-bg-surface px-4 text-[14px] font-extrabold text-bg-surface",
              isBookmarked ? "bg-action-pressed" : "bg-action-primary",
            )}
          >
            <img
              src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
              alt=""
              width={16}
              height={16}
              className="brightness-0 invert"
            />
            즐겨찾기
          </button>
        </div>
      </div>
    </main>
  );
}
