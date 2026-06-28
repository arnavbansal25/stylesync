import { readFile } from "node:fs/promises"
import path from "node:path"
import { generateRemovalMaskPng } from "@/lib/extras-mask"
import { resolveExtrasPreset } from "@/lib/extras-presets"
import type { ExtrasToolId } from "@/lib/extras-types"
import { buildExtrasYouCamTaskPayload } from "@/lib/extras-youcam-payload"
import {
  defaultExtrasYouCamSettings,
  type ExtrasYouCamSettings,
  parseExtrasYouCamSettings,
} from "@/lib/extras-youcam-settings"
import { createInsForgeServerClient } from "@/lib/insforge/server"
import { STUDIO_GENERATION_CREDIT_COST } from "@/lib/studio-generation-cost"
import {
  deductStudioCredits,
  refundStudioCredits,
} from "@/lib/studio-credits"
import {
  downloadImageBuffer,
  runYouCamTaskAndPoll,
  uploadYouCamFile,
  YouCamError,
} from "@/lib/youcam/client"
import type { YouCamFileSlug } from "@/lib/youcam/config"

export type ExtrasSourceInput =
  | { kind: "upload"; file: File }
  | { kind: "test"; testId: string }

const TEST_IMAGE_FILES: Record<
  string,
  { relativePath: string; contentType: string }
> = {
  "object-scene": {
    relativePath: "extras-samples/object-remove-scene.jpg",
    contentType: "image/jpeg",
  },
  product: {
    relativePath: "extras-samples/bg-remove-product.jpg",
    contentType: "image/jpeg",
  },
  "bw-01": {
    relativePath: "extras-samples/colorize-bw-01.jpg",
    contentType: "image/jpeg",
  },
  landscape: {
    relativePath: "extras-samples/extender-landscape.jpg",
    contentType: "image/jpeg",
  },
  "headshot-01": {
    relativePath: "extras-samples/headshot-source-01.jpg",
    contentType: "image/jpeg",
  },
  "headshot-02": {
    relativePath: "extras-samples/headshot-source-02.jpg",
    contentType: "image/jpeg",
  },
  girl1: { relativePath: "normal-headshot/girl1.png", contentType: "image/png" },
  girl2: { relativePath: "normal-headshot/girl2.png", contentType: "image/png" },
}

export type ExtrasGenerationSuccess = {
  generationId: string
  resultUrl: string
  previewUrl: string
  remainingCredits: number
}

export type ExtrasGenerationFailure = {
  error: string
  code?: "unauthorized" | "insufficient_credits" | "validation" | "youcam" | "server"
}

