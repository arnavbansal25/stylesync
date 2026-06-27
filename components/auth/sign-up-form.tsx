"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { signUpWithEmail, verifyEmailCode } from "@/app/actions/auth"
import { OAuthButtons } from "@/components/auth/oauth-buttons"
import { CtaButton } from "@/components/landing/cta-button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Step = "register" | "verify"

export function SignUpForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("register")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function handleRegister(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await signUpWithEmail(
        email.trim(),
        password,
        name.trim()
      )
      if (!result.ok) {
        setError(result.message ?? "Sign up failed.")
        return
      }
      if (result.requireEmailVerification) {
        setStep("verify")
        return
      }
      router.replace("/")
      router.refresh()
    })
  }

  function handleVerify(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await verifyEmailCode(email.trim(), otp)
      if (!result.ok) {
        setError(result.message ?? "Invalid code.")
        return
      }
      router.replace("/")
      router.refresh()
    })
  }

  if (step === "verify") {
    return (
      <div className="space-y-6">
        <p className="text-center text-sm text-muted-foreground">
          We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>.
          Enter it below to verify your email.
        </p>
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, i) => (
                  <InputOTPSlot key={i} index={i} className="size-11 rounded-xl" />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          {error ? (
            <p className="text-center text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <CtaButton
            type="submit"
            tone="gold"
            className="w-full"
            disabled={pending || otp.length < 6}
          >
            {pending ? "Verifying…" : "Verify & continue"}
          </CtaButton>
        </form>
        <button
          type="button"
          className="w-full text-sm text-muted-foreground hover:text-brand-teal"
          onClick={() => setStep("register")}
        >
          ← Use a different email
        </button>
      </div>
    )
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

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="h-11 rounded-xl"
          />
        </div>
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
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="h-11 rounded-xl"
          />
        </div>

        {error ? (
          <p className="text-sm text-destructive" role="alert">{error}</p>
        ) : null}

        <CtaButton type="submit" tone="gold" className="w-full" disabled={pending}>
          {pending ? "Creating account…" : "Create account"}
        </CtaButton>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-brand-teal hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
