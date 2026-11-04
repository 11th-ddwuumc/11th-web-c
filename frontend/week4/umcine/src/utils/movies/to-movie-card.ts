import type { TmdbMovieListItem } from "../../api/movies/models";
import type { Movie } from "../../types/movie";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "./tmdb-image";

export function toMovieCard(
  movie: TmdbMovieListItem,
  isBookmarked = false,
): Movie {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: movie.release_date,
    posterPath: getTmdbPosterUrl(movie.poster_path) ?? "",
    backdropPath: getTmdbBackdropUrl(movie.backdrop_path) ?? "",

    // 목록 응답에는 장르 이름, 상영 시간, 태그라인이 없어요.
    genres: [],
    runtime: "",
    tagline: "",

    overview: movie.overview,
    isBookmarked,
  };
}
