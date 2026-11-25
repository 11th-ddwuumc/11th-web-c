import { authApi } from "../auth-api";
import type { Rating, RatingResponse } from "./models";

export interface UpdateRatingRequest {
  ratingId: number;
  score: number;
  // 빼고 보내면 기존 후기가 null로 덮인다(전체 교체).
  comment?: string;
}

// PATCH /ratings/{ratingId}
export function updateRating({ ratingId, ...body }: UpdateRatingRequest) {
  return authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<RatingResponse<Rating>>();
}
