import { ApiProperty } from "@nestjs/swagger";
import {Rating} from "../entity/rating.entity.js";

export class RatingResponseDto {
  @ApiProperty({ description: "평점 ID", example: 1 })
  ratingId: number;
  @ApiProperty({ description: "TMDB 영화 ID", example: 550 })
  movieId: number;
  @ApiProperty({ description: "별점", example: 5, minimum: 1, maximum: 5 })
  score: number;
  @ApiProperty({
    description: "후기. 작성하지 않았으면 null",
    type: "string",
    nullable: true,
    example: "최고의 영화",
  })
  comment: string | null;
  @ApiProperty({
    description: "평점 등록 시각",
    type: "string",
    format: "date-time",
    example: "2026-09-13T21:00:00.000Z",
  })
  createdAt: Date;
  @ApiProperty({
    description: "평점 최종 수정 시각",
    type: "string",
    format: "date-time",
    example: "2026-09-13T21:00:00.000Z",
  })
  updatedAt: Date;

  static from(rating: Rating): RatingResponseDto {
    return {
      ratingId: rating.ratingId,
      movieId: rating.movieId,
      score: rating.score,
      comment: rating.comment,
      createdAt: rating.createdAt,
      updatedAt: rating.updatedAt,
    };
  }
}