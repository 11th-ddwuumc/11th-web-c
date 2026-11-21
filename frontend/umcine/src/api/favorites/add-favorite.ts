import { authApi } from "../auth-api.ts";
import type { FavoriteMovieInfo } from "./models.ts";

export interface AddFavoriteRequest {
  movieId: number;
}

export interface AddFavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FavoriteMovieInfo;
}

export function addFavorite(body: AddFavoriteRequest) {
  return authApi
    .post(`favorites`, { json: body })
    .json<AddFavoriteResponse>();
}