import {Link, useNavigate, useSearch} from "@tanstack/react-router";
import {type SubmitEvent, useState} from "react";
import {movies} from "../../data/movies";
import {cn} from "../../utils/cn.ts";
import Footer from "../../components/movies/footer.tsx";

export function SearchPage() {
  const {query} = useSearch({from: "/search"});
  const normalizedQuery = query?.trim() ?? "";

  return normalizedQuery ? (
    <SearchResultPage query={normalizedQuery}/>
  ) : (
    <SearchLandingPage/>
  );
}

/**
 * 초기 검색 랜딩 페이지
 */
function SearchLandingPage() {
  return (
    <section className={cn(
      "w-full flex flex-col align-middle",
      "min-h-[calc(100vh-80px)] items-center",
      "pt-52.25 pr-18 pl-18 pb-52.5",
      "bg-(--color-bg-page)"
    )}>
      <div className="w-197.5 flex flex-col items-center gap-9">
        <h1 className={cn(
          "font-bold text-[46px] text-(--color-text-primary)",
          "leading-[52.44px] tracking-[-2.3px] m-0"
        )}>
          어떤 영화를 찾고 있나요?
        </h1>
        <SearchForm variant="landing"/>
      </div>
    </section>
  );
}

type SearchFormProps = {
  variant: "landing" | "result";
  initialValue?: string;
};

/**
 * 검색창
 */
function SearchForm({
                      variant,
                      initialValue = ""
                    }: SearchFormProps) {
  const navigate = useNavigate({from: "/search"});
  const [searchText, setSearchText] = useState(initialValue);
  const isLanding = variant === "landing";

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? {query: nextQuery} : {},
    });
  }

  function handleReset() {
    setSearchText("");
    navigate({
      search: {},
    });
  }

  return (
    <form
      className={cn(
        "flex w-full bg-(--color-bg-surface) items-center",
        isLanding ?
          "h-18.5 gap-3.5 pr-4.25 pl-5.25 rounded-xl border-2 border-(--color-text-primary) shadow-[0px_12px_34px_0px_#11131814]"
          : "h-13.5 gap-4.5 pr-2.5 pl-3.75 rounded-[9px] border border-(--color-border-default)",
      )}
      onSubmit={handleSubmit}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_98_684)">
          <path
            d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
            fill="#606774"/>
        </g>
        <defs>
          <clipPath id="clip0_98_684">
            <rect width="24" height="24" fill="white"/>
          </clipPath>
        </defs>
      </svg>

      <input
        className={isLanding ?
          cn(
            "flex flex-col w-full px-0.5 py-px",
            "text-[17px] font-normal leading-[100%] tracking-[0%]",
            "placeholder:text-(--color-text-tertiary)"
          ) :
          cn(
            "flex flex-col w-full px-0.5 py-px",
            "text-[14px] font-bold leading-[100%] tracking-[0%]",
          )
        }
        aria-label="검색어"
        value={searchText}
        placeholder="예: 스파이더맨"
        onChange={(event) => setSearchText(event.target.value)}
      />

      {!isLanding && searchText && (
        <button
          type="button"
          aria-label="검색어 지우기"
          onClick={handleReset}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_98_742)">
              <path
                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                fill="#606774"/>
            </g>
            <defs>
              <clipPath id="clip0_98_742">
                <rect width="24" height="24" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </button>
      )}

      <button
        className={cn(
          "flex h-10.5 shrink-0 px-4 justify-center items-center border rounded-lg",
          isLanding ? "border-(--color-text-primary)" : "border-(--color-bg-surface)",
          "bg-(--color-text-primary) text-[14px] font-extrabold text-(--color-bg-surface)",
        )}
        type="submit"
      >
        {isLanding ? "검색" : "다시 검색"}
      </button>
    </form>
  );
}

/**
 * 검색 결과 페이지
 */
