import { headers } from "next/headers"

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

/**
 * Server-only. Prefer a non-localhost env URL; otherwise derive origin from the
 * incoming request (fixes OAuth redirects when NEXT_PUBLIC_APP_URL was baked as localhost).
 */
export async function resolveAppUrl(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL
    ? stripTrailingSlash(process.env.NEXT_PUBLIC_APP_URL)
    : null

  if (envUrl && !isLocalhostUrl(envUrl)) {
    return envUrl
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

  if (envUrl) {
    return envUrl
  }

  throw new Error("NEXT_PUBLIC_APP_URL is not set")
}
