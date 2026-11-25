import { useState, type ComponentProps } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { movieDetailOptions } from "../../api/movies/movie-query-options";

import RequestError from "../../components/request-error";

import { getFavorite } from "../../api/favorites";
import { getMemberRatings } from "../../api/ratings";
import { getMe } from "../../api/members/me";
import { favoriteKeys, useFavoriteMutation } from "../../hooks/use-favorite-mutation";
import { useRatingMutations } from "../../hooks/use-rating-mutations";
import { useAuthStore } from "../../stores/auth-store";

import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({
    from: "/movies/$movieId",
  });

  const movieId = Number(movieIdParam);

  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery(movieDetailOptions(movieId));

  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"], queryFn: getMe,
    enabled: Boolean(accessToken), staleTime: 5 * 60 * 1000, retry: false,
  });
  const memberId = meQuery.data?.memberId ?? meQuery.data?.id;
  const favoriteQuery = useQuery({
    queryKey: favoriteKeys.detail(movieId), queryFn: () => getFavorite(movieId),
    enabled: Boolean(accessToken) && isValidMovieId, retry: false,
  });
  const ratingsQuery = useQuery({
    queryKey: ["members", memberId, "ratings"],
    queryFn: () => getMemberRatings(memberId!),
    enabled: Boolean(accessToken) && memberId !== undefined, retry: false,
  });
  const favoriteMutation = useFavoriteMutation();
  const ratingMutations = useRatingMutations(memberId);
  const [score, setScore] = useState("5");
  const myRating = ratingsQuery.data?.find((rating) => rating.movieId === movieId);
  const validScore = Number.isInteger(Number(score)) && Number(score) >= 1 && Number(score) <= 5;
  const ratingPending = ratingMutations.create.isPending || ratingMutations.update.isPending || ratingMutations.remove.isPending;
  const handleRatingSubmit: NonNullable<ComponentProps<"form">["onSubmit"]> = (event) => {
    event.preventDefault();
    if (!validScore || ratingPending || !memberId) return;
    if (myRating) ratingMutations.update.mutate({ ratingId: myRating.ratingId, score: Number(score) });
    else ratingMutations.create.mutate({ movieId, score: Number(score) });
  };

  // 영화 ID가 유효하지 않은 경우
  if (!isValidMovieId) {
    return (
      <main className="mx-auto w-[calc(100%-80px)] max-w-[1200px] py-8">
        <p role="alert">올바르지 않은 영화 번호예요.</p>
      </main>
    );
  }

  // 최초 조회 중인 경우
  if (movieDetailQuery.isPending) {
    return (
      <main className="mx-auto w-[calc(100%-80px)] max-w-[1200px] py-8">
        <p role="status" className="text-[#6b7280]">
          영화 정보를 불러오는 중이에요.
        </p>
      </main>
    );
  }

  // API 요청이 실패한 경우
  if (movieDetailQuery.isError) {
    return (
      <main className="mx-auto w-[calc(100%-80px)] max-w-[1200px] py-8">
        <RequestError
          message={getMovieDetailErrorMessage(movieDetailQuery.error)}
          onRetry={() => {
            void movieDetailQuery.refetch();
          }}
        />
      </main>
    );
  }

  // API 응답 데이터
  const movie = movieDetailQuery.data;

  // 영화 정보가 없는 경우
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

  const isBookmarked = favoriteQuery.data ?? false;

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

            {accessToken ? (
              <button
                type="button" aria-pressed={isBookmarked}
                disabled={favoriteQuery.isPending || favoriteMutation.isPending}
                onClick={() => favoriteMutation.mutate({ movieId, isFavorite: isBookmarked })}
                className="rounded-lg bg-[#2563eb] px-4 py-3 text-[14px] font-semibold text-white"
              >
                {favoriteMutation.isPending ? "처리 중" : isBookmarked ? "즐겨찾기 해제" : "즐겨찾기 추가"}
              </button>
            ) : <Link to="/login">즐겨찾기는 로그인 후 이용할 수 있어요.</Link>}
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
          {accessToken && favoriteQuery.isError && <p role="alert">즐겨찾기를 불러오지 못했어요. <button type="button" onClick={() => void favoriteQuery.refetch()}>다시 시도</button></p>}
          {favoriteMutation.isError && <p role="alert">즐겨찾기 변경에 실패했어요.</p>}

          <section className="mt-8" aria-label="내 평점">
            <h2 className="text-[20px] font-bold">내 평점</h2>
            {!accessToken ? <Link to="/login">로그인하고 평점 남기기</Link>
              : meQuery.isPending || (memberId && ratingsQuery.isPending) ? <p>평점을 불러오는 중이에요.</p>
              : meQuery.isError ? <p role="alert">회원 정보를 불러오지 못했어요.</p>
              : !memberId ? <p role="alert">회원 번호가 조회 응답에 없어 평점 요청을 보낼 수 없어요.</p>
              : ratingsQuery.isError ? <p role="alert">평점을 불러오지 못했어요. <button type="button" onClick={() => void ratingsQuery.refetch()}>다시 시도</button></p>
              : <>
                  <p>{myRating ? `현재 평점: ${myRating.score}점` : "아직 이 영화에 남긴 평점이 없어요."}</p>
                  <form onSubmit={handleRatingSubmit}>
                    <label htmlFor="rating-score">평점 (1~5점)</label>{" "}
                    <input id="rating-score" type="number" min="1" max="5" step="1" value={score} onChange={(event) => setScore(event.target.value)} />{" "}
                    <button type="submit" disabled={!validScore || ratingPending}>{myRating ? "평점 수정" : "평점 등록"}</button>
                    {myRating && <button type="button" disabled={ratingPending} onClick={() => ratingMutations.remove.mutate(myRating.ratingId)}>평점 삭제</button>}
                  </form>
                  {(ratingMutations.create.isError || ratingMutations.update.isError || ratingMutations.remove.isError) && <p role="alert">평점 변경에 실패했어요.</p>}
                </>}
          </section>
        </section>
      </div>
    </main>
  );
}
