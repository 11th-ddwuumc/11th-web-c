import { EditProfilePage } from "@/views/members/edit-profile-page";
import { requireSession } from "@/server/session";

export default async function Page() {
  await requireSession();
  return <EditProfilePage />;
}
