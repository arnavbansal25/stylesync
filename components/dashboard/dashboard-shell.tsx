"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import type { DashboardUser } from "@/lib/dashboard"

type DashboardShellProps = {
  user: DashboardUser
  children: React.ReactNode
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  return (
    <SidebarProvider defaultOpen>
      <DashboardSidebar user={user} />
      <SidebarInset className="min-h-svh bg-brand-blush/30">
        <DashboardHeader user={user} />
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
