import { readFile } from "node:fs/promises"
import path from "node:path"
import {
  absoluteAppUrl,
  resolveBeautyLook,
  YOUCAM_SAMPLE_PORTRAIT_URL,
} from "@/lib/beauty-looks"
import type { BeautyToolId } from "@/lib/beauty-studio"
import {
  buildMakeupVtoEffects,
  defaultBeautyYouCamSettings,
  type BeautyYouCamSettings,
  parseBeautyYouCamSettings,
} from "@/lib/beauty-youcam-settings"
import { makeupAddonEffectsByLookId } from "@/lib/makeup-addon-effects"
import { STUDIO_GENERATION_CREDIT_COST } from "@/lib/studio-generation-cost"
import { createInsForgeServerClient } from "@/lib/insforge/server"
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

export type BeautySourceInput =
  | { kind: "upload"; file: File }
  | { kind: "test"; testId: string }
  | { kind: "youcam-sample" }

const TEST_IMAGE_FILES: Record<
  string,
  { relativePath: string; contentType: string }
> = {
  girl1: { relativePath: "normal-headshot/girl1.png", contentType: "image/png" },
  girl2: { relativePath: "normal-headshot/girl2.png", contentType: "image/png" },
  girl3: { relativePath: "normal-headshot/girl3.png", contentType: "image/png" },
  girl4: { relativePath: "normal-headshot/girl4.png", contentType: "image/png" },
  boy1: { relativePath: "normal-headshot/boy1.png", contentType: "image/png" },
}

export type BeautyGenerationSuccess = {
  generationId: string
  /** InsForge storage URL (requires auth — not for direct browser display). */
  resultUrl: string
  /** Same-origin URL the studio UI can load in `<img>` / `next/image`. */
  previewUrl: string
  remainingCredits: number
}

export type BeautyGenerationFailure = {
  error: string
  code?: "unauthorized" | "insufficient_credits" | "validation" | "youcam" | "server"
}

export async function runBeautyGeneration(params: {
  userId: string
  toolId: BeautyToolId
  lookId: string
  source: BeautySourceInput
  youcamSettings?: BeautyYouCamSettings
}): Promise<BeautyGenerationSuccess | BeautyGenerationFailure> {
  const youcamSettings =
    params.youcamSettings ?? defaultBeautyYouCamSettings(params.toolId)
  const insforge = await createInsForgeServerClient()
  const look = resolveBeautyLook(params.toolId, params.lookId)
  if (!look) {
    return { error: "Invalid look selection", code: "validation" }
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
    return {
      error: deductResult.error,
      code: deductResult.code,
    }
  }

  let remainingCredits = deductResult.remainingCredits
  let youcamTaskId: string | undefined
  try {
    const srcFileId = await uploadYouCamFile(fileSlug, {
      bytes: sourceBytes,
      contentType: sourceContentType,
      fileName: sourceFileName,
    })

    const taskResult = await runYouCamTaskForTool(
      params.toolId,
      look,
      srcFileId,
      params.lookId,
      youcamSettings
    )

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
      .from("beauty-results")
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
      .from("beauty_generations")
      .insert([
        {
          id: generationId,
          user_id: params.userId,
          tool_id: params.toolId,
          look_id: params.lookId,
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
      previewUrl: `/api/studio/beauty/result/${generationId}`,
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

async function resolveSourceBytes(source: BeautySourceInput): Promise<{
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

  if (source.kind === "youcam-sample" || source.testId === "youcam") {
    const res = await fetch(YOUCAM_SAMPLE_PORTRAIT_URL)
    if (!res.ok) throw new Error("Failed to fetch YouCam sample image")
    const bytes = Buffer.from(await res.arrayBuffer())
    return {
      bytes,
      contentType: res.headers.get("content-type") ?? "image/jpeg",
      fileName: "youcam-sample.jpg",
    }
  }

  const mapped = TEST_IMAGE_FILES[source.testId]
  if (!mapped) {
    throw new Error("Unknown test image")
  }

  const filePath = path.join(
    /* turbopackIgnore: true */ process.cwd(),
    "public",
    mapped.relativePath
  )
  const bytes = await readFile(filePath)
  return {
    bytes,
    contentType: mapped.contentType,
    fileName: path.basename(mapped.relativePath),
  }
}

function fileSlugForTool(toolId: BeautyToolId) {
  switch (toolId) {
    case "makeup-transfer":
      return "mu-transfer" as const
    case "makeup-try-on":
      return "makeup-vto" as const
    case "eye-color-try-on":
      return "eye-color-vto" as const
  }
}

async function runYouCamTaskForTool(
  toolId: BeautyToolId,
  look: ReturnType<typeof resolveBeautyLook>,
  srcFileId: string,
  lookId: string,
  settings: BeautyYouCamSettings
) {
  if (!look) throw new Error("Look not found")

  switch (toolId) {
    case "makeup-transfer": {
      if (!look.refUrl) throw new Error("Missing reference look URL")
      const ref = await resolveYouCamReference("mu-transfer", look.refUrl)
      return runYouCamTaskAndPoll("mu-transfer", {
        src_file_id: srcFileId,
        ...ref,
      })
    }
    case "makeup-try-on": {
      const addonEffects = makeupAddonEffectsByLookId[lookId]
      if (!addonEffects?.length) {
        throw new Error("Missing makeup addon effects for this look")
      }
      const makeupSettings =
        settings.makeupTryOn ??
        defaultBeautyYouCamSettings("makeup-try-on").makeupTryOn!
      const effects = buildMakeupVtoEffects(addonEffects, makeupSettings)
      return runYouCamTaskAndPoll("makeup-vto", {
        version: "1.0",
        effects,
        src_file_id: srcFileId,
      })
    }
    case "eye-color-try-on": {
      if (!look.refUrl) throw new Error("Missing lens reference")
      const ref = await resolveYouCamReference("eye-color-vto", look.refUrl)
      const effect =
        settings.eyeColor ??
        defaultBeautyYouCamSettings("eye-color-try-on").eyeColor!
      return runYouCamTaskAndPoll("eye-color-vto", {
        version: "1.0",
        effect: {
          intensity: effect.intensity,
          enlargement: effect.enlargement,
          skin_smooth_strength: effect.skin_smooth_strength,
          skin_smooth_color_intensity: effect.skin_smooth_color_intensity,
        },
        src_file_id: srcFileId,
        ...ref,
      })
    }
  }
}

export { parseBeautyYouCamSettings }

type YouCamRefPayload =
  | { ref_file_id: string }
  | { ref_file_url: string }

async function resolveYouCamReference(
  slug: YouCamFileSlug,
  refUrl: string
): Promise<YouCamRefPayload> {
  if (refUrl.startsWith("/")) {
    const filePath = path.join(process.cwd(), "public", refUrl.replace(/^\//, ""))
    const bytes = await readFile(filePath)
    const refFileId = await uploadYouCamFile(slug, {
      bytes,
      contentType: contentTypeFromPath(filePath),
      fileName: path.basename(filePath),
    })
    return { ref_file_id: refFileId }
  }

  const absolute = absoluteAppUrl(refUrl)
  if (absolute.includes("localhost") || absolute.includes("127.0.0.1")) {
    throw new Error("Reference image must be a public URL or a path under /public")
  }

  return { ref_file_url: refUrl.startsWith("http") ? refUrl : absolute }
}

function contentTypeFromPath(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  if (ext === ".png") return "image/png"
  if (ext === ".webp") return "image/webp"
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg"
  return "application/octet-stream"
}
