import { apiClient } from "../api-client";
import type { RatingResponse } from "../ratings/models.ts";

export async function getRatings(memberId: number) {
  return apiClient.get(`members/${ memberId }/ratings`).json<RatingResponse[]>();
}
