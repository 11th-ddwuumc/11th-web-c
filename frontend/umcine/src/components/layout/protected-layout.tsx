import { Navigate, Outlet } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store";

export function ProtectedLayout() {
  // 페이지를 보는 중에 401로 토큰이 지워지면 로그인 화면으로 보낸다.
  const accessToken = useAuthStore((state) => state.accessToken);
  if (!accessToken) return <Navigate to="/login" />;

  return <Outlet />;
}
