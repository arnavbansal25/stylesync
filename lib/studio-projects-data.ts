import { createInsForgeServerClient } from "@/lib/insforge/server"
import {
  STUDIO_PROJECTS_PAGE_SIZE,
  type StudioProjectCategory,
  type StudioProjectItem,
  studioProjectPreviewPath,
} from "@/lib/studio-projects"

type GenerationRow = {
  id: string
  tool_id: string
  created_at: string
}

function mapRows(
  rows: GenerationRow[] | null | undefined,
  category: StudioProjectCategory
): StudioProjectItem[] {
  if (!rows?.length) return []
  return rows.map((row) => ({
    id: row.id,
    category,
    toolId: row.tool_id,
    createdAt: row.created_at,
    previewPath: studioProjectPreviewPath(category, row.id),
  }))
}

export type StudioProjectsPageResult = {
  items: StudioProjectItem[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export async function fetchStudioProjectsPage(
  userId: string,
  page: number
): Promise<StudioProjectsPageResult> {
  const insforge = await createInsForgeServerClient()
  const selectFields = "id, tool_id, created_at"

  const [beautyRes, fashionRes, extrasRes] = await Promise.all([
    insforge.database
      .from("beauty_generations")
      .select(selectFields)
      .eq("user_id", userId)
      .eq("status", "completed")
      .not("result_storage_key", "is", null)
      .order("created_at", { ascending: false }),
    insforge.database
      .from("fashion_generations")
      .select(selectFields)
      .eq("user_id", userId)
      .eq("status", "completed")
      .not("result_storage_key", "is", null)
      .order("created_at", { ascending: false }),
    insforge.database
      .from("extras_generations")
      .select(selectFields)
      .eq("user_id", userId)
      .eq("status", "completed")
      .not("result_storage_key", "is", null)
      .order("created_at", { ascending: false }),
  ])

  const merged = [
    ...mapRows(beautyRes.data as GenerationRow[] | null, "beauty"),
    ...mapRows(fashionRes.data as GenerationRow[] | null, "fashion"),
    ...mapRows(extrasRes.data as GenerationRow[] | null, "extras"),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const total = merged.length
  const totalPages = Math.max(1, Math.ceil(total / STUDIO_PROJECTS_PAGE_SIZE))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const skip = (safePage - 1) * STUDIO_PROJECTS_PAGE_SIZE
  const items = merged.slice(skip, skip + STUDIO_PROJECTS_PAGE_SIZE)

  return {
    items,
    page: safePage,
    pageSize: STUDIO_PROJECTS_PAGE_SIZE,
    total,
    totalPages,
  }
}

export async function fetchRecentStudioProjects(
  userId: string,
  limit: number
): Promise<StudioProjectItem[]> {
  const { items } = await fetchStudioProjectsPage(userId, 1)
  return items.slice(0, limit)
}
