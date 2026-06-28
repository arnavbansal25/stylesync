import Link from "next/link"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  formatStudioProjectDate,
  type StudioProjectItem,
  studioProjectToolMeta,
} from "@/lib/studio-projects"
import { cn } from "@/lib/utils"

type ProjectGenerationCardProps = {
  project: StudioProjectItem
}

export function ProjectGenerationCard({ project }: ProjectGenerationCardProps) {
  const meta = studioProjectToolMeta(project.category, project.toolId)
  const ToolIcon = meta.toolIcon
  const CategoryIcon = meta.categoryIcon
  const dateLabel = formatStudioProjectDate(project.createdAt)

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow hover:border-brand-teal/25 hover:shadow-md"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-cream/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.previewPath}
          alt={`${meta.toolLabel} result`}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand-ink/55 via-transparent to-transparent"
          aria-hidden
        />
        <span
          className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-brand-ink shadow-sm backdrop-blur-sm sm:text-xs"
        >
          <CategoryIcon className="size-3 shrink-0 text-brand-teal" aria-hidden />
          {meta.categoryLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3.5 sm:p-4">
        <div className="flex items-start gap-2.5">
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl",
              project.category === "extras"
                ? "bg-brand-gold/15 text-brand-gold"
                : "bg-brand-teal/10 text-brand-teal-dark"
            )}
          >
            <ToolIcon className="size-4" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-sm font-semibold leading-snug text-brand-ink line-clamp-2">
              {meta.toolLabel}
            </h3>
            {dateLabel ? (
              <p className="mt-0.5 text-xs text-muted-foreground">{dateLabel}</p>
            ) : null}
          </div>
        </div>

        <div className="mt-auto flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-brand-teal/25 text-brand-ink hover:bg-brand-teal/10"
            render={<Link href={meta.categoryHref} />}
          >
            Open tool
          </Button>
          <Button
            size="sm"
            className="bg-brand-teal text-white hover:bg-brand-teal-dark"
            render={
              <a
                href={project.previewPath}
                download={`get-ready-ai-${project.id}.jpg`}
              />
            }
          >
            <Download className="size-4" aria-hidden />
            <span className="sr-only sm:not-sr-only sm:ml-1">Download</span>
          </Button>
        </div>
      </div>
    </article>
  )
}
