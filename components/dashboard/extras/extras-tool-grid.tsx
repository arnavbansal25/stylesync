"use client"

import Image from "next/image"
import type { ExtrasTool, ExtrasToolId } from "@/lib/extras-studio"
import { cn } from "@/lib/utils"
import { Check, Sparkles } from "lucide-react"

type ExtrasToolGridProps = {
  tools: ExtrasTool[]
  selectedId: ExtrasToolId
  onSelect: (id: ExtrasToolId) => void
}

export function ExtrasToolGrid({
  tools,
  selectedId,
  onSelect,
}: ExtrasToolGridProps) {
  return (
    <ul className="flex flex-col gap-2.5" role="list">
      {tools.map((tool) => {
        const active = tool.id === selectedId
        return (
          <li key={tool.id}>
            <button
              type="button"
              onClick={() => onSelect(tool.id)}
              className={cn(
                "group relative flex w-full flex-col overflow-hidden rounded-2xl border text-left transition-all outline-none focus-visible:ring-3 focus-visible:ring-brand-teal/30",
                active
                  ? "border-brand-teal bg-linear-to-br from-brand-teal/10 via-white to-brand-gold/5 shadow-md ring-2 ring-brand-teal/35"
                  : "border-black/5 bg-white hover:border-brand-teal/30 hover:shadow-sm"
              )}
              aria-pressed={active}
            >
              <div className="relative aspect-[2.4/1] w-full overflow-hidden bg-brand-cream/40">
                <Image
                  src={tool.image}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 22rem"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div
                  className={cn(
                    "absolute inset-0 bg-linear-to-t from-brand-ink/55 via-transparent to-transparent",
                    active && "from-brand-teal-dark/50"
                  )}
                />
                {active ? (
                  <span
                    className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-white/95 text-brand-teal shadow-sm"
                    aria-hidden
                  >
                    <Check className="size-4" strokeWidth={2.5} />
                  </span>
                ) : null}
              </div>
              <div className="flex flex-col gap-1 px-3.5 py-3">
                <span className="flex items-start gap-1.5">
                  {active ? (
                    <Sparkles
                      className="mt-0.5 size-3.5 shrink-0 text-brand-gold"
                      aria-hidden
                    />
                  ) : null}
                  <span
                    className={cn(
                      "font-heading text-[13px] font-semibold leading-snug",
                      active ? "text-brand-teal-dark" : "text-brand-ink"
                    )}
                  >
                    {tool.name}
                  </span>
                </span>
                <span className="text-[11px] leading-relaxed text-muted-foreground">
                  {tool.shortDescription}
                </span>
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
