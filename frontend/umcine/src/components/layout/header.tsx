"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../utils/cn.ts";
import { useAuthStore } from "../../stores/auth-store";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me.ts";

export default function Header() {
  const pathname = usePathname();

  const isAuthenticated = useAuthStore((state) => state.session !== null);
  const meQuery = useQuery({
    queryKey: [ "members", "me" ],
    queryFn: getMe,
    enabled: isAuthenticated, // 토큰이 있을 때만 조회
    staleTime: 5 * 60 * 1000, // 5분
    retry: false,
  });

  return (
    <header className={ cn(
      "flex items-center justify-between",
      "border-b border-(--color-border-default)",
      "px-20 py-6",
    ) }>
      <div className={ cn("flex items-center gap-10.5") }>
        <Link className={ cn("flex items-center gap-2.5 text-inherit no-underline") } href="/">
          <div className={ cn(
            "flex size-8 flex-col items-center justify-center",
            "rounded-lg border-2 border-(--color-text-primary)",
            "px-0 py-1.5",
          ) }>
            <img src="/icons/movie.svg" alt=""/>
          </div>
          <span className={ cn(
            "text-[20px] font-black tracking-[-0.7px] align-middle",
          ) }>UMCine</span>
        </Link>

        <nav className={ cn("flex items-center gap-7.5") }>
          {[
            { href: "/", label: "영화" },
            { href: "/search", label: "검색" },
            { href: "/my-info", label: "내 정보" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className={cn(
                "text-center text-[14px] font-bold align-middle",
                pathname === href
                  ? "text-(--color-text-primary) underline decoration-solid"
                  : "text-(--color-text-secondary) no-underline",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className={ cn("flex items-center gap-2.5") }>
        <Link
          href="/search"
          className={ cn(
            "flex size-10.5 flex-col items-center justify-center",
            "rounded-lg border border-(--color-border-default)",
            "bg-(--color-bg-surface) px-1.5 py-px",
            "cursor-pointer text-(--color-text-secondary)",
          ) }
          aria-label="검색"
        >
          <svg width="24" height="24" viewBox="80 80 24 24" aria-hidden="true">
            <path
              d="M95.5 94H94.71L94.43 93.73C95.41 92.59 96 91.11 96 89.5C96 85.91 93.09 83 89.5 83C85.91 83 83 85.91 83 89.5C83 93.09 85.91 96 89.5 96C91.11 96 92.59 95.41 93.73 94.43L94 94.71V95.5L99 100.49L100.49 99L95.5 94ZM89.5 94C87.01 94 85 91.99 85 89.5C85 87.01 87.01 85 89.5 85C91.99 85 94 87.01 94 89.5C94 91.99 91.99 94 89.5 94Z"
              fill="currentColor"/>
          </svg>
        </Link>

        { !isAuthenticated ? (
          <Link
            className={ cn(
              "flex justify-center items-center h-10.5 w-17.75 px-4 py-0",
              "rounded-lg border border-(--color-bg-surface)",
              "bg-(--color-action-primary)",
              "text-center text-[14px] font-extrabold align-middle",
              "cursor-pointer text-(--color-bg-surface)",
            ) }
            href="/login"
          >
            로그인
          </Link>
        ) : meQuery.isLoading ? (
          <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200"/>
        ) : (
          <Link
            className={ cn(
              "flex justify-center items-center h-10.5 px-4 py-0",
              "rounded-lg border border-(--color-bg-surface)",
              "bg-(--color-action-primary)",
              "text-center text-[14px] font-extrabold align-middle",
              "cursor-pointer text-(--color-bg-surface)",
            ) }
            href="/my-info"
          >
            마이페이지
          </Link>
        ) }
      </div>
    </header>
  );
}
