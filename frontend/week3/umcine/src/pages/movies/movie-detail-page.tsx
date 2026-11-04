import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({
    from: "/movies/$movieId",
  });

  const movie = movies.find(
    (item) => item.id === Number(movieId),
  );

  if (!movie) {
    return (
      <main className="mx-auto w-[calc(100%-80px)] max-w-[1200px] py-12">
        <p className="text-[16px] text-[#6b7280]">
          영화를 찾을 수 없어요.
        </p>
      </main>
    );
  }

  return (
    <main className="pb-[100px]">
      <div className="relative h-[360px] w-full overflow-hidden">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="mx-auto w-[calc(100%-80px)] max-w-[1200px]">
        <div className="mt-6">
          <Link
            to="/"
            className="text-[14px] font-medium text-[#4b5563] underline-offset-4 hover:underline"
          >
            ← 영화 목록
          </Link>
        </div>

        <section className="mt-8 flex gap-10">
          <div className="shrink-0">
            <img
              src={movie.posterPath}
              alt={`${movie.title} 포스터`}
              className="w-[260px] rounded-xl object-cover"
            />
          </div>

          <div className="min-w-0 flex-1 text-left">
            <h1 className="m-0 text-[36px] font-bold">
              {movie.title}
            </h1>

            <p className="mt-2 text-[16px] text-[#6b7280]">
              {movie.originalTitle}
            </p>

            <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-[14px] text-[#6b7280]">
              <span>{movie.releaseDate}</span>
              <span>·</span>
              <span>{movie.genres.join(" · ")}</span>
              <span>·</span>
              <span>{movie.runtime}</span>
            </div>

            <h2 className="mt-8 mb-3 text-[22px] font-semibold">
              {movie.tagline}
            </h2>

            <p className="max-w-[720px] text-[15px] leading-7 text-[#4b5563]">
              {movie.overview}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}