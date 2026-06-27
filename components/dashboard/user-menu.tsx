"use client"

import Link from "next/link"
import { signOutAction } from "@/app/actions/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/components/dashboard/user-avatar"
import { displayName, type DashboardUser } from "@/lib/dashboard"
import { cn } from "@/lib/utils"

type UserMenuProps = {
  user: DashboardUser
  showName?: boolean
  className?: string
}

export function UserMenu({ user, showName = false, className }: UserMenuProps) {
  const name = displayName(user)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-2 rounded-full outline-none ring-brand-teal/40 focus-visible:ring-2",
          className
        )}
      >
        <UserAvatar user={user} size="sm" />
        {showName ? (
          <span className="hidden max-w-[9rem] truncate text-sm font-medium text-brand-ink sm:inline">
            {name}
          </span>
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <div className="px-2 py-1.5">
          <p className="truncate text-sm font-medium text-brand-ink">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/studio/billing" />}>
          Billing & credits
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/" />}>Back to home</DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={signOutAction}>
          <DropdownMenuItem
            variant="destructive"
            render={<button type="submit" className="w-full text-left" />}
          >
            Sign out
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
