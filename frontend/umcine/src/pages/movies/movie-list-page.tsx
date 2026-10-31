import MovieGrid from "../../components/movie-grid";
import Pagination from "../../components/pagination";
import { useState, useEffect } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function MovieListPage() {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  useEffect(() => {
    let ignore = false;
    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: 1 });
        if (!ignore) setMovies(response.results);
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

  const movieCards = movies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    releaseDate: movie.release_date,
    posterPath: getTmdbPosterUrl(movie.poster_path),
    isBookmarked: bookmarkedMovieIds.includes(movie.id),
  }));

  return (
    <main className="flex flex-col gap-5 px-20 py-6">
      <h1 className="text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-text-primary">
        영화 목록
      </h1>
      {isLoading ? (
        <p className="text-text-secondary">영화 목록을 불러오는 중이에요.</p>
      ) : errorMessage ? (
        <p className="text-danger-default">{errorMessage}</p>
      ) : movieCards.length === 0 ? (
        <p className="text-text-secondary">조건에 맞는 영화가 없어요.</p>
      ) : (
        <>
          <MovieGrid movies={movieCards} onToggleBookmark={toggleBookmark} />
          <Pagination currentPage={1} totalPages={5} />
        </>
      )}
    </main>
  );
}
