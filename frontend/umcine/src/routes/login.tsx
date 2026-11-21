import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "../pages/auth/login-page.tsx";
import { useAuthStore } from "../stores/auth-store.ts";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (useAuthStore.getState().accessToken) { // 이미 로그인한 사용자가 주소 접근할 경우 
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});