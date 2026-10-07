import MovieGrid from "../../components/movie-grid";
import Pagination from "../../components/pagination";
import { movies as initialMovies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MovieListPage() {
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const movies = initialMovies.map((movie) => ({
    ...movie,
    isBookmarked: bookmarkedMovieIds.includes(movie.id),
  }));

  return (
    <main className="flex flex-col gap-5 px-20 py-6">
      <h1 className="text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-text-primary">
        영화 목록
      </h1>
      <MovieGrid movies={movies} onToggleBookmark={toggleBookmark} />
      <Pagination currentPage={1} totalPages={5} />
    </main>
  );
}
