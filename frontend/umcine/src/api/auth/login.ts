import ky from "ky";
import type { Session } from "@/types/session";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Session;
}

export function login(body: LoginRequest) {
  return ky.post("/api/auth/login", { json: body }).json<LoginResponse>();
}