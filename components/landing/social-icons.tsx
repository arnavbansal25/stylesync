import { cn } from "@/lib/utils"

export function SocialIcon({
  name,
  className,
}: {
  name: "instagram" | "x" | "tiktok"
  className?: string
}) {
  const paths = {
    instagram:
      "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 4.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zm6.25-.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z",
    x: "M4 4l6.2 8.4L4.2 20H6l4.9-5.3L15 20h4l-6.5-8.8L19.1 4H17.1l-4.5 4.9L9.4 4H4z",
    tiktok:
      "M14 4c.6 2.4 2.4 4.2 4.8 4.6V12c-1.8 0-3.5-.6-4.8-1.7v5.2a5.5 5.5 0 1 1-5.5-5.5c.3 0 .6 0 .9.1v3a2.5 2.5 0 1 0 2.2 2.5V4h2.4z",
  } as const

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-4 fill-current", className)}
    >
      <path d={paths[name]} />
    </svg>
  )
}
