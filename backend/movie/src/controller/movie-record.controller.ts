import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiExtraModels } from "@nestjs/swagger";
import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guard/auth.guard.js";
import { MovieRecordService } from "../service/movie-record.service.js";
import type { AuthenticatedRequest } from "../types/authenticated-request.js";
import { CreateMovieRecordDto } from "../dto/create-movie-record.dto.js";
import { BaseResponse } from "../types/base-response.js";
import { MovieRecordResponseDto } from "../dto/movie-record-response.dto.js";

@ApiExtraModels(MovieRecordResponseDto)
@ApiTags("영화 기록")
@ApiBearerAuth("bearerAuth")
@Controller("movie-records")
@UseGuards(AuthGuard)
export class MovieRecordController {

  constructor(private readonly movieRecordService: MovieRecordService) {
  }

  @ApiOperation({
    summary: "영화 기록 등록",
    description:
      "인증 필요. 평점을 등록하고 addToFavorites가 true이면 즐겨찾기도 함께 등록합니다. 하나라도 실패하면 모두 취소됩니다. false이면 응답의 favorite은 null입니다.",
  })
  @ApiResponse({
    status: 201,
    description: "영화 기록을 저장했습니다.",
    schema: {
      example: {
        isSuccess: true,
        code: "COMMON201",
        message: "영화 기록을 저장했습니다.",
        result: {
          rating: {
            ratingId: 1,
            movieId: 550,
            score: 5,
            comment: "최고의 영화",
            createdAt: "2026-09-13T21:00:00.000Z",
            updatedAt: "2026-09-13T21:00:00.000Z",
          },
          favorite: {
            favoriteId: 1,
            movieId: 550,
            createdAt: "2026-09-13T21:00:00.000Z",
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "요청 본문의 필수 항목 또는 형식이 올바르지 않습니다.",
    schema: {
      example: {
        isSuccess: false,
        code: "COMMON400",
        message: "영화 ID는 정수여야 합니다.",
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
  @ApiResponse({
    status: 409,
    description:
      "`RATING409_1` 이미 이 영화에 평점을 남기셨습니다. / `FAVORITE409_1` 이미 이 영화를 즐겨찾기했습니다.",
    schema: {
      example: {
        isSuccess: false,
        code: "RATING409_1",
        message: "이미 이 영화에 평점을 남기셨습니다.",
        result: null,
      },
    },
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createMovieRecord(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateMovieRecordDto,
  ): Promise<BaseResponse<MovieRecordResponseDto>> {
    return {
      isSuccess: true,
      code: "COMMON201",
      message: "영화 기록을 저장했습니다.",
      result: await this.movieRecordService.create(request.memberId, dto),
    };
  }
}