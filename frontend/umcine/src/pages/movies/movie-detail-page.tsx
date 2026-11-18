import { Link, useParams } from "@tanstack/react-router";
import Footer from "../../components/movies/footer.tsx";
import { cn } from "../../utils/cn.ts";
import { useState } from "react";
import { BookmarkButton } from "../../components/bookmark-button.tsx";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image.ts";
import { getMovieDetail } from "../../api/movies/get-movie-detail.ts";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message.ts";
import { getFavorite } from "../../api/favorites/get-favorite.ts";
import { useAuthStore } from "../../stores/auth-store.ts";
import { getMe } from "../../api/members/me.ts";
import { useFavoriteMutation } from "../../hooks/use-favorite-mutation.ts";
import { getRatings } from "../../api/members/get-ratings.ts";
import { getMemberId } from "../../utils/get-member-id.ts";
import { useMovieRecordMutation } from "../../hooks/use-movie-record-mutation.ts";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const accessToken = useAuthStore((state) => state.accessToken);

  return <MovieDetailContent key={`${movieId}:${accessToken ?? "guest"}`} />;
}

function MovieDetailContent() {
  const [ ratingDraft, setRating ] = useState<number | null>(null);
  const [ commentDraft, setComment ] = useState<string | null>(null);

  const movieRecordMutation = useMovieRecordMutation();

  const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: [ "movies", "detail", movieId ],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
    staleTime: 30 * 1000,
  });

  const accessToken = useAuthStore((state) => state.accessToken);

  const meQuery = useQuery({
    queryKey: [ "members", "me" ],
    queryFn: getMe,
    enabled: Boolean(accessToken),
  });

  const memberEmail = meQuery.data?.email;
  const memberId = getMemberId(accessToken);

  const ratingsQuery = useQuery({
    queryKey: [ "ratings", "member", memberEmail, "list", memberId ],
    queryFn: () => {
      if (memberId === null) {
        throw new Error("회원 정보를 확인할 수 없어요.");
      }
      return getRatings(memberId);
    },
    enabled: Boolean(accessToken) && Boolean(memberEmail) && memberId !== null,
  });

  const savedRating = ratingsQuery.data?.find((item) => item.movieId === movieId) ?? null;
  const rating = ratingDraft ?? savedRating?.score ?? 0;
  const comment = commentDraft ?? savedRating?.comment ?? "";
  const recordDisabled = movieRecordMutation.isPending || (
    Boolean(accessToken) && (
      !memberEmail || memberId === null || !ratingsQuery.isSuccess || ratingsQuery.isFetching
    )
  );

  const favoriteQuery = useQuery({
    queryKey: [ "favorites", "member", memberEmail, "movie", movieId ],
    queryFn: () => getFavorite(movieId),
    enabled:
      Boolean(accessToken) &&
      memberEmail !== undefined &&
      isValidMovieId,
    staleTime: 30 * 1000,
  });

  const favoriteMutation = useFavoriteMutation();

  const handleToggleFavorite = () => {
    if (!accessToken) {
      alert("로그인이 필요해요.");
      return;
    }

    if (!memberEmail ||
      !isValidMovieId ||
      !favoriteQuery.isSuccess ||
      favoriteQuery.isFetching ||
      favoriteMutation.isPending
    ) {
      return;
    }

    favoriteMutation.mutate({
      movieId,
      memberEmail,
      wasFavorite: favoriteQuery.data.result.isFavorite,
    });
  };

  const statusMessage = !isValidMovieId
    ? "올바르지 않은 영화 번호예요."
    : movieDetailQuery.isPending
      ? "영화 정보를 불러오는 중이에요."
      : movieDetailQuery.isError ?
        getMovieDetailErrorMessage(movieDetailQuery.error) : null;

  const movie = movieDetailQuery.data;

  const handleSaveRecord = () => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!memberEmail || !isValidMovieId || recordDisabled) {
      return;
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      alert("별점을 선택해 주세요.");
      return;
    }

    const trimmedComment = comment.trim();

    if (savedRating && trimmedComment.length > 500) {
      alert("수정할 후기는 500자 이하로 입력해 주세요.");
      return;
    }

    const body = {
      score: rating,
      ...(trimmedComment ? { comment: trimmedComment } : {}),
    };

    movieRecordMutation.mutate(
      savedRating ? {
        action: "update-rating",
        memberEmail,
        ratingId: savedRating.ratingId,
        body,
      } : {
        action: "create-record",
        memberEmail,
        body: {
          movieId,
          score: rating,
          ...(trimmedComment ? { comment: trimmedComment } : {}),
          addToFavorites: false,
        },
      },
      {
        onSuccess: (result) => {
          setRating(result.rating?.score ?? 0);
          setComment(result.rating?.comment ?? "");
          alert(savedRating ? "평점을 수정했어요." : "영화 기록을 저장했어요.");
        },
      },
    );
  };

  const handleDeleteRating = () => {
    if (!accessToken || !memberEmail || !savedRating || recordDisabled) {
      return;
    }

    movieRecordMutation.mutate({
      action: "delete-rating",
      memberEmail,
      ratingId: savedRating.ratingId,
    }, {
      onSuccess: () => {
        setRating(null);
        setComment(null);
        alert("평점을 삭제했어요.");
      },
    });
  };

  if (statusMessage !== null || !movie) {
    return (
      <main className="flex min-h-[calc(100vh-90px)] items-center justify-center bg-(--color-bg-page)">
        <p
          role="status"
          className="m-0 text-[28px] font-bold text-(--color-text-primary)"
        >
          { statusMessage ?? "영화 정보를 불러오는 중이에요." }
        </p>
      </main>
    );
  }

  const genresText = movie.genres
    .map((genre) => genre.name)
    .join(", ");

  const runtimeText =
    typeof movie.runtime === "number"
      ? `${ Math.floor(movie.runtime / 60) }시간 ${ movie.runtime % 60 }분`
      : "상영 시간 정보가 없어요.";

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  return (
    <div className="flex min-h-[calc(100vh-90px)] w-full flex-col bg-(--color-bg-page) pb-59.5">

      {/* detail-stage */ }
      <section className="relative w-full h-90 overflow-hidden text-(--color-bg-surface)">
        {/* 배경 이미지 */ }
        <img
          src={ backdropUrl }
          alt=""
          className="absolute inset-0 z-0 h-full w-full object-cover object-center"
        />

        {/* Frame 2 */ }
        <div className={ "relative z-10 flex h-full w-full flex-col justify-between px-20 py-6" }>
          {/* button.back-link */ }
          <Link
            to="/"
            className="flex items-center w-fit h-fit gap-1 cursor-pointer"
          >
            <svg width="24" height="24" viewBox="32 128 24 24" fill="none">
              <path d="M47.41 144.59L42.83 140L47.41 135.41L46 134L40 140L46 146L47.41 144.59Z"
                    fill="currentColor"/>
            </svg>
            <span className="text-[13px] font-bold">
                영화 목록
              </span>
          </Link>

          {/* div.detail-copy */ }
          <div className="flex flex-col w-200 gap-2">
            {/* Title */ }
            <h1 className="m-0 text-[46px] leading-[49.68px] font-bold tracking-[-0.023em]">
              { movie?.title }
            </h1>

            {/* Original title */ }
            <div className="w-full text-[14px] font-normal">
              { movie?.original_title }
            </div>

            {/* detail-meta */ }
            <div className="flex w-full gap-2 text-[13px] font-bold">
              <span>{ movie?.release_date }</span>
              <span>{ genresText }</span>
              <span>{ runtimeText }</span>
            </div>
          </div>
        </div>
      </section>

      {/* main.container */ }
      <main className="flex flex-row w-full px-20 py-6 gap-8">

        {/* poster */ }
        <div className={ cn(
          "h-71.5 w-50 shrink-0 overflow-hidden rounded-[10px]",
          "shadow-[0px_12px_30px_0px_#0C0F141F]",
        ) }>
          <img
            src={ posterUrl }
            alt=""
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* section.synopsis */ }
        <section className="flex flex-col w-full gap-3">
          <h2 className={ cn(
            "m-0 w-full text-(--color-text-primary)",
            "text-[21px] font-bold tracking-[-0.63px] leading-[100%]",
          ) }>
            { movie?.tagline }
          </h2>
          <p className={ cn(
            "w-full m-0 text-(--color-text-secondary)",
            "text-[14px] font-normal leading-6",
          ) }>
            { movie?.overview }
          </p>

          {/* bookmark button */ }
          <BookmarkButton
            variant="detail"
            isBookmarked={
              Boolean(accessToken) &&
              favoriteQuery.data?.result.isFavorite === true
            }
            disabled={
              Boolean(accessToken) && (
                !memberEmail ||
                !favoriteQuery.isSuccess ||
                favoriteQuery.isFetching ||
                favoriteMutation.isPending
              )
            }
            onClick={ handleToggleFavorite }
          />
        </section>

        {/* aside.rating-panel */ }
        <aside className={ cn(
          "w-90 h-fit shrink-0 border-l border-(--color-border-default)",
          "flex flex-col pb-10.25 pl-7.5 gap-2",
        ) }>
          <h2 className={ cn(
            "m-0 w-full text-(--color-text-primary) font-bold",
            "text-[21px] tracking-[-0.63px] leading-[100%]",
          ) }>
            내 평점
          </h2>
          <p className={ cn(
            "w-full m-0 leading-[100%]",
            "text-(--color-text-tertiary) font-normal text-[12px]",
          ) }>
            별점은 필수, 후기는 선택이에요.
          </p>

          {accessToken && (
            memberId === null ? (
              <p role="alert">회원 정보를 확인할 수 없어요. 다시 로그인해 주세요.</p>
            ) : meQuery.isError || ratingsQuery.isError ? (
              <div>
                <p role="alert">평점 정보를 불러오지 못했어요.</p>
                <button
                  type="button"
                  disabled={meQuery.isFetching || ratingsQuery.isFetching}
                  onClick={() => {
                    if (meQuery.isError) {
                      void meQuery.refetch();
                    } else {
                      void ratingsQuery.refetch();
                    }
                  }}
                >
                  다시 시도
                </button>
              </div>
            ) : !ratingsQuery.isSuccess ? (
              <p role="status">평점을 불러오는 중이에요.</p>
            ) : null
          )}

          {/* 별점 버튼 */ }
          <div className="flex w-full gap-1">
            { Array.from({ length: 5 }, (_, index) => {
              const score = index + 1;
              const isSelected = score <= rating;

              return (
                <button
                  key={ score }
                  type="button"
                  aria-label={ `${ score }점` }
                  aria-pressed={ rating === score }
                  onClick={ () => setRating(score) }
                  disabled={ recordDisabled }
                  className={ cn(
                    "flex size-9.5 items-center justify-center rounded-lg",
                    "border border-(--color-border-default)",
                    "bg-(--color-bg-surface)",
                    "cursor-pointer",
                    isSelected
                      ? "text-yellow-400"
                      : "text-(--color-text-secondary)",
                  ) }
                >
                  <svg aria-hidden="true" width="24" height="24" viewBox="176 32 24 24" fill="none">
                    <path
                      d="M188 49.27L194.18 53L192.54 45.97L198 41.24L190.81 40.63L188 34L185.19 40.63L178 41.24L183.46 45.97L181.82 53L188 49.27Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              );
            }) }
          </div>

          <textarea
            value={ comment }
            onChange={ (event) => setComment(event.target.value) }
            disabled={ recordDisabled }
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className={ cn(
              "h-25.5 w-full resize-none rounded-lg px-3 py-4",
              "border border-(--color-border-default)",
              "bg-(--color-bg-surface)",
              "text-[13px] font-normal leading-[19.5px]",
              "placeholder:text-(--color-text-tertiary)",
            ) }/>

          <button
            className={ cn(
              "flex items-center justify-center w-full h-10.5 px-4 ",
              "rounded-lg bg-(--color-text-primary)",
              "text-(--color-bg-surface) text-[14px] font-extrabold",
              "cursor-pointer",
            ) }
            type="button"
            onClick={ handleSaveRecord }
            disabled={ rating === 0 || recordDisabled }
          >
            { movieRecordMutation.isPending ? "처리 중..." : savedRating ? "평점 수정" : "평점 저장" }
          </button>

          {savedRating && (
            <button
              type="button"
              onClick={handleDeleteRating}
              disabled={recordDisabled}
              className="h-10.5 rounded-lg border border-(--color-border-default) text-(--color-text-primary) disabled:opacity-50"
            >
              평점 삭제
            </button>
          )}

        </aside>

      </main>

      <div className="fixed bottom-0 left-1/2 z-20 w-full -translate-x-1/2">
        <Footer/>
      </div>
    </div>
  );
}
