import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import MovieGrid from "@/components/movie-grid";
import Pagination from "@/components/pagination";
import { getMovieDetail } from "@/api/movies/get-movie-detail";
import { useBookmarkStore } from "@/stores/bookmark-store";
import { useProfileStore } from "@/stores/profile-store";
import { getTmdbPosterUrl } from "@/utils/movies/tmdb-image";

// 즐겨찾기는 한 페이지에 5개씩 2줄까지 보여 준다.
const BOOKMARKS_PER_PAGE = 10;

export function MyInfoPage() {
  const profile = useProfileStore((state) => state.profile);
  const bookmarkedMovieIds = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(bookmarkedMovieIds.length / BOOKMARKS_PER_PAGE));
  // 즐겨찾기를 해제해 페이지 수가 줄면 마지막 페이지를 보여 준다.
  const currentPage = Math.min(page, totalPages);
  const pageMovieIds = bookmarkedMovieIds.slice(
    (currentPage - 1) * BOOKMARKS_PER_PAGE,
    currentPage * BOOKMARKS_PER_PAGE,
  );

  // 상세 페이지와 같은 queryKey를 써서 캐시를 함께 쓴다.
  const movieQueries = useQueries({
    queries: pageMovieIds.map((movieId) => ({
      queryKey: ["movies", "detail", movieId],
      queryFn: () => getMovieDetail(movieId),
    })),
  });

  const isPending = movieQueries.some((query) => query.isPending);
  const isError = movieQueries.some((query) => query.isError);
  const movieCards = movieQueries.flatMap((query) =>
    query.data
      ? [
          {
            id: query.data.id,
            title: query.data.title,
            releaseDate: query.data.release_date.replaceAll("-", "."),
            posterPath: getTmdbPosterUrl(query.data.poster_path),
            isBookmarked: true,
          },
        ]
      : [],
  );

  return (
    <main className="flex flex-col gap-7 px-20 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[31px] font-bold tracking-[-1.24px] text-text-primary">내 정보</h1>
        <Link
          to="/my/edit"
          className="flex h-10.5 items-center justify-center rounded-8 border border-bg-surface bg-action-primary px-4 text-[14px] font-extrabold text-bg-surface hover:bg-action-hover"
        >
          정보 수정
        </Link>
      </div>

      <section className="flex flex-col gap-4 border-y border-border-default py-3">
        <h2 className="text-[17px] font-bold text-text-primary">기본 정보</h2>
        <div className="flex items-center gap-7">
          <span className="flex size-[82px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-border-default">
            {profile.profileImageUrl ? (
              <img src={profile.profileImageUrl} alt="프로필 이미지" className="size-full object-cover" />
            ) : (
              <img src="/icons/person-avatar.svg" alt="" width={48} height={48} />
            )}
          </span>
          <dl className="flex w-[760px] gap-7">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <dt className="text-[11px] text-text-tertiary">닉네임</dt>
              <dd className="text-[14px] font-bold text-text-primary">{profile.nickname}</dd>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <dt className="text-[11px] text-text-tertiary">이메일</dt>
              <dd className="text-[14px] font-bold text-text-primary">{profile.email}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-[17px] font-bold text-text-primary">내 즐겨찾기</h2>
        {bookmarkedMovieIds.length === 0 ? (
          <p className="py-16 text-center text-text-secondary">즐겨찾기한 영화가 없어요.</p>
        ) : isPending && movieCards.length === 0 ? (
          <p className="py-16 text-center text-text-secondary">즐겨찾기를 불러오는 중이에요.</p>
        ) : (
          <>
            {isError && (
              <p className="text-[13px] text-danger-default">일부 영화를 불러오지 못했어요.</p>
            )}
            <MovieGrid movies={movieCards} onToggleBookmark={toggleBookmark} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </section>
    </main>
  );
}
