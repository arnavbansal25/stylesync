import { cn } from "@/lib/utils"

type StudioPanelSectionProps = {
  title: string
  description?: string
  className?: string
  children: React.ReactNode
}

export function StudioPanelSection({
  title,
  description,
  className,
  children,
}: StudioPanelSectionProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-black/5 bg-white/90 p-4 shadow-sm sm:p-5",
        className
      )}
    >
      <div className="mb-4">
        <h3 className="font-heading text-sm font-semibold text-brand-ink sm:text-[15px]">
          {title}
        </h3>
        {description ? (
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  )
}
