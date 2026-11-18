import { useAuthStore } from "../stores/auth-store";
import { apiClient } from "./api-client";

export const authApi = apiClient.extend({  // 기존 apiClient에 인증 처리 더함
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
          // 요청 보내기 전 최신 토큰을 읽어 헤더에 넣음
          request.headers.set("Authorization", `Bearer ${ accessToken }`);
        }
      },
    ],
    afterResponse: [
      ({ response }) => {
        // 인증 실패할 경우 토큰을 비움
        if (response.status === 401) {
          useAuthStore.getState().setAccessToken(null);
        }
      },
    ],
  },
});