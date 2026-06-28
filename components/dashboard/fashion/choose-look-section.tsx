"use client"

import Image from "next/image"
import type { FashionLookOption, FashionToolId } from "@/lib/fashion-studio"
import { fashionToolById } from "@/lib/fashion-studio"
import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"

type ChooseLookSectionProps = {
  toolId: FashionToolId
  options: FashionLookOption[]
  selectedLookId: string | null
  onSelectLook: (id: string) => void
}

export function ChooseLookSection({
  toolId,
  options,
  selectedLookId,
  onSelectLook,
}: ChooseLookSectionProps) {
  const tool = fashionToolById(toolId)

  if (options.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-xl border border-dashed border-brand-gold/30 bg-brand-cream/20 px-4 py-10 text-center"
      >
        <div
          className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5"
        >
          <Sparkles className="size-5 text-brand-gold" aria-hidden />
        </div>
        <p className="mt-3 text-sm font-medium text-brand-ink">
          Looks for {tool.name}
        </p>
        <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
          Reference product and worn-style presets will appear here for the
          selected tool.
        </p>
      </div>
    )
  }

  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {options.map((option) => {
        const selected = option.id === selectedLookId
        return (
          <li key={option.id}>
            <button
              type="button"
              onClick={() => onSelectLook(option.id)}
              className={cn(
                "flex w-full flex-col overflow-hidden rounded-lg border text-left transition-colors",
                selected
                  ? "border-brand-teal bg-brand-teal/5 ring-2 ring-brand-teal/30"
                  : "border-black/5 bg-white hover:border-brand-teal/25"
              )}
              aria-pressed={selected}
            >
              {option.thumbnail ? (
                <span className="relative aspect-square w-full bg-[#FAF8F5]">
                  <Image
                    src={option.thumbnail}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-contain p-1.5"
                  />
                </span>
              ) : null}
              <span
                className={cn(
                  "px-2 py-1.5 text-xs font-medium",
                  selected ? "text-brand-teal-dark" : "text-brand-ink"
                )}
              >
                {option.label}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
