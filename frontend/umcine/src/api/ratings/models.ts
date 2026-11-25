export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RatingResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}
