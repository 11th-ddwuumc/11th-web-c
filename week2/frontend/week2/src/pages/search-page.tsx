import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { TmdbMovieListItem } from "../api/movies/models";
import { searchMovies } from "../api/movies/search-movies";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const normalizedQuery = query.trim();

    setMovies([]);
    setErrorMessage(null);

    if (!normalizedQuery) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (!ignore) setMovies(response.results);
      })
      .catch(() => {
        if (!ignore) setErrorMessage("검색 결과를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [query]);

  return (
    <div>
    </div>
  );
}