import { createFileRoute } from "@tanstack/react-router";
import { EditProfilePage } from "../../../pages/members/edit-profile-page.tsx";

export const Route = createFileRoute("/(members)/_authenticated/edit-profile")({
  component: EditProfilePage,
});