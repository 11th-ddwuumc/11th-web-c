import { HTTPError } from "ky";
import { authApi } from "./auth-api";

export interface Favorite {
  movieId: number;
  title?: string;
  posterPath?: string | null;
}

type Envelope<T> = { result: T };

export async function getFavorites(): Promise<Favorite[]> {
  const response = await authApi.get("favorites").json<Envelope<Favorite[] | { favorites?: Favorite[]; content?: Favorite[] }>>();
  const result = response.result;
  const favorites = Array.isArray(result) ? result : result.favorites ?? result.content;
  if (!favorites) throw new Error("즐겨찾기 응답 형식을 확인해 주세요.");
  return favorites;
}

export async function getFavorite(movieId: number): Promise<boolean> {
  try {
    const response = await authApi.get(`favorites/${movieId}`).json<Envelope<boolean | { isFavorite?: boolean; favorite?: boolean } | null>>();
    if (response.result === null) return false;
    if (typeof response.result === "boolean") return response.result;
    return response.result.isFavorite ?? response.result.favorite ?? true;
  } catch (error) {
    if (error instanceof HTTPError && error.response.status === 404) return false;
    throw error;
  }
}

export async function addFavorite(movieId: number): Promise<void> {
  await authApi.post("favorites", { json: { movieId } });
}

export async function deleteFavorite(movieId: number): Promise<void> {
  await authApi.delete(`favorites/${movieId}`);
}
