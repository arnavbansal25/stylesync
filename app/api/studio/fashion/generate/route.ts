import { NextResponse } from "next/server"
import type { FashionToolId } from "@/lib/fashion-studio"
import {
  parseFashionYouCamSettings,
  runFashionGeneration,
} from "@/lib/fashion-generation"
import { createInsForgeServerClient } from "@/lib/insforge/server"

const TOOL_IDS: FashionToolId[] = [
  "clothes-vto",
  "bag-vto",
  "shoes-vto",
  "hat-vto",
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

  if (!TOOL_IDS.includes(toolId as FashionToolId)) {
    return NextResponse.json({ error: "Invalid tool" }, { status: 400 })
  }
  if (!lookId) {
    return NextResponse.json({ error: "Choose a look first" }, { status: 400 })
  }

  let source: { kind: "upload"; file: File } | { kind: "test"; testId: string }

  if (file instanceof File && file.size > 0) {
    source = { kind: "upload", file }
  } else if (typeof testImageId === "string" && testImageId.length > 0) {
    source = { kind: "test", testId: testImageId }
  } else {
    return NextResponse.json(
      { error: "Upload a photo or pick a test image" },
      { status: 400 }
    )
  }

  const youcamSettings = parseFashionYouCamSettings(
    toolId as FashionToolId,
    typeof settingsRaw === "string" ? settingsRaw : undefined
  )

  const result = await runFashionGeneration({
    userId: user.id,
    toolId: toolId as FashionToolId,
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
