import { mutationOptions, useMutation } from "@tanstack/react-query";
import { signup } from "../api/members/signup";

export function useSignupMutation() {
  return useMutation(signupMutationOptions());
}

export function signupMutationOptions() {
  return mutationOptions({
    mutationKey: ["members", "signup"],
    mutationFn: async (body: Parameters<typeof signup>[0]) => {
      const response = await signup(body);
      if (!response.isSuccess) throw new Error(response.message || "회원가입에 실패했어요.");
      return response;
    },
  });
}
