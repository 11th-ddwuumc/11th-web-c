import Footer from "../../components/movies/footer.tsx";
import {cn} from "../../utils/cn.ts";

export default function MyinfoPage() {
  const arrowClassName = cn(
    "flex size-6 shrink-0 items-center justify-center border-0 bg-transparent p-0",
    "text-(--color-text-secondary) cursor-pointer",
    "disabled:cursor-default disabled:text-(--color-action-disabled)",
  );

  const arrowMaskStyle = {
    mask: "url('/icons/keyboard-arrow-left.svg') center / contain no-repeat",
    WebkitMask:
      "url('/icons/keyboard-arrow-left.svg') center / contain no-repeat",
  };

  return (
    <main className={cn(
      "flex flex-col min-h-[calc(100vh-90px)] w-full bg-(--color-bg-page) pb-14.25 pt-6 px-20 gap-7",
    )}>
      <div className="flex w-full h-fit justify-between">
        <div className="font-bold text-[31px] leading-[100%] tracking-[-1.24px] text-(--color-text-primary)">
          내 정보
        </div>
        <button className={cn(
          "flex h-10.5 justify-center items-center px-4 cursor-pointer",
          "rounded-lg border border-(--color-bg-surface) bg-(--color-action-primary)",
          "font-bold text-[14px] text-(--color-bg-surface) leading-[100%]"
        )}>
          정보 수정
        </button>
      </div>
      <section className="flex flex-col w-full h-fit gap-4 py-3 border-t border-b border-(--color-border-default)">
        <h2 className="flex w-full h-fit font-bold text-[17px] leading-[100%] text-(--color-text-primary)">
          기본 정보
        </h2>
        <div className="flex w-full h-fit gap-7 items-center">
          <span
            className="relative flex flex-col shrink-0 justify-center items-center w-20.5 h-20.5 rounded-[41px] bg-(--color-border-default)"
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_98_1158)">
              <path
                d="M24 24C28.42 24 32 20.42 32 16C32 11.58 28.42 8 24 8C19.58 8 16 11.58 16 16C16 20.42 19.58 24 24 24ZM24 28C18.66 28 8 30.68 8 36V40H40V36C40 30.68 29.34 28 24 28Z"
                fill="#17191E"/>
              </g>
              <defs>
              <clipPath id="clip0_98_1158">
              <rect width="48" height="48" fill="white"/>
              </clipPath>
              </defs>
            </svg>
          </span>
          <div className="flex w-190 h-fit max-w-190 gap-7">
            <div className="flex flex-col w-full h-fit gap-1.5">
              <label className="flex w-full font-normal text-[11px] text-(--color-text-tertiary) leading-[100%]">
                닉네임
              </label>
              <strong className="flex w-full font-bold text-[14px] text-(--color-text-primary) leading-[100%]">
                gs0428
              </strong>
            </div>
            <div className="flex w-190 h-fit max-w-190 gap-7">
              <div className="flex flex-col w-full h-fit gap-1.5">
                <label className="flex w-full font-normal text-[11px] text-(--color-text-tertiary) leading-[100%]">
                  이메일
                </label>
                <strong className="flex w-full font-bold text-[14px] text-(--color-text-primary) leading-[100%]">
                  gwangsoo@cinemalab.kr
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="flex flex-col w-full h-fit gap-4">
        <div className="flex w-full font-bold text-[17px] text-(--color-text-primary) leading-[100%]">
          내 즐겨찾기
        </div>
        <div className="grid h-84.75 w-full max-w-7xl grid-rows-1 grid-cols-5 gap-x-4.5 gap-y-5">
          <article className={cn("relative flex flex-col gap-1")}>
            <div className={cn(
              "relative h-68.5 w-full",
              "overflow-hidden rounded-[10px]",
              "bg-(--color-bg-page)",
            )}>
              <img
                className={cn("block h-full w-full object-cover")}
                src="../../../public/images/movies/spider-man-brand-new-day.jpg"
                alt=""
              />
            </div>
            <div
              className={cn(
                "h-5.5 pt-1.25 truncate",
                "text-[14px] leading-[100%] font-extrabold align-middle",
                "text-(--color-text-primary)",
              )}
            >
              스파이더맨: 브랜드 뉴 데이
            </div>
            <div className={cn(
              "h-3.5",
              "text-[12px] font-normal align-middle leading-[100%]",
              "text-(--color-text-tertiary)",
            )}>
              2026.07.29
            </div>
          </article>
          <article className={cn("relative flex flex-col gap-1")}>
            <div className={cn(
              "relative h-68.5 w-full",
              "overflow-hidden rounded-[10px]",
              "bg-(--color-bg-page)",
            )}>
              <img
                className={cn("block h-full w-full object-cover")}
                src="../../../public/images/movies/odyssey.jpg"
                alt=""
              />
            </div>
            <div
              className={cn(
                "h-5.5 pt-1.25 truncate",
                "text-[14px] leading-[100%] font-extrabold align-middle",
                "text-(--color-text-primary)",
              )}
            >
              오디세이
            </div>
            <div className={cn(
              "h-3.5",
              "text-[12px] font-normal align-middle",
              "text-(--color-text-tertiary) leading-[100%]",
            )}>
              2026.08.05
            </div>
          </article>
          <article className={cn("relative flex flex-col gap-1")}>
            <div className={cn(
              "relative h-68.5 w-full",
              "overflow-hidden rounded-[10px]",
              "bg-(--color-bg-page)",
            )}>
              <img
                className={cn("block h-full w-full object-cover")}
                src="../../../public/images/movies/minions-monsters.jpg"
                alt=""
              />
            </div>
            <div
              className={cn(
                "h-5.5 pt-1.25 truncate",
                "text-[14px] leading-[100%] font-extrabold align-middle",
                "text-(--color-text-primary)",
              )}
            >
              미니언즈 & 몬스터즈
            </div>
            <div className={cn(
              "h-3.5",
              "text-[12px] font-normal align-middle",
              "text-(--color-text-tertiary)  leading-[100%]",
            )}>
              2026.07.15
            </div>
          </article>
        </div>
        <nav className="flex w-full items-center justify-center gap-3 pb-12">
          <button
            type="button"
            aria-label="이전 페이지"
            className={arrowClassName}
            disabled
          >
            <span
              aria-hidden="true"
              className="block size-6 bg-current"
              style={arrowMaskStyle}
            />
          </button>
          <div className="flex h-9 w-fit items-center gap-1">
            <button
              type="button"
              className={cn(
                "flex size-9 shrink-0 items-center justify-center",
                "cursor-pointer rounded-[7px] border-0 px-1.5 py-px",
                "text-center text-[13px] leading-none font-bold tracking-normal",
                "bg-(--color-text-primary) text-(--color-bg-surface)"
              )}
            >
              1
            </button>
          </div>
          <button
            type="button"
            aria-label="다음 페이지"
            className={arrowClassName}
            disabled
          >
            <span
              aria-hidden="true"
              className="block size-6 rotate-180 bg-current"
              style={arrowMaskStyle}
            />
          </button>
        </nav>
      </div>
      <div className="fixed bottom-0 left-0 z-20 w-full">
        <Footer/>
      </div>
    </main>
  );
}
