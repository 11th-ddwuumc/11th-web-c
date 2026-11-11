import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });

  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

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

    const nextQuery = searchText.trim();

    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="mx-auto w-[calc(100%-80px)] max-w-[1200px] py-8 pb-[100px]">
      <h1 className="mb-8 text-[32px] font-bold">
        영화 검색
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mb-10 flex max-w-[640px] gap-3"
      >
        <input
          aria-label="검색어"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="영화 제목을 입력해 주세요."
          className="h-12 flex-1 rounded-lg border border-[#dfe3e8] bg-white px-4 text-[14px] outline-none focus:border-[#2563eb]"
        />

        <button
          type="submit"
          className="h-12 rounded-lg bg-[#2563eb] px-6 font-semibold text-white"
        >
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <p className="text-[14px] text-[#6b7280]">
          검색어를 입력해 주세요.
        </p>
      ) : (
        <>
          <div className="mb-6 text-left">
            <h2 className="m-0 text-[24px] font-bold">
              ‘{query}’ 검색 결과
            </h2>

            <p className="mt-2 text-[14px] text-[#6b7280]">
              영화 {searchResults.length}편
            </p>
          </div>

          {searchResults.length === 0 ? (
            <p className="text-[14px] text-[#6b7280]">
              검색 결과가 없어요.
            </p>
          ) : (
            <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2">
              {searchResults.map((movie) => (
                <li
                  key={movie.id}
                  className="flex gap-5 rounded-xl border border-[#e5e7eb] bg-white p-4 text-left"
                >
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="shrink-0"
                  >
                    <img
                      src={movie.posterPath}
                      alt={`${movie.title} 포스터`}
                      className="h-[180px] w-[120px] rounded-lg object-cover"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="no-underline"
                    >
                      <h3 className="m-0 mb-1 text-[18px] font-bold text-[#111]">
                        {movie.title}
                      </h3>
                    </Link>

                    <p className="mb-1 text-[13px] text-[#6b7280]">
                      {movie.originalTitle}
                    </p>

                    <p className="mb-3 text-[13px] text-[#9ca3af]">
                      {movie.releaseDate}
                    </p>

                    <p className="line-clamp-3 text-[14px] leading-6 text-[#4b5563]">
                      {movie.overview}
                    </p>

                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="mt-4 inline-block text-[14px] font-semibold text-[#2563eb] underline-offset-4 hover:underline"
                    >
                      상세 보기
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}