import type { createInsForgeServerClient } from "@/lib/insforge/server"
import { STUDIO_GENERATION_CREDIT_COST } from "@/lib/studio-generation-cost"

type InsforgeClient = Awaited<ReturnType<typeof createInsForgeServerClient>>

export type StudioCreditResult =
  | { ok: true; remainingCredits: number }
  | {
      ok: false
      error: string
      code: "insufficient_credits" | "unauthorized" | "server"
    }

function parseCreditBalance(data: unknown): number | null {
  if (typeof data === "number" && Number.isFinite(data)) return data
  if (typeof data === "string" && data.trim() !== "") {
    const n = Number(data)
    if (Number.isFinite(n)) return n
  }
  return null
}

function normalizeAmount(amount: number | undefined): number {
  const raw = amount ?? STUDIO_GENERATION_CREDIT_COST
  const amt = Math.trunc(Number(raw))
  if (!Number.isFinite(amt) || amt <= 0) {
    return STUDIO_GENERATION_CREDIT_COST
  }
  return amt
}

async function rpcDeduct(
  insforge: InsforgeClient,
  amount: number
): Promise<{ data: unknown; error: { message?: string } | null }> {
  const p_amount = normalizeAmount(amount)

  const studio = await insforge.database.rpc("deduct_studio_credits", {
    p_amount,
  })
  if (!studio.error) return studio

  const { data: authData } = await insforge.auth.getCurrentUser()
  const userId = authData?.user?.id
  if (!userId) return studio

  return insforge.database.rpc("deduct_user_credits", {
    p_user_id: userId,
    p_amount,
  })
}

async function rpcRefund(insforge: InsforgeClient, amount: number): Promise<void> {
  const p_amount = normalizeAmount(amount)

  const studio = await insforge.database.rpc("refund_studio_credits", {
    p_amount,
  })
  if (!studio.error) return

  const userId = (await insforge.auth.getCurrentUser()).data?.user?.id
  if (!userId) return

  await insforge.database.rpc("refund_user_credits", {
    p_user_id: userId,
    p_amount,
  })
}

export async function deductStudioCredits(
  insforge: InsforgeClient,
  _userId: string,
  amount: number
): Promise<StudioCreditResult> {
  const { data, error } = await rpcDeduct(insforge, amount)

  if (error) {
    const message = error.message ?? "Could not deduct credits"
    if (message.includes("Could not find the function")) {
      return {
        ok: false,
        error:
          "Credit system is updating — refresh the page and try again in a moment.",
        code: "server",
      }
    }
    return {
      ok: false,
      error: message,
      code: "server",
    }
  }

  const remaining = parseCreditBalance(data)
  if (remaining !== null) {
    return { ok: true, remainingCredits: remaining }
  }

  const { data: authData } = await insforge.auth.getCurrentUser()
  if (!authData?.user) {
    return {
      ok: false,
      error: "Session expired — sign in and try again",
      code: "unauthorized",
    }
  }

  return {
    ok: false,
    error: "Insufficient credits for this generation",
    code: "insufficient_credits",
  }
}

export async function refundStudioCredits(
  insforge: InsforgeClient,
  _userId: string,
  amount: number
): Promise<void> {
  await rpcRefund(insforge, amount)
}
