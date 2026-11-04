import { useEffect, useState } from "react";
import { getMovies } from "../api/movies/get-movies";
import type { GetMoviesResponse } from "../api/movies/get-movies";
import { Header } from "./header";
import { MovieGrid } from "./movie-grid";
import { Pagination } from "./pagination";

type Result =
  | { page: number; data: GetMoviesResponse; error?: undefined }
  | { page: number; error: string; data?: undefined };

export const HomePage = () => {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    let ignore = false;

    getMovies({ page })
      .then((data) => {
        if (!ignore) setResult({ page, data });
      })
      .catch(() => {
        if (!ignore) {
          setResult({ page, error: "영화 목록을 불러오지 못했어요." });
        }
      });

    return () => {
      ignore = true;
    };
  }, [page]);

  // 결과가 없거나 다른 페이지의 결과면 로딩 중
  const isLoading = result === null || result.page !== page;
  const movies = result?.data?.results ?? [];
  // TMDB는 최대 500페이지까지만 허용해요
  const totalPages = Math.min(result?.data?.total_pages ?? 1, 500);
  const errorMessage = !isLoading ? (result?.error ?? null) : null;

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col justify-between font-sans">
      <div>
        <Header />
        <main className="max-w-7xl mx-auto px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 min-h-[750px] flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                영화 목록
              </h2>
              {isLoading && <p className="text-gray-500">불러오는 중...</p>}
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              {!isLoading && !errorMessage && <MovieGrid movies={movies} />}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          </div>
        </main>
      </div>

      <footer className="py-4 text-center text-xs text-gray-400">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </div>
  );
};

export default HomePage;