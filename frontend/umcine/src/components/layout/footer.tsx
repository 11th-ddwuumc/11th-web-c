export function Footer() {
  return (
    <footer className="flex items-center justify-end gap-2 border-t border-border-default bg-bg-surface px-20 py-4">
      <img src="/images/logos/tmdb-logo.svg" alt="" width={24} height={24} />
      <p className="text-[12px] text-text-secondary">
        This product uses the TMDB API but is not endorsed or certified by{" "}
        <a
          className="underline"
          href="https://www.themoviedb.org/?language=ko"
          target="_blank"
          rel="noreferrer"
        >
          TMDB
        </a>
        .
      </p>
    </footer>
  );
}
