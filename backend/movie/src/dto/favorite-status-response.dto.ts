import { ApiProperty } from "@nestjs/swagger";
export class FavoriteStatusResponseDto {
  @ApiProperty({ description: "해당 영화의 즐겨찾기 등록 여부", example: true })
  isFavorite: boolean;

  static from(isFavorite: boolean): FavoriteStatusResponseDto {
    return { isFavorite };
  }
}