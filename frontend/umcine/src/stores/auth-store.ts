"use client";

import { createContext, useContext } from "react";
import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";
import type { Session } from "@/types/session";

interface AuthState {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

export function createAuthStore(session: Session | null) {
  return createStore<AuthState>()((set) => ({
    session,
    setSession: (session) => set({ session }),
  }));
}

export const AuthStoreContext = createContext<ReturnType<typeof createAuthStore> | null>(null);

export function useAuthStore<T>(selector: (state: AuthState) => T): T {
  const store = useContext(AuthStoreContext);
  if (!store) throw new Error("인증 Provider가 필요해요.");
  return useStore(store, selector);
}
