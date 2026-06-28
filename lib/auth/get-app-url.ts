import { headers } from "next/headers"
import type { NextRequest } from "next/server"

function stripTrailingSlash(url: string) {
  return url.replace(/\/$/, "")
}

function isLocalhostUrl(url: string) {
  try {
    const hostname = new URL(url).hostname
    return hostname === "localhost" || hostname === "127.0.0.1"
  } catch {
    return url.includes("localhost") || url.includes("127.0.0.1")
  }
}

export function getAppUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL
  if (!url) {
    throw new Error("NEXT_PUBLIC_APP_URL is not set")
  }
  return stripTrailingSlash(url)
}

/** Production/canonical origin from env when set to a non-localhost URL. */
export function getCanonicalAppUrl(): string | null {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL
    ? stripTrailingSlash(process.env.NEXT_PUBLIC_APP_URL)
    : null
  if (envUrl && !isLocalhostUrl(envUrl)) {
    return envUrl
  }
  return null
}

export function getOAuthCallbackUrl(): string {
  const base = getCanonicalAppUrl() ?? getAppUrl()
  return `${base}/api/auth/callback`
}

export function isNetlifyBranchDeployHost(hostname: string): boolean {
  return hostname.includes("--") && hostname.endsWith(".netlify.app")
}

/** OAuth code must hit /api/auth/callback so the verifier cookie can be exchanged. */
export function oauthCallbackRedirectTarget(request: NextRequest): URL | null {
  if (!request.nextUrl.searchParams.has("insforge_code")) {
    return null
  }
  if (request.nextUrl.pathname === "/api/auth/callback") {
    return null
  }
  const target = new URL(request.url)
  target.pathname = "/api/auth/callback"
  return target
}

/**
 * Netlify branch URLs (e.g. master--site.netlify.app) are a different site than
 * the production custom/domain URL — auth cookies do not cross. Send auth traffic
 * to NEXT_PUBLIC_APP_URL so OAuth start + callback share one origin.
 */
export function canonicalAuthRedirectTarget(
  request: NextRequest
): URL | null {
  const canonical = getCanonicalAppUrl()
  if (!canonical) {
    return null
  }

  const canonicalHost = new URL(canonical).hostname
  const requestHost = request.nextUrl.hostname
  if (requestHost === canonicalHost) {
    return null
  }

  if (!isNetlifyBranchDeployHost(requestHost)) {
    return null
  }

  const { pathname, search } = request.nextUrl
  const hasOAuthCode = request.nextUrl.searchParams.has("insforge_code")
  const isAuthRoute =
    pathname === "/sign-in" ||
    pathname === "/sign-up" ||
    pathname.startsWith("/api/auth/") ||
    hasOAuthCode

  if (!isAuthRoute) {
    return null
  }

  const target = new URL(canonical)
  if (hasOAuthCode && pathname !== "/api/auth/callback") {
    target.pathname = "/api/auth/callback"
    target.search = search
  } else {
    target.pathname = pathname
    target.search = search
  }
  return target
}

/**
 * Server-only. Prefer a non-localhost env URL; otherwise derive origin from the
 * incoming request (fixes OAuth redirects when NEXT_PUBLIC_APP_URL was baked as localhost).
 */
export async function resolveAppUrl(): Promise<string> {
  const canonical = getCanonicalAppUrl()
  if (canonical) {
    return canonical
  }

  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host")
  if (host) {
    const hostname = host.split(",")[0]?.trim()
    if (hostname && !isLocalhostUrl(`http://${hostname}`)) {
      const proto =
        h.get("x-forwarded-proto")?.split(",")[0]?.trim() ??
        (process.env.NODE_ENV === "production" ? "https" : "http")
      return stripTrailingSlash(`${proto}://${hostname}`)
    }
  }

  return getAppUrl()
}
