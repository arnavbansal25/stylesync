import Image from "next/image"
import { cn } from "@/lib/utils"

export function OutfitCard({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <figure
      className={cn(
        "relative aspect-3/4 overflow-hidden rounded-2xl bg-muted shadow-sm",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 45vw, 180px"
        className="object-cover transition-transform duration-500 hover:scale-105"
      />
    </figure>
  )
}
