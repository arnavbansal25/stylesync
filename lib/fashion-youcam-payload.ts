import type { FashionToolId } from "@/lib/fashion-studio"
import type { GarmentCategory } from "@/lib/fashion-looks"
import type { FashionYouCamSettings } from "@/lib/fashion-youcam-settings"
import { defaultFashionYouCamSettings } from "@/lib/fashion-youcam-settings"
import type { YouCamTaskSlug } from "@/lib/youcam/config"

type RefPayload = { ref_file_id: string } | { ref_file_url: string }

/** Task bodies aligned with YouCam MCP `Get-Upload-API-Info` / Perfect Corp S2S docs. */
export function buildFashionYouCamTaskPayload(
  toolId: FashionToolId,
  params: {
    srcFileId: string
    ref: RefPayload
    garmentCategory?: GarmentCategory
    settings: FashionYouCamSettings
  }
): { slug: YouCamTaskSlug; body: Record<string, unknown> } {
  const { srcFileId, ref, settings } = params

  switch (toolId) {
    case "clothes-vto": {
      const clothes =
        settings.clothes ?? defaultFashionYouCamSettings("clothes-vto").clothes!
      const garmentCategory =
        params.garmentCategory ?? clothes.garmentCategory ?? "full_body"
      return {
        slug: "cloth-v4",
        body: {
          src_file_id: srcFileId,
          ...ref,
          garment_category: garmentCategory,
          change_shoes: clothes.changeShoes,
          filter_multi_person: clothes.filterMultiPerson,
        },
      }
    }
    case "bag-vto":
      return accessoryPayload("bag", srcFileId, ref, settings, toolId)
    case "shoes-vto":
      return accessoryPayload("shoes-transfer", srcFileId, ref, settings, toolId)
    case "hat-vto":
      return accessoryPayload("hat", srcFileId, ref, settings, toolId)
  }
}

function accessoryPayload(
  slug: YouCamTaskSlug,
  srcFileId: string,
  ref: RefPayload,
  settings: FashionYouCamSettings,
  toolId: FashionToolId
): { slug: YouCamTaskSlug; body: Record<string, unknown> } {
  const accessory =
    settings.accessory ?? defaultFashionYouCamSettings(toolId).accessory!
  return {
    slug,
    body: {
      src_file_id: srcFileId,
      ...ref,
      gender: accessory.gender,
      style: accessory.style ?? "random",
    },
  }
}
