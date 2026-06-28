"use client"

import type { ExtrasToolId } from "@/lib/extras-types"
import type { ExtrasYouCamSettings } from "@/lib/extras-youcam-settings"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ExtrasToolSettingsProps = {
  toolId: ExtrasToolId
  value: ExtrasYouCamSettings
  onChange: (next: ExtrasYouCamSettings) => void
}

export function ExtrasToolSettings({
  toolId,
  value,
  onChange,
}: ExtrasToolSettingsProps) {
  if (toolId !== "headshot") {
    return (
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        This tool uses YouCam defaults for your selected preset. Upload a clear
        photo for the best result.
      </p>
    )
  }

  const count = value.headshotOutputCount ?? 1

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-brand-ink">
        Variations per run
      </Label>
      <Select
        value={String(count)}
        onValueChange={(v) => {
          if (!v) return
          onChange({ headshotOutputCount: Number.parseInt(v, 10) })
        }}
      >
        <SelectTrigger className="h-9 w-full text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1 headshot</SelectItem>
          <SelectItem value="2">2 headshots</SelectItem>
          <SelectItem value="4">4 headshots</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-[10px] text-muted-foreground">
        More variations use more YouCam units; we return the first result for
        preview.
      </p>
    </div>
  )
}
