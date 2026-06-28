import Image from "next/image"
import { studioProjectsBannerImage } from "@/lib/studio-projects"

type ProjectsBannerProps = {
  totalProjects: number
}

export function ProjectsBanner({ totalProjects }: ProjectsBannerProps) {
  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-brand-teal/15 bg-linear-to-br from-white via-brand-cream/40 to-brand-gold/10"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-brand-teal/10 blur-2xl"
        aria-hidden
      />
      <div className="grid items-center gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,11rem)] sm:gap-5 sm:p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,14rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-wide text-brand-teal-dark uppercase sm:text-xs">
            My projects
          </p>
          <h1 className="mt-1 font-heading text-xl font-semibold tracking-tight text-brand-ink sm:mt-1.5 sm:text-2xl sm:leading-snug">
            Your AI creations, all in one gallery
          </h1>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-brand-ink/70 sm:text-sm">
            Every successful Beauty, Fashion, and Extras run is saved here —
            browse results, see which tool was used, and download anytime.
          </p>
          <p className="mt-3 text-xs font-medium text-brand-teal-dark sm:text-sm">
            {totalProjects === 0
              ? "No generations yet — open a studio tool to get started."
              : `${totalProjects} saved generation${totalProjects === 1 ? "" : "s"}`}
          </p>
        </div>
        <div
          className="relative h-24 w-full overflow-hidden rounded-lg border border-black/5 shadow-sm sm:h-28 md:h-32"
        >
          <Image
            src={studioProjectsBannerImage}
            alt="Collage of AI-enhanced studio photos"
            fill
            sizes="(max-width: 640px) 100vw, 288px"
            className="object-cover"
            priority
          />
          <div
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand-ink/20 to-transparent"
            aria-hidden
          />
        </div>
      </div>
    </section>
  )
}