export async function runExtrasGeneration(params: {
  userId: string
  toolId: ExtrasToolId
  presetId: string
  source: ExtrasSourceInput
  youcamSettings?: ExtrasYouCamSettings
}): Promise<ExtrasGenerationSuccess | ExtrasGenerationFailure> {
  const youcamSettings =
    params.youcamSettings ?? defaultExtrasYouCamSettings(params.toolId)
  const insforge = await createInsForgeServerClient()
  const preset = resolveExtrasPreset(params.toolId, params.presetId)
  if (!preset) {
    return { error: "Invalid preset selection", code: "validation" }
  }

  let sourceBytes: Buffer
  let sourceContentType: string
  let sourceFileName: string

  try {
    const resolved = await resolveSourceBytes(params.source)
    sourceBytes = resolved.bytes
    sourceContentType = resolved.contentType
    sourceFileName = resolved.fileName
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not read source image"
    return { error: message, code: "validation" }
  }

  const fileSlug = fileSlugForTool(params.toolId)

  const deductResult = await deductStudioCredits(
    insforge,
    params.userId,
    STUDIO_GENERATION_CREDIT_COST
  )
  if (!deductResult.ok) {
    return { error: deductResult.error, code: deductResult.code }
  }

  let remainingCredits = deductResult.remainingCredits
  let youcamTaskId: string | undefined

  try {
    const srcFileId = await uploadYouCamFile(fileSlug, {
      bytes: sourceBytes,
      contentType: sourceContentType,
      fileName: sourceFileName,
    })

    let maskFileId: string | undefined
    if (params.toolId === "object-remover") {
      try {
        const maskBytes = generateRemovalMaskPng(sourceBytes)
        maskFileId = await uploadYouCamFile(fileSlug, {
          bytes: maskBytes,
          contentType: "image/png",
          fileName: "removal-mask.png",
        })
      } catch {
        await refundStudioCredits(
          await createInsForgeServerClient(),
          params.userId,
          STUDIO_GENERATION_CREDIT_COST
        )
        return {
          error:
            "Object removal needs a JPEG source image so we can build a matching mask.",
          code: "validation",
        }
      }
    }

    const { slug, body } = buildExtrasYouCamTaskPayload(params.toolId, {
      srcFileId,
      maskFileId,
      headshotTemplateId: preset.headshotTemplateId,
      extenderDirection: preset.extenderDirection,
      sourceBytes,
      settings: youcamSettings,
    })

    const taskResult = await runYouCamTaskAndPoll(slug, body)

    if (taskResult.status === "error") {
      await refundStudioCredits(
        await createInsForgeServerClient(),
        params.userId,
        STUDIO_GENERATION_CREDIT_COST
      )
      return {
        error: taskResult.errorMessage ?? "YouCam generation failed",
        code: "youcam",
      }
    }

    youcamTaskId = taskResult.taskId
    const resultBytes = await downloadImageBuffer(taskResult.resultUrl!)

    const generationId = crypto.randomUUID()
    const storageKey = `${params.userId}/${generationId}.jpg`
    const resultFile = new File([new Uint8Array(resultBytes)], `${generationId}.jpg`, {
      type: "image/jpeg",
    })

    const { data: uploadData, error: uploadError } = await insforge.storage
      .from("extras-results")
      .upload(storageKey, resultFile)

    if (uploadError || !uploadData) {
      await refundStudioCredits(
        await createInsForgeServerClient(),
        params.userId,
        STUDIO_GENERATION_CREDIT_COST
      )
      return {
        error: uploadError?.message ?? "Failed to save result to storage",
        code: "server",
      }
    }

    const { error: insertError } = await insforge.database
      .from("extras_generations")
      .insert([
        {
          id: generationId,
          user_id: params.userId,
          tool_id: params.toolId,
          preset_id: params.presetId,
          result_url: uploadData.url,
          result_storage_key: uploadData.key,
          youcam_task_id: youcamTaskId,
          credits_spent: STUDIO_GENERATION_CREDIT_COST,
          status: "completed",
        },
      ])

    if (insertError) {
      return { error: insertError.message, code: "server" }
    }

    return {
      generationId,
      resultUrl: uploadData.url,
      previewUrl: `/api/studio/extras/result/${generationId}`,
      remainingCredits,
    }
  } catch (e) {
    await refundStudioCredits(
      await createInsForgeServerClient(),
      params.userId,
      STUDIO_GENERATION_CREDIT_COST
    )
    const message =
      e instanceof YouCamError
        ? e.message
        : e instanceof Error
          ? e.message
          : "Generation failed"
    return { error: message, code: "youcam" }
  }
}

async function resolveSourceBytes(source: ExtrasSourceInput): Promise<{
  bytes: Buffer
  contentType: string
  fileName: string
}> {
  if (source.kind === "upload") {
    const arrayBuffer = await source.file.arrayBuffer()
    const contentType = source.file.type || "image/jpeg"
    return {
      bytes: Buffer.from(arrayBuffer),
      contentType,
      fileName: source.file.name || "upload.jpg",
    }
  }

  const mapped = TEST_IMAGE_FILES[source.testId]
  if (!mapped) throw new Error("Unknown test image")

  const filePath = path.join(process.cwd(), "public", mapped.relativePath)
  const bytes = await readFile(filePath)
  return {
    bytes,
    contentType: mapped.contentType,
    fileName: path.basename(mapped.relativePath),
  }
}

function fileSlugForTool(toolId: ExtrasToolId): YouCamFileSlug {
  switch (toolId) {
    case "object-remover":
      return "generative-fill"
    case "bg-remove":
      return "sod"
    case "colorize":
      return "colorize"
    case "photo-extender":
      return "out-paint"
    case "headshot":
      return "headshot"
  }
}

export { parseExtrasYouCamSettings }
