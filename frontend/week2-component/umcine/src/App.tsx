import { useState } from "react";

import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";

import { movies as initialMovies } from "./data/movies";
import type { Movie } from "./types/movie";

import "./App.css";

export default function App() {
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
      <Header />

      <main className="main">
        <div className="main__heading">
          <h2>영화 목록</h2>
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

      <footer className="footer">
        <div className="footer__inner">
          <img
            src="/images/tmdb-logo.svg"
            alt="TMDB"
            className="footer__logo"
          />

          <p>
            This product uses the TMDB API but is not endorsed or certified by{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noreferrer"
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