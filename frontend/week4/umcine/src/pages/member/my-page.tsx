import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";
import { getFavorites } from "../../api/favorites";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import "../../styles/auth.css";

export function MyPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
    retry: false,
  });

  if (!accessToken) {
    return (
      <main className="w7-page">
        <section className="w7-card">
          <h1>내 정보</h1>
          <p>내 정보를 보려면 로그인해 주세요.</p>
          <Link to="/login">로그인</Link>
        </section>
      </main>
    );
  }

  if (meQuery.isLoading) {
    return (
      <main className="w7-page">
        <section className="w7-card">
          <p>내 정보를 불러오는 중이에요.</p>
        </section>
      </main>
    );
  }

  if (meQuery.isError || !meQuery.data) {
    return (
      <main className="w7-page">
        <section className="w7-card">
          <h1>내 정보</h1>
          <p role="alert">내 정보를 불러오지 못했어요.</p>
          <button type="button" onClick={() => void meQuery.refetch()}>
            다시 시도
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="w7-page">
      <section className="w7-card">
        <h1>내 정보</h1>

        <dl className="w7-profile">
          <dt>이메일</dt>
          <dd>{meQuery.data.email}</dd>

          <dt>닉네임</dt>
          <dd>{meQuery.data.nickname}</dd>
        </dl>

        <h2>즐겨찾기</h2>
        {favoritesQuery.isPending ? (
          <p>즐겨찾기를 불러오는 중이에요.</p>
        ) : favoritesQuery.isError ? (
          <p role="alert">즐겨찾기를 불러오지 못했어요. <button type="button" onClick={() => void favoritesQuery.refetch()}>다시 시도</button></p>
        ) : favoritesQuery.data.length === 0 ? (
          <p>즐겨찾기한 영화가 없어요.</p>
        ) : (
          <ul>
            {favoritesQuery.data.map((favorite) => (
              <li key={favorite.movieId}>
                <Link to="/movies/$movieId" params={{ movieId: String(favorite.movieId) }}>
                  {favorite.posterPath && <img width={64} src={getTmdbPosterUrl(favorite.posterPath) ?? undefined} alt="" />}
                  {favorite.title || `영화 ${favorite.movieId}`}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <nav className="w7-links">
          <Link to="/mypage/edit">정보 수정</Link>
          <Link to="/">영화 목록</Link>
        </nav>
      </section>
    </main>
  );
}
