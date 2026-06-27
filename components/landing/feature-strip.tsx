import { FeatureIcon } from "@/components/landing/feature-icon"
import { SectionShell } from "@/components/landing/section-shell"
import { featureStripItems } from "@/lib/landing"
import { cn } from "@/lib/utils"

const iconById = {
  "skin-face": "skin",
  "fashion-try-on": "fashion",
  "hair-beard": "hair",
} as const

export function FeatureStrip() {
  return (
    <SectionShell id="features" className="border-b border-black/5 bg-white py-10 sm:py-12">
      <div className="grid sm:grid-cols-3">
        {featureStripItems.map((item, index) => (
          <a
            key={item.id}
            href={item.href}
            className={cn(
              "flex flex-col items-center px-4 py-2 text-center no-underline sm:px-6",
              index > 0 && "sm:border-l sm:border-black/10"
            )}
          >
            <FeatureIcon name={iconById[item.id]} />
            <h3 className="mt-3 text-xs font-semibold tracking-[0.14em] text-brand-ink uppercase">
              {item.title}
            </h3>
            <p className="mt-2 max-w-[240px] text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </a>
        ))}
      </div>
    </SectionShell>
  )
}
