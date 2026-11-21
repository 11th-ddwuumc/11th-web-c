import { authApi } from "../auth-api.ts";
import type { MovieRatingResponse } from "./models.ts";

export interface UpdateRatingRequest {
  score: number;
  comment?: string;
}

export async function updateRating(ratingId: number, body: UpdateRatingRequest): Promise<MovieRatingResponse> {
  return await authApi
    .patch(`ratings/${ ratingId }`, { json: body })
    .json<MovieRatingResponse>();
}