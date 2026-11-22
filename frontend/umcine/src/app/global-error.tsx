"use client";

export default function GlobalError({ retry }: { retry: () => void }) {
  return (
    <html lang="ko"><body>
      <main>
        <p role="alert">서비스에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.</p>
        <button type="button" onClick={retry}>다시 시도</button>
      </main>
    </body></html>
  );
}
