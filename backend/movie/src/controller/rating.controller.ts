import type { BaseResponse } from "../types/base-response.js";
import { RatingResponseDto } from "../dto/rating-response.dto.js";
import type { AuthenticatedRequest } from "../types/authenticated-request.js";
// src/controller/rating.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { RatingService } from "../service/rating.service.js";
import { CreateRatingDto } from "../dto/create-rating.dto.js";
import { UpdateRatingDto } from "../dto/update-rating.dto.js";
import { AuthGuard } from "../guard/auth.guard.js";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiExtraModels } from "@nestjs/swagger";

@ApiExtraModels(RatingResponseDto)
@ApiTags("평점")
@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {
  }

  @ApiOperation({
    summary: "사용자별 평점 조회",
    description: "인증 필요 없는 공개 API",
  })
  @ApiResponse({
    status: 200,
    description: "조회 성공",
    schema: {
      example:
        [
          {
            "ratingId": 2,
            "movieId": 155,
            "score": 4,
            "comment": "다시 봐도 명작",
            "createdAt": "2026-10-28T12:10:38.000Z",
            "updatedAt": "2026-10-28T12:10:38.000Z",
          },
        ],
    },
  })
  @ApiParam({ name: "memberId", description: "평점을 조회할 회원 ID", type: Number, example: 1, required: true })
  @ApiResponse({
    status: 400,
    description: "경로 ID는 정수여야 합니다.",
    schema: {
      example: {
        isSuccess: false,
        code: "COMMON400",
        message: "Validation failed (numeric string is expected)",
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "해당 회원을 찾을 수 없습니다.",
    schema: {
      example: {
        isSuccess: false,
        code: "MEMBER404_1",
        message: "해당 회원을 찾을 수 없습니다.",
        result: null,
      },
    },
  })
  @Get("members/:memberId/ratings")
  getMemberRatings(
    @Param("memberId", ParseIntPipe)
    memberId: number,
  ) {
    return this.ratingService.getRatingsByMember(memberId);
  }

  @ApiOperation({
    summary: "평점 등록",
    description: "인증 필요. 로그인한 회원의 영화 평점을 등록합니다.",
  })
  @ApiResponse({
    status: 201,
    description: "평점 등록 성공",
    schema: {
      example: {
        isSuccess: true,
        code: "COMMON201",
        message: "평점을 등록했습니다.",
        result: {
          ratingId: 1,
          movieId: 550,
          score: 5,
          comment: "최고의 영화",
          createdAt: "2026-09-13T21:00:00.000Z",
          updatedAt: "2026-09-13T21:00:00.000Z",
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "요청 본문 또는 경로 ID의 형식이 올바르지 않습니다.",
    schema: {
      example: {
        isSuccess: false,
        code: "COMMON400",
        message: "별점은 5점 이하여야 합니다.",
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "`AUTH401_2` 로그인이 필요한 요청입니다. / `AUTH401_3` 유효하지 않은 토큰입니다. / `AUTH401_4` 토큰이 만료되었습니다. 다시 로그인해주세요",
    schema: {
      example: {
        isSuccess: false,
        code: "AUTH401_2",
        message: "로그인이 필요한 요청입니다.",
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "회원 찾을 수 없는 경우",
    schema: {
      example: {
        isSuccess: false,
        code: "MEMBER404_1",
        message: "해당 회원을 찾을 수 없습니다.",
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: "이미 평점 남긴 경우",
    schema: {
      example: {
        isSuccess: false,
        code: "RATING409_1",
        message: "이미 이 영화에 평점을 남기셨습니다.",
        result: null,
      },
    },
  })
  @ApiBearerAuth("bearerAuth")
  @Post("ratings")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateRatingDto,
  ): Promise<BaseResponse<RatingResponseDto>> {
    const memberId = request.memberId;

    const result = await this.ratingService.create(memberId, dto);
    return {
      isSuccess: true,
      code: "COMMON201",
      message: "평점을 등록했습니다.",
      result,
    };
  }

  @ApiOperation({
    summary: "평점 수정",
    description: "인증 필요. PATCH 지만 score 는 필수이고, comment 를 빼면 기존 후기가 null 로 덮입니다",
  })
  @ApiResponse({
    status: 200,
    description: "평점 수정 성공",
    schema: {
      example: {
        isSuccess: true,
        code: "COMMON200",
        message: "평점을 수정했습니다.",
        result: {
          ratingId: 1,
          movieId: 550,
          score: 5,
          comment: "최고의 영화",
          createdAt: "2026-09-13T21:00:00.000Z",
          updatedAt: "2026-09-13T21:00:00.000Z",
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "요청 본문 또는 경로 ID의 형식이 올바르지 않습니다.",
    schema: {
      example: {
        isSuccess: false,
        code: "COMMON400",
        message: "별점은 5점 이하여야 합니다.",
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "`AUTH401_2` 로그인이 필요한 요청입니다. / `AUTH401_3` 유효하지 않은 토큰입니다. / `AUTH401_4` 토큰이 만료되었습니다. 다시 로그인해주세요",
    schema: {
      example: {
        isSuccess: false,
        code: "AUTH401_2",
        message: "로그인이 필요한 요청입니다.",
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: "타인의 평점에 대해 요청",
    schema: {
      example: {
        isSuccess: false,
        code: "RATING403_1",
        message: "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.",
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "해당 평점을 찾을 수 없는 경우",
    schema: {
      example: {
        isSuccess: false,
        code: "RATING404_1",
        message: "해당 평점을 찾을 수 없습니다.",
        result: null,
      },
    },
  })
  @ApiBearerAuth("bearerAuth")
  @ApiParam({
    name: "ratingId",
    description: "수정할 평점 ID",
    required: true,
    schema: { type: "integer", example: 1 },
  })
  @Patch("ratings/:ratingId")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Req() request: AuthenticatedRequest,
    @Param("ratingId", ParseIntPipe) ratingId: number,
    @Body() dto: UpdateRatingDto,
  ): Promise<BaseResponse<RatingResponseDto>> {
    const memberId = request.memberId;

    const result = await this.ratingService.update(memberId, ratingId, dto);
    return {
      isSuccess: true,
      code: "COMMON200",
      message: "평점을 수정했습니다.",
      result,
    };
  }

  @ApiOperation({
    summary: "평점 삭제",
    description:
      "인증 필요. 본인이 작성한 평점을 삭제합니다. 성공 시 result는 null입니다.",
  })
  @ApiParam({
    name: "ratingId",
    description: "삭제할 평점 ID",
    required: true,
    schema: { type: "integer", example: 1 },
  })
  @ApiResponse({
    status: 200,
    description: "평점을 삭제했습니다.",
    schema: {
      example: {
        isSuccess: true,
        code: "COMMON200",
        message: "평점을 삭제했습니다.",
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "경로 ID는 정수여야 합니다.",
    schema: {
      example: {
        isSuccess: false,
        code: "COMMON400",
        message: "Validation failed (numeric string is expected)",
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description:
      "`AUTH401_2` 로그인이 필요한 요청입니다. / `AUTH401_3` 유효하지 않은 토큰입니다. / `AUTH401_4` 토큰이 만료되었습니다. 다시 로그인해주세요",
    schema: {
      example: {
        isSuccess: false,
        code: "AUTH401_2",
        message: "로그인이 필요한 요청입니다.",
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.",
    schema: {
      example: {
        isSuccess: false,
        code: "RATING403_1",
        message: "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.",
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "해당 평점을 찾을 수 없습니다.",
    schema: {
      example: {
        isSuccess: false,
        code: "RATING404_1",
        message: "해당 평점을 찾을 수 없습니다.",
        result: null,
      },
    },
  })
  @ApiBearerAuth("bearerAuth")
  @Delete("ratings/:ratingId")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(
    @Req() request: AuthenticatedRequest,
    @Param("ratingId", ParseIntPipe) ratingId: number,
  ): Promise<BaseResponse<null>> {
    const memberId = request.memberId;

    await this.ratingService.delete(memberId, ratingId);
    return {
      isSuccess: true,
      code: "COMMON200",
      message: "평점을 삭제했습니다.",
      result: null,
    };
  }
}