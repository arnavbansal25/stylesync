import { Suspense } from "react"
import { AuthShell } from "@/components/auth/auth-shell"
import { RedirectIfAuthenticated } from "@/components/auth/redirect-if-authenticated"
import { SignUpForm } from "@/components/auth/sign-up-form"

export default function SignUpPage() {
  return (
    <AuthShell
      title="Start your free trial"
      subtitle="Create your Get Ready AI account in seconds"
    >
      <Suspense fallback={null}>
        <RedirectIfAuthenticated />
      </Suspense>
      <Suspense
        fallback={
          <p className="text-center text-sm text-muted-foreground">Loading…</p>
        }
      >
        <SignUpForm />
      </Suspense>
    </AuthShell>
  )
}
