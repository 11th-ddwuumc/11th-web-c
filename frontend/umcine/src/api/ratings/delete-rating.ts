import { authApi } from "../auth-api";
import type { RatingResponse } from "./models";

// DELETE /ratings/{ratingId}: 성공 시 200, result는 null
export function deleteRating(ratingId: number) {
  return authApi.delete(`ratings/${ratingId}`).json<RatingResponse<null>>();
}
