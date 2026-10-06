import { useState } from "react";

import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

import { movies as initialMovies } from "../../data/movies";
import type { Movie } from "../../types/movie";

import { useBookmarkStore } from "../../stores/bookmark-store";
import { useUiStore } from "../../stores/ui-store";

export function MovieListPage() {
  const [movies] = useState<Movie[]>(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const sortOrder = useUiStore((state) => state.sortOrder);

  const setSortOrder = useUiStore((state) => state.setSortOrder);

  function handleToggleBookmark(movieId: number) {
    toggleBookmark(movieId);
  }

  function handleChangePage(page: number) {
    setCurrentPage(page);
  }

  const moviesWithBookmarks = movies.map((movie) => ({
    ...movie,
    isBookmarked: bookmarkedMovieIds.includes(movie.id),
  }));

  const sortedMovies = [...moviesWithBookmarks].sort((a, b) => {
    const firstDate = new Date(a.releaseDate).getTime();
    const secondDate = new Date(b.releaseDate).getTime();

    return sortOrder === "latest"
      ? secondDate - firstDate
      : firstDate - secondDate;
  });

  return (
    <>
      <main className="mx-auto w-[calc(100%-80px)] max-w-[1200px] py-8 pb-[100px]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="m-0 text-[32px] font-bold">영화 목록</h2>

          <select
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(event.target.value as "latest" | "oldest")
            }
            className="rounded-lg border border-[#dfe3e8] bg-white px-3 py-2 text-[14px]"
          >
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
          </select>
        </div>

        <MovieGrid
          movies={sortedMovies}
          onToggleBookmark={handleToggleBookmark}
        />

        <Pagination currentPage={currentPage} onChangePage={handleChangePage} />
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
