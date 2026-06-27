"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles } from "lucide-react"
import { SiteLogo } from "@/components/landing/site-logo"
import { UserAvatar } from "@/components/dashboard/user-avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  aiToolNavItems,
  dashboardNavItems,
  displayName,
  workspaceNavItems,
  type DashboardUser,
} from "@/lib/dashboard"
import { cn } from "@/lib/utils"

function isNavActive(pathname: string, href: string) {
  if (href === "/studio") {
    return pathname === "/studio"
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

type DashboardSidebarProps = {
  user: DashboardUser
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const name = displayName(user)

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-black/5 bg-white [&_[data-sidebar=sidebar]]:bg-white"
    >
      <SidebarHeader className="border-b border-black/5 px-3 py-4">
        <SiteLogo href="/studio" className="group-data-[collapsible=icon]:justify-center" />
      </SidebarHeader>

      <SidebarContent className="px-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold tracking-wide text-brand-ink/50 uppercase">
            Dashboard options
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isNavActive(pathname, item.href)}
                    tooltip={item.label}
                    className={cn(
                      "text-brand-ink/80",
                      "data-[active=true]:bg-brand-teal/15 data-[active=true]:text-brand-ink data-[active=true]:font-medium"
                    )}
                    render={<Link href={item.href} />}
                  >
                    <item.icon className="text-brand-teal" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-black/5" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold tracking-wide text-brand-ink/50 uppercase">
            AI Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {aiToolNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isNavActive(pathname, item.href)}
                    tooltip={item.label}
                    className={cn(
                      "text-brand-ink/80",
                      "data-[active=true]:bg-brand-teal/15 data-[active=true]:text-brand-ink data-[active=true]:font-medium"
                    )}
                    render={<Link href={item.href} />}
                  >
                    <item.icon className="text-brand-teal" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-black/5" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {workspaceNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isNavActive(pathname, item.href)}
                    tooltip={item.label}
                    className={cn(
                      "text-brand-ink/80",
                      "data-[active=true]:bg-brand-teal/15 data-[active=true]:text-brand-ink data-[active=true]:font-medium"
                    )}
                    render={<Link href={item.href} />}
                  >
                    <item.icon className="text-brand-gold" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-black/5 p-3">
        <div
          className="mb-3 rounded-xl border border-brand-gold/25 bg-brand-cream/40 px-3 py-2.5 group-data-[collapsible=icon]:hidden"
        >
          <div className="flex items-center gap-2 text-brand-gold-dark">
            <Sparkles className="size-4 shrink-0" aria-hidden />
            <p className="text-xs font-medium text-brand-ink/70">Credits remaining</p>
          </div>
          <p className="mt-0.5 font-heading text-xl font-semibold text-brand-ink">
            {user.remainingCredits}
          </p>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg px-1 py-1 group-data-[collapsible=icon]:justify-center">
          <UserAvatar user={user} size="sm" />
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-medium text-brand-ink">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
