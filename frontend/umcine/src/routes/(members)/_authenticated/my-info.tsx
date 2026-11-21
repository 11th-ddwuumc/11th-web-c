import { createFileRoute } from "@tanstack/react-router";
import MyinfoPage from "../../../pages/members/myinfo-page.tsx";

export const Route = createFileRoute("/(members)/_authenticated/my-info")({
  component: MyinfoPage,
});