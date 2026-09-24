import {Link} from "@tanstack/react-router";
import {cn} from "../../utils/cn.ts";

export default function Header() {
  return (
    <header className={cn(
      "flex items-center justify-between",
      "border-b border-(--color-border-default)",
      "px-[80px] py-[24px]",
    )}>
      <div className={cn("flex items-center gap-[42px]")}>
        <a className={cn("flex items-center gap-[10px] text-inherit no-underline")} href="">
          <div className={cn(
            "flex size-[32px] flex-col items-center justify-center",
            "rounded-[8px] border-2 border-(--color-text-primary)",
            "px-0 py-[6px]",
          )}>
            <img src="/icons/movie.svg" alt=""/>
          </div>
          <span className={cn(
            "text-[20px] font-[900] tracking-[-0.7px] align-middle",
          )}>UMCine</span>
        </a>

        <nav className={cn("flex items-center gap-[30px]")}>
          <Link
            to="/"
            className={cn(
              "text-center text-[14px] font-[700] align-middle no-underline",
              "text-(--color-text-primary) underline decoration-solid",
            )}
          >영화</Link>
          <Link
            to="/search"
            className={cn(
              "text-center text-[14px] font-[700] align-middle no-underline",
              "text-(--color-text-secondary)",
            )}
          >검색</Link>
          <Link
            to="/"
            className={cn(
              "text-center text-[14px] font-[700] align-middle no-underline",
              "text-(--color-text-secondary)",
            )}
          >내 정보</Link>
        </nav>
      </div>

      <div className={cn("flex items-center gap-[10px]")}>
        <Link
          to="/search"
          className={cn(
            "flex size-[42px] flex-col items-center justify-center",
            "rounded-[8px] border border-(--color-border-default)",
            "bg-(--color-bg-surface) px-[6px] py-[1px]",
            "cursor-pointer text-(--color-text-secondary)",
          )}
          aria-label="검색"
        >
          <svg width="24" height="24" viewBox="80 80 24 24" aria-hidden="true">
            <path
              d="M95.5 94H94.71L94.43 93.73C95.41 92.59 96 91.11 96 89.5C96 85.91 93.09 83 89.5 83C85.91 83 83 85.91 83 89.5C83 93.09 85.91 96 89.5 96C91.11 96 92.59 95.41 93.73 94.43L94 94.71V95.5L99 100.49L100.49 99L95.5 94ZM89.5 94C87.01 94 85 91.99 85 89.5C85 87.01 87.01 85 89.5 85C91.99 85 94 87.01 94 89.5C94 91.99 91.99 94 89.5 94Z"
              fill="currentColor"/>
          </svg>
        </Link>

        <button
          className={cn(
            "h-[42px] w-[71px] px-[16px] py-0",
            "rounded-[8px] border border-(--color-bg-surface)",
            "bg-(--color-action-primary)",
            "text-center text-[14px] font-[800] align-middle",
            "cursor-pointer text-(--color-bg-surface)",
          )}
          type="button"
        >
          로그인
        </button>
      </div>
    </header>
  );
}
