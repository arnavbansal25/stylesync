import type { PaidBillingPlanId } from "@/lib/billing-plans"

export type StripePaymentEnvironment = "test" | "live"

export function getStripePaymentEnvironment(): StripePaymentEnvironment {
  const env = process.env.STRIPE_PAYMENT_ENV?.trim().toLowerCase()
  return env === "live" ? "live" : "test"
}

export function getStripePriceIdForPlan(plan: PaidBillingPlanId): string | null {
  if (plan === "basic") {
    return process.env.STRIPE_PRICE_ID_BASIC?.trim() || null
  }
  if (plan === "pro") {
    return process.env.STRIPE_PRICE_ID_PRO?.trim() || null
  }
  return null
}
