import type { BeautyLookOption, BeautyToolId } from "@/lib/beauty-studio"

/** YouCam-provided sample portrait (makeup transfer integration guide). */
export const YOUCAM_SAMPLE_PORTRAIT_URL =
  "https://bcw-media.s3.ap-northeast-1.amazonaws.com/YCE_web_Makeup_Transfer_s1_img_be53c5c345.jpg"

type LookPreset = BeautyLookOption & {
  /** Public reference image URL (makeup transfer / eye color lens). */
  refUrl?: string
}

/** Reference makeup looks bundled in `public/makeup-transfer/`. */
const makeupTransferLooks: LookPreset[] = [
  {
    id: "mu-ref-01",
    label: "Look 1",
    thumbnail: "/makeup-transfer/webp_makeup_transfer_01.png",
    refUrl: "/makeup-transfer/webp_makeup_transfer_01.png",
  },
  {
    id: "mu-ref-02",
    label: "Look 2",
    thumbnail: "/makeup-transfer/webp_makeup_transfer_02_.png",
    refUrl: "/makeup-transfer/webp_makeup_transfer_02_.png",
  },
  {
    id: "mu-ref-03",
    label: "Look 3",
    thumbnail: "/makeup-transfer/webp_makeup_transfer_03.png",
    refUrl: "/makeup-transfer/webp_makeup_transfer_03.png",
  },
  {
    id: "mu-ref-04",
    label: "Look 4",
    thumbnail: "/makeup-transfer/webp_makeup_transfer_04_21e14d1789.png",
    refUrl: "/makeup-transfer/webp_makeup_transfer_04_21e14d1789.png",
  },
]

/** Curated from YouCam Look VTO templates (`AI-Look-Virtual-Try-On-Templates`). */
/** Addon cards → YouCam Makeup VTO effects in `lib/makeup-addon-effects.ts`. */
const makeupTryOnLooks: LookPreset[] = [
  {
    id: "all_pure",
    label: "Natural Blush",
    thumbnail: "/makeup-try-on/natural-blush.svg",
  },
  {
    id: "all_sunny",
    label: "Rose Glam",
    thumbnail: "/makeup-try-on/rose-glam.svg",
  },
  {
    id: "all_fresh",
    label: "Smoky Night",
    thumbnail: "/makeup-try-on/smoky-night.svg",
  },
  {
    id: "all_dreamy",
    label: "Bronze Glow",
    thumbnail: "/makeup-try-on/bronze-glow.svg",
  },
  {
    id: "all_coral",
    label: "Fresh Brows",
    thumbnail: "/makeup-try-on/fresh-brows.svg",
  },
  {
    id: "all_neat_nude",
    label: "Classic Red Lip",
    thumbnail: "/makeup-try-on/classic-red-lip.svg",
  },
]

/** Lens reference PNGs in `public/eye-lens/`. */
const eyeColorLooks: LookPreset[] = [
  {
    id: "lens-01",
    label: "Lens 1",
    thumbnail: "/eye-lens/webp_eye_len_01.png",
    refUrl: "/eye-lens/webp_eye_len_01.png",
  },
  {
    id: "lens-02",
    label: "Lens 2",
    thumbnail: "/eye-lens/webp_eye_len_02.png",
    refUrl: "/eye-lens/webp_eye_len_02.png",
  },
  {
    id: "lens-03",
    label: "Lens 3",
    thumbnail: "/eye-lens/webp_eye_len_03.png",
    refUrl: "/eye-lens/webp_eye_len_03.png",
  },
  {
    id: "lens-04",
    label: "Lens 4",
    thumbnail: "/eye-lens/webp_eye_len_04.png",
    refUrl: "/eye-lens/webp_eye_len_04.png",
  },
  {
    id: "lens-05",
    label: "Lens 5",
    thumbnail: "/eye-lens/webp_eye_len_05_a2cb4f207a.png",
    refUrl: "/eye-lens/webp_eye_len_05_a2cb4f207a.png",
  },
  {
    id: "lens-06",
    label: "Lens 6",
    thumbnail: "/eye-lens/webp_eye_len_06_a6bc280531.png",
    refUrl: "/eye-lens/webp_eye_len_06_a6bc280531.png",
  },
]

const presetsByTool: Record<BeautyToolId, LookPreset[]> = {
  "makeup-transfer": makeupTransferLooks,
  "makeup-try-on": makeupTryOnLooks,
  "eye-color-try-on": eyeColorLooks,
}

export function beautyLookPresetsForTool(toolId: BeautyToolId): LookPreset[] {
  return presetsByTool[toolId] ?? []
}

export function beautyLookOptionsByTool(): Record<BeautyToolId, BeautyLookOption[]> {
  return {
    "makeup-transfer": makeupTransferLooks.map(stripPreset),
    "makeup-try-on": makeupTryOnLooks.map(stripPreset),
    "eye-color-try-on": eyeColorLooks.map(stripPreset),
  }
}

export function resolveBeautyLook(
  toolId: BeautyToolId,
  lookId: string
): LookPreset | undefined {
  return beautyLookPresetsForTool(toolId).find((l) => l.id === lookId)
}

function stripPreset(preset: LookPreset): BeautyLookOption {
  return {
    id: preset.id,
    label: preset.label,
    thumbnail: preset.thumbnail,
  }
}

export function absoluteAppUrl(relativeOrAbsolute: string): string {
  if (relativeOrAbsolute.startsWith("http://") || relativeOrAbsolute.startsWith("https://")) {
    return relativeOrAbsolute
  }
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  return `${base.replace(/\/$/, "")}${relativeOrAbsolute.startsWith("/") ? "" : "/"}${relativeOrAbsolute}`
}
