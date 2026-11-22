import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/auth-store";
import { login } from "../api/auth/login";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      queryClient.clear();
      queryClient.setQueryData(["members", "me"], response.result.member);
      setSession(response.result);
      alert("로그인에 성공했어요.");
      router.replace("/");
      router.refresh();
    },
    onError: () => { alert("로그인에 실패했어요. 다시 시도해 주세요."); },
  });
}
