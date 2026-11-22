import { authApi } from "../auth-api.ts";
import type { FavoriteMovieInfo } from "./models.ts";

export interface FavoritesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FavoriteMovieInfo[];
}

export async function getFavorites(): Promise<FavoriteMovieInfo[]> {
  const response = await authApi.get("favorites").json<FavoritesResponse>();
  return response.result;
}