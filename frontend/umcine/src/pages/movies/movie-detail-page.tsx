import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../lib/cn";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

function formatRuntime(runtime: number | null) {
  if (runtime === null) return "상영 시간 정보가 없어요.";

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(parsedMovieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  useEffect(() => {
    let ignore = false;

    if (!(Number.isInteger(parsedMovieId) && parsedMovieId > 0)) {
      setMovie(null);
      setErrorMessage(null);
      setIsLoading(false);
      return;
    }

    async function loadMovie() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovieDetail(parsedMovieId);
        if (!ignore) setMovie(response);
      } catch (error) {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovie();

    return () => {
      ignore = true;
    };
  }, [parsedMovieId]);

  if (!isValidMovieId) {
    return (
      <main className="flex justify-center px-20 py-24 text-text-secondary">
        올바르지 않은 영화 번호예요.
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex justify-center px-20 py-24 text-text-secondary">
        영화 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (errorMessage || !movie) {
    return (
      <main className="flex justify-center px-20 py-24 text-text-secondary">
        {errorMessage ?? "영화 정보를 불러오지 못했어요."}
      </main>
    );
  }

  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <main className="flex flex-col items-center pb-15">
      <div className="relative h-[360px] w-full overflow-hidden">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-text-secondary text-[14px] text-bg-surface">
            이미지 없음
          </div>
        )}
        <div className="absolute inset-0 flex flex-col justify-between px-20 py-6">
          <Link
            to="/"
            className="flex items-center gap-1 text-[13px] font-bold text-bg-surface"
          >
            <img
              src="/icons/chevron-left.svg"
              alt=""
              width={24}
              height={24}
              className="brightness-0 invert"
            />
            영화 목록
          </Link>
          <div className="flex w-[800px] flex-col gap-2">
            <h1 className="text-[46px] leading-[49.68px] font-bold tracking-[-2.3px] text-bg-surface">
              {movie.title}
            </h1>
            <p className="text-[14px] text-bg-surface">{movie.original_title}</p>
            <div className="flex items-center gap-2 text-[13px] font-bold text-bg-surface">
              <span>{movie.release_date}</span>
              <span>{movie.genres.map((genre) => genre.name).join(", ")}</span>
              <span>{formatRuntime(movie.runtime)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full gap-8 px-20 py-6">
        <div className="h-[286px] w-[200px] shrink-0 overflow-hidden rounded-10 shadow-[0px_12px_30px_0px_rgba(12,15,20,0.12)]">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-border-default text-[14px] text-text-tertiary">
              이미지 없음
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <h2 className="text-[21px] font-bold tracking-[-0.63px] text-text-primary">
            {movie.tagline}
          </h2>
          <p className="text-[14px] leading-[24px] text-text-secondary">
            {movie.overview}
          </p>
          <button
            type="button"
            onClick={() => toggleBookmark(movie.id)}
            aria-pressed={isBookmarked}
            className={cn(
              "flex h-10.5 w-fit items-center gap-2 rounded-8 border border-bg-surface px-4 text-[14px] font-extrabold text-bg-surface",
              isBookmarked ? "bg-action-pressed" : "bg-action-primary",
            )}
          >
            <img
              src={
                isBookmarked
                  ? "/icons/bookmark.svg"
                  : "/icons/bookmark-outline.svg"
              }
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
