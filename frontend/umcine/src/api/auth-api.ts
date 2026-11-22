import { apiClient } from "./api-client";

export const authApi = apiClient.extend({
  hooks: {
    afterResponse: [
      ({ response }) => {
        if (response.status === 401 && typeof window !== "undefined") {
          window.dispatchEvent(new Event("umcine:session-expired"));
        }
      },
    ],
  },
});