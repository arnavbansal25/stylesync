import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function SectionShell({
  id,
  className,
  children,
}: {
  id?: string
  className?: string
  children: ReactNode
}) {
  return (
    <section id={id} className={cn("w-full", className)}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  )
}
