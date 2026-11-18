import { authApi } from "../auth-api.ts";
import type { FavoriteMovieInfo } from "../favorites/models.ts";
import type { RatingResponse } from "../ratings/models.ts";

export interface CreateMovieRecordRequest {
  movieId: number;
  score: number;
  comment?: string;
  addToFavorites: boolean;
}

export interface MovieRecordResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    rating: RatingResponse,
    favorite: FavoriteMovieInfo | null;
  };
}

export function addMovieRecord(body: CreateMovieRecordRequest) {
  return authApi
    .post(`movie-records`, { json: body })
    .json<MovieRecordResponse>();
}