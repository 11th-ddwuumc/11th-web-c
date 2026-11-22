import { ApiProperty } from "@nestjs/swagger";
export class LoginResponseDto {
  @ApiProperty({ description: "로그인한 회원의 닉네임", example: "영화조아" })
  nickname: string;
  @ApiProperty({
    description: "인증 API의 Authorization 헤더에 Bearer 형식으로 전달할 JWT",
    example: "eyJhbGciOiJIUzI1NiJ9.payload.signature",
  })
  accessToken: string;
}