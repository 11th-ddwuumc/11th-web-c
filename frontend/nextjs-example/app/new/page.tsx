import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "새 페이지 | Next.js",
  description: "Test page for Next.js",
  openGraph: {
    title: "Test for Nest.js",
    description: "Learning Next.js with small examples",
    images: [ "https://images.unsplash.com/photo-1516321318423-f06f85e504b3" ],
  },
};

export default function NewPage() {
  return <div>This is New page</div>;
};