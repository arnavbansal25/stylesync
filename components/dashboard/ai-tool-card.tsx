import Image from "next/image"
import Link from "next/link"
import type { DashboardAiToolCard } from "@/lib/dashboard"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AiToolCardProps = {
  tool: DashboardAiToolCard
  className?: string
}

export function AiToolCard({ tool, className }: AiToolCardProps) {
  return (
    <article
      className={cn(
        "flex overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow hover:border-brand-teal/25 hover:shadow-md",
        className
      )}
    >
      <div
        className="relative min-h-[8.75rem] w-[8.5rem] shrink-0 self-stretch sm:min-h-[9.25rem] sm:w-36 md:w-[9.5rem]"
      >
        <Image
          src={tool.image}
          alt=""
          fill
          sizes="(max-width: 640px) 136px, 152px"
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center px-3.5 py-3 sm:px-4 sm:py-3.5">
        <h3 className="font-heading text-sm font-semibold leading-snug text-brand-ink sm:text-[15px]">
          {tool.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
          {tool.description}
        </p>
        <Button
          size="sm"
          className="mt-2.5 w-fit bg-brand-teal text-white hover:bg-brand-teal-dark"
          render={<Link href={tool.href} />}
        >
          Open tool
        </Button>
      </div>
    </article>
  )
}
