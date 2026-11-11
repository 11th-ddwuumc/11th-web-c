import {createFileRoute} from "@tanstack/react-router";
import MyinfoPage from "../pages/auth/myinfo-page.tsx";

export const Route = createFileRoute("/my-info")({
  component: MyinfoPage,
});