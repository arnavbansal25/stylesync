import { extrasPresetsByTool } from "@/lib/extras-presets"
import type { ExtrasToolId } from "@/lib/extras-types"

export type { ExtrasToolId } from "@/lib/extras-types"

export type ExtrasTool = {
  id: ExtrasToolId
  name: string
  shortDescription: string
  image: string
  accent: "teal" | "gold"
}

export const extrasTools: ExtrasTool[] = [
  {
    id: "object-remover",
    name: "AI Object Remover",
    shortDescription: "Erase distractions with a guided mask — clean, natural fills.",
    image: "/ai-photo-editing-images/object-remove.jpg",
    accent: "teal",
  },
  {
    id: "bg-remove",
    name: "AI Photo Background Remove",
    shortDescription: "Cut out people, products, and pets with crisp edges.",
    image: "/ai-photo-editing-images/bg-remove.jpg",
    accent: "gold",
  },
  {
    id: "colorize",
    name: "AI Photo Colorize",
    shortDescription: "Bring black-and-white photos back to life in seconds.",
    image: "/ai-photo-editing-images/photo-colorize.jpg",
    accent: "teal",
  },
  {
    id: "photo-extender",
    name: "AI Photo Extender",
    shortDescription: "Outpaint your frame — widen or lengthen the scene.",
    image: "/ai-photo-editing-images/image-extender.jpg",
    accent: "gold",
  },
  {
    id: "headshot",
    name: "AI Headshot Generator",
    shortDescription: "Studio-quality portraits from a casual selfie.",
    image: "/ai-photo-editing-images/head-shot-generator.jpg",
    accent: "teal",
  },
]

export type ExtrasTestImage = {
  id: string
  label: string
  src: string
}

export const extrasTestImagesByTool: Record<ExtrasToolId, ExtrasTestImage[]> = {
  "object-remover": [
    {
      id: "object-scene",
      label: "Street scene",
      src: "/extras-samples/object-remove-scene.jpg",
    },
    {
      id: "headshot-01",
      label: "Portrait",
      src: "/extras-samples/headshot-source-01.jpg",
    },
  ],
  "bg-remove": [
    {
      id: "product",
      label: "Product",
      src: "/extras-samples/bg-remove-product.jpg",
    },
    {
      id: "headshot-02",
      label: "Portrait",
      src: "/extras-samples/headshot-source-02.jpg",
    },
    { id: "girl1", label: "Studio 1", src: "/normal-headshot/girl2.png" },
  ],
  colorize: [
    {
      id: "bw-01",
      label: "Vintage B&W",
      src: "/extras-samples/colorize-bw-01.jpg",
    },
  ],
  "photo-extender": [
    {
      id: "landscape",
      label: "Landscape",
      src: "/extras-samples/extender-landscape.jpg",
    },
    {
      id: "object-scene",
      label: "Wide scene",
      src: "/extras-samples/object-remove-scene.jpg",
    },
  ],
  headshot: [
    {
      id: "headshot-01",
      label: "Selfie 1",
      src: "/extras-samples/headshot-source-01.jpg",
    },
    {
      id: "headshot-02",
      label: "Selfie 2",
      src: "/extras-samples/headshot-source-02.jpg",
    },
    { id: "girl1", label: "Girl 1", src: "/normal-headshot/girl1.png" },
  ],
}

export type ExtrasPresetOption = {
  id: string
  label: string
  description?: string
  thumbnail?: string
}

export const extrasPresetOptionsByTool: Record<
  ExtrasToolId,
  ExtrasPresetOption[]
> = Object.fromEntries(
  Object.entries(extrasPresetsByTool()).map(([toolId, presets]) => [
    toolId,
    presets.map((p) => ({
      id: p.id,
      label: p.label,
      description: p.description,
      thumbnail: p.thumbnail,
    })),
  ])
) as Record<ExtrasToolId, ExtrasPresetOption[]>

export function extrasToolById(id: ExtrasToolId): ExtrasTool {
  return extrasTools.find((t) => t.id === id) ?? extrasTools[0]
}
