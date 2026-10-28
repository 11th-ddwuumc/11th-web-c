import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback } from "react";

import { getMovies } from "../../api/movies/get-movies";

import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import RequestError from "../../components/request-error";

import { useApiRequest } from "../../hooks/use-api-request";

import { useBookmarkStore } from "../../stores/bookmark-store";
import { useUiStore } from "../../stores/ui-store";

import { TMDB_MAX_PAGE } from "../../utils/movies/parse-page";
import { toMovieCard } from "../../utils/movies/to-movie-card";

export function MovieListPage() {
  const { page = 1 } = useSearch({ from: "/" });

  return <MovieListContent key={page} page={page} />;
}

function MovieListContent({ page }: { page: number }) {
  const navigate = useNavigate({ from: "/" });

  const load = useCallback(() => getMovies({ page }), [page]);

  const { data, isLoading, errorMessage, retry } = useApiRequest(
    load,
    "영화 목록을 불러오지 못했어요.",
  );

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const sortOrder = useUiStore((state) => state.sortOrder);

  const setSortOrder = useUiStore((state) => state.setSortOrder);

  const movies = (data?.results ?? []).map((movie) =>
    toMovieCard(movie, bookmarkedMovieIds.includes(movie.id)),
  );

  const sortedMovies = [...movies].sort((a, b) => {
    const difference =
      (Date.parse(a.releaseDate) || 0) - (Date.parse(b.releaseDate) || 0);

    return sortOrder === "latest" ? -difference : difference;
  });

  const totalPages = Math.min(data?.total_pages ?? 0, TMDB_MAX_PAGE);

  function handleChangePage(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) {
      return;
    }

    void navigate({
      search: { page: nextPage },
    });
  }

  return (
    <>
      <main className="mx-auto w-[calc(100%-80px)] max-w-[1200px] py-8 pb-[100px]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="m-0 text-[32px] font-bold">영화 목록</h2>

          <select
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(
                event.target.value === "oldest" ? "oldest" : "latest",
              )
            }
            className="rounded-lg border border-[#dfe3e8] bg-white px-3 py-2 text-[14px]"
          >
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
          </select>
        </div>

        {isLoading ? (
          <p role="status" className="py-16 text-center text-[#6b7280]">
            영화 목록을 불러오는 중이에요.
          </p>
        ) : errorMessage ? (
          <RequestError message={errorMessage} onRetry={retry} />
        ) : movies.length === 0 ? (
          <div className="py-16 text-center">
            <p>조건에 맞는 영화가 없어요.</p>

            {page > 1 && (
              <button
                type="button"
                onClick={() =>
                  void navigate({
                    search: { page: 1 },
                  })
                }
                className="mt-3 text-[#2563eb]"
              >
                첫 페이지로 이동
              </button>
            )}
          </div>
        ) : (
          <>
            <MovieGrid
              movies={sortedMovies}
              onToggleBookmark={toggleBookmark}
            />

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onChangePage={handleChangePage}
            />
          </>
        )}
      </main>

      <footer className="mt-10 border-t border-[#e5e7eb] bg-white">
        <div className="mx-auto flex min-h-[72px] w-[calc(100%-80px)] max-w-[1200px] items-center justify-end gap-[10px]">
          <img src="/images/tmdb-logo.svg" alt="TMDB" className="h-auto w-8" />

          <p className="m-0 text-[12px] text-[#6b7280]">
            This product uses the TMDB API but is not endorsed or certified by{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noreferrer"
              className="text-inherit underline"
            >
              TMDB
            </a>
            .
          </p>
        </div>
      </footer>
    </>
  );
}
