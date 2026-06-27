"use client"

import Link from "next/link"
import { useEffect, useState, useTransition } from "react"
import { signOutAction } from "@/app/actions/auth"
import { CtaButton } from "@/components/landing/cta-button"
import { insforge } from "@/lib/insforge/client"

type AuthUser = { id: string; email: string | null }

export function SiteHeaderAuth({ className }: { className?: string }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const { data, error } = await insforge.auth.getCurrentUser()
      if (cancelled) return
      setUser(error ? null : (data?.user ?? null))
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className={className}>
        <div className="h-10 w-24 animate-pulse rounded-full bg-muted" />
      </div>
    )
  }

  if (user) {
    return (
      <div className={className}>
        <div className="flex items-center gap-2">
          <span className="hidden max-w-[140px] truncate text-sm text-muted-foreground sm:inline">
            {user.email}
          </span>
          <CtaButton
            type="button"
            tone="ghost"
            disabled={pending}
            onClick={() => startTransition(() => signOutAction())}
          >
            Sign out
          </CtaButton>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <CtaButton tone="ghost" render={<Link href="/sign-in" />}>
          Log In
        </CtaButton>
        <CtaButton tone="gold" render={<Link href="/sign-up" />}>
          Start Free Trial
        </CtaButton>
      </div>
    </div>
  )
}
