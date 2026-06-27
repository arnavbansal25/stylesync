import { BeforeAfterSlider } from "@/components/landing/before-after-slider"
import { cn } from "@/lib/utils"

export function ShowcaseCard({
  title,
  category,
  description,
  image,
  beforeClassName,
  afterClassName,
  className,
}: {
  title: string
  category: string
  description: string
  image: string
  beforeClassName?: string
  afterClassName?: string
  className?: string
}) {
  return (
    <article
      className={cn(
        "relative isolate h-[380px] overflow-hidden rounded-[22px] bg-black shadow-[0_18px_40px_-12px_rgba(0,0,0,0.35)] sm:h-[440px]",
        className
      )}
    >
      <BeforeAfterSlider
        src={image}
        alt={title}
        beforeClassName={beforeClassName}
        afterClassName={afterClassName}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-black/90 via-black/55 to-transparent px-3 pt-14 pb-3 text-white">
        <p className="text-[13px] font-semibold tracking-wide">{title}</p>
        <p className="mt-0.5 text-[10px] font-medium text-white/80">{category}</p>
        <p className="mt-1 text-[10px] leading-snug text-white/70">{description}</p>
      </div>
    </article>
  )
}
