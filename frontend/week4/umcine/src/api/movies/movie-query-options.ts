import { queryOptions } from "@tanstack/react-query";

import { getMovies } from "./get-movies";
import { searchMovies } from "./search-movies";
import { getMovieDetail } from "./get-movie-detail";

// 영화 목록 조회
export const movieListOptions = (page: number) =>
  queryOptions({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

// 영화 검색
export const movieSearchOptions = (query: string, page: number) => {
  const normalizedQuery = query.trim();

  return queryOptions({
    queryKey: ["movies", "search", { query: normalizedQuery, page }],
    queryFn: () =>
      searchMovies({
        query: normalizedQuery,
        page,
      }),
    enabled: normalizedQuery.length > 0,
  });
};

// 영화 상세 조회
export const movieDetailOptions = (movieId: number) => {
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  return queryOptions({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
    staleTime: 30 * 1000,
  });
};
