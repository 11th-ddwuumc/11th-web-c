import { createFileRoute, redirect } from "@tanstack/react-router";
import { ProtectedLayout } from "@/components/layout/protected-layout";
import { useAuthStore } from "@/stores/auth-store";

// (protected) 폴더 아래 페이지는 로그인한 사용자만 볼 수 있다.
export const Route = createFileRoute("/(protected)")({
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: ProtectedLayout,
});
