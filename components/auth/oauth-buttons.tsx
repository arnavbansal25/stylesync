"use client"

import { useTransition } from "react"
import { initiateOAuth } from "@/app/actions/auth"
import { CtaButton } from "@/components/landing/cta-button"
import { GoogleIcon } from "@/components/auth/google-icon"

export function OAuthButtons() {
  const [pending, startTransition] = useTransition()

  return (
    <CtaButton
      type="button"
      tone="ghost"
      disabled={pending}
      className="w-full border border-black/10 bg-white hover:bg-muted"
      onClick={() => startTransition(() => initiateOAuth("google"))}
    >
      <GoogleIcon className="mr-2 size-5" />
      Continue with Google
    </CtaButton>
  )
}
