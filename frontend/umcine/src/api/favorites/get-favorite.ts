import { authApi } from "../auth-api.ts";

export interface FavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    isFavorite: boolean;
  };
}

export async function getFavorite(movieId: number): Promise<FavoriteResponse> {
  return await authApi.get(`favorites/${ movieId }`).json<FavoriteResponse>();
}