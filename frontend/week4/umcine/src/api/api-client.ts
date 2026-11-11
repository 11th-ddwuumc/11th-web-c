import ky from "ky";
import { env } from "../config/env";
// 기존 영화 API 클라이언트와 분리합니다.

export const apiClient = ky.create({ baseUrl: env.apiBaseUrl });

export function memberApiUrl(path: string) {
  const base = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!base) throw new Error(".env.local에 VITE_API_BASE_URL을 설정해 주세요.");
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}
