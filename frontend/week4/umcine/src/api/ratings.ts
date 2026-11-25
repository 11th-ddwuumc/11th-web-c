import { authApi } from "./auth-api";

export interface Rating {
  ratingId: number;
  memberId: number;
  movieId: number;
  score: number;
}

type Envelope<T> = { result: T };

export async function getMemberRatings(memberId: number): Promise<Rating[]> {
  const response = await authApi.get(`members/${memberId}/ratings`).json<Envelope<Rating[] | { ratings?: Rating[]; content?: Rating[] }>>();
  const result = response.result;
  const ratings = Array.isArray(result) ? result : result.ratings ?? result.content;
  if (!ratings) throw new Error("평점 응답 형식을 확인해 주세요.");
  return ratings;
}

export interface CreateRatingRequest { movieId: number; score: number }
export interface UpdateRatingRequest { ratingId: number; score: number }

export async function createRating(body: CreateRatingRequest): Promise<void> {
  await authApi.post("ratings", { json: body });
}

export async function updateRating({ ratingId, score }: UpdateRatingRequest): Promise<void> {
  await authApi.patch(`ratings/${ratingId}`, { json: { score } });
}

export async function deleteRating(ratingId: number): Promise<void> {
  await authApi.delete(`ratings/${ratingId}`);
}
