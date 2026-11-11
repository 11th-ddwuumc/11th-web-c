import { createFileRoute } from "@tanstack/react-router";
import { MyEditPage } from "../pages/member/my-edit-page";

export const Route = createFileRoute("/mypage/edit")({ component: MyEditPage });
