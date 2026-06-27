import { Suspense } from "react"
import { RequireAuthenticated } from "@/components/auth/require-authenticated"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { StudioDashboardFallback } from "@/components/dashboard/studio-dashboard-fallback"

export default function StudioRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<StudioDashboardFallback />}>
      <RequireAuthenticated />
      <DashboardLayout>{children}</DashboardLayout>
    </Suspense>
  )
}
