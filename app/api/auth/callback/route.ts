import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"
import { createAuthActions } from "@insforge/sdk/ssr"

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("insforge_code")
  const oauthError = request.nextUrl.searchParams.get("error")

  if (oauthError || !code) {
    const target = new URL("/sign-in", request.url)
    target.searchParams.set("error", oauthError ? "oauth_failed" : "missing_code")
    return NextResponse.redirect(target)
  }

  const cookieStore = await cookies()
  const codeVerifier = cookieStore.get("insforge_code_verifier")?.value
  if (!codeVerifier) {
    const target = new URL("/sign-in", request.url)
    target.searchParams.set("error", "missing_verifier")
    return NextResponse.redirect(target)
  }

  const response = NextResponse.redirect(new URL("/", request.url))
  const auth = createAuthActions({
    requestCookies: request.cookies,
    responseCookies: response.cookies,
  })

  const { data, error } = await auth.exchangeOAuthCode(code, codeVerifier)
  if (error || !data?.user) {
    const target = new URL("/sign-in", request.url)
    target.searchParams.set("error", "exchange_failed")
    return NextResponse.redirect(target)
  }

  response.cookies.delete("insforge_code_verifier")
  return response
}
