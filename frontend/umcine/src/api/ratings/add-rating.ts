import { authApi } from "../auth-api.ts";
import type { MovieRatingResponse } from "./models.ts";

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment?: string;
}

export async function addRating(body: CreateRatingRequest): Promise<MovieRatingResponse> {
  return await authApi
    .post(`ratings`, { json: body })
    .json<MovieRatingResponse>();
}