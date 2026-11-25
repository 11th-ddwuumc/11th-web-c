import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

export default function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <header className="border-b border-[#e5e7eb] bg-white">
      <div className="mx-auto flex h-[88px] w-[calc(100%-80px)] max-w-[1200px] items-center justify-between">
        <div className="flex items-center gap-9">
          <Link
            to="/"
            className="flex items-center gap-2 text-[20px] font-bold no-underline"
          >
            <img src="/icons/movie.svg" alt="" className="h-7 w-7" />
            <span>UMCine</span>
          </Link>

          <nav className="flex gap-7">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              activeProps={{
                className:
                  "text-[14px] font-semibold text-[#111] underline underline-offset-[5px]",
              }}
              inactiveProps={{
                className: "text-[14px] text-[#4b5563] no-underline",
              }}
            >
              영화
            </Link>

            <Link
              to="/search"
              activeProps={{
                className:
                  "text-[14px] font-semibold text-[#111] underline underline-offset-[5px]",
              }}
              inactiveProps={{
                className: "text-[14px] text-[#4b5563] no-underline",
              }}
            >
              검색
            </Link>

            <Link to="/mypage">내 정보</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/search"
            aria-label="검색"
            className="flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-[#dfe3e8] bg-white"
          >
            <img src="/icons/search.svg" alt="" className="h-5 w-5" />
          </Link>

          {!accessToken ? (
            <Link
              to="/login"
              className="inline-flex h-[42px] items-center justify-center rounded-[6px] bg-[#2563eb] px-[18px] font-semibold text-white no-underline"
            >
              로그인
            </Link>
          ) : meQuery.isLoading ? (
            <span
              aria-label="내 정보 확인 중"
              className="h-10 w-24 animate-pulse rounded-lg bg-gray-200"
            />
          ) : (
            <Link
              to="/mypage"
              className="inline-flex h-[42px] items-center justify-center rounded-[6px] bg-[#2563eb] px-[18px] font-semibold text-white no-underline"
            >
              마이페이지
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
