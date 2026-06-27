import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

export function TestimonialCard({
  name,
  quote,
  rating,
  image,
}: {
  name: string
  quote: string
  rating: number
  image: string
}) {
  return (
    <blockquote className="flex h-full flex-col items-center rounded-3xl bg-white/80 p-6 text-center shadow-sm ring-1 ring-black/5">
      <p className="font-heading text-4xl leading-none text-brand-teal/35" aria-hidden="true">
        “
      </p>
      <Avatar size="lg" className="mt-2">
        <AvatarImage src={image} alt={name} />
        <AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
      </Avatar>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{quote}</p>
      <cite className="mt-3 text-sm font-semibold not-italic text-brand-ink">
        {name}
      </cite>
      <p
        className="mt-1 flex justify-center gap-0.5 text-brand-gold"
        aria-label={`${rating} out of 5 stars`}
      >
        {Array.from({ length: rating }).map((_, index) => (
          <Star key={index} className="size-3.5 fill-current" />
        ))}
      </p>
    </blockquote>
  )
}
