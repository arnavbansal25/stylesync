"use client"

import type { BeautyToolId } from "@/lib/beauty-studio"
import {
  type BeautyYouCamSettings,
  type EyeColorEffectSettings,
  type MakeupTryOnSettings,
  defaultBeautyYouCamSettings,
} from "@/lib/beauty-youcam-settings"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

type BeautyToolSettingsProps = {
  toolId: BeautyToolId
  selectedLookId: string | null
  value: BeautyYouCamSettings
  onChange: (next: BeautyYouCamSettings) => void
}

function SettingSlider({
  id,
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  id: string
  label: string
  hint?: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={id} className="text-xs font-medium text-brand-ink">
          {label}
        </Label>
        <span className="text-[11px] tabular-nums text-muted-foreground">
          {value}
        </span>
      </div>
      {hint ? (
        <p className="text-[10px] leading-snug text-muted-foreground">{hint}</p>
      ) : null}
      <Slider
        id={id}
        min={min}
        max={max}
        step={1}
        value={[value]}
        onValueChange={(vals) => {
          const next = Array.isArray(vals) ? vals[0] : vals
          if (typeof next === "number") onChange(next)
        }}
        className="py-1"
      />
    </div>
  )
}

export function BeautyToolSettings({
  toolId,
  selectedLookId,
  value,
  onChange,
}: BeautyToolSettingsProps) {
  if (toolId === "makeup-transfer") {
    return (
      <p className="text-xs leading-relaxed text-muted-foreground">
        Uses your source portrait and the selected reference look. No extra
        YouCam parameters are required for makeup transfer.
      </p>
    )
  }

  if (toolId === "makeup-try-on") {
    const settings =
      value.makeupTryOn ??
      defaultBeautyYouCamSettings("makeup-try-on").makeupTryOn!

    const patch = (partial: Partial<MakeupTryOnSettings>) =>
      onChange({
        makeupTryOn: { ...settings, ...partial },
      })

    return (
      <div className="space-y-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Addon presets (blush, liner, lips, etc.) come from your selected
          look. Adjust global skin smoothing below — sent as YouCam{" "}
          <code className="text-[10px]">skin_smooth</code> with version{" "}
          <code className="text-[10px]">1.0</code>.
        </p>
        <SettingSlider
          id="mu-skin-strength"
          label="Skin smooth strength"
          hint="Default 50. Higher = softer skin texture."
          min={0}
          max={100}
          value={settings.skinSmoothStrength}
          onChange={(n) => patch({ skinSmoothStrength: n })}
        />
        <SettingSlider
          id="mu-skin-color"
          label="Skin smooth color blend"
          hint="Default 50. Unifies skin tone while smoothing."
          min={0}
          max={100}
          value={settings.skinSmoothColorIntensity}
          onChange={(n) => patch({ skinSmoothColorIntensity: n })}
        />
        {selectedLookId === "all_coral" ? (
          <>
            <p className="text-[11px] font-medium text-brand-ink">
              Fresh Brows (eyebrows.pattern)
            </p>
            <SettingSlider
              id="brow-curvature"
              label="Brow curvature"
              hint="−100 straighter → +100 more arched. Default 0."
              min={-100}
              max={100}
              value={settings.eyebrowCurvature}
              onChange={(n) => patch({ eyebrowCurvature: n })}
            />
            <SettingSlider
              id="brow-thickness"
              label="Brow thickness"
              hint="Default 0."
              min={-100}
              max={100}
              value={settings.eyebrowThickness}
              onChange={(n) => patch({ eyebrowThickness: n })}
            />
            <SettingSlider
              id="brow-definition"
              label="Brow definition"
              hint="Default 50."
              min={0}
              max={100}
              value={settings.eyebrowDefinition}
              onChange={(n) => patch({ eyebrowDefinition: n })}
            />
          </>
        ) : null}
        {selectedLookId === "all_neat_nude" ? (
          <SettingSlider
            id="lip-transparency"
            label="Lip transparency"
            hint="Required for gloss lips (YouCam `transparencyIntensity`). Default 0."
            min={0}
            max={100}
            value={settings.lipTransparencyIntensity}
            onChange={(n) => patch({ lipTransparencyIntensity: n })}
          />
        ) : null}
      </div>
    )
  }

  if (toolId === "eye-color-try-on") {
    const settings =
      value.eyeColor ?? defaultBeautyYouCamSettings("eye-color-try-on").eyeColor!

    const patch = (partial: Partial<EyeColorEffectSettings>) =>
      onChange({
        eyeColor: { ...settings, ...partial },
      })

    return (
      <div className="space-y-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Lens reference comes from your selected look. These sliders map to
          YouCam Eye Color Lens VTO <code className="text-[10px]">effect</code>{" "}
          (API version <code className="text-[10px]">1.0</code>).
        </p>
        <SettingSlider
          id="eye-intensity"
          label="Lens intensity"
          hint="Required. Default 85 (range 1–100)."
          min={1}
          max={100}
          value={settings.intensity}
          onChange={(n) => patch({ intensity: n })}
        />
        <SettingSlider
          id="eye-enlargement"
          label="Iris enlargement"
          hint="Default 0. Subtle doll-eye effect when increased."
          min={0}
          max={100}
          value={settings.enlargement}
          onChange={(n) => patch({ enlargement: n })}
        />
        <SettingSlider
          id="eye-skin-strength"
          label="Skin smooth strength"
          hint="Default 50."
          min={0}
          max={100}
          value={settings.skin_smooth_strength}
          onChange={(n) => patch({ skin_smooth_strength: n })}
        />
        <SettingSlider
          id="eye-skin-color"
          label="Skin smooth color blend"
          hint="Default 50."
          min={0}
          max={100}
          value={settings.skin_smooth_color_intensity}
          onChange={(n) => patch({ skin_smooth_color_intensity: n })}
        />
      </div>
    )
  }

  return null
}
