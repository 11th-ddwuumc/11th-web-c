import { ApiProperty } from "@nestjs/swagger";
import {Member} from "../entity/member.entity.js";

export class MemberInfoResponseDto {
  @ApiProperty({ description: "회원 이메일", example: "challenger@umc.com" })
  email: string;
  @ApiProperty({ description: "회원 닉네임", example: "영화조아" })
  nickname: string;
  @ApiProperty({
    description: "회원 가입 시각",
    type: "string",
    format: "date-time",
    example: "2026-09-13T21:00:00.000Z",
  })
  createdAt: Date;

  // 엔티티를 그대로 응답하면 password까지 나가버리므로 반드시 DTO로 옮겨 담습니다
  static from(member: Member): MemberInfoResponseDto {
    return {
      email: member.email,
      nickname: member.nickname,
      createdAt: member.createdAt,
    };
  }
}