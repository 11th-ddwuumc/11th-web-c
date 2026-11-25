import { authApi } from "../auth-api";
import type { ApiResponse, Favorite } from "./models";

// POST /favorites
export function addFavorite(movieId: number) {
  return authApi.post("favorites", { json: { movieId } }).json<ApiResponse<Favorite>>();
}
