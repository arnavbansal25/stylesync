import type { ExtrasToolId } from "@/lib/extras-types"

export type ExtrasYouCamSettings = {
  headshotOutputCount?: number
}

export const DEFAULT_HEADSHOT_OUTPUT_COUNT = 1

export function defaultExtrasYouCamSettings(
  _toolId: ExtrasToolId
): ExtrasYouCamSettings {
  return { headshotOutputCount: DEFAULT_HEADSHOT_OUTPUT_COUNT }
}

export function parseExtrasYouCamSettings(
  raw: string | null | undefined
): ExtrasYouCamSettings {
  const defaults = defaultExtrasYouCamSettings("headshot")
  if (!raw?.trim()) return defaults
  try {
    const parsed = JSON.parse(raw) as ExtrasYouCamSettings
    const count = parsed.headshotOutputCount ?? defaults.headshotOutputCount!
    const clamped = Math.min(4, Math.max(1, Math.trunc(Number(count)) || 1))
    return { headshotOutputCount: clamped }
  } catch {
    return defaults
  }
}
