import { useState } from "react";

import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

import { movies as initialMovies } from "../../data/movies";
import type { Movie } from "../../types/movie";

export function MovieListPage() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? {
              ...movie,
              isBookmarked: !movie.isBookmarked,
            }
          : movie,
      ),
    );
  }

  function handleChangePage(page: number) {
    setCurrentPage(page);
  }

  return (
    <>
      <main className="mx-auto w-[calc(100%-80px)] max-w-[1200px] py-8 pb-[100px]">
        <div className="mb-6">
          <h2 className="m-0 text-[32px] font-bold">
            영화 목록
          </h2>
        </div>

        <MovieGrid
          movies={movies}
          onToggleBookmark={handleToggleBookmark}
        />

        <Pagination
          currentPage={currentPage}
          onChangePage={handleChangePage}
        />
      </main>

      <footer className="mt-10 border-t border-[#e5e7eb] bg-white">
        <div className="mx-auto flex min-h-[72px] w-[calc(100%-80px)] max-w-[1200px] items-center justify-end gap-[10px]">
            <img
            src="/images/tmdb-logo.svg"
            alt="TMDB"
            className="h-auto w-8"
            />

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