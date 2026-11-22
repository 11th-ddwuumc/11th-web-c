"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export function AuthGuard({
  children,
  guestOnly = false,
}: {
  children: ReactNode;
  guestOnly?: boolean;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.session !== null);
  const shouldRedirect = guestOnly ? isAuthenticated : !isAuthenticated;

  useEffect(() => {
    if (shouldRedirect) {
      router.replace(guestOnly ? "/" : "/login");
    }
  }, [shouldRedirect, guestOnly, router]);

  if (shouldRedirect) {
    return (
      <main className="flex flex-1 items-center justify-center bg-(--color-bg-page)">
        <p role="status">로그인 상태를 확인하고 있어요.</p>
      </main>
    );
  }

  return children;
}
