"use client"

import Image from "next/image"
import type { BeautyTool, BeautyToolId } from "@/lib/beauty-studio"
import { cn } from "@/lib/utils"

type BeautyToolPickerProps = {
  tools: BeautyTool[]
  selectedId: BeautyToolId
  onSelect: (id: BeautyToolId) => void
}

export function BeautyToolPicker({
  tools,
  selectedId,
  onSelect,
}: BeautyToolPickerProps) {
  return (
    <ul className="flex list-none flex-col gap-2.5">
      {tools.map((tool) => {
        const isActive = tool.id === selectedId
        return (
          <li key={tool.id}>
            <button
              type="button"
              onClick={() => onSelect(tool.id)}
              className={cn(
                "flex w-full overflow-hidden rounded-xl border text-left transition-all outline-none focus-visible:ring-3 focus-visible:ring-brand-teal/30",
                isActive
                  ? "border-brand-teal bg-brand-teal/5 shadow-sm ring-2 ring-brand-teal/40"
                  : "border-black/5 bg-white hover:border-brand-teal/25 hover:shadow-sm"
              )}
              aria-pressed={isActive}
            >
              <div className="relative h-[4.5rem] w-[4.75rem] shrink-0 sm:h-[5rem] sm:w-20">
                <Image
                  src={tool.image}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
                {isActive ? (
                  <span
                    className="absolute inset-0 bg-brand-teal/10"
                    aria-hidden
                  />
                ) : null}
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-2.5 sm:px-3.5">
                <span
                  className={cn(
                    "font-heading text-xs font-semibold leading-snug sm:text-[13px]",
                    isActive ? "text-brand-teal-dark" : "text-brand-ink"
                  )}
                >
                  {tool.name}
                </span>
                <span className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
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
