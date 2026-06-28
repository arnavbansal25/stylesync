"use server"

import { resolveAppUrl } from "@/lib/auth/get-app-url"
import type { PaidBillingPlanId } from "@/lib/billing-plans"
import {
  getStripePaymentEnvironment,
  getStripePriceIdForPlan,
} from "@/lib/billing-stripe-server"
import { createInsForgeServerClient } from "@/lib/insforge/server"

export type BillingActionResult =
  | { ok: true; url: string }
  | { ok: false; message: string }

export async function startSubscriptionCheckout(
  plan: PaidBillingPlanId
): Promise<BillingActionResult> {
  const priceId = getStripePriceIdForPlan(plan)
  if (!priceId) {
    return {
      ok: false,
      message:
        "Billing is not configured yet. Add STRIPE_PRICE_ID_BASIC and STRIPE_PRICE_ID_PRO on the server.",
    }
  }

  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  const user = authData?.user
  if (!user) {
    return { ok: false, message: "Sign in to upgrade your plan." }
  }

  const appUrl = await resolveAppUrl()
  const environment = getStripePaymentEnvironment()

  const { data, error } = await insforge.payments.stripe.createCheckoutSession(
    environment,
    {
      mode: "subscription",
      subject: { type: "user", id: user.id },
      lineItems: [{ priceId, quantity: 1 }],
      successUrl: `${appUrl}/studio/billing?checkout=success`,
      cancelUrl: `${appUrl}/studio/billing`,
      customerEmail: user.email ?? null,
      metadata: { plan },
    }
  )

  if (error) {
    return {
      ok: false,
      message: error.message ?? "Could not start checkout. Try again.",
    }
  }

  const url = data?.checkoutSession?.url
  if (!url) {
    return { ok: false, message: "Checkout URL was not returned." }
  }

  return { ok: true, url }
}

export async function openBillingPortal(): Promise<BillingActionResult> {
  const insforge = await createInsForgeServerClient()
  const { data: authData } = await insforge.auth.getCurrentUser()
  const user = authData?.user
  if (!user) {
    return { ok: false, message: "Sign in to manage billing." }
  }

  const appUrl = await resolveAppUrl()
  const environment = getStripePaymentEnvironment()

  const { data, error } =
    await insforge.payments.stripe.createCustomerPortalSession(environment, {
      subject: { type: "user", id: user.id },
      returnUrl: `${appUrl}/studio/billing`,
    })

  if (error) {
    const code = (error as { code?: string }).code
    if (code === "404" || error.message?.toLowerCase().includes("not found")) {
      return {
        ok: false,
        message:
          "No billing profile yet. Subscribe to Basic or Pro first, then you can manage payment methods here.",
      }
    }
    return {
      ok: false,
      message: error.message ?? "Could not open the billing portal.",
    }
  }

  const url = data?.customerPortalSession?.url
  if (!url) {
    return { ok: false, message: "Billing portal URL was not returned." }
  }

  return { ok: true, url }
}
