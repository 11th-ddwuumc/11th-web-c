import { authApi } from "../auth-api";
import type { ApiResponse, Favorite } from "./models";

// GET /favorites: 내 즐겨찾기 목록 (favoriteId 내림차순)
export async function getFavorites(): Promise<Favorite[]> {
  const response = await authApi.get("favorites").json<ApiResponse<Favorite[]>>();
  return response.result;
}
