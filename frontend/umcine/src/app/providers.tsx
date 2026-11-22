"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthStoreContext, createAuthStore } from "@/stores/auth-store";
import type { Session } from "@/types/session";

export default function Providers({ children, session }: { children: ReactNode; session: Session | null }) {
  const router = useRouter();
  const [authStore] = useState(() => createAuthStore(session));
  const [queryClient] = useState(() => {
    const client = new QueryClient({ defaultOptions: { queries: { staleTime: 60 * 1000 } } });
    if (session) client.setQueryData(["members", "me"], session.member);
    return client;
  });

  useEffect(() => {
    authStore.getState().setSession(session);
    if (session) queryClient.setQueryData(["members", "me"], session.member);
  }, [session, authStore, queryClient]);

  useEffect(() => {
    // Remove tokens persisted by the previous client-only authentication flow.
    try { localStorage.removeItem("umcine-auth-store"); } catch { /* Storage may be disabled. */ }
    const expireSession = () => {
      authStore.getState().setSession(null);
      queryClient.clear();
      router.refresh();
    };
    window.addEventListener("umcine:session-expired", expireSession);
    return () => window.removeEventListener("umcine:session-expired", expireSession);
  }, [authStore, queryClient, router]);

  return (
    <AuthStoreContext.Provider value={authStore}>
      <QueryClientProvider client={queryClient}>
        {children}
        {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </AuthStoreContext.Provider>
  );
}
