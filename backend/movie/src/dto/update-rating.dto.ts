import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {IsInt, IsOptional, Max, MaxLength, Min} from "class-validator";

export class UpdateRatingDto {
  @IsInt({message: "별점은 정수여야 합니다."})
  @Min(1, {message: "별점은 1점 이상이어야 합니다."})
  @Max(5, {message: "별점은 5점 이하여야 합니다."})
  @ApiProperty({
    description: "수정할 별점. PATCH 요청에서도 필수입니다.",
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  score: number;

  @IsOptional()
  @MaxLength(500, {message: "후기는 500자 이하로 입력해주세요."})
  @ApiPropertyOptional({
    description:
      "수정할 후기. 생략하거나 null이면 기존 후기가 null로 변경됩니다.",
    example: "다시 봐도 명작",
    type: "string",
    nullable: true,
    maxLength: 500,
  })
  comment?: string;
}