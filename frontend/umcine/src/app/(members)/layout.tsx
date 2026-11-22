import type { ReactNode } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { requireSession } from "@/server/session";

export default async function MembersLayout({ children }: { children: ReactNode }) {
  await requireSession();
  return <AuthGuard>{children}</AuthGuard>;
}
