import { redirect } from "next/navigation"
import { createInsForgeServerClient } from "@/lib/insforge/server"

export async function RedirectIfAuthenticated() {
  const insforge = await createInsForgeServerClient()
  const { data } = await insforge.auth.getCurrentUser()
  if (data?.user) {
    redirect("/")
  }
  return null
}
