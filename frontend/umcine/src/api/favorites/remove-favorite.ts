import { authApi } from "../auth-api";
import type { ApiResponse } from "./models";

// DELETE /favorites/{movieId}: favoriteId가 아니라 movieId로 지정한다.
export function removeFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json<ApiResponse<null>>();
}
