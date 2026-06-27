import { SiteHeader } from "@/components/landing/site-header"
import { createInsForgeServerClient } from "@/lib/insforge/server"

export async function SiteHeaderWithAuth() {
  const insforge = await createInsForgeServerClient()
  const { data } = await insforge.auth.getCurrentUser()
  const initialUser = data?.user
    ? { id: data.user.id, email: data.user.email ?? null }
    : null

  return <SiteHeader initialUser={initialUser} />
}
