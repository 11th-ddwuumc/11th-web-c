import { useParams } from "@tanstack/react-router";
import { useCallback } from "react";

import { getMovieDetail } from "../../api/movies/get-movie-detail";

import RequestError from "../../components/request-error";
import { useApiRequest } from "../../hooks/use-api-request";

import { useBookmarkStore } from "../../stores/bookmark-store";

import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

export function MovieDetailPage() {
  const { movieId } = useParams({
    from: "/movies/$movieId",
  });

  const parsedMovieId = Number(movieId);

  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  if (!isValidMovieId) {
    return (
      <main className="mx-auto w-[calc(100%-80px)] max-w-[1200px] py-8">
        <p role="alert">올바르지 않은 영화 번호예요.</p>
      </main>
    );
  }

  return <MovieDetailContent key={parsedMovieId} movieId={parsedMovieId} />;
}

interface MovieDetailContentProps {
  movieId: number;
}

function MovieDetailContent({ movieId }: MovieDetailContentProps) {
  const load = useCallback(() => getMovieDetail(movieId), [movieId]);

  const {
    data: movie,
    isLoading,
    errorMessage,
    retry,
  } = useApiRequest(load, getMovieDetailErrorMessage);

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  if (isLoading) {
    return (
      <main className="mx-auto w-[calc(100%-80px)] max-w-[1200px] py-8">
        <p role="status" className="text-[#6b7280]">
          영화 정보를 불러오는 중이에요.
        </p>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="mx-auto w-[calc(100%-80px)] max-w-[1200px] py-8">
        <RequestError message={errorMessage} onRetry={retry} />
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="mx-auto w-[calc(100%-80px)] max-w-[1200px] py-8">
        <p>표시할 영화 정보가 없어요.</p>
      </main>
    );
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  const genreText = movie.genres.map((genre) => genre.name).join(", ");

  const runtimeText =
    typeof movie.runtime === "number"
      ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
      : "상영 시간 정보가 없어요.";

  const isBookmarked = bookmarkedMovieIds.includes(movie.id);

  return (
    <main className="mx-auto w-[calc(100%-80px)] max-w-[1200px] py-8 pb-[100px]">
      <div className="mb-8 h-[240px] overflow-hidden rounded-2xl bg-[#e5e7eb] md:h-[400px]">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt={`${movie.title} 배경`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#6b7280]">
            이미지 없음
          </div>
        )}
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <div className="h-[360px] w-[240px] shrink-0 overflow-hidden rounded-xl bg-[#e5e7eb]">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#6b7280]">
              이미지 없음
            </div>
          )}
        </div>

        <section className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
            <h1 className="m-0 text-[32px] font-bold">{movie.title}</h1>

            <button
              type="button"
              aria-pressed={isBookmarked}
              onClick={() => toggleBookmark(movie.id)}
              className="rounded-lg bg-[#2563eb] px-4 py-3 text-[14px] font-semibold text-white"
            >
              {isBookmarked ? "북마크 해제" : "북마크 추가"}
            </button>
          </div>

          <p className="mb-6 text-[16px] text-[#6b7280]">
            {movie.original_title}
          </p>

          <dl className="mb-8 grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 text-[14px]">
            <dt className="font-semibold">개봉일</dt>
            <dd className="m-0 text-[#4b5563]">
              {movie.release_date || "개봉일 정보가 없어요."}
            </dd>

            <dt className="font-semibold">장르</dt>
            <dd className="m-0 text-[#4b5563]">
              {genreText || "장르 정보가 없어요."}
            </dd>

            <dt className="font-semibold">상영 시간</dt>
            <dd className="m-0 text-[#4b5563]">{runtimeText}</dd>
          </dl>

          {movie.tagline && (
            <p className="mb-5 text-[20px] font-semibold">{movie.tagline}</p>
          )}

          <h2 className="mb-3 text-[20px] font-bold">줄거리</h2>

          <p className="whitespace-pre-line text-[15px] leading-7 text-[#4b5563]">
            {movie.overview || "줄거리 정보가 없어요."}
          </p>
        </section>
      </div>
    </main>
  );
}
