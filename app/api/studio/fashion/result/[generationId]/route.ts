import { NextResponse } from "next/server"
import { createInsForgeServerClient } from "@/lib/insforge/server"

type RouteContext = { params: Promise<{ generationId: string }> }

export async function GET(_request: Request, context: RouteContext) {
  const { generationId } = await context.params

  if (!generationId || !/^[0-9a-f-]{36}$/i.test(generationId)) {
    return NextResponse.json({ error: "Invalid generation id" }, { status: 400 })
  }

  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  const user = authData?.user
  if (!user) {
    return NextResponse.json({ error: "Sign in to view results" }, { status: 401 })
  }

  const { data: row, error: rowError } = await insforge.database
    .from("fashion_generations")
    .select("result_storage_key, user_id")
    .eq("id", generationId)
    .maybeSingle()

  if (rowError || !row) {
    return NextResponse.json({ error: "Result not found" }, { status: 404 })
  }

  if (row.user_id !== user.id) {
    return NextResponse.json({ error: "Result not found" }, { status: 404 })
  }

  const { data: blob, error: downloadError } = await insforge.storage
    .from("fashion-results")
    .download(row.result_storage_key)

  if (downloadError || !blob) {
    return NextResponse.json(
      { error: downloadError?.message ?? "Could not load result image" },
      { status: 502 }
    )
  }

  const bytes = Buffer.from(await blob.arrayBuffer())
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": blob.type || "image/jpeg",
      "Cache-Control": "private, max-age=3600",
    },
  })
}
