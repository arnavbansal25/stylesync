import { redirect } from "next/navigation"
import { BillingWorkspace } from "@/components/dashboard/billing/billing-workspace"
import { getDashboardUser } from "@/lib/dashboard-session"

type BillingPageProps = {
  searchParams?: Promise<{ checkout?: string }>
}

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const user = await getDashboardUser()
  if (!user) {
    redirect("/sign-in?next=/studio/billing")
  }

  const params = searchParams ? await searchParams : {}
  const checkoutSuccess = params.checkout === "success"

  return <BillingWorkspace user={user} checkoutSuccess={checkoutSuccess} />
}
