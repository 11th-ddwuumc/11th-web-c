import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="border-b border-[#e5e7eb] bg-white">
      <div className="mx-auto flex h-[88px] w-[calc(100%-80px)] max-w-[1200px] items-center justify-between">
        <div className="flex items-center gap-9">
          <Link
            to="/"
            className="flex items-center gap-2 text-[20px] font-bold no-underline"
          >
            <img
              src="/icons/movie.svg"
              alt=""
              className="h-7 w-7"
            />
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
                className:
                  "text-[14px] text-[#4b5563] no-underline",
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
                className:
                  "text-[14px] text-[#4b5563] no-underline",
              }}
            >
              검색
            </Link>

            <a
              href="#"
              className="text-[14px] text-[#4b5563] no-underline"
            >
              내 정보
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/search"
            aria-label="검색"
            className="flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-[#dfe3e8] bg-white"
          >
            <img
              src="/icons/search.svg"
              alt=""
              className="h-5 w-5"
            />
          </Link>

          <button
            type="button"
            className="h-[42px] rounded-[6px] border-0 bg-[#2563eb] px-[18px] font-semibold text-white"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}