import { beautyLookOptionsByTool as looksByTool } from "@/lib/beauty-looks"

export type BeautyToolId =
  | "makeup-transfer"
  | "makeup-try-on"
  | "eye-color-try-on"

export type BeautyTool = {
  id: BeautyToolId
  name: string
  shortDescription: string
  image: string
}

export const beautyTools: BeautyTool[] = [
  {
    id: "makeup-transfer",
    name: "AI Makeup Transfer",
    shortDescription: "Copy a makeup look from a reference onto your photo.",
    image: "/ai-photo-editing-images/ai-makeup-transfer.jpg",
  },
  {
    id: "makeup-try-on",
    name: "AI Makeup Virtual Try-On",
    shortDescription: "Preview curated makeup styles on your portrait.",
    image: "/ai-photo-editing-images/ai-makeup-try-on.jpg",
  },
  {
    id: "eye-color-try-on",
    name: "AI Eye Color Virtual Try-On",
    shortDescription: "Experiment with lens colors on your eyes.",
    image: "/ai-photo-editing-images/eye-color-try-on.webp",
  },
]

export type BeautyTestImage = {
  id: string
  label: string
  src: string
}

/** Sample portraits from `public/normal-headshot/` (same faces across tools). */
export const beautyTestImages: BeautyTestImage[] = [
  { id: "girl1", label: "Girl 1", src: "/normal-headshot/girl1.png" },
  { id: "girl2", label: "Girl 2", src: "/normal-headshot/girl2.png" },
  { id: "girl3", label: "Girl 3", src: "/normal-headshot/girl3.png" },
  { id: "girl4", label: "Girl 4", src: "/normal-headshot/girl4.png" },
  { id: "boy1", label: "Boy 1", src: "/normal-headshot/boy1.png" },
]

export type BeautyLookOption = {
  id: string
  label: string
  thumbnail?: string
}

/** Curated YouCam look presets per tool (templates, refs, lens styles). */
export const beautyLookOptionsByTool: Record<BeautyToolId, BeautyLookOption[]> =
  looksByTool()

export function beautyToolById(id: BeautyToolId): BeautyTool {
  const tool = beautyTools.find((t) => t.id === id)
  if (!tool) {
    return beautyTools[0]
  }
  return tool
}
