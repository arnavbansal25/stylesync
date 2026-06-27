import { createInsForgeServerClient } from "@/lib/insforge/server"
import {
  DEFAULT_REMAINING_CREDITS,
  type DashboardUser,
} from "@/lib/dashboard"

export async function getDashboardUser(): Promise<DashboardUser | null> {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  const authUser = authData?.user
  if (!authUser) return null

  const email = authUser.email ?? ""
  let name: string | null = null
  let avatarUrl: string | null = null

  const { data: profile } = await insforge.database
    .from("users")
    .select("name, avatar_url")
    .eq("id", authUser.id)
    .maybeSingle()

  if (profile) {
    name = profile.name
    avatarUrl = profile.avatar_url
  }

  return {
    id: authUser.id,
    email,
    name,
    avatarUrl,
    remainingCredits: DEFAULT_REMAINING_CREDITS,
  }
}
