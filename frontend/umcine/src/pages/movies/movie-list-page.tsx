import {MovieCard} from "../../components/movies/movie-card.tsx";
import Footer from "../../components/movies/footer.tsx";
import {cn} from "../../utils/cn.ts";
import {useEffect, useState} from "react";
import type {TmdbMovieListItem} from "../../api/movies/models.ts";
import {getMovies} from "../../api/movies/get-movies.ts";

export default function MovieListPage() {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({page: 1});
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

  return (
    <main className={cn(
      "min-h-[calc(100vh-90px)] w-full bg-(--color-bg-page) pb-14.25",
    )}>
      <div className={cn(
        "flex w-full flex-col gap-5 px-20 py-6",
        "max-[750px]:p-6",
        "max-[480px]:px-4 max-[480px]:py-6",
      )}>
        <h1 className={cn(
          "m-0 self-start",
          "text-[38px] leading-11 font-bold tracking-[-1.71px]",
          "text-(--color-text-primary)",
        )}>영화 목록</h1>
        {isLoading ? (
          <p role="status" className="m-0 text-(--color-text-secondary)">
            영화 목록을 불러오는 중이에요.
          </p>
        ) : errorMessage ? (
          <p role="alert" className="m-0 text-(--color-text-primary)">
            {errorMessage}
          </p>
        ) : movies.length === 0 ? (
          <p className="m-0 text-(--color-text-secondary)">
            표시할 영화가 없어요.
          </p>
        ) : (
          <ul className={cn(
            "m-0 grid w-full list-none grid-cols-5 p-0",
            "gap-x-5 gap-y-6",
            "max-[1100px]:grid-cols-3",
            "max-[750px]:grid-cols-2",
            "max-[480px]:grid-cols-1",
          )}>
            {movies.map((movie) => (
              <li key={movie.id}>
                <MovieCard movie={movie}/>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="fixed bottom-0 left-0 z-20 w-full">
        <Footer/>
      </div>
    </main>
  );
}
