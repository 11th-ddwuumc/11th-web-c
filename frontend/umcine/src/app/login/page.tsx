import { redirect } from "next/navigation";
import { getSession } from "@/server/session";
import { AuthGuard } from "@/components/auth/auth-guard";
import { LoginPage } from "@/views/auth/login-page";

export default async function Page() {
  if (await getSession()) redirect("/");
  return <AuthGuard guestOnly><LoginPage /></AuthGuard>;
}
