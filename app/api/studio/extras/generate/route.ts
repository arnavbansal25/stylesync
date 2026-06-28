import { NextResponse } from "next/server"
import {
  parseExtrasYouCamSettings,
  runExtrasGeneration,
} from "@/lib/extras-generation"
import type { ExtrasToolId } from "@/lib/extras-types"
import { createInsForgeServerClient } from "@/lib/insforge/server"

const TOOL_IDS: ExtrasToolId[] = [
  "object-remover",
  "bg-remove",
  "colorize",
  "photo-extender",
  "headshot",
]

export async function POST(request: Request) {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  const user = authData?.user
  if (!user) {
    return NextResponse.json({ error: "Sign in to generate" }, { status: 401 })
  }

  const form = await request.formData()
  const toolId = String(form.get("toolId") ?? "")
  const presetId = String(form.get("presetId") ?? "")
  const testImageId = form.get("testImageId")
  const file = form.get("file")
  const settingsRaw = form.get("youcamSettings")

  if (!TOOL_IDS.includes(toolId as ExtrasToolId)) {
    return NextResponse.json({ error: "Invalid tool" }, { status: 400 })
  }
  if (!presetId) {
    return NextResponse.json({ error: "Choose a preset first" }, { status: 400 })
  }

  let source: { kind: "upload"; file: File } | { kind: "test"; testId: string }

  if (file instanceof File && file.size > 0) {
    source = { kind: "upload", file }
  } else if (typeof testImageId === "string" && testImageId.length > 0) {
    source = { kind: "test", testId: testImageId }
  } else {
    return NextResponse.json(
      { error: "Upload a photo or pick a sample image" },
      { status: 400 }
    )
  }

  const youcamSettings = parseExtrasYouCamSettings(
    typeof settingsRaw === "string" ? settingsRaw : undefined
  )

  const result = await runExtrasGeneration({
    userId: user.id,
    toolId: toolId as ExtrasToolId,
    presetId,
    source,
    youcamSettings,
  })

  if ("error" in result) {
    const status =
      result.code === "insufficient_credits"
        ? 402
        : result.code === "validation"
          ? 400
          : result.code === "unauthorized"
            ? 401
            : 502
    return NextResponse.json(
      { error: result.error, code: result.code },
      { status }
    )
  }

  return NextResponse.json(result)
}
