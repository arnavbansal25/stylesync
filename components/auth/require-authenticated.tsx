import { redirect } from "next/navigation"
import { createInsForgeServerClient } from "@/lib/insforge/server"

export async function RequireAuthenticated({
  redirectTo = "/sign-in",
}: {
  redirectTo?: string
}) {
  const insforge = await createInsForgeServerClient()
  const { data } = await insforge.auth.getCurrentUser()
  if (!data?.user) {
    redirect(redirectTo)
  }
  return null
}
