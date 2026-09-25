import {Link, useParams} from "@tanstack/react-router";
import {movies} from "../../data/movies";
import Footer from "../../components/movies/footer.tsx";
import {cn} from "../../utils/cn.ts";
import {useState} from "react";

export function MovieDetailPage() {
  const {movieId} = useParams({from: "/movies/$movieId"});
  const movie = movies.find((item) => item.id === Number(movieId));
  const [isBookmarked, setIsBookmarked] = useState(movie?.isBookmarked ?? false);
  const [rating, setRating] = useState(0);

  if (!movie) {
    return (
      <main className="flex min-h-[calc(100vh-90px)] items-center justify-center bg-(--color-bg-page)">
        <p className="m-0 text-[28px] font-bold text-(--color-text-primary)">
          영화를 찾을 수 없어요.
        </p>
      </main>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-90px)] w-full flex-col bg-(--color-bg-page) pb-59.5">

      {/* detail-stage */}
      <section className="relative w-full h-90 overflow-hidden text-(--color-bg-surface)">
        {/* 배경 이미지 */}
        <img
          src={movie.backdropPath}
          alt=""
          className="absolute inset-0 z-0 h-full w-full object-cover object-center"
        />

        {/* Frame 2 */}
        <div className={"relative z-10 flex h-full w-full flex-col justify-between px-20 py-6"}>
          {/* button.back-link */}
          <Link to="/">
            <button
              type="button"
              className="flex items-center w-fit h-fit gap-1 cursor-pointer"
            >
              <svg width="24" height="24" viewBox="32 128 24 24" fill="none">
                <path d="M47.41 144.59L42.83 140L47.41 135.41L46 134L40 140L46 146L47.41 144.59Z"
                      fill="currentColor"/>
              </svg>
              <span className="text-[13px] font-bold">
                영화 목록
              </span>
            </button>
          </Link>

          {/* div.detail-copy */}
          <div className="flex flex-col w-200 gap-2">
            {/* Title */}
            <h1 className="m-0 text-[46px] leading-[49.68px] font-bold tracking-[-0.023em]">
              {movie.title}
            </h1>

            {/* Original title */}
            <div className="w-full text-[14px] font-normal">
              {movie.originalTitle}
            </div>

            {/* detail-meta */}
            <div className="flex w-full gap-2 text-[13px] font-bold">
              <span>{movie.releaseDate}</span>
              <span>{movie.genres.join(" · ")}</span>
              <span>{movie.runtime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* main.container */}
      <main className="flex flex-row w-full px-20 py-6 gap-8">

        {/* poster */}
        <div className={cn(
          "h-71.5 w-50 shrink-0 overflow-hidden rounded-[10px]",
          "shadow-[0px_12px_30px_0px_#0C0F141F]",
        )}>
          <img
            src={movie.posterPath}
            alt=""
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* section.synopsis */}
        <section className="flex flex-col w-full gap-3">
          <h2 className={cn(
            "m-0 w-full text-(--color-text-primary)",
            "text-[21px] font-bold tracking-[-0.63px] leading-[100%]"
          )}>
            {movie.tagline}
          </h2>
          <p className={cn(
            "w-full m-0 text-(--color-text-secondary)",
            "text-[14px] font-normal leading-6"
          )}>
            {movie.overview}
          </p>

          {/* bookmark button */}
          <button
            type="button"
            aria-pressed={isBookmarked}
            onClick={() => setIsBookmarked((current) => !current)}
            className={cn(
              "flex px-4 gap-2 w-fit h-10.5 items-center cursor-pointer",
              "rounded-lg bg-(--color-action-primary) text-(--color-bg-surface)"
            )}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M11.333 2C11.6866 2 12.0258 2.14048 12.2758 2.39052C12.5259 2.64057 12.6663 2.97971 12.6663 3.33333V13.3333C12.6663 13.4501 12.6356 13.5648 12.5773 13.6659C12.519 13.7671 12.4352 13.8512 12.3342 13.9098C12.2333 13.9683 12.1187 13.9994 12.0019 13.9998C11.8852 14.0002 11.7704 13.9699 11.669 13.912L8.66101 12.1933C8.45959 12.0783 8.23164 12.0178 7.99967 12.0178C7.76771 12.0178 7.53976 12.0783 7.33834 12.1933L4.33034 13.912C4.22897 13.9699 4.11417 14.0002 3.99742 13.9998C3.88068 13.9994 3.76608 13.9683 3.6651 13.9098C3.56412 13.8512 3.4803 13.7671 3.42202 13.6659C3.36374 13.5648 3.33305 13.4501 3.33301 13.3333V3.33333C3.33301 2.97971 3.47348 2.64057 3.72353 2.39052C3.97358 2.14048 4.31272 2 4.66634 2H11.333Z"
                fill={isBookmarked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[14px] font-extrabold">
              즐겨찾기
            </span>
          </button>
        </section>

        {/* aside.rating-panel */}
        <aside className={cn(
          "w-90 h-fit shrink-0 border-l border-(--color-border-default)",
          "flex flex-col pb-10.25 pl-7.5 gap-2"
        )}>
          <h2 className={cn(
            "m-0 w-full text-(--color-text-primary) font-bold",
            "text-[21px] tracking-[-0.63px] leading-[100%]"
          )}>
            내 평점
          </h2>
          <p className={cn(
            "w-full m-0 leading-[100%]",
            "text-(--color-text-tertiary) font-normal text-[12px]"
          )}>
            별점은 필수, 후기는 선택이에요.
          </p>

          {/* 별점 버튼 */}
          <div className="flex w-full gap-1">
            {Array.from({length: 5}, (_, index) => {
              const score = index + 1;
              const isSelected = score <= rating;

              return (
                <button
                  key={score}
                  type="button"
                  aria-label={`${score}점`}
                  aria-pressed={rating === score}
                  onClick={() => setRating(score)}
                  className={cn(
                    "flex size-9.5 items-center justify-center rounded-lg",
                    "border border-(--color-border-default)",
                    "bg-(--color-bg-surface)",
                    "cursor-pointer",
                    isSelected
                      ? "text-yellow-400"
                      : "text-(--color-text-secondary)",
                  )}
                >
                  <svg aria-hidden="true" width="24" height="24" viewBox="176 32 24 24" fill="none">
                    <path
                      d="M188 49.27L194.18 53L192.54 45.97L198 41.24L190.81 40.63L188 34L185.19 40.63L178 41.24L183.46 45.97L181.82 53L188 49.27Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              );
            })}
          </div>

          <textarea
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className={cn(
              "h-25.5 w-full resize-none rounded-lg px-3 py-4",
              "border border-(--color-border-default)",
              "bg-(--color-bg-surface)",
              "text-[13px] font-normal leading-[19.5px]",
              "placeholder:text-(--color-text-tertiary)",
            )}/>

          <button className={cn(
            "flex items-center justify-center w-full h-10.5 px-4 ",
            "rounded-lg bg-(--color-text-primary)",
            "text-(--color-bg-surface) text-[14px] font-extrabold",
            "cursor-pointer"
          )}>
            평점 저장
          </button>

        </aside>

      </main>

      <div className="fixed bottom-0 left-1/2 z-20 w-full -translate-x-1/2">
        <Footer/>
      </div>
    </div>
  );
}
