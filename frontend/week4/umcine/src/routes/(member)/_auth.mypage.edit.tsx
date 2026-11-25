import { createFileRoute } from "@tanstack/react-router";
import { MyEditPage } from "../../pages/member/my-edit-page";

export const Route = createFileRoute("/(member)/_auth/mypage/edit")({
  component: MyEditPage,
});
