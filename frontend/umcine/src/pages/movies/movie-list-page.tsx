import MovieGrid from "../../components/movie-grid";
import Pagination from "../../components/pagination";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import { useNavigate } from "@tanstack/react-router";
import {
  useAddFavoriteMutation,
  useFavoritesQuery,
  useRemoveFavoriteMutation,
} from "../../hooks/use-favorites";
import { useAuthStore } from "../../stores/auth-store";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const favoritesQuery = useFavoritesQuery();
  const addFavoriteMutation = useAddFavoriteMutation();
  const removeFavoriteMutation = useRemoveFavoriteMutation();
  const bookmarkedMovieIds = (favoritesQuery.data ?? []).map((favorite) => favorite.movieId);

  const toggleBookmark = (movieId: number) => {
    if (!accessToken) {
      alert("로그인이 필요해요.");
      navigate({ to: "/login" });
      return;
    }
    if (addFavoriteMutation.isPending || removeFavoriteMutation.isPending) return;

    if (bookmarkedMovieIds.includes(movieId)) {
      removeFavoriteMutation.mutate(movieId);
    } else {
      addFavoriteMutation.mutate(movieId);
    }
  };

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

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
      {moviesQuery.isPending ? (
        <p className="text-text-secondary">영화 목록을 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        <p className="text-danger-default">영화 목록을 불러오지 못했어요.</p>
      ) : movieCards.length === 0 ? (
        <p className="text-text-secondary">조건에 맞는 영화가 없어요.</p>
      ) : (
        <>
          <MovieGrid movies={movieCards} onToggleBookmark={toggleBookmark} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
}
