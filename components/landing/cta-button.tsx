import type { ComponentProps } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CtaButtonProps = ComponentProps<typeof Button> & {
  tone?: "teal" | "gold" | "ghost"
}

export function CtaButton({
  tone = "teal",
  className,
  ...props
}: CtaButtonProps) {
  return (
    <Button
      className={cn(
        "h-10 rounded-full px-5 text-sm font-semibold tracking-wide shadow-sm",
        tone === "teal" &&
          "bg-brand-teal text-white hover:bg-brand-teal-dark",
        tone === "gold" &&
          "border-0 bg-linear-to-r from-[#d9b45a] to-[#b8893f] text-white hover:from-[#cfaa52] hover:to-[#a67d36]",
        tone === "ghost" &&
          "bg-transparent text-foreground shadow-none hover:bg-muted",
        className
      )}
      {...props}
    />
  )
}
