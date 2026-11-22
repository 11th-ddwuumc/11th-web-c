import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 bg-(--color-bg-page)">
      <h1 className="text-2xl font-bold">페이지를 찾을 수 없어요.</h1>
      <Link href="/" className="text-(--color-action-primary) underline">영화 목록으로 이동</Link>
    </main>
  );
}
