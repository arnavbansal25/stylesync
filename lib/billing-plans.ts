export type PaidBillingPlanId = "basic" | "pro"
export type BillingPlanId = "free" | PaidBillingPlanId

export type BillingPlanDefinition = {
  id: BillingPlanId
  name: string
  priceLabel: string
  priceCents: number | null
  monthlyCreditGrant: number | null
  signupCredits: number | null
  highlights: string[]
  popular?: boolean
}

export const BILLING_PLANS: BillingPlanDefinition[] = [
  {
    id: "free",
    name: "Free",
    priceLabel: "₹0",
    priceCents: null,
    monthlyCreditGrant: null,
    signupCredits: 25,
    highlights: [
      "25 credits when you sign up",
      "Access to every studio AI tool",
      "5 credits per generation",
      "My Projects gallery",
      "Upgrade anytime",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    priceLabel: "₹999",
    priceCents: 99900,
    monthlyCreditGrant: 350,
    signupCredits: null,
    highlights: [
      "Everything in Free",
      "350 credits added each billing cycle",
      "Ideal for regular creators",
      "Cancel anytime in the billing portal",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    priceLabel: "₹2,499",
    priceCents: 249900,
    monthlyCreditGrant: 1000,
    signupCredits: null,
    popular: true,
    highlights: [
      "Everything in Basic",
      "1,000 credits added each billing cycle",
      "Best value for heavy studio use",
      "Priority access as we scale capacity",
    ],
  },
]

export function getBillingPlan(id: BillingPlanId): BillingPlanDefinition {
  const plan = BILLING_PLANS.find((p) => p.id === id)
  if (!plan) {
    return BILLING_PLANS[0]
  }
  return plan
}

export function formatBillingPlanLabel(plan: BillingPlanId): string {
  return getBillingPlan(plan).name
}
