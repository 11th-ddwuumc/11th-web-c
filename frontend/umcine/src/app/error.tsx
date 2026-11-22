"use client";

export default function ErrorPage({ retry }: { retry: () => void }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4">
      <p role="alert">정보를 불러오지 못했어요. 다시 시도해 주세요.</p>
      <button type="button" onClick={retry} className="rounded-lg bg-(--color-action-primary) px-4 py-2 text-white">다시 시도</button>
    </main>
  );
}
