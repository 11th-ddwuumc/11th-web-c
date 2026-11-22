export interface RatingResponse {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MovieRatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: RatingResponse;
}