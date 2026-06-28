import type { ExtrasToolId, ExtenderDirection } from "@/lib/extras-types"

export type { ExtenderDirection } from "@/lib/extras-types"

export type ExtrasPreset = {
  id: string
  label: string
  description?: string
  thumbnail?: string
  /** Object remover — mask under `public/`. */
  maskPath?: string
  /** Headshot — YouCam `template_id`. */
  headshotTemplateId?: string
  extenderDirection?: ExtenderDirection
}

const objectRemoverPresets: ExtrasPreset[] = [
  {
    id: "remove-center",
    label: "Center object",
    description: "Uses the bundled ellipse mask on your photo.",
    thumbnail: "/extras-samples/object-remove-scene.jpg",
    maskPath: "/extras-samples/object-remove-mask.png",
  },
]

const bgRemovePresets: ExtrasPreset[] = [
  {
    id: "standard",
    label: "Standard cutout",
    description: "Best for products and portraits on simple backgrounds.",
    thumbnail: "/extras-samples/bg-remove-product.jpg",
  },
]

const colorizePresets: ExtrasPreset[] = [
  {
    id: "auto-tone",
    label: "Auto colorize",
    description: "YouCam generates rich color from monochrome sources.",
    thumbnail: "/extras-samples/colorize-bw-01.jpg",
  },
]

const extenderPresets: ExtrasPreset[] = [
  {
    id: "extend-horizontal",
    label: "Widen frame",
    description: "Adds canvas to the left and right.",
    thumbnail: "/extras-samples/extender-landscape.jpg",
    extenderDirection: "horizontal",
  },
  {
    id: "extend-vertical",
    label: "Tall frame",
    description: "Adds canvas above and below.",
    thumbnail: "/extras-samples/extender-landscape.jpg",
    extenderDirection: "vertical",
  },
  {
    id: "extend-all",
    label: "Expand all sides",
    description: "Gentle outpaint on every edge.",
    thumbnail: "/extras-samples/extender-landscape.jpg",
    extenderDirection: "all-sides",
  },
]

/** Curated from GET `/s2s/v2.0/task/template/headshot` (YouCam MCP). */
const headshotPresets: ExtrasPreset[] = [
  {
    id: "hs-classic-navy",
    label: "Classic navy suit",
    description: "Professional LinkedIn-ready look.",
    thumbnail: "/extras-samples/headshot-source-01.jpg",
    headshotTemplateId: "male_classic_navy_suit",
  },
  {
    id: "hs-medical",
    label: "Medical expert",
    description: "Clean clinical portrait style.",
    thumbnail: "/extras-samples/headshot-source-02.jpg",
    headshotTemplateId: "female_medical_expert",
  },
  {
    id: "hs-casual-polo",
    label: "Casual polo",
    description: "Relaxed studio lighting.",
    thumbnail: "/normal-headshot/girl1.png",
    headshotTemplateId: "female_white_polo",
  },
]

const byTool: Record<ExtrasToolId, ExtrasPreset[]> = {
  "object-remover": objectRemoverPresets,
  "bg-remove": bgRemovePresets,
  colorize: colorizePresets,
  "photo-extender": extenderPresets,
  headshot: headshotPresets,
}

export function extrasPresetsByTool(): Record<ExtrasToolId, ExtrasPreset[]> {
  return byTool
}

export function resolveExtrasPreset(
  toolId: ExtrasToolId,
  presetId: string
): ExtrasPreset | undefined {
  return byTool[toolId]?.find((p) => p.id === presetId)
}
