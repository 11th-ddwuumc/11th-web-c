import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guard/auth.guard.js";
import { MovieRecordService } from "../service/movie-record.service.js";
import type { AuthenticatedRequest } from "../types/authenticated-request.js";
import { CreateMovieRecordDto } from "../dto/create-movie-record.dto.js";
import { ApiResponse } from "../types/api-response.js";
import { MovieRecordResponseDto } from "../dto/movie-record-response.dto.js";

@Controller("movie-records")
@UseGuards(AuthGuard)
export class MovieRecordController {

  constructor(private readonly movieRecordService: MovieRecordService) {
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createMovieRecord(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateMovieRecordDto,
  ): Promise<ApiResponse<MovieRecordResponseDto>> {
    return {
      isSuccess: true,
      code: "COMMON201",
      message: "영화 기록을 저장했습니다.",
      result: await this.movieRecordService.create(request.memberId, dto),
    };
  }
}