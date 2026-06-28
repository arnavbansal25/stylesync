export const YOUCAM_API_BASE =
  process.env.YOUCAM_API_BASE ?? "https://yce-api-01.makeupar.com"

import { STUDIO_GENERATION_CREDIT_COST } from "@/lib/studio-generation-cost"
import { DEFAULT_REMAINING_CREDITS } from "@/lib/dashboard"

export const BEAUTY_GENERATION_CREDIT_COST = STUDIO_GENERATION_CREDIT_COST
export const SIGNUP_FREE_CREDITS = DEFAULT_REMAINING_CREDITS

export type YouCamFileSlug =
  | "mu-transfer"
  | "look-vto"
  | "makeup-vto"
  | "eye-color-vto"
  | "cloth-v4"
  | "bag"
  | "shoes-transfer"
  | "hat"
  | "generative-fill"
  | "sod"
  | "colorize"
  | "out-paint"
  | "headshot"

export type YouCamTaskSlug = YouCamFileSlug

export function getYouCamSecretKey(): string {
  const key = process.env.YOUCAM_API_SECRET_KEY
  if (!key) {
    throw new Error("YOUCAM_API_SECRET_KEY is not configured")
  }
  return key
}
