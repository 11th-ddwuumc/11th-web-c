import { IsInt, IsOptional, Max, MaxLength, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateRatingDto {

  @ApiProperty({ description: "TMDB 영화 ID", example: 550, minimum: 1 })
  @IsInt({ message: "영화 ID는 정수여야 합니다." })
  @Min(1, { message: "영화 ID는 양수여야 합니다." })
  movieId: number;

  @ApiProperty({ description: "별점, 1점 이상 5점 이하", example: 5, minimum: 1, maximum: 5 })
  @IsInt({ message: "별점은 정수여야 합니다." })
  @Min(1, { message: "별점은 1점 이상이어야 합니다." })
  @Max(5, { message: "별점은 5점 이하여야 합니다." })
  score: number;

  @ApiPropertyOptional({ description: "후기. 생략하거나 null이면 후기 없이 저장합니다.", type: String, nullable: true, maxLength: 500, example: "최고의 영화" })
  @IsOptional()
  @MaxLength(500, { message: "후기는 500자 이하로 입력해주세요." })
  comment?: string;
}