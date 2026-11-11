import { apiClient, memberApiUrl } from "../api-client";

export interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}

export interface SignupResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result?: { memberId: number; email: string; nickname: string } | null;
}

export function signup(body: SignupRequest) {
  return apiClient
    .post(memberApiUrl("members"), { json: body })
    .json<SignupResponse>();
}
