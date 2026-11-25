import { apiClient } from "../api-client";
import type { Rating } from "./models";

// GET /members/{memberId}/ratings: 인증이 필요 없고, 성공 응답을 공통 형식으로 감싸지 않는다.
export function getMemberRatings(memberId: number) {
  return apiClient.get(`members/${memberId}/ratings`).json<Rating[]>();
}
