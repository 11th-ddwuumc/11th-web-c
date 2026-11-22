import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "../guard/auth.guard.js";
import { FavoriteService } from "../service/favorite.service.js";
import { CreateFavoriteDto } from "../dto/create-favorite.dto.js";
import type { AuthenticatedRequest } from "../types/authenticated-request.js";
import { FavoriteResponseDto } from "../dto/favorite-response.dto.js";
import { BaseResponse } from "../types/base-response.js";
import { FavoriteStatusResponseDto } from "../dto/favorite-status-response.dto.js";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam, ApiExtraModels } from "@nestjs/swagger";

@ApiExtraModels(FavoriteResponseDto, FavoriteStatusResponseDto)
@ApiTags("즐겨찾기")
@ApiBearerAuth("bearerAuth")
@Controller("favorites")
@UseGuards(AuthGuard)
export class FavoriteController {

  constructor(
    private readonly favoriteService: FavoriteService,
  ) {
  }

  @ApiOperation({
    summary: "즐겨찾기 등록",
    description: "인증 필요. 토큰의 주인인 회원이 TMDB 영화 ID 하나를 즐겨찾기에 추가합니다.",
  })
  @ApiResponse({
    status: 201,
    description: "즐겨찾기 등록 성공",
    schema: {
      example: {
        isSuccess: true,
        code: "COMMON201",
        message: "즐겨찾기를 등록했습니다.",
        result: { favoriteId: 1, movieId: 550, createdAt: "2026-09-13T21:00:00.000Z" },
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
    status: 409,
    description: "이미 즐겨찾기한 영화",
    schema: {
      example: {
        isSuccess: false,
        code: "FAVORITE409_1",
        message: "이미 이 영화를 즐겨찾기했습니다.",
        result: null,
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
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createFavorite(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateFavoriteDto,
  ): Promise<BaseResponse<FavoriteResponseDto>> {
    const memberId: number = request.memberId;
    const result: FavoriteResponseDto = await this.favoriteService.create(memberId, dto);
    return {
      isSuccess: true,
      code: "COMMON201",
      message: "즐겨찾기를 등록했습니다.",
      result,
    };
  }

  @ApiOperation({
    summary: "즐겨찾기 목록 조회",
    description: "인증 필요. 토큰의 주인인 회원의 즐겨찾기 목록을 모두 조회합니다.",
  })
  @ApiResponse({
    status: 200,
    description: "즐겨찾기 목록 조회 성공. 즐겨찾기가 없으면 빈 배열 []",
    schema: {
      example: {
        isSuccess: true,
        code: "COMMON200",
        message: "내 즐겨찾기 목록을 조회했습니다.",
        result: [ { favoriteId: 1, movieId: 550, createdAt: "2026-09-13T21:00:00.000Z" } ],
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
  @Get()
  @HttpCode(HttpStatus.OK)
  async getMyFavorites(
    @Req() request: AuthenticatedRequest,
  ): Promise<BaseResponse<FavoriteResponseDto[]>> {
    const memberId: number = request.memberId;
    const result: FavoriteResponseDto[] = await this.favoriteService.getMyFavorites(memberId);
    return {
      isSuccess: true,
      code: "COMMON200",
      message: "내 즐겨찾기 목록을 조회했습니다.",
      result,
    };
  }

  @ApiOperation({
    summary: "즐겨찾기 여부 조회",
    description: "인증 필요. 토큰의 주인인 회원이 해당 영화를 즐겨찾기했는지 여부를 반환합니다.",
  })
  @ApiResponse({
    status: 200,
    description: "즐겨찾기 여부 조회 성공",
    schema: {
      example: {
        isSuccess: true,
        code: "COMMON200",
        message: "즐겨찾기 여부를 조회했습니다.",
        result: { isFavorite: true },
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
  @ApiParam({
    name: "movieId",
    description: "TMDB 영화 ID",
    required: true,
    schema: { type: "integer", example: 550 },
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
  @Get(":movieId")
  @HttpCode(HttpStatus.OK)
  async getFavoriteStatus(
    @Req() request: AuthenticatedRequest,
    @Param("movieId", ParseIntPipe) movieId: number,
  ): Promise<BaseResponse<FavoriteStatusResponseDto>> {
    const memberId: number = request.memberId;
    const result: FavoriteStatusResponseDto = await this.favoriteService.getStatus(memberId, movieId);
    return {
      isSuccess: true,
      code: "COMMON200",
      message: "즐겨찾기 여부를 조회했습니다.",
      result: result,
    };
  }

  @ApiOperation({
    summary: "즐겨찾기 해제",
    description: "인증 필요. favoriteId 가 아니라 movieId 로 지정합니다. 성공 시 200 이고 result 는 null 입니다.",
  })
  @ApiResponse({
    status: 200,
    description: "즐겨찾기 해제 성공, result는 null",
    schema: {
      example: {
        isSuccess: true,
        code: "COMMON200",
        message: "즐겨찾기를 해제했습니다.",
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
    description: "해당 영화를 찾을 수 없음",
    schema: {
      example: {
        isSuccess: false,
        code: "FAVORITE404_1",
        message: "해당 영화 즐겨찾기를 찾을 수 없습니다.",
        result: null,
      },
    },
  })
  @ApiParam({
    name: "movieId",
    description: "TMDB 영화 ID",
    required: true,
    schema: { type: "integer", example: 550 },
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
  @Delete(":movieId")
  @HttpCode(HttpStatus.OK)
  async deleteFavorite(
    @Req() request: AuthenticatedRequest,
    @Param("movieId", ParseIntPipe) movieId: number,
  ): Promise<BaseResponse<null>> {
    const memberId = request.memberId;
    await this.favoriteService.delete(memberId, movieId);
    return {
      isSuccess: true,
      code: "COMMON200",
      message: "즐겨찾기를 해제했습니다.",
      result: null,
    };
  }
}