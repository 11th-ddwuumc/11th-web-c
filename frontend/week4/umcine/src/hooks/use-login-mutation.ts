import { mutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { login } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    ...loginMutationOptions(),
    onSuccess: (response) => {
      queryClient.removeQueries({ queryKey: ["members", "me"] });
      queryClient.removeQueries({ queryKey: ["favorites"] });
      setAccessToken(response.result.accessToken);
      alert("로그인에 성공했어요.");
      void queryClient.invalidateQueries({ queryKey: ["members", "me"] });
      void navigate({ to: "/" });
    },
    onError: () => {
      alert("로그인에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

export function loginMutationOptions() {
  return mutationOptions({
    mutationKey: ["auth", "login"],
    mutationFn: async (body: Parameters<typeof login>[0]) => {
      const response = await login(body);
      if (!response.isSuccess || !response.result?.accessToken) {
        throw new Error(response.message || "로그인에 실패했어요.");
      }
      return response;
    },
  });
}
