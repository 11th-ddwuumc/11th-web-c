import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/index.css";
import Providers from "./providers";
import { getSession } from "@/server/session";
import Header from "@/components/layout/header";

export const metadata: Metadata = {
  title: "UMCine",
  description: "영화 탐색과 기록을 위한 UMCine",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  return (
    <html lang="ko">
      <body>
        <Providers session={session}>
          <div className="flex min-h-screen flex-col">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
