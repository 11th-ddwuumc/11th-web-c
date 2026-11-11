import {cn} from "../../utils/cn.ts";

export default function Footer() {
  return (
    <footer className={cn(
      "flex w-full items-center justify-end gap-2",
      "border-t border-(--color-border-default)",
      "bg-(--color-bg-surface) px-20 py-4",
    )}>
      <img src="/images/logos/tmdb-logo.svg" alt="tmdb-logo"/>
      <div className={cn(
        "text-[12px] font-normal text-(--color-text-secondary)",
      )}>
        This product uses the TMDB API but is not endorsed or certified by <a
        className={cn("underline decoration-solid")}
        href="https://www.themoviedb.org/?language=ko" target="_blank">TMDB</a>.
      </div>
    </footer>
  )
}
