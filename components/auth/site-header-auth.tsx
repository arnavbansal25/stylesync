"use client"

import Link from "next/link"
import { signOutAction } from "@/app/actions/auth"
import { CtaButton } from "@/components/landing/cta-button"

export type SiteHeaderAuthUser = { id: string; email: string | null }

type SiteHeaderAuthProps = {
  className?: string
  initialUser: SiteHeaderAuthUser | null
  pending?: boolean
}

export function SiteHeaderAuth({
  className,
  initialUser,
  pending = false,
}: SiteHeaderAuthProps) {
  if (pending) {
    return (
      <div className={className}>
        <div className="h-10 w-[11.5rem] animate-pulse rounded-full bg-muted" />
      </div>
    )
  }

  if (initialUser) {
    return (
      <div className={className}>
        <div className="flex items-center gap-2">
          <form action={signOutAction}>
            <CtaButton type="submit" tone="ghost">
              Sign out
            </CtaButton>
          </form>
          <CtaButton tone="gold" render={<Link href="/studio" />}>
            Studio
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
          Get Started
        </CtaButton>
      </div>
    </div>
  )
}
