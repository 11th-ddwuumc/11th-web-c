import { ApiProperty } from "@nestjs/swagger";
import { RatingResponseDto } from "./rating-response.dto.js";
import { FavoriteResponseDto } from "./favorite-response.dto.js";

export class MovieRecordResponseDto {
  @ApiProperty({ description: "등록한 평점", type: () => RatingResponseDto })
  rating: RatingResponseDto;
  @ApiProperty({
    description: "등록한 즐겨찾기. 추가하지 않았으면 null",
    type: () => FavoriteResponseDto,
    nullable: true,
  })
  favorite: FavoriteResponseDto | null;

  static of(rating: RatingResponseDto, favorite: FavoriteResponseDto | null): MovieRecordResponseDto {
    return { rating, favorite };
  }
}