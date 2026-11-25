import { authApi } from "../auth-api";
import type { Rating, RatingResponse } from "./models";

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment?: string;
}

// POST /ratings
export function createRating(body: CreateRatingRequest) {
  return authApi.post("ratings", { json: body }).json<RatingResponse<Rating>>();
}
