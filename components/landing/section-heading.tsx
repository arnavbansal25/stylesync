import { cn } from "@/lib/utils"

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: "left" | "center"
  className?: string
}) {
  return (
    <div
      className={cn(
        "max-w-xl space-y-2",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <p className="text-[11px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-heading text-3xl font-medium tracking-tight text-brand-ink sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  )
}
