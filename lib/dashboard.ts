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

export type DashboardAiToolCard = {
  href: string
  name: string
  description: string
  image: string
}

/** Featured AI tools on the studio overview (matches sidebar categories; max 6). */
export const dashboardAiToolCards: DashboardAiToolCard[] = [
  {
    href: "/studio/ai/skin-face",
    name: "AI Skin & Face Analysis",
    description:
      "Analyze skin tone, texture, and facial structure for smarter retouching and care suggestions.",
    image: "/ai-photo-editing-images/ai-skin-analaysis.webp",
  },
  {
    href: "/studio/ai/beauty",
    name: "Beauty",
    description:
      "Try virtual makeup, transfer looks from reference photos, and refine color with AI precision.",
    image: "/ai-photo-editing-images/ai-makeup-try-on.jpg",
  },
  {
    href: "/studio/ai/fashion",
    name: "Fashion",
    description:
      "Preview outfits, bags, shoes, and hats on your photo without leaving the studio.",
    image: "/ai-photo-editing-images/ai-virtual-cloth-try-on.webp",
  },
  {
    href: "/studio/ai/hair-beard",
    name: "Hair & Beard",
    description:
      "Experiment with hairstyles, color, extensions, and beard styles before your next salon visit.",
    image: "/ai-photo-editing-images/hairstyle.jpg",
  },
  {
    href: "/studio/ai/extras",
    name: "AI Extras",
    description:
      "Enhance lighting, remove backgrounds, extend frames, and polish photos in one place.",
    image: "/ai-photo-editing-images/photo-enhance.jpg",
  },
  {
    href: "/studio/ai/extras",
    name: "AI Studio Generator",
    description:
      "Generate headshots, avatars, and creative portraits from a single upload with guided prompts.",
    image: "/ai-photo-editing-images/ai-studio-generator.jpg",
  },
]

export const DASHBOARD_AI_TOOLS_MAX = 6

export const studioOverviewBannerImage =
  "/ai-photo-editing-images/head-shot-generator.jpg"

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