function SearchResultPage({query}: { query: string }) {
  const normalizedQuery = query.toLowerCase();

  const searchResults = movies.filter((movie) =>
    movie.title.toLowerCase().includes(normalizedQuery) ||
    movie.originalTitle.toLowerCase().includes(normalizedQuery)
  );

  return (
    <main className="flex flex-col w-full px-20 py-6 min-h-[calc(100vh-80px)] bg-(--color-bg-page)">
      {/*results-head*/}
      <div className="flex flex-col w-full gap-4.25">
        <h1 className={cn(
          "flex flex-col m-0 w-full",
          "font-bold text-(--color-text-primary) text-[38px]",
          "leading-11 tracking-[-1.71px]"
        )}>
          영화 검색
        </h1>
        <SearchForm
          key={query}
          variant="result"
          initialValue={query}
        />
      </div>

      {/*results-toolbar*/}
      <div className={cn(
        "flex w-full h-13.5",
        "justify-between items-center",
        "border-t border-b border-(--color-border-default)",
      )}>
        <h2 className="font-bold text-[18px] text-(--color-text-primary)">
          `{query}` 검색 결과
        </h2>
        <span className="font-normal text-[12px] text-(--color-text-tertiary)">
          영화 {searchResults.length}편 · 1페이지
        </span>
      </div>

      {/*results-list*/}
      {searchResults.length > 0 ? (
        <ul className="h-180 grid grid-rows-3 grid-cols-2 gap-x-10">
          {searchResults.map((movie) => (
            <li
              key={movie.id}
              className={cn(
                "flex w-full h-60 py-5 gap-4.5",
                "border-b border-(--color-border-default)"
              )}
            >
              <img
                src={movie.posterPath}
                alt={`${movie.title} 포스터`}
                className="w-31.5 h-47.5 rounded-[10px] shrink-0"
              />

              <div className="w-full h-full flex flex-col gap-2">
                <h3 className={cn("w-full m-0 font-bold text-[18px]",
                  "text-(--color-text-primary) leading-[24.3px]"
                )}>
                  {movie.title}
                </h3>
                <div className="flex w-full gap-2">
                  <span className="font-normal text-[12px] text-(--color-text-tertiary)">
                    {movie.originalTitle}
                  </span>
                  <span className="font-normal text-[12px] text-(--color-text-tertiary)">
                    {movie.releaseDate}
                  </span>
                </div>
                <span className={cn(
                  "block min-h-16.5",
                  "font-normal text-[12.5px] text-(--color-text-secondary)",
                  "leading-[20.25px]"
                )}>
                  {movie.overview}
                </span>
                <Link
                  className="flex gap-1 cursor-pointer text-(--color-action-primary)"
                  to={"/movies/$movieId"}
                  params={{movieId: String(movie.id)}}
                >
                  <span className="font-extrabold text-[12px]">
                    상세 보기
                  </span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8.86699 11.5165C8.73366 11.3832 8.66966 11.2221 8.67499 11.0332C8.68077 10.8443 8.75033 10.6832 8.88366 10.5499L10.767 8.66654H3.33366C3.14477 8.66654 2.98633 8.60254 2.85833 8.47454C2.73077 8.34698 2.66699 8.18876 2.66699 7.99987C2.66699 7.81098 2.73077 7.65254 2.85833 7.52454C2.98633 7.39698 3.14477 7.3332 3.33366 7.3332H10.767L8.86699 5.4332C8.73366 5.29987 8.66699 5.14143 8.66699 4.95787C8.66699 4.77476 8.73366 4.61654 8.86699 4.4832C9.00033 4.34987 9.15877 4.2832 9.34233 4.2832C9.52544 4.2832 9.68366 4.34987 9.81699 4.4832L12.867 7.5332C12.9337 7.59987 12.981 7.67209 13.009 7.74987C13.0365 7.82765 13.0503 7.91098 13.0503 7.99987C13.0503 8.08876 13.0365 8.17209 13.009 8.24987C12.981 8.32765 12.9337 8.39987 12.867 8.46654L9.80033 11.5332C9.6781 11.6554 9.52544 11.7165 9.34233 11.7165C9.15877 11.7165 9.00033 11.6499 8.86699 11.5165Z"
                      fill="currentColor"/>
                  </svg>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-5 px-1">
          검색 결과가 없어요.
        </div>
      )}
      <div className="fixed bottom-0 left-1/2 z-20 w-full -translate-x-1/2">
        <Footer/>
      </div>
    </main>
  );
}