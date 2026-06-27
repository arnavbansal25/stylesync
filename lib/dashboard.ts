import type { LucideIcon } from "lucide-react"
import {
  CreditCard,
  FolderKanban,
  LayoutDashboard,
  LayoutTemplate,
  Palette,
  ScanFace,
  Scissors,
  Shirt,
  Wand2,
} from "lucide-react"

export type DashboardNavItem = {
  href: string
  label: string
  icon: LucideIcon
}

/** Placeholder until billing / credits are stored in the database. */
export const DEFAULT_REMAINING_CREDITS = 50

export const dashboardNavItems: DashboardNavItem[] = [
  { href: "/studio", label: "Overview", icon: LayoutDashboard },
]

export const aiToolNavItems: DashboardNavItem[] = [
  {
    href: "/studio/ai/skin-face",
    label: "AI Skin & Face Analysis",
    icon: ScanFace,
  },
  { href: "/studio/ai/beauty", label: "Beauty", icon: Palette },
  { href: "/studio/ai/fashion", label: "Fashion", icon: Shirt },
  { href: "/studio/ai/hair-beard", label: "Hair & Beard", icon: Scissors },
  { href: "/studio/ai/extras", label: "AI Extras", icon: Wand2 },
]

export const workspaceNavItems: DashboardNavItem[] = [
  { href: "/studio/projects", label: "My Projects", icon: FolderKanban },
  { href: "/studio/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/studio/billing", label: "Billing", icon: CreditCard },
]

export type DashboardUser = {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  remainingCredits: number
}

export function displayName(user: Pick<DashboardUser, "name" | "email">) {
  if (user.name?.trim()) return user.name.trim()
  const local = user.email.split("@")[0]
  return local || "Member"
}

export function initialsFromUser(
  user: Pick<DashboardUser, "name" | "email">
): string {
  const name = displayName(user)
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}
