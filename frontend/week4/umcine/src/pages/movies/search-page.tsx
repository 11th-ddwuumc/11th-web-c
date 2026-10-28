import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useState } from "react";

import { searchMovies } from "../../api/movies/search-movies";

import Pagination from "../../components/movies/pagination";
import RequestError from "../../components/request-error";

import { useApiRequest } from "../../hooks/use-api-request";
import { useBookmarkStore } from "../../stores/bookmark-store";

import { TMDB_MAX_PAGE } from "../../utils/movies/parse-page";
import { toMovieCard } from "../../utils/movies/to-movie-card";

export function SearchPage() {
  const { query = "", page = 1 } = useSearch({ from: "/search" });

  return (
    <SearchPageContent
      key={JSON.stringify([query, page])}
      query={query}
      page={page}
    />
  );
}

function SearchPageContent({ query, page }: { query: string; page: number }) {
  const navigate = useNavigate({ from: "/search" });

  const normalizedQuery = query.trim();

  const [searchText, setSearchText] = useState(query);

  const load = useCallback(
    () =>
      normalizedQuery
        ? searchMovies({
            query: normalizedQuery,
            page,
          })
        : Promise.resolve({
            page: 1,
            results: [],
            total_pages: 0,
            total_results: 0,
          }),
    [normalizedQuery, page],
  );

  const { data, isLoading, errorMessage, retry } = useApiRequest(
    load,
    "검색 결과를 불러오지 못했어요.",
  );

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const movies = (data?.results ?? []).map((movie) =>
    toMovieCard(movie, bookmarkedMovieIds.includes(movie.id)),
  );

  const totalResults = data?.total_results ?? 0;

  const totalPages = Math.min(data?.total_pages ?? 0, TMDB_MAX_PAGE);

  function handleSubmit() {
    const nextQuery = searchText.trim();

    void navigate({
      search: {
        query: nextQuery || undefined,
        page: 1,
      },
    });
  }

  function handleChangePage(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) {
      return;
    }

    void navigate({
      search: {
        query: normalizedQuery,
        page: nextPage,
      },
    });
  }

  return (
    <main className="mx-auto w-[calc(100%-80px)] max-w-[1200px] py-8 pb-[100px]">
      <h1 className="mb-8 text-[32px] font-bold">영화 검색</h1>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
        className="mx-auto mb-10 flex max-w-[640px] gap-3"
      >
        <input
          aria-label="검색어"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="영화 제목을 입력해 주세요."
          className="h-12 min-w-0 flex-1 rounded-lg border border-[#dfe3e8] bg-white px-4 text-[14px] outline-none focus:border-[#2563eb]"
        />

        <button
          type="submit"
          className="h-12 shrink-0 rounded-lg bg-[#2563eb] px-6 font-semibold text-white"
        >
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <p className="text-[14px] text-[#6b7280]">검색어를 입력해 주세요.</p>
      ) : isLoading ? (
        <p role="status" className="text-[14px] text-[#6b7280]">
          검색 결과를 불러오는 중이에요.
        </p>
      ) : errorMessage ? (
        <RequestError message={errorMessage} onRetry={retry} />
      ) : (
        <>
          <div className="mb-6 text-left">
            <h2 className="m-0 text-[24px] font-bold">
              ‘{normalizedQuery}’ 검색 결과
            </h2>

            <p className="mt-2 text-[14px] text-[#6b7280]">
              전체 영화 {totalResults}편 · 현재 {movies.length}편 표시
            </p>
          </div>

          {movies.length === 0 ? (
            <p className="text-[14px] text-[#6b7280]">검색 결과가 없어요.</p>
          ) : (
            <>
              <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2">
                {movies.map((movie) => {
                  const posterUrl = movie.posterPath;

                  const isBookmarked = bookmarkedMovieIds.includes(movie.id);

                  return (
                    <li
                      key={movie.id}
                      className="flex gap-5 rounded-xl border border-[#e5e7eb] bg-white p-4 text-left"
                    >
                      <Link
                        to="/movies/$movieId"
                        params={{
                          movieId: String(movie.id),
                        }}
                        className="shrink-0"
                      >
                        {posterUrl ? (
                          <img
                            src={posterUrl}
                            alt={`${movie.title} 포스터`}
                            className="h-[180px] w-[120px] rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-[180px] w-[120px] items-center justify-center rounded-lg bg-[#e5e7eb] text-[13px] text-[#6b7280]">
                            이미지 없음
                          </div>
                        )}
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-start justify-between gap-3">
                          <Link
                            to="/movies/$movieId"
                            params={{
                              movieId: String(movie.id),
                            }}
                            className="no-underline"
                          >
                            <h3 className="m-0 text-[18px] font-bold text-[#111]">
                              {movie.title}
                            </h3>
                          </Link>

                          <button
                            type="button"
                            aria-pressed={isBookmarked}
                            onClick={() => toggleBookmark(movie.id)}
                            className="shrink-0 text-[14px] font-semibold text-[#2563eb]"
                          >
                            {isBookmarked ? "북마크 해제" : "북마크 추가"}
                          </button>
                        </div>

                        <p className="mb-1 text-[13px] text-[#6b7280]">
                          {movie.originalTitle}
                        </p>

                        <p className="mb-3 text-[13px] text-[#9ca3af]">
                          {movie.releaseDate || "개봉일 정보가 없어요."}
                        </p>

                        <p className="line-clamp-3 text-[14px] leading-6 text-[#4b5563]">
                          {movie.overview || "줄거리 정보가 없어요."}
                        </p>

                        <Link
                          to="/movies/$movieId"
                          params={{
                            movieId: String(movie.id),
                          }}
                          className="mt-4 inline-block text-[14px] font-semibold text-[#2563eb] underline-offset-4 hover:underline"
                        >
                          상세 보기
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onChangePage={handleChangePage}
              />
            </>
          )}
        </>
      )}
    </main>
  );
}
