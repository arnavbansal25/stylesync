import { createInsForgeServerClient } from "@/lib/insforge/server"
import type { BillingPlanId } from "@/lib/billing-plans"
import {
  DEFAULT_REMAINING_CREDITS,
  type DashboardUser,
} from "@/lib/dashboard"

function parseBillingPlan(value: unknown): BillingPlanId {
  if (value === "basic" || value === "pro" || value === "free") {
    return value
  }
  return "free"
}

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
    .select(
      "name, avatar_url, credits, billing_plan, subscription_status, subscription_period_end, subscription_cancel_at"
    )
    .eq("id", authUser.id)
    .maybeSingle()

  if (profile) {
    name = profile.name
    avatarUrl = profile.avatar_url
  }

  const remainingCredits =
    typeof profile?.credits === "number"
      ? profile.credits
      : DEFAULT_REMAINING_CREDITS

  return {
    id: authUser.id,
    email,
    name,
    avatarUrl,
    remainingCredits,
    billingPlan: parseBillingPlan(profile?.billing_plan),
    subscriptionStatus: profile?.subscription_status ?? null,
    subscriptionPeriodEnd: profile?.subscription_period_end ?? null,
    subscriptionCancelAt: profile?.subscription_cancel_at ?? null,
  }
}
