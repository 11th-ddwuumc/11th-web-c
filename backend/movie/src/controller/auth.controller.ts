import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "../service/auth.service.js";
import { LoginRequestDto } from "../dto/login-request.dto.js";
import type { BaseResponse } from "../types/base-response.js";
import { LoginResponseDto } from "../dto/login-response.dto.js";
import { ApiOperation, ApiTags, ApiResponse, ApiExtraModels } from "@nestjs/swagger";

@ApiExtraModels(LoginResponseDto)
@ApiTags("인증")
@Controller("auth")
export class AuthController {

  constructor(private readonly authService: AuthService) {
  }

  @ApiOperation({
    summary: "이메일 로그인",
    description: "이메일/비밀번호로 로그인하고 Access token을 발급받습니다. " +
      "발급받은 토큰은 위쪽 Authorize 버튼에 넣어두면 인증이 필요한 API에 자동으로 실립니다.",
  })
  @ApiResponse({
    status: 200,
    description: "로그인에 성공했습니다.",
    schema: {
      example: {
        isSuccess: true,
        code: "COMMON200",
        message: "로그인에 성공했습니다.",
        result: {
          nickname: "영화조아",
          accessToken: "eyJhbGciOiJIUzI1NiJ9.payload.signature",
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "이메일 또는 비밀번호의 필수 항목 및 형식 검증 실패",
    schema: {
      example: {
        isSuccess: false,
        code: "COMMON400",
        message: "이메일 형식이 올바르지 않습니다.",
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "`AUTH401_1` 이메일 또는 비밀번호가 올바르지 않습니다.",
    schema: {
      example: {
        isSuccess: false,
        code: "AUTH401_1",
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
        result: null,
      },
    },
  })
  @Post("login")
  @HttpCode(HttpStatus.OK) // NestJS의 @Post 기본 응답은 201이라 200으로 바꿔줍니다
  async login(@Body() dto: LoginRequestDto): Promise<BaseResponse<LoginResponseDto>> {
    const result: LoginResponseDto = await this.authService.login(dto);
    return {
      isSuccess: true,
      code: "COMMON200",
      message: "로그인에 성공했습니다.",
      result,
    };
  }
}