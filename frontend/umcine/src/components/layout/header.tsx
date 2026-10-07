import { Link } from "@tanstack/react-router";

const menuLinkClass = "text-[14px] font-bold text-text-secondary";
const menuLinkActiveClass = "text-text-primary underline";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-border-default bg-bg-surface px-20 py-6">
      <div className="flex items-center gap-10.5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-8 border-2 border-text-primary">
            <img src="/icons/movie.svg" alt="" width={24} height={24} />
          </span>
          <span className="text-[20px] font-black tracking-[-0.7px] text-text-primary">
            UMCine
          </span>
        </div>
        <nav className="flex items-center gap-7.5 text-center" aria-label="주요 메뉴">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className={menuLinkClass}
            activeProps={{ className: menuLinkActiveClass }}
          >
            영화
          </Link>
          <Link to="/search" className={menuLinkClass} activeProps={{ className: menuLinkActiveClass }}>
            검색
          </Link>
          <span className={menuLinkClass}>내 정보</span>
        </nav>
      </div>
      <div className="flex items-center gap-2.5">
        <Link
          to="/search"
          aria-label="영화 검색"
          className="flex size-10.5 items-center justify-center rounded-8 border border-border-default bg-bg-surface"
        >
          <img src="/icons/search.svg" alt="" width={24} height={24} />
        </Link>
        <button
          type="button"
          className="flex h-10.5 items-center justify-center rounded-8 border border-bg-surface bg-action-primary px-4 text-[14px] font-extrabold text-bg-surface"
        >
          로그인
        </button>
      </div>
    </header>
  );
}
