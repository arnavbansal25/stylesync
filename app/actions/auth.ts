"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createAuthActions } from "@insforge/sdk/ssr"
import { getAppUrl } from "@/lib/auth/get-app-url"

export type AuthActionResult = {
  ok: boolean
  message?: string
  requireEmailVerification?: boolean
  user?: { id: string; email: string | null }
}

function authErrorMessage(error: { message?: string } | null) {
  return error?.message ?? "Something went wrong. Please try again."
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthActionResult> {
  const auth = createAuthActions({ cookies: await cookies() })
  const { data, error } = await auth.signInWithPassword({ email, password })

  if (error) {
    return { ok: false, message: authErrorMessage(error) }
  }

  if (!data?.user) {
    return { ok: false, message: "Sign in failed." }
  }

  revalidatePath("/")

  return {
    ok: true,
    user: { id: data.user.id, email: data.user.email ?? null },
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
): Promise<AuthActionResult> {
  const auth = createAuthActions({ cookies: await cookies() })
  const { data, error } = await auth.signUp({
    email,
    password,
    name,
    redirectTo: `${getAppUrl()}/sign-in`,
  })

  if (error) {
    return { ok: false, message: authErrorMessage(error) }
  }

  if (data?.requireEmailVerification) {
    return { ok: true, requireEmailVerification: true }
  }

  if (data?.user) {
    revalidatePath("/")
    return {
      ok: true,
      user: { id: data.user.id, email: data.user.email ?? null },
    }
  }

  return { ok: false, message: "Sign up failed." }
}

export async function verifyEmailCode(
  email: string,
  otp: string
): Promise<AuthActionResult> {
  const auth = createAuthActions({ cookies: await cookies() })
  const { data, error } = await auth.verifyEmail({ email, otp })

  if (error) {
    return { ok: false, message: authErrorMessage(error) }
  }

  if (!data?.user) {
    return { ok: false, message: "Verification failed." }
  }

  revalidatePath("/")

  return {
    ok: true,
    user: { id: data.user.id, email: data.user.email ?? null },
  }
}

export async function signOutAction() {
  const auth = createAuthActions({ cookies: await cookies() })
  await auth.signOut()
  revalidatePath("/")
  redirect("/")
}

export async function initiateOAuth(provider: "google" | "github") {
  const cookieStore = await cookies()
  const auth = createAuthActions({ cookies: cookieStore })
  const { data, error } = await auth.signInWithOAuth(provider, {
    redirectTo: `${getAppUrl()}/api/auth/callback`,
    skipBrowserRedirect: true,
    additionalParams: { prompt: "select_account" },
  })

  if (error || !data?.url || !data.codeVerifier) {
    throw new Error(error?.message ?? "Could not start OAuth sign-in.")
  }

  cookieStore.set("insforge_code_verifier", data.codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  })

  redirect(data.url)
}
