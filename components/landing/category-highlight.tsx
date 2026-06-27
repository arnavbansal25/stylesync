import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { SectionHeading } from "@/components/landing/section-heading"

export function CategoryHighlight({
  id,
  eyebrow,
  title,
  description,
  media,
  reverse = false,
}: {
  id: string
  eyebrow?: string
  title: string
  description: string
  media: ReactNode
  reverse?: boolean
}) {
  return (
    <article
      id={id}
      className={cn(
        "grid items-center gap-6 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8 lg:grid-cols-2",
        reverse && "lg:[&>div:first-child]:order-2"
      )}
    >
      <div className="overflow-hidden rounded-3xl bg-linear-to-br from-[#fdeef5] to-[#eef7ff] p-4">
        {media}
      </div>
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
    </article>
  )
}
