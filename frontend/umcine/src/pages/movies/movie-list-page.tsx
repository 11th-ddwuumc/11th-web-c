import {MovieCard} from "../../components/movies/movie-card.tsx";
import Footer from "../../components/movies/footer.tsx";
import {cn} from "../../utils/cn.ts";
import {useState} from "react";
import {getMovies} from "../../api/movies/get-movies.ts";
import {useQuery} from "@tanstack/react-query";

export default function MovieListPage() {
  const [page, setPage] = useState(1);
  const moviesQuery = useQuery({
    queryKey: ["movies", "list", {page}],
    queryFn: () => getMovies({page}),
  });
  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  const pageGroupSize = 5;
  const startPage = Math.floor((page - 1) / pageGroupSize) * pageGroupSize + 1;

  const pageNumbers = Array.from(
    {length: Math.max(0, Math.min(pageGroupSize, totalPages - startPage + 1))},
    (_, index) => startPage + index,
  );

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) {
      return;
    }
    setPage(nextPage);
  };

  const arrowClassName = cn(
    "flex size-6 shrink-0 items-center justify-center border-0 bg-transparent p-0",
    "text-(--color-text-secondary) cursor-pointer",
    "disabled:cursor-default disabled:text-(--color-action-disabled)",
  );

  const arrowMaskStyle = {
    mask: "url('/icons/keyboard-arrow-left.svg') center / contain no-repeat",
    WebkitMask:
      "url('/icons/keyboard-arrow-left.svg') center / contain no-repeat",
  };

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
        {moviesQuery.isPending ? (
          <p role="status" className="m-0 text-(--color-text-secondary)">
            영화 목록을 불러오는 중이에요.
          </p>
        ) : moviesQuery.isError ? (
          <p role="alert" className="m-0 text-(--color-text-primary)">
            {moviesQuery.error.message}
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
      {/*페이지네이션*/}
      {!moviesQuery.isPending && !moviesQuery.isError && totalPages > 0 && (
        <nav className="mt-4 flex w-full items-center justify-center gap-3 pb-12">
          <button
            type="button"
            aria-label="이전 페이지"
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
            className={arrowClassName}
          >
            <span
              aria-hidden="true"
              className="block size-6 bg-current"
              style={arrowMaskStyle}
            />
          </button>

          <div className="flex h-9 w-49 items-center gap-1">
            {pageNumbers.map((pageNumber) => {
              const isActive = page === pageNumber;

              return (
                <button
                  key={pageNumber}
                  type="button"
                  aria-label={`${pageNumber}페이지`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => handlePageChange(pageNumber)}
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center",
                    "cursor-pointer rounded-[7px] border-0 px-1.5 py-px",
                    "text-center text-[13px] leading-none font-bold tracking-normal",
                    isActive
                      ? "bg-(--color-text-primary) text-(--color-bg-surface)"
                      : "bg-transparent text-(--color-text-secondary)",
                  )}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            aria-label="다음 페이지"
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
            className={arrowClassName}
          >
            <span
              aria-hidden="true"
              className="block size-6 rotate-180 bg-current"
              style={arrowMaskStyle}
            />
          </button>
        </nav>
      )}
      <div className="fixed bottom-0 left-0 z-20 w-full">
        <Footer/>
      </div>
    </main>
  );
}
