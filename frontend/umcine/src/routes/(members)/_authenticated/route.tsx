import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../../stores/auth-store.ts";

export const Route = createFileRoute("/(members)/_authenticated")({
  beforeLoad: () => {
    const { accessToken } = useAuthStore.getState();

    if (!accessToken) { // 토큰 없는 경우 로그인 페이지로 이동 
      throw redirect({ to: "/login", replace: true });
    }
  },
  component: () => <Outlet />,
});
