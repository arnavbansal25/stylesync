"use client"

import { UserMenu } from "@/components/dashboard/user-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import type { DashboardUser } from "@/lib/dashboard"

type DashboardHeaderProps = {
  user: DashboardUser
  title?: string
}

export function DashboardHeader({ user, title = "Studio" }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-black/5 bg-white/90 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <SidebarTrigger className="text-brand-ink hover:bg-brand-blush" />
      <Separator orientation="vertical" className="mr-1 h-5 bg-black/10" />
      <h1 className="font-heading text-lg font-semibold tracking-tight text-brand-ink">
        {title}
      </h1>
      <div className="ml-auto flex items-center gap-3">
        <UserMenu user={user} />
      </div>
    </header>
  )
}
