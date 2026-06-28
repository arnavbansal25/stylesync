"use client"

import type { FashionToolId } from "@/lib/fashion-studio"
import {
  BAG_STYLE_OPTIONS,
  GARMENT_CATEGORY_OPTIONS,
  HAT_STYLE_OPTIONS,
  type FashionYouCamSettings,
  defaultFashionYouCamSettings,
} from "@/lib/fashion-youcam-settings"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

type FashionToolSettingsProps = {
  toolId: FashionToolId
  value: FashionYouCamSettings
  onChange: (next: FashionYouCamSettings) => void
}

export function FashionToolSettings({
  toolId,
  value,
  onChange,
}: FashionToolSettingsProps) {
  if (toolId === "clothes-vto") {
    const clothes =
      value.clothes ?? defaultFashionYouCamSettings("clothes-vto").clothes!

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-brand-ink">
            Garment category
          </Label>
          <Select
            value={clothes.garmentCategory}
            onValueChange={(garmentCategory) =>
              onChange({
                clothes: {
                  ...clothes,
                  garmentCategory: garmentCategory as typeof clothes.garmentCategory,
                },
              })
            }
          >
            <SelectTrigger className="h-9 w-full text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {GARMENT_CATEGORY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[10px] leading-snug text-muted-foreground">
            Each look preset also sets a category; override here if needed.
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-lg border border-black/5 bg-white px-3 py-2.5">
          <div>
            <Label
              htmlFor="change-shoes"
              className="text-xs font-medium text-brand-ink"
            >
              Swap shoes (full / lower body)
            </Label>
            <p className="text-[10px] text-muted-foreground">
              When the reference includes footwear
            </p>
          </div>
          <Switch
            id="change-shoes"
            checked={clothes.changeShoes}
            onCheckedChange={(checked) =>
              onChange({ clothes: { ...clothes, changeShoes: checked } })
            }
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-brand-ink">
            Multi-person filter
          </Label>
          <Select
            value={clothes.filterMultiPerson}
            onValueChange={(filterMultiPerson) =>
              onChange({
                clothes: {
                  ...clothes,
                  filterMultiPerson:
                    filterMultiPerson as typeof clothes.filterMultiPerson,
                },
              })
            }
          >
            <SelectTrigger className="h-9 w-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="off">Off</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="strict">Strict</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  const accessory =
    value.accessory ?? defaultFashionYouCamSettings(toolId).accessory!

  const styleOptions =
    toolId === "hat-vto" ? HAT_STYLE_OPTIONS : BAG_STYLE_OPTIONS

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-medium text-brand-ink">Gender</Label>
        <Select
          value={accessory.gender}
          onValueChange={(gender) =>
            onChange({
              accessory: {
                ...accessory,
                gender: gender as typeof accessory.gender,
              },
            })
          }
        >
          <SelectTrigger className="h-9 w-full text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="male">Male</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-brand-ink">Try-on style</Label>
        <Select
          value={String(accessory.style)}
          onValueChange={(style) =>
            onChange({
              accessory: {
                ...accessory,
                style: style as typeof accessory.style,
              },
            })
          }
        >
          <SelectTrigger className="h-9 w-full text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {styleOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-[10px] leading-snug text-muted-foreground">
          YouCam API styling for bag, shoes, and hat virtual try-on.
        </p>
      </div>
    </div>
  )
}
