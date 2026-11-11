import {createFileRoute} from "@tanstack/react-router";
import {EditProfilePage} from "../pages/auth/edit-profile-page.tsx";

export const Route = createFileRoute("/edit-profile")({
  component: EditProfilePage,
});