import { readFile } from "node:fs/promises"
import path from "node:path"
import {
  absoluteAppUrl,
  resolveFashionLook,
} from "@/lib/fashion-looks"
import type { FashionToolId } from "@/lib/fashion-studio"
import { buildFashionYouCamTaskPayload } from "@/lib/fashion-youcam-payload"
import {
  defaultFashionYouCamSettings,
  type FashionYouCamSettings,
  parseFashionYouCamSettings,
} from "@/lib/fashion-youcam-settings"
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

export type FashionSourceInput =
  | { kind: "upload"; file: File }
  | { kind: "test"; testId: string }

const TEST_IMAGE_FILES: Record<
  string,
  { relativePath: string; contentType: string }
> = {
  "fullbody-01": {
    relativePath: "fashion-samples/source/fullbody_01.jpg",
    contentType: "image/jpeg",
  },
  "fullbody-02": {
    relativePath: "fashion-samples/source/fullbody_02.jpg",
    contentType: "image/jpeg",
  },
  "youcam-clothes": {
    relativePath: "fashion-samples/source/clothes_03_cccd5d4803.jpeg",
    contentType: "image/jpeg",
  },
  "sample-portrait": {
    relativePath: "fashion-samples/source/sample_Image_1_202b6bf6e6.jpg",
    contentType: "image/jpeg",
  },
  girl1: { relativePath: "normal-headshot/girl1.png", contentType: "image/png" },
  girl2: { relativePath: "normal-headshot/girl2.png", contentType: "image/png" },
  girl3: { relativePath: "normal-headshot/girl3.png", contentType: "image/png" },
  girl4: { relativePath: "normal-headshot/girl4.png", contentType: "image/png" },
  boy1: { relativePath: "normal-headshot/boy1.png", contentType: "image/png" },
}

export type FashionGenerationSuccess = {
  generationId: string
  resultUrl: string
  previewUrl: string
  remainingCredits: number
}

export type FashionGenerationFailure = {
  error: string
  code?: "unauthorized" | "insufficient_credits" | "validation" | "youcam" | "server"
}

export async function runFashionGeneration(params: {
  userId: string
  toolId: FashionToolId
  lookId: string
  source: FashionSourceInput
  youcamSettings?: FashionYouCamSettings
}): Promise<FashionGenerationSuccess | FashionGenerationFailure> {
  const youcamSettings =
    params.youcamSettings ?? defaultFashionYouCamSettings(params.toolId)
  const insforge = await createInsForgeServerClient()
  const look = resolveFashionLook(params.toolId, params.lookId)
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
      .from("fashion-results")
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
      .from("fashion_generations")
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
      previewUrl: `/api/studio/fashion/result/${generationId}`,
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

async function resolveSourceBytes(source: FashionSourceInput): Promise<{
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
  if (!mapped) {
    throw new Error("Unknown test image")
  }

  const filePath = path.join(process.cwd(), "public", mapped.relativePath)
  const bytes = await readFile(filePath)
  return {
    bytes,
    contentType: mapped.contentType,
    fileName: path.basename(mapped.relativePath),
  }
}

function fileSlugForTool(toolId: FashionToolId): YouCamFileSlug {
  switch (toolId) {
    case "clothes-vto":
      return "cloth-v4"
    case "bag-vto":
      return "bag"
    case "shoes-vto":
      return "shoes-transfer"
    case "hat-vto":
      return "hat"
  }
}

async function runYouCamTaskForTool(
  toolId: FashionToolId,
  look: NonNullable<ReturnType<typeof resolveFashionLook>>,
  srcFileId: string,
  settings: FashionYouCamSettings
) {
  const ref = await resolveYouCamReference(fileSlugForTool(toolId), look.refUrl)
  const { slug, body } = buildFashionYouCamTaskPayload(toolId, {
    srcFileId,
    ref,
    garmentCategory: look.garmentCategory,
    settings,
  })
  return runYouCamTaskAndPoll(slug, body)
}

export { parseFashionYouCamSettings }

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
