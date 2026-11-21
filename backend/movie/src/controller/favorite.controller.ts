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
import type { ApiResponse } from "../types/api-response.js";
import { FavoriteStatusResponseDto } from "../dto/favorite-status-response.dto.js";

@Controller("favorites")
@UseGuards(AuthGuard)
export class FavoriteController {

  constructor(
    private readonly favoriteService: FavoriteService,
  ) {
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createFavorite(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateFavoriteDto,
  ): Promise<ApiResponse<FavoriteResponseDto>> {
    const memberId: number = request.memberId;
    const result: FavoriteResponseDto = await this.favoriteService.create(memberId, dto);
    return {
      isSuccess: true,
      code: "COMMON201",
      message: "즐겨찾기를 등록했습니다.",
      result,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getMyFavorites(
    @Req() request: AuthenticatedRequest,
  ): Promise<ApiResponse<FavoriteResponseDto[]>> {
    const memberId: number = request.memberId;
    const result: FavoriteResponseDto[] = await this.favoriteService.getMyFavorites(memberId);
    return {
      isSuccess: true,
      code: "COMMON200",
      message: "내 즐겨찾기 목록을 조회했습니다.",
      result,
    };
  }

  @Get(":movieId")
  @HttpCode(HttpStatus.OK)
  async getFavoriteStatus(
    @Req() request: AuthenticatedRequest,
    @Param("movieId", ParseIntPipe) movieId: number,
  ): Promise<ApiResponse<FavoriteStatusResponseDto>> {
    const memberId: number = request.memberId;
    const result: FavoriteStatusResponseDto = await this.favoriteService.getStatus(memberId, movieId);
    return {
      isSuccess: true,
      code: "COMMON200",
      message: "즐겨찾기 여부를 조회했습니다.",
      result: result,
    };
  }

  @Delete(":movieId")
  @HttpCode(HttpStatus.OK)
  async deleteFavorite(
    @Req() request: AuthenticatedRequest,
    @Param("movieId", ParseIntPipe) movieId: number,
  ): Promise<ApiResponse<null>> {
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