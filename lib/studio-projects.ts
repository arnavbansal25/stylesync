import type { LucideIcon } from "lucide-react"
import {
  Droplets,
  Eraser,
  Expand,
  Eye,
  Footprints,
  HardHat,
  ImageMinus,
  Palette,
  ScanFace,
  Shirt,
  ShoppingBag,
  Sparkles,
  UserCircle,
  Wand2,
} from "lucide-react"
import { beautyTools } from "@/lib/beauty-studio"
import { extrasTools } from "@/lib/extras-studio"
import { fashionTools } from "@/lib/fashion-studio"

export const STUDIO_PROJECTS_PAGE_SIZE = 20

export type StudioProjectCategory = "beauty" | "fashion" | "extras"

export type StudioProjectItem = {
  id: string
  category: StudioProjectCategory
  toolId: string
  createdAt: string
  previewPath: string
}

export type StudioProjectToolMeta = {
  toolLabel: string
  categoryLabel: string
  categoryHref: string
  toolIcon: LucideIcon
  categoryIcon: LucideIcon
}

const categoryMeta: Record<
  StudioProjectCategory,
  { label: string; href: string; icon: LucideIcon }
> = {
  beauty: { label: "Beauty", href: "/studio/ai/beauty", icon: Palette },
  fashion: { label: "Fashion", href: "/studio/ai/fashion", icon: Shirt },
  extras: { label: "AI Extras", href: "/studio/ai/extras", icon: Wand2 },
}

const beautyToolIcons: Record<string, LucideIcon> = {
  "makeup-transfer": Sparkles,
  "makeup-try-on": Palette,
  "eye-color-try-on": Eye,
}

const fashionToolIcons: Record<string, LucideIcon> = {
  "clothes-vto": Shirt,
  "bag-vto": ShoppingBag,
  "shoes-vto": Footprints,
  "hat-vto": HardHat,
}

const extrasToolIcons: Record<string, LucideIcon> = {
  "object-remover": Eraser,
  "bg-remove": ImageMinus,
  colorize: Droplets,
  "photo-extender": Expand,
  headshot: UserCircle,
}

function toolLabelByCategory(
  category: StudioProjectCategory,
  toolId: string
): string {
  if (category === "beauty") {
    return beautyTools.find((t) => t.id === toolId)?.name ?? "Beauty AI"
  }
  if (category === "fashion") {
    return fashionTools.find((t) => t.id === toolId)?.name ?? "Fashion AI"
  }
  return extrasTools.find((t) => t.id === toolId)?.name ?? "AI Extras"
}

export function studioProjectPreviewPath(
  category: StudioProjectCategory,
  generationId: string
): string {
  switch (category) {
    case "beauty":
      return `/api/studio/beauty/result/${generationId}`
    case "fashion":
      return `/api/studio/fashion/result/${generationId}`
    case "extras":
      return `/api/studio/extras/result/${generationId}`
  }
}

export function studioProjectToolMeta(
  category: StudioProjectCategory,
  toolId: string
): StudioProjectToolMeta {
  const cat = categoryMeta[category]
  let toolIcon: LucideIcon = ScanFace
  if (category === "beauty") {
    toolIcon = beautyToolIcons[toolId] ?? Palette
  } else if (category === "fashion") {
    toolIcon = fashionToolIcons[toolId] ?? Shirt
  } else {
    toolIcon = extrasToolIcons[toolId] ?? Wand2
  }

  return {
    toolLabel: toolLabelByCategory(category, toolId),
    categoryLabel: cat.label,
    categoryHref: cat.href,
    toolIcon,
    categoryIcon: cat.icon,
  }
}

export const studioProjectsBannerImage =
  "/ai-photo-editing-images/photo-enhance.jpg"

export function formatStudioProjectDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}
