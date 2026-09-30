import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useRef, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const inputRef = useRef<HTMLInputElement>(null);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = inputRef.current?.value.trim() ?? "";
    navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }

  function handleClear() {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  }

  if (!normalizedQuery) {
    return (
      <main className="flex flex-col items-center px-18 pt-52.25 pb-52.5">
        <div className="flex w-197.5 flex-col items-center gap-9">
          <h1 className="text-[46px] leading-[52.44px] font-bold tracking-[-2.3px] text-text-primary">
            어떤 영화를 찾고 있나요?
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex h-18.5 w-full items-center gap-3.5 rounded-xl border-2 border-text-primary bg-bg-surface py-1 pr-4.25 pl-5.25 shadow-[0px_12px_17px_rgba(17,19,24,0.08)]"
          >
            <img src="/icons/search.svg" alt="" width={24} height={24} />
            <input
              key={query ?? ""}
              ref={inputRef}
              defaultValue={query ?? ""}
              type="text"
              aria-label="검색어"
              placeholder="예: 스파이더맨"
              className="flex-1 text-[17px] text-text-primary outline-none placeholder:text-text-tertiary"
            />
            <button
              type="submit"
              className="flex h-10.5 items-center justify-center rounded-8 bg-text-primary px-4 text-[14px] font-extrabold text-bg-surface"
            >
              검색
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-start px-20 py-6">
      <div className="flex w-full flex-col gap-4.25">
        <h1 className="text-[38px] leading-11 font-bold tracking-[-1.71px] text-text-primary">
          영화 검색
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex h-13.5 w-full items-center gap-4.5 rounded-[9px] border border-border-default bg-bg-surface py-1 pr-2.5 pl-3.75"
        >
          <img src="/icons/search.svg" alt="" width={24} height={24} />
          <input
            key={query ?? ""}
            ref={inputRef}
            defaultValue={query ?? ""}
            type="text"
            aria-label="검색어"
            className="flex-1 text-[14px] font-bold text-text-primary outline-none"
          />
          <button type="button" onClick={handleClear} aria-label="검색어 지우기" className="shrink-0">
            <img src="/icons/close.svg" alt="" width={24} height={24} />
          </button>
          <button
            type="submit"
            className="flex h-10.5 items-center justify-center rounded-8 bg-text-primary px-4 text-[14px] font-extrabold text-bg-surface"
          >
            다시 검색
          </button>
        </form>
      </div>

      <div className="flex h-13.5 w-full items-center justify-between border-y border-border-default">
        <h2 className="text-[18px] font-bold text-text-primary">'{query}' 검색 결과</h2>
        <span className="text-[12px] text-text-tertiary">영화 {searchResults.length}편</span>
      </div>

      {searchResults.length === 0 ? (
        <p className="w-full py-24 text-center text-text-secondary">검색 결과가 없어요.</p>
      ) : (
        <ul className="grid w-full grid-cols-2 gap-x-10">
          {searchResults.map((movie) => (
            <li key={movie.id} className="flex gap-4.5 border-b border-border-default py-5">
              <div className="h-47.5 w-31.5 shrink-0 overflow-hidden rounded-10 bg-bg-page">
                <img
                  src={movie.posterPath}
                  alt={`${movie.title} 포스터`}
                  className="size-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 py-1">
                <h3 className="text-[18px] leading-[24.3px] font-bold text-text-primary">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-2 text-[12px] text-text-tertiary">
                  <span>{movie.originalTitle}</span>
                  <span>{movie.releaseDate}</span>
                </div>
                <p className="line-clamp-2 text-[12.5px] leading-[20.25px] text-text-secondary">
                  {movie.overview}
                </p>
                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                  className="flex items-center gap-1 text-[12px] font-extrabold text-action-primary"
                >
                  상세 보기
                  <img src="/icons/arrow-right.svg" alt="" width={16} height={16} />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
