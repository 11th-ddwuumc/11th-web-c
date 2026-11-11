import {apiClient} from "../api-client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    memberId: number;
    email: string;
    nickname: string;
  };
}

export function login(body: LoginRequest) {
  return apiClient.post("members", {json: body}).json<LoginResponse>();
}