"use client"

import Image from "next/image"
import type { ExtrasPresetOption } from "@/lib/extras-studio"
import { cn } from "@/lib/utils"

type ExtrasPresetCardsProps = {
  options: ExtrasPresetOption[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ExtrasPresetCards({
  options,
  selectedId,
  onSelect,
}: ExtrasPresetCardsProps) {
  return (
    <ul className="flex flex-col gap-2">
      {options.map((option) => {
        const selected = option.id === selectedId
        return (
          <li key={option.id}>
            <button
              type="button"
              onClick={() => onSelect(option.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-colors",
                selected
                  ? "border-brand-teal bg-brand-teal/5 ring-2 ring-brand-teal/25"
                  : "border-black/5 bg-brand-cream/30 hover:border-brand-teal/25 hover:bg-white"
              )}
              aria-pressed={selected}
            >
              {option.thumbnail ? (
                <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-black/5">
                  <Image
                    src={option.thumbnail}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </span>
              ) : null}
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block text-sm font-medium",
                    selected ? "text-brand-teal-dark" : "text-brand-ink"
                  )}
                >
                  {option.label}
                </span>
                {option.description ? (
                  <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                    {option.description}
                  </span>
                ) : null}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
