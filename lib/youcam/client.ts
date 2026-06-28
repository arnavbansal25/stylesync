import {
  getYouCamSecretKey,
  YOUCAM_API_BASE,
  type YouCamFileSlug,
  type YouCamTaskSlug,
} from "@/lib/youcam/config"

type YouCamApiError = {
  status?: number
  error?: string
  error_code?: string
}

export class YouCamError extends Error {
  readonly status?: number
  readonly errorCode?: string

  constructor(message: string, options?: { status?: number; errorCode?: string }) {
    super(message)
    this.name = "YouCamError"
    this.status = options?.status
    this.errorCode = options?.errorCode
  }
}

function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${getYouCamSecretKey()}`,
    "Content-Type": "application/json",
  }
}

async function parseYouCamJson<T>(res: Response): Promise<T> {
  const body = (await res.json()) as T & YouCamApiError
  if (!res.ok) {
    throw new YouCamError(body.error ?? `YouCam API error (${res.status})`, {
      status: res.status,
      errorCode: body.error_code,
    })
  }
  return body
}

export async function uploadYouCamFile(
  slug: YouCamFileSlug,
  file: { bytes: Buffer; fileName: string; contentType: string }
): Promise<string> {
  const initRes = await fetch(`${YOUCAM_API_BASE}/s2s/v2.0/file/${slug}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      files: [
        {
          content_type: file.contentType,
          file_name: file.fileName,
          file_size: file.bytes.length,
        },
      ],
    }),
  })

  const initBody = await parseYouCamJson<{
    data: {
      files: Array<{
        file_id: string
        requests: Array<{
          method: string
          url: string
          headers: Record<string, string>
        }>
      }>
    }
  }>(initRes)

  const entry = initBody.data.files[0]
  const uploadReq = entry.requests[0]
  const putRes = await fetch(uploadReq.url, {
    method: uploadReq.method,
    headers: uploadReq.headers,
    body: new Uint8Array(file.bytes),
  })

  if (!putRes.ok) {
    throw new YouCamError(`Failed to upload file to YouCam (${putRes.status})`, {
      status: putRes.status,
    })
  }

  return entry.file_id
}

export type YouCamTaskPollResult = {
  taskId: string
  status: "success" | "error" | "running"
  resultUrl?: string
  errorMessage?: string
  pollingIntervalMs?: number
}

function urlFromUnknown(value: unknown): string | undefined {
  if (typeof value === "string" && value.startsWith("http")) return value
  if (!value || typeof value !== "object") return undefined
  const record = value as Record<string, unknown>
  if (typeof record.url === "string") return record.url
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = urlFromUnknown(item)
      if (found) return found
    }
    return undefined
  }
  for (const nested of Object.values(record)) {
    const found = urlFromUnknown(nested)
    if (found) return found
  }
  return undefined
}

function extractResultUrl(data: Record<string, unknown>): string | undefined {
  const results = data.results
  const fromResults = urlFromUnknown(results)
  if (fromResults) return fromResults
  if (typeof data.url === "string") return data.url
  return undefined
}

export async function pollYouCamTask(
  slug: YouCamTaskSlug,
  taskId: string,
  options?: { maxAttempts?: number }
): Promise<YouCamTaskPollResult> {
  const maxAttempts = options?.maxAttempts ?? 60

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const res = await fetch(
      `${YOUCAM_API_BASE}/s2s/v2.0/task/${slug}/${encodeURIComponent(taskId)}`,
      { headers: authHeaders() }
    )

    const body = await parseYouCamJson<{
      data: Record<string, unknown> & {
        task_status?: string
        polling_interval?: number
        error?: string
        error_message?: string
      }
    }>(res)

    const data = body.data
    const taskStatus = String(data.task_status ?? "").toLowerCase()
    const intervalMs =
      typeof data.polling_interval === "number"
        ? data.polling_interval * 1000
        : 3000

    if (taskStatus === "success") {
      const resultUrl = extractResultUrl(data)
      if (!resultUrl) {
        throw new YouCamError("YouCam task succeeded but no result URL was returned")
      }
      return { taskId, status: "success", resultUrl, pollingIntervalMs: intervalMs }
    }

    if (taskStatus === "error") {
      const code =
        typeof data.error === "string" ? data.error : undefined
      const detail =
        typeof data.error_message === "string" ? data.error_message : undefined
      const errorMessage =
        code && detail
          ? `${code}: ${detail}`
          : detail ?? code ?? "YouCam task failed"
      return { taskId, status: "error", errorMessage, pollingIntervalMs: intervalMs }
    }

    await sleep(intervalMs)
  }

  throw new YouCamError("YouCam task timed out while polling")
}

export async function runYouCamTaskAndPoll(
  slug: YouCamTaskSlug,
  payload: Record<string, unknown>
): Promise<YouCamTaskPollResult> {
  const res = await fetch(`${YOUCAM_API_BASE}/s2s/v2.0/task/${slug}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })

  const body = await parseYouCamJson<{
    data: { task_id: string; polling_interval?: number }
  }>(res)

  const taskId = body.data.task_id
  const firstInterval =
    typeof body.data.polling_interval === "number"
      ? body.data.polling_interval * 1000
      : 3000

  await sleep(firstInterval)
  return pollYouCamTask(slug, taskId)
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function downloadImageBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new YouCamError(`Failed to download result image (${res.status})`, {
      status: res.status,
    })
  }
  const arrayBuffer = await res.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
