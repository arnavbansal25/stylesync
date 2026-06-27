import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { getDashboardUser } from "@/lib/dashboard-session"

type DashboardLayoutProps = {
  children: React.ReactNode
}

export async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getDashboardUser()
  if (!user) {
    redirect("/sign-in")
  }

  return <DashboardShell user={user}>{children}</DashboardShell>
}
