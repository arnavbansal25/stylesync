"use client"

import { useState, useTransition } from "react"
import { Check, CreditCard, Loader2, Sparkles } from "lucide-react"
import {
  openBillingPortal,
  startSubscriptionCheckout,
} from "@/app/actions/billing"
import { Button } from "@/components/ui/button"
import {
  BILLING_PLANS,
  formatBillingPlanLabel,
  getBillingPlan,
  type BillingPlanId,
  type PaidBillingPlanId,
} from "@/lib/billing-plans"
import type { DashboardUser } from "@/lib/dashboard"
import { cn } from "@/lib/utils"

type BillingWorkspaceProps = {
  user: DashboardUser
  checkoutSuccess?: boolean
}

function formatRenewalDate(iso: string | null): string | null {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function planRank(plan: BillingPlanId): number {
  if (plan === "free") return 0
  if (plan === "basic") return 1
  return 2
}

export function BillingWorkspace({ user, checkoutSuccess }: BillingWorkspaceProps) {
  const [pendingPlan, setPendingPlan] = useState<PaidBillingPlanId | null>(null)
  const [portalPending, setPortalPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const currentPlan = getBillingPlan(user.billingPlan)
  const renewsOn = formatRenewalDate(user.subscriptionPeriodEnd)
  const cancelsOn = formatRenewalDate(user.subscriptionCancelAt)
  const hasPaidPlan =
    user.billingPlan !== "free" ||
    user.subscriptionStatus === "active" ||
    user.subscriptionStatus === "trialing"

  async function handleUpgrade(plan: PaidBillingPlanId) {
    setError(null)
    setPendingPlan(plan)
    startTransition(async () => {
      const result = await startSubscriptionCheckout(plan)
      setPendingPlan(null)
      if (!result.ok) {
        setError(result.message)
        return
      }
      window.location.assign(result.url)
    })
  }

  async function handlePortal() {
    setError(null)
    setPortalPending(true)
    startTransition(async () => {
      const result = await openBillingPortal()
      setPortalPending(false)
      if (!result.ok) {
        setError(result.message)
        return
      }
      window.location.assign(result.url)
    })
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-teal/15 via-white to-brand-gold/10 px-6 py-8 shadow-sm ring-1 ring-brand-teal/20 sm:px-10 sm:py-10">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-brand-teal">
              Billing
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
              Credits & subscription
            </h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Your balance powers every AI generation. Upgrade for monthly credit
              top-ups; manage payment methods in Stripe.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-sm font-medium text-brand-ink ring-1 ring-brand-teal/25">
              <Sparkles className="size-4 text-brand-gold" aria-hidden />
              {formatBillingPlanLabel(user.billingPlan)} plan
            </span>
            <p className="text-4xl font-semibold tabular-nums text-brand-ink">
              {user.remainingCredits}
              <span className="ml-2 text-base font-normal text-muted-foreground">
                credits left
              </span>
            </p>
          </div>
        </div>
      </div>

      {checkoutSuccess ? (
        <div
          className="mt-6 rounded-2xl border border-brand-teal/30 bg-brand-teal/5 px-4 py-3 text-sm text-brand-ink"
          role="status"
        >
          Payment received. Credits and plan updates apply after Stripe confirms
          (usually within a minute). Refresh this page if your balance has not
          updated yet.
        </div>
      ) : null}

      {error ? (
        <div
          className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <section className="mt-8 rounded-2xl border border-brand-teal/15 bg-white/70 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-lg font-semibold text-brand-ink">
              Current subscription
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {currentPlan.name} —{" "}
              {user.billingPlan === "free"
                ? "no active paid subscription"
                : user.subscriptionStatus ?? "active"}
            </p>
            {renewsOn && user.billingPlan !== "free" && !cancelsOn ? (
              <p className="mt-1 text-sm text-muted-foreground">
                Renews on {renewsOn}
              </p>
            ) : null}
            {cancelsOn ? (
              <p className="mt-1 text-sm text-amber-800">
                Scheduled to end on {cancelsOn}
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="outline"
            className="border-brand-teal/40"
            disabled={isPending || portalPending}
            onClick={() => handlePortal()}
          >
            {portalPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <CreditCard className="size-4" aria-hidden />
            )}
            Manage payment & subscription
          </Button>
        </div>
        {!hasPaidPlan ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Subscribe to Basic or Pro below to unlock the billing portal.
          </p>
        ) : null}
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-xl font-semibold text-brand-ink">
          Plans
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Paid plans add credits to your balance each billing cycle (unused
          credits carry over).
        </p>
        <ul className="mt-6 grid list-none gap-6 lg:grid-cols-3">
          {BILLING_PLANS.map((plan) => {
            const isCurrent = user.billingPlan === plan.id
            const isUpgrade =
              plan.id !== "free" &&
              planRank(plan.id) > planRank(user.billingPlan)
            const isDowngrade =
              plan.id !== "free" &&
              planRank(plan.id) < planRank(user.billingPlan)
            const loading =
              isPending &&
              plan.id !== "free" &&
              pendingPlan === plan.id

            return (
              <li
                key={plan.id}
                className={cn(
                  "flex flex-col rounded-2xl border bg-white p-6 shadow-sm",
                  plan.popular
                    ? "border-brand-gold/50 ring-2 ring-brand-gold/30"
                    : "border-brand-teal/15",
                  isCurrent && "ring-2 ring-brand-teal/40"
                )}
              >
                {plan.popular ? (
                  <span className="mb-3 inline-flex w-fit rounded-full bg-brand-gold/15 px-2.5 py-0.5 text-xs font-semibold text-brand-ink">
                    Most popular
                  </span>
                ) : null}
                <h3 className="font-heading text-xl font-semibold text-brand-ink">
                  {plan.name}
                </h3>
                <p className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold text-brand-ink">
                    {plan.priceLabel}
                  </span>
                  {plan.priceCents !== null ? (
                    <span className="text-sm text-muted-foreground">/ month</span>
                  ) : null}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.signupCredits !== null
                    ? `${plan.signupCredits} credits at signup`
                    : `+${plan.monthlyCreditGrant} credits per billing cycle`}
                </p>
                <ul className="mt-5 flex flex-1 flex-col gap-2 text-sm text-brand-ink/90">
                  {plan.highlights.map((line) => (
                    <li key={line} className="flex gap-2">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-brand-teal"
                        aria-hidden
                      />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  {plan.id === "free" ? (
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      disabled={isCurrent}
                    >
                      {isCurrent ? "Current plan" : "Included"}
                    </Button>
                  ) : isCurrent ? (
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      disabled
                    >
                      Current plan
                    </Button>
                  ) : isDowngrade ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      disabled={isPending}
                      onClick={() => handlePortal()}
                    >
                      Change in billing portal
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className="w-full bg-brand-teal text-white hover:bg-brand-teal/90"
                      disabled={isPending}
                      onClick={() => handleUpgrade(plan.id as PaidBillingPlanId)}
                    >
                      {loading ? (
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                      ) : null}
                      {isUpgrade ? `Upgrade to ${plan.name}` : `Choose ${plan.name}`}
                    </Button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}
