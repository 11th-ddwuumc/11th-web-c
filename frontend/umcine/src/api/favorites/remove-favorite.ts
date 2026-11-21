import { authApi } from "../auth-api.ts";

export interface RemoveFavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: null;
}

export function removeFavorite(movieId: number) {
  return authApi.delete(`favorites/${ movieId }`).json<RemoveFavoriteResponse>();
}