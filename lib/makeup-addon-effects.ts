import type { YouCamMakeupEffect } from "@/lib/beauty-youcam-settings"

/**
 * YouCam AI Makeup Virtual Try-On effect stacks per addon card.
 * Pattern names validated via YouCam MCP `AI-Makeup-Virtual-Try-On-Pattern-Name`.
 */
export const makeupAddonEffectsByLookId: Record<string, YouCamMakeupEffect[]> = {
  all_pure: [
    {
      category: "blush",
      pattern: { name: "1color1" },
      palettes: [
        { color: "#e19f9f", colorIntensity: 60, texture: "matte" },
      ],
    },
  ],
  all_sunny: [
    {
      category: "eye_shadow",
      pattern: { name: "2colors1" },
      palettes: [
        { color: "#e85d6f", colorIntensity: 65, texture: "matte" },
        { color: "#f4a03a", colorIntensity: 55, texture: "matte" },
      ],
    },
    {
      category: "eye_liner",
      pattern: { name: "Arabic3" },
      palettes: [
        { color: "#c41e3a", colorIntensity: 72, texture: "matte" },
      ],
    },
  ],
  all_fresh: [
    {
      category: "eye_shadow",
      pattern: { name: "1color1" },
      palettes: [
        { color: "#3d3d3d", colorIntensity: 68, texture: "matte" },
      ],
    },
    {
      category: "eye_liner",
      pattern: { name: "Arabic3" },
      palettes: [
        { color: "#0a0a0a", colorIntensity: 88, texture: "matte" },
      ],
    },
  ],
  all_dreamy: [
    {
      category: "bronzer",
      pattern: { name: "Bronzer1" },
      palettes: [{ color: "#9a6b45", colorIntensity: 58 }],
    },
  ],
  all_coral: [
    {
      category: "eyebrows",
      pattern: {
        type: "shape",
        name: "SoftArch1",
        curvature: 0,
        thickness: 0,
        definition: 50,
      },
      palettes: [
        { color: "#4a3728", colorIntensity: 78, texture: "matte" },
      ],
    },
  ],
  all_neat_nude: [
    {
      category: "lip_color",
      shape: { name: "plump" },
      style: { type: "full" },
      morphology: { fullness: 25, wrinkless: 20 },
      palettes: [
        {
          color: "#e11c43",
          colorIntensity: 80,
          gloss: 75,
          texture: "gloss",
          transparencyIntensity: 0,
        },
      ],
    },
  ],
}
