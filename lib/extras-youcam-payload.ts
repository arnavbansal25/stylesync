import { jpegDimensions } from "@/lib/extras-image-size"
import type { ExtrasToolId, ExtenderDirection } from "@/lib/extras-types"
import type { ExtrasYouCamSettings } from "@/lib/extras-youcam-settings"
import { DEFAULT_HEADSHOT_OUTPUT_COUNT } from "@/lib/extras-youcam-settings"
import type { YouCamTaskSlug } from "@/lib/youcam/config"

export function buildExtrasYouCamTaskPayload(
  toolId: ExtrasToolId,
  params: {
    srcFileId: string
    maskFileId?: string
    headshotTemplateId?: string
    extenderDirection?: ExtenderDirection
    sourceBytes: Buffer
    settings: ExtrasYouCamSettings
  }
): { slug: YouCamTaskSlug; body: Record<string, unknown> } {
  switch (toolId) {
    case "object-remover": {
      if (!params.maskFileId) {
        throw new Error("Object removal requires a mask image")
      }
      return {
        slug: "generative-fill",
        body: {
          src_file_id: params.srcFileId,
          msk_file_id: params.maskFileId,
        },
      }
    }
    case "bg-remove":
      return {
        slug: "sod",
        body: { src_file_id: params.srcFileId },
      }
    case "colorize":
      return {
        slug: "colorize",
        body: { src_file_id: params.srcFileId },
      }
    case "photo-extender": {
      const layout = computeOutPaintLayout(
        params.extenderDirection ?? "horizontal",
        params.sourceBytes
      )
      return {
        slug: "out-paint",
        body: {
          src_file_id: params.srcFileId,
          ...layout,
        },
      }
    }
    case "headshot": {
      if (!params.headshotTemplateId) {
        throw new Error("Choose a headshot style first")
      }
      const outputCount =
        params.settings.headshotOutputCount ?? DEFAULT_HEADSHOT_OUTPUT_COUNT
      return {
        slug: "headshot",
        body: {
          src_file_id: params.srcFileId,
          template_id: params.headshotTemplateId,
          output_count: outputCount,
        },
      }
    }
  }
}

function computeOutPaintLayout(
  direction: ExtenderDirection,
  sourceBytes: Buffer
): Record<string, number> {
  const { width: w, height: h } = jpegDimensions(sourceBytes)

  if (direction === "horizontal") {
    const outputWidth = Math.min(4096, Math.round(w * 1.5))
    const outputHeight = h
    const inputX = Math.floor((outputWidth - w) / 2)
    return layoutFields(outputWidth, outputHeight, inputX, 0, w, h, w, h)
  }

  if (direction === "vertical") {
    const outputWidth = w
    const outputHeight = Math.min(4096, Math.round(h * 1.4))
    const inputY = Math.floor((outputHeight - h) / 2)
    return layoutFields(outputWidth, outputHeight, 0, inputY, w, h, w, h)
  }

  const outputWidth = Math.min(4096, Math.round(w * 1.25))
  const outputHeight = Math.min(4096, Math.round(h * 1.25))
  const inputX = Math.floor((outputWidth - w) / 2)
  const inputY = Math.floor((outputHeight - h) / 2)
  return layoutFields(outputWidth, outputHeight, inputX, inputY, w, h, w, h)
}

function layoutFields(
  outputWidth: number,
  outputHeight: number,
  inputX: number,
  inputY: number,
  inputWidth: number,
  inputHeight: number,
  cropWidth: number,
  cropHeight: number
) {
  return {
    output_width: outputWidth,
    output_height: outputHeight,
    input_x: inputX,
    input_y: inputY,
    input_width: inputWidth,
    input_height: inputHeight,
    crop_input_x: 0,
    crop_input_y: 0,
    crop_input_width: cropWidth,
    crop_input_height: cropHeight,
  }
}
