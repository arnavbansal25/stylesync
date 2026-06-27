import { Suspense } from "react"
import { AuthShell } from "@/components/auth/auth-shell"
import { RedirectIfAuthenticated } from "@/components/auth/redirect-if-authenticated"
import { SignInForm } from "@/components/auth/sign-in-form"

export default function SignInPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your Get Ready AI studio"
      footer={
        <p>
          By continuing, you agree to our terms of service and privacy policy.
        </p>
      }
    >
      <Suspense fallback={null}>
        <RedirectIfAuthenticated />
      </Suspense>
      <Suspense
        fallback={
          <p className="text-center text-sm text-muted-foreground">Loading…</p>
        }
      >
        <SignInForm />
      </Suspense>
    </AuthShell>
  )
}
