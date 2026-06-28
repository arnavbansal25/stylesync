import type { FashionToolId } from "@/lib/fashion-studio"
import type { GarmentCategory } from "@/lib/fashion-looks"

export type FashionGender = "female" | "male"

export type BagStyle =
  | "random"
  | "style_parisian_chic"
  | "style_urban_chic"
  | "style_mediterranean_chic"
  | "style_art_deco_style"

export type HatStyle =
  | "random"
  | "style_sporty_casual"
  | "style_urban_fashion"
  | "style_vacation_casual"
  | "style_warm_cozy"
  | "style_bohemian"

export type ClothesVtoSettings = {
  garmentCategory: GarmentCategory
  changeShoes: boolean
  filterMultiPerson: "off" | "normal" | "strict"
}

export type AccessoryVtoSettings = {
  gender: FashionGender
  style: BagStyle | HatStyle | "random"
}

export type FashionYouCamSettings = {
  clothes?: ClothesVtoSettings
  accessory?: AccessoryVtoSettings
}

export const DEFAULT_CLOTHES_VTO_SETTINGS: ClothesVtoSettings = {
  garmentCategory: "full_body",
  changeShoes: true,
  filterMultiPerson: "off",
}

export const DEFAULT_ACCESSORY_VTO_SETTINGS: AccessoryVtoSettings = {
  gender: "female",
  style: "random",
}

export function defaultFashionYouCamSettings(
  toolId: FashionToolId
): FashionYouCamSettings {
  if (toolId === "clothes-vto") {
    return { clothes: { ...DEFAULT_CLOTHES_VTO_SETTINGS } }
  }
  return { accessory: { ...DEFAULT_ACCESSORY_VTO_SETTINGS } }
}

export function parseFashionYouCamSettings(
  toolId: FashionToolId,
  raw: string | null | undefined
): FashionYouCamSettings {
  const defaults = defaultFashionYouCamSettings(toolId)
  if (!raw?.trim()) return defaults

  try {
    const parsed = JSON.parse(raw) as FashionYouCamSettings
    if (toolId === "clothes-vto" && parsed.clothes) {
      return {
        clothes: {
          ...defaults.clothes!,
          ...parsed.clothes,
        },
      }
    }
    if (toolId !== "clothes-vto" && parsed.accessory) {
      return {
        accessory: {
          ...defaults.accessory!,
          ...parsed.accessory,
        },
      }
    }
  } catch {
    /* use defaults */
  }
  return defaults
}

export const BAG_STYLE_OPTIONS: { value: BagStyle; label: string }[] = [
  { value: "random", label: "Random (API picks)" },
  { value: "style_parisian_chic", label: "Parisian chic" },
  { value: "style_urban_chic", label: "Urban chic" },
  { value: "style_mediterranean_chic", label: "Mediterranean chic" },
  { value: "style_art_deco_style", label: "Art deco" },
]

export const HAT_STYLE_OPTIONS: { value: HatStyle; label: string }[] = [
  { value: "random", label: "Random (API picks)" },
  { value: "style_sporty_casual", label: "Sporty casual" },
  { value: "style_urban_fashion", label: "Urban fashion" },
  { value: "style_vacation_casual", label: "Vacation casual" },
  { value: "style_warm_cozy", label: "Warm & cozy" },
  { value: "style_bohemian", label: "Bohemian" },
]

export const GARMENT_CATEGORY_OPTIONS: {
  value: GarmentCategory
  label: string
}[] = [
  { value: "full_body", label: "Full body" },
  { value: "upper_body", label: "Upper body" },
  { value: "lower_body", label: "Lower body" },
  { value: "outer", label: "Outerwear" },
  { value: "auto", label: "Auto detect" },
]
