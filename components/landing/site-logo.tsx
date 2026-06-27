import Link from "next/link"
import { cn } from "@/lib/utils"
import { brand } from "@/lib/landing"

export function SiteLogo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5 no-underline", className)}
    >
      <span
        aria-hidden="true"
        className="grid size-8 place-items-center text-brand-ink"
      >
        <svg viewBox="0 0 32 32" className="size-7 fill-current">
          <path d="M16 2.5 18.4 13.6 29.5 16 18.4 18.4 16 29.5 13.6 18.4 2.5 16 13.6 13.6Z" />
        </svg>
      </span>
      <span className="text-[13px] font-semibold tracking-[0.22em] text-brand-ink">
        {brand.shortName}
      </span>
    </Link>
  )
}
