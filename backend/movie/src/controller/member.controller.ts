import { CheckResponseDto } from "../dto/check-response.dto.js";
import type { BaseResponse } from "../types/base-response.js";
import { MemberInfoResponseDto } from "../dto/member-info-response.dto.js";
import type { AuthenticatedRequest } from "../types/authenticated-request.js";
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { MemberService } from "../service/member.service.js";
import { CreateMemberDto } from "../dto/create-member.dto.js";
import { AuthGuard } from "../guard/auth.guard.js";
import { MemberUpdateRequestDto } from "../dto/member-update-request.dto.js";
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse, ApiParam, ApiExtraModels } from "@nestjs/swagger";

@ApiExtraModels(MemberInfoResponseDto, CheckResponseDto)
@ApiTags("회원")
@Controller("members")
export class MemberController {

  constructor(private readonly memberService: MemberService) {
  }

  @ApiOperation({
    summary: "내 정보 조회",
    description: "인증 필요. 현재 로그인한 사용자의 정보를 조회합니다. 토큰이 필요합니다.",
  })
  @ApiBearerAuth("bearerAuth")
  @ApiResponse({
    status: 200,
    description: "회원 정보를 조회했습니다.",
    schema: {
      example: {
        isSuccess: true,
        code: "COMMON200",
        message: "회원 정보를 조회했습니다.",
        result: {
          email: "challenger@umc.com",
          nickname: "영화조아",
          createdAt: "2026-09-13T21:00:00.000Z",
        },
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
  @Get("me")
  @UseGuards(AuthGuard) // 이 줄이 없으면 토큰 없이도 호출됩니다
  async getMyInfo(@Req() request: AuthenticatedRequest): Promise<BaseResponse<MemberInfoResponseDto>> {
    // Guard가 request.memberId에 담아둔 값을 꺼냅니다
    const memberId = request.memberId;

    const result = await this.memberService.getMyInfo(memberId);
    return {
      isSuccess: true,
      code: "COMMON200",
      message: "회원 정보를 조회했습니다.",
      result,
    };
  }

  @ApiOperation({
    summary: "내 정보 수정",
    description: "인증 필요. 현재 로그인한 사용자의 정보를 수정합니다. 토큰이 필요합니다.",
  })
  @ApiBearerAuth("bearerAuth")
  @ApiResponse({
    status: 200,
    description: "회원 정보를 수정했습니다.",
    schema: {
      example: {
        isSuccess: true,
        code: "COMMON200",
        message: "회원 정보를 수정했습니다.",
        result: {
          email: "challenger@umc.com",
          nickname: "영화조아",
          createdAt: "2026-09-13T21:00:00.000Z",
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "닉네임은 2자 이상 12자 이하여야 합니다.",
    schema: {
      example: {
        isSuccess: false,
        code: "COMMON400",
        message: "닉네임은 2자 이상 12자 이하여야 합니다.",
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
    description: "이미 사용 중인 닉네임입니다.",
    schema: {
      example: {
        isSuccess: false,
        code: "MEMBER409_1",
        message: "이미 사용 중인 닉네임입니다.",
        result: null,
      },
    },
  })
  @Patch("me")
  @UseGuards(AuthGuard)
  async updateMyInfo(
    @Req() request: AuthenticatedRequest,
    @Body() dto: MemberUpdateRequestDto,
  ): Promise<BaseResponse<MemberInfoResponseDto>> {
    const memberId = request.memberId;

    const result = await this.memberService.updateMyInfo(memberId, dto);
    return {
      isSuccess: true,
      code: "COMMON200",
      message: "회원 정보를 수정했습니다.",
      result,
    };
  }

  @ApiOperation({
    summary: "닉네임 중복 확인",
    description: "해당 닉네임이 사용 가능한지 중복 확인합니다. 토큰이 없어도 호출할 수 있는 공개 API입니다.",
  })
  @ApiParam({
    name: "nickname",
    description: "중복 확인할 닉네임",
    required: true,
    schema: { type: "string", example: "영화조아" },
  })
  @ApiResponse({
    status: 200,
    description: "닉네임 중복 확인 성공. 사용 가능하면 true",
    schema: { example: { available: true } },
  })
  @Get("nickname/:nickname")
  checkNickname(@Param("nickname") nickname: string) {
    return this.memberService.checkNickname(nickname);
  }

  @ApiOperation({
    summary: "이메일 중복 확인",
    description: "해당 이메일이 사용 가능한지 중복 확인합니다. 토큰이 없어도 호출할 수 있는 공개 API입니다.",
  })
  @ApiParam({
    name: "email",
    description: "중복 확인할 이메일",
    required: true,
    schema: { type: "string", example: "challenger@umc.com" },
  })
  @ApiResponse({
    status: 200,
    description: "이메일 중복 확인 성공. 사용 가능하면 true",
    schema: { example: { available: true } },
  })
  @Get("email/:email")
  checkEmail(@Param("email") email: string) {
    return this.memberService.checkEmail(email);
  }

  @ApiOperation({
    summary: "회원가입",
    description: "이메일, 비밀번호, 닉네임으로 회원을 등록합니다. 토큰이 없어도 호출할 수 있는 공개 API입니다.",
  })
  @ApiResponse({
    status: 201,
    description: "회원가입에 성공했습니다.",
    schema: {
      example: {
        isSuccess: true,
        code: "COMMON201",
        message: "회원가입에 성공했습니다.",
        result: {
          memberId: 1,
          email: "challenger@umc.com",
          nickname: "영화조아",
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "이메일 또는 비밀번호 또는 닉네임의 필수 항목 및 형식 검증 실패",
    schema: {
      example: {
        isSuccess: false,
        code: "COMMON400",
        message: "올바른 이메일 형식이 아닙니다.",
        result: null,
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: "이미 사용 중인 이메일 또는 닉네임입니다.",
    schema: {
      example: {
        isSuccess: false,
        code: "COMMON409",
        message: "이미 사용 중인 이메일입니다.",
        result: null,
      },
    },
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: CreateMemberDto): Promise<BaseResponse<{
    memberId: number;
    email: string;
    nickname: string
  }>> {
    const result = await this.memberService.signUp(dto);
    return {
      isSuccess: true,
      code: "COMMON201",
      message: "회원가입에 성공했습니다.",
      result,
    };
  }
}