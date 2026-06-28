import type { BeautyToolId } from "@/lib/beauty-studio"

/** YouCam Eye Color Lens VTO `effect` object (API v1.0). */
export type EyeColorEffectSettings = {
  intensity: number
  enlargement: number
  skin_smooth_strength: number
  skin_smooth_color_intensity: number
}

/** Shared + addon tuning for AI Makeup Virtual Try-On (MCP-validated defaults). */
export type MakeupTryOnSettings = {
  skinSmoothStrength: number
  skinSmoothColorIntensity: number
  /** Required by API when `eyebrows.pattern.type` is `shape`. */
  eyebrowCurvature: number
  eyebrowThickness: number
  eyebrowDefinition: number
  /** Required for `lip_color` gloss / sheer / shimmer palettes. */
  lipTransparencyIntensity: number
}

export type BeautyYouCamSettings = {
  eyeColor?: EyeColorEffectSettings
  makeupTryOn?: MakeupTryOnSettings
}

export const DEFAULT_EYE_COLOR_EFFECT: EyeColorEffectSettings = {
  intensity: 85,
  enlargement: 0,
  skin_smooth_strength: 50,
  skin_smooth_color_intensity: 50,
}

export const DEFAULT_MAKEUP_TRY_ON_SETTINGS: MakeupTryOnSettings = {
  skinSmoothStrength: 50,
  skinSmoothColorIntensity: 50,
  eyebrowCurvature: 0,
  eyebrowThickness: 0,
  eyebrowDefinition: 50,
  lipTransparencyIntensity: 0,
}

export function defaultBeautyYouCamSettings(
  toolId: BeautyToolId
): BeautyYouCamSettings {
  switch (toolId) {
    case "eye-color-try-on":
      return { eyeColor: { ...DEFAULT_EYE_COLOR_EFFECT } }
    case "makeup-try-on":
      return { makeupTryOn: { ...DEFAULT_MAKEUP_TRY_ON_SETTINGS } }
    case "makeup-transfer":
      return {}
  }
}

export function parseBeautyYouCamSettings(
  toolId: BeautyToolId,
  raw: string | null | undefined
): BeautyYouCamSettings {
  const defaults = defaultBeautyYouCamSettings(toolId)
  if (!raw?.trim()) return defaults

  try {
    const parsed = JSON.parse(raw) as BeautyYouCamSettings
    if (toolId === "eye-color-try-on" && parsed.eyeColor) {
      return {
        eyeColor: clampEyeColor({
          ...defaults.eyeColor!,
          ...parsed.eyeColor,
        }),
      }
    }
    if (toolId === "makeup-try-on") {
      return {
        makeupTryOn: clampMakeupTryOn({
          ...defaults.makeupTryOn!,
          ...(parsed.makeupTryOn ?? {}),
        }),
      }
    }
  } catch {
    /* use defaults */
  }
  return defaults
}

function clampInt(value: unknown, min: number, max: number, fallback: number) {
  const n = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, Math.round(n)))
}

function clampEyeColor(s: EyeColorEffectSettings): EyeColorEffectSettings {
  return {
    intensity: clampInt(s.intensity, 1, 100, DEFAULT_EYE_COLOR_EFFECT.intensity),
    enlargement: clampInt(
      s.enlargement,
      0,
      100,
      DEFAULT_EYE_COLOR_EFFECT.enlargement
    ),
    skin_smooth_strength: clampInt(
      s.skin_smooth_strength,
      0,
      100,
      DEFAULT_EYE_COLOR_EFFECT.skin_smooth_strength
    ),
    skin_smooth_color_intensity: clampInt(
      s.skin_smooth_color_intensity,
      0,
      100,
      DEFAULT_EYE_COLOR_EFFECT.skin_smooth_color_intensity
    ),
  }
}

function clampMakeupTryOn(s: MakeupTryOnSettings): MakeupTryOnSettings {
  return {
    skinSmoothStrength: clampInt(
      s.skinSmoothStrength,
      0,
      100,
      DEFAULT_MAKEUP_TRY_ON_SETTINGS.skinSmoothStrength
    ),
    skinSmoothColorIntensity: clampInt(
      s.skinSmoothColorIntensity,
      0,
      100,
      DEFAULT_MAKEUP_TRY_ON_SETTINGS.skinSmoothColorIntensity
    ),
    eyebrowCurvature: clampInt(
      s.eyebrowCurvature,
      -100,
      100,
      DEFAULT_MAKEUP_TRY_ON_SETTINGS.eyebrowCurvature
    ),
    eyebrowThickness: clampInt(
      s.eyebrowThickness,
      -100,
      100,
      DEFAULT_MAKEUP_TRY_ON_SETTINGS.eyebrowThickness
    ),
    eyebrowDefinition: clampInt(
      s.eyebrowDefinition,
      0,
      100,
      DEFAULT_MAKEUP_TRY_ON_SETTINGS.eyebrowDefinition
    ),
    lipTransparencyIntensity: clampInt(
      s.lipTransparencyIntensity,
      0,
      100,
      DEFAULT_MAKEUP_TRY_ON_SETTINGS.lipTransparencyIntensity
    ),
  }
}

export type YouCamMakeupEffect = Record<string, unknown> & { category: string }

/** Fill required fields per YouCam MCP / S2S validation (see AI-Makeup-Virtual-Try-On). */
export function normalizeMakeupVtoEffects(
  effects: YouCamMakeupEffect[],
  settings: MakeupTryOnSettings
): YouCamMakeupEffect[] {
  return effects.map((effect) => {
    const next: YouCamMakeupEffect = { ...effect }

    if (next.category === "eyebrows" && next.pattern) {
      const pattern = {
        ...(next.pattern as Record<string, unknown>),
      }
      if (pattern.type === "shape") {
        pattern.curvature = settings.eyebrowCurvature
        pattern.thickness = settings.eyebrowThickness
        pattern.definition = settings.eyebrowDefinition
      }
      next.pattern = pattern
    }

    if (next.category === "lip_color" && Array.isArray(next.palettes)) {
      next.palettes = (next.palettes as Record<string, unknown>[]).map(
        (palette) => {
          const pal = { ...palette }
          const texture = pal.texture
          if (
            texture === "gloss" ||
            texture === "sheer" ||
            texture === "shimmer"
          ) {
            pal.transparencyIntensity = settings.lipTransparencyIntensity
          }
          if (texture === "gloss" && pal.gloss === undefined) {
            pal.gloss = 75
          }
          return pal
        }
      )
    }

    if (next.category === "blush" && Array.isArray(next.palettes)) {
      next.palettes = (next.palettes as Record<string, unknown>[]).map(
        (palette) => {
          const pal = { ...palette }
          if (pal.texture === "satin" && pal.glowStrength === undefined) {
            pal.glowStrength = 40
          }
          return pal
        }
      )
    }

    return next
  })
}

export function buildMakeupVtoEffects(
  addonEffects: YouCamMakeupEffect[],
  settings: MakeupTryOnSettings
): YouCamMakeupEffect[] {
  const withoutSkin = addonEffects.filter((e) => e.category !== "skin_smooth")
  const merged = [
    {
      category: "skin_smooth",
      skinSmoothStrength: settings.skinSmoothStrength,
      skinSmoothColorIntensity: settings.skinSmoothColorIntensity,
    },
    ...withoutSkin,
  ]
  return normalizeMakeupVtoEffects(merged, settings)
}
