import { ApiProperty } from "@nestjs/swagger";
import { Favorite } from "../entity/favorite.entity.js";

export class FavoriteResponseDto {
  @ApiProperty({ description: "즐겨찾기 ID", example: 1 })
  favoriteId: number;
  @ApiProperty({ description: "TMDB 영화 ID", example: 550 })
  movieId: number;
  @ApiProperty({
    description: "즐겨찾기 등록 시각",
    type: "string",
    format: "date-time",
    example: "2026-09-13T21:00:00.000Z",
  })
  createdAt: Date;

  static from(favorite: Favorite): FavoriteResponseDto {
    return {
      favoriteId: favorite.favoriteId,
      movieId: favorite.movieId,
      createdAt: favorite.createdAt,
    };
  }
}