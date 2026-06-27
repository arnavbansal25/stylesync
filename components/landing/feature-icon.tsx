import { cn } from "@/lib/utils"

const icons = {
  skin: SkinIcon,
  fashion: FashionIcon,
  hair: HairIcon,
} as const

export function FeatureIcon({
  name,
  className,
}: {
  name: keyof typeof icons
  className?: string
}) {
  const Icon = icons[name]
  return (
    <span
      className={cn(
        "grid size-12 place-items-center text-brand-teal",
        className
      )}
    >
      <Icon />
    </span>
  )
}

function SkinIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-10 fill-none stroke-current">
      <path
        d="M16 34c2-8 6-14 8-18 2 4 6 10 8 18"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="24" cy="16" r="5" strokeWidth="1.8" />
      <path d="M14 38c3 2 7 3 10 3s7-1 10-3" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function FashionIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-10 fill-none stroke-current">
      <path
        d="M16 14 24 10l8 4 4 6-6 3v13H18V23l-6-3z"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M20 10c1 3 7 3 8 0" strokeWidth="1.8" />
    </svg>
  )
}

function HairIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-10 fill-none stroke-current">
      <path
        d="M16 32c0-10 3-18 8-20 5 2 8 10 8 20"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M18 34c2 4 4 6 6 6s4-2 6-6" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15 22c2 1 3 4 3 7M33 22c-2 1-3 4-3 7" strokeWidth="1.8" />
    </svg>
  )
}
