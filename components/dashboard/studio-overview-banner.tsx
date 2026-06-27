import Image from "next/image"
import { studioOverviewBannerImage } from "@/lib/dashboard"

export function StudioOverviewBanner() {
  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-brand-teal/15 bg-linear-to-br from-white via-brand-cream/50 to-brand-teal/10"
    >
      <div className="grid items-center gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,11rem)] sm:gap-5 sm:p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,14rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-wide text-brand-teal-dark uppercase sm:text-xs">
            Studio overview
          </p>
          <h2 className="mt-1 font-heading text-xl font-semibold tracking-tight text-brand-ink sm:mt-1.5 sm:text-2xl sm:leading-snug">
            AI Photo Editing redefined for you
          </h2>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-brand-ink/70 sm:text-sm">
            Launch any tool below to analyze, retouch, and style your photos with
            the same AI workflows you see in the sidebar — all in one place.
          </p>
        </div>
        <div
          className="relative h-24 w-full overflow-hidden rounded-lg border border-black/5 shadow-sm sm:h-28 md:h-32"
        >
          <Image
            src={studioOverviewBannerImage}
            alt="AI-generated professional headshot preview"
            fill
            sizes="(max-width: 640px) 100vw, 288px"
            className="object-cover"
            priority
          />
          <div
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand-ink/15 to-transparent"
            aria-hidden
          />
        </div>
      </div>
    </section>
  )
}
