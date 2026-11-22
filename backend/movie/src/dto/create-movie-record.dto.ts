import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive, Max, Min } from "class-validator";

export class CreateMovieRecordDto {

  @IsNotEmpty({ message: "영화 ID는 필수입니다." })
  @IsInt({ message: "영화 ID는 정수여야 합니다." })
  @IsPositive({ message: "영화 ID는 양수여야 합니다." })
  @ApiProperty({ description: "TMDB 영화 ID", example: 550, minimum: 1 })
  movieId: number;

  @IsNotEmpty({ message: "별점은 필수입니다." })
  @IsInt({ message: "별점은 정수여야 합니다." })
  @Min(1, { message: "별점은 1점 이상이어야 합니다." })
  @Max(5, { message: "별점은 5점 이하여야 합니다." })
  @ApiProperty({ description: "별점", example: 5, minimum: 1, maximum: 5 })
  score: number;

  @IsOptional()
  @ApiPropertyOptional({
    description: "후기. 생략하거나 null이면 후기 없이 저장합니다.",
    example: "최고의 영화",
    type: "string",
    nullable: true,
  })
  comment?: string;

  @IsBoolean({ message: "즐겨찾기 추가 여부는 true 또는 false여야 합니다." })
  @ApiProperty({ description: "즐겨찾기도 함께 등록할지 여부", example: true })
  addToFavorites: boolean;
}