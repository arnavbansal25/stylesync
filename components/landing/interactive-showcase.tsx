import { ShowcaseCard } from "@/components/landing/showcase-card"
import { showcaseItems } from "@/lib/landing"
import { cn } from "@/lib/utils"

export function InteractiveShowcase({ className }: { className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      <p className="mb-3 text-right text-[11px] font-semibold tracking-[0.28em] text-brand-ink/70 uppercase">
        Interactive Showcase
      </p>
      <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:justify-end">
        {showcaseItems.map((item) => (
          <ShowcaseCard key={item.id} {...item} className="w-[min(42vw,200px)] shrink-0 sm:w-[190px]" />
        ))}
      </div>
    </div>
  )
}
