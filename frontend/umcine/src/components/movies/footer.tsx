import {cn} from "../../utils/cn.ts";

export default function Footer() {
  return (
    <footer className={cn(
      "flex w-full items-center justify-end gap-[8px]",
      "border-t border-(--color-border-default)",
      "bg-(--color-bg-surface) px-[80px] py-[16px]",
    )}>
      <img src="/images/logos/tmdb-logo.svg" alt="tmdb-logo"/>
      <div className={cn(
        "text-[12px] font-[400] text-(--color-text-secondary)",
      )}>
        This product uses the TMDB API but is not endorsed or certified by <a
        className={cn("underline decoration-solid")}
        href="https://www.themoviedb.org/?language=ko" target="_blank">TMDB</a>.
      </div>
    </footer>
  )
}
