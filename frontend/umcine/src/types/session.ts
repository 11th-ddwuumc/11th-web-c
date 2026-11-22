import type { MemberInfo } from "../api/members/me";

export interface Session {
  member: MemberInfo;
  memberId: number | null;
}
