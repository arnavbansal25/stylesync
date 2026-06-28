import type { FashionLookOption, FashionToolId } from "@/lib/fashion-studio"

/** YouCam integration guide sample (also in `public/fashion-samples/source/`). */
export const YOUCAM_CLOTHES_SAMPLE_SRC_URL =
  "https://plugins-media.makeupar.com/strapi/assets/clothes_03_cccd5d4803.jpeg"

export const YOUCAM_CLOTHES_REF_FULL_BODY_URL =
  "https://plugins-media.makeupar.com/strapi/assets/clothes_reference_full_body_01_5a000d999f.png"

export type GarmentCategory =
  | "full_body"
  | "upper_body"
  | "lower_body"
  | "shoes"
  | "auto"
  | "outer"

type LookPreset = FashionLookOption & {
  refUrl: string
  garmentCategory?: GarmentCategory
}

const clothesLooks: LookPreset[] = [
  {
    id: "cloth-ref-full-body",
    label: "Full outfit",
    thumbnail: "/fashion-looks/clothes/full_body_01_5a000d999f.png",
    refUrl: YOUCAM_CLOTHES_REF_FULL_BODY_URL,
    garmentCategory: "full_body",
  },
  {
    id: "cloth-dress",
    label: "Evening dress",
    thumbnail: "/fashion-looks/clothes/dress_full.jpg",
    refUrl: "/fashion-looks/clothes/dress_full.jpg",
    garmentCategory: "full_body",
  },
  {
    id: "cloth-blazer",
    label: "Blazer top",
    thumbnail: "/fashion-looks/clothes/upper_blazer.jpg",
    refUrl: "/fashion-looks/clothes/upper_blazer.jpg",
    garmentCategory: "upper_body",
  },
  {
    id: "cloth-denim",
    label: "Denim lower",
    thumbnail: "/fashion-looks/clothes/lower_denim.jpg",
    refUrl: "/fashion-looks/clothes/lower_denim.jpg",
    garmentCategory: "lower_body",
  },
]

const bagLooks: LookPreset[] = [
  {
    id: "bag-tote",
    label: "Leather tote",
    thumbnail: "/fashion-looks/bag/tote_leather.jpg",
    refUrl: "/fashion-looks/bag/tote_leather.jpg",
  },
  {
    id: "bag-crossbody",
    label: "Crossbody",
    thumbnail: "/fashion-looks/bag/crossbody.jpg",
    refUrl: "/fashion-looks/bag/crossbody.jpg",
  },
  {
    id: "bag-structured",
    label: "Structured",
    thumbnail: "/fashion-looks/bag/structured.jpg",
    refUrl: "/fashion-looks/bag/structured.jpg",
  },
  {
    id: "bag-mini",
    label: "Mini purse",
    thumbnail: "/fashion-looks/bag/mini_purse.jpg",
    refUrl: "/fashion-looks/bag/mini_purse.jpg",
  },
]

const shoesLooks: LookPreset[] = [
  {
    id: "shoes-sneakers",
    label: "White sneakers",
    thumbnail: "/fashion-looks/shoes/white_sneakers.jpg",
    refUrl: "/fashion-looks/shoes/white_sneakers.jpg",
  },
  {
    id: "shoes-heels",
    label: "Heels",
    thumbnail: "/fashion-looks/shoes/heels.jpg",
    refUrl: "/fashion-looks/shoes/heels.jpg",
  },
  {
    id: "shoes-boots",
    label: "Boots",
    thumbnail: "/fashion-looks/shoes/boots.jpg",
    refUrl: "/fashion-looks/shoes/boots.jpg",
  },
  {
    id: "shoes-loafers",
    label: "Loafers",
    thumbnail: "/fashion-looks/shoes/loafers.jpg",
    refUrl: "/fashion-looks/shoes/loafers.jpg",
  },
]

const hatLooks: LookPreset[] = [
  {
    id: "hat-cap",
    label: "Baseball cap",
    thumbnail: "/fashion-looks/hat/cap.jpg",
    refUrl: "/fashion-looks/hat/cap.jpg",
  },
  {
    id: "hat-fedora",
    label: "Fedora",
    thumbnail: "/fashion-looks/hat/fedora.jpg",
    refUrl: "/fashion-looks/hat/fedora.jpg",
  },
  {
    id: "hat-beanie",
    label: "Beanie",
    thumbnail: "/fashion-looks/hat/beanie.jpg",
    refUrl: "/fashion-looks/hat/beanie.jpg",
  },
  {
    id: "hat-bucket",
    label: "Bucket hat",
    thumbnail: "/fashion-looks/hat/bucket.jpg",
    refUrl: "/fashion-looks/hat/bucket.jpg",
  },
]

const presetsByTool: Record<FashionToolId, LookPreset[]> = {
  "clothes-vto": clothesLooks,
  "bag-vto": bagLooks,
  "shoes-vto": shoesLooks,
  "hat-vto": hatLooks,
}

export function fashionLookPresetsForTool(toolId: FashionToolId): LookPreset[] {
  return presetsByTool[toolId] ?? []
}

export function fashionLookOptionsByTool(): Record<
  FashionToolId,
  FashionLookOption[]
> {
  return {
    "clothes-vto": clothesLooks.map(stripPreset),
    "bag-vto": bagLooks.map(stripPreset),
    "shoes-vto": shoesLooks.map(stripPreset),
    "hat-vto": hatLooks.map(stripPreset),
  }
}

export function resolveFashionLook(
  toolId: FashionToolId,
  lookId: string
): LookPreset | undefined {
  return fashionLookPresetsForTool(toolId).find((l) => l.id === lookId)
}

function stripPreset(preset: LookPreset): FashionLookOption {
  return {
    id: preset.id,
    label: preset.label,
    thumbnail: preset.thumbnail,
  }
}

export function absoluteAppUrl(relativeOrAbsolute: string): string {
  if (
    relativeOrAbsolute.startsWith("http://") ||
    relativeOrAbsolute.startsWith("https://")
  ) {
    return relativeOrAbsolute
  }
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  return `${base.replace(/\/$/, "")}${relativeOrAbsolute.startsWith("/") ? "" : "/"}${relativeOrAbsolute}`
}
