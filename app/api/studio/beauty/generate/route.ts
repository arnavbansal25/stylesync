import { NextResponse } from "next/server"
import type { BeautyToolId } from "@/lib/beauty-studio"
import {
  parseBeautyYouCamSettings,
  runBeautyGeneration,
} from "@/lib/beauty-generation"
import { createInsForgeServerClient } from "@/lib/insforge/server"

const TOOL_IDS: BeautyToolId[] = [
  "makeup-transfer",
  "makeup-try-on",
  "eye-color-try-on",
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
  const lookId = String(form.get("lookId") ?? "")
  const testImageId = form.get("testImageId")
  const file = form.get("file")
  const settingsRaw = form.get("youcamSettings")

  if (!TOOL_IDS.includes(toolId as BeautyToolId)) {
    return NextResponse.json({ error: "Invalid tool" }, { status: 400 })
  }
  if (!lookId) {
    return NextResponse.json({ error: "Choose a look first" }, { status: 400 })
  }

  let source:
    | { kind: "upload"; file: File }
    | { kind: "test"; testId: string }
    | { kind: "youcam-sample" }

  if (file instanceof File && file.size > 0) {
    source = { kind: "upload", file }
  } else if (typeof testImageId === "string" && testImageId.length > 0) {
    source =
      testImageId === "youcam"
        ? { kind: "youcam-sample" }
        : { kind: "test", testId: testImageId }
  } else {
    return NextResponse.json(
      { error: "Upload a photo or pick a test image" },
      { status: 400 }
    )
  }

  const youcamSettings = parseBeautyYouCamSettings(
    toolId as BeautyToolId,
    typeof settingsRaw === "string" ? settingsRaw : undefined
  )

  const result = await runBeautyGeneration({
    userId: user.id,
    toolId: toolId as BeautyToolId,
    lookId,
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
