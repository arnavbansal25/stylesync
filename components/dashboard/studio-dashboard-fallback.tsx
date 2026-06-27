import { Spinner } from "@/components/ui/spinner"

export function StudioDashboardFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-brand-blush/30">
      <Spinner className="size-8 text-brand-teal" />
    </div>
  )
}
