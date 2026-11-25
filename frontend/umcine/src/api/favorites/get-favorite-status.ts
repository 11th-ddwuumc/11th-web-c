import { authApi } from "../auth-api";
import type { ApiResponse, FavoriteStatus } from "./models";

// GET /favorites/{movieId}: 이 영화가 내 즐겨찾기인지
export async function getFavoriteStatus(movieId: number): Promise<FavoriteStatus> {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<ApiResponse<FavoriteStatus>>();
  return response.result;
}
