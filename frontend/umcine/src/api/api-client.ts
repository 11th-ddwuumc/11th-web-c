import ky from "ky";

export const apiClient = ky.create({
  baseUrl: "/api/backend/",
  credentials: "same-origin",
});