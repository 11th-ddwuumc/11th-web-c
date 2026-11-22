import { authApi } from "../auth-api";
import type { RatingResponse } from "../ratings/models.ts";

export async function getRatings(memberId: number) {
  return authApi.get(`members/${ memberId }/ratings`).json<RatingResponse[]>();
}