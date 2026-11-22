import { authApi } from "../auth-api.ts";

export interface DeleteRatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: null;
}

export function deleteRating(ratingId: number) {
  return authApi
    .delete(`ratings/${ ratingId }`)
    .json<DeleteRatingResponse>();
}