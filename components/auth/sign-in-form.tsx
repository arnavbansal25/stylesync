"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { signInWithEmail } from "@/app/actions/auth"
import { OAuthButtons } from "@/components/auth/oauth-buttons"
import { CtaButton } from "@/components/landing/cta-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const errorMessages: Record<string, string> = {
  oauth_failed: "Google sign-in was cancelled or failed. Please try again.",
  missing_verifier: "Your sign-in session expired. Please try again.",
  exchange_failed: "We could not complete Google sign-in. Please try again.",
  missing_code: "Invalid sign-in response. Please try again.",
}

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(() => {
    const code = searchParams.get("error")
    return code ? (errorMessages[code] ?? "Sign in failed.") : null
  })
  const [pending, startTransition] = useTransition()

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await signInWithEmail(email.trim(), password)
      if (!result.ok) {
        setError(result.message ?? "Sign in failed.")
        return
      }
      router.replace("/")
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      <OAuthButtons />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-black/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wide">
          <span className="bg-white px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-11 rounded-xl"
          />
        </div>

        {error ? (
          <p className="text-sm text-destructive" role="alert">{error}</p>
        ) : null}

        <CtaButton type="submit" tone="teal" className="w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </CtaButton>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        New to Get Ready AI?{" "}
        <Link href="/sign-up" className="font-medium text-brand-teal hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}
