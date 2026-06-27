import Link from "next/link"
import { SiteLogo } from "@/components/landing/site-logo"

type AuthShellProps = {
  title: string
  subtitle: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-linear-to-b from-brand-blush via-white to-brand-cream/40">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(62,207,196,0.12),transparent_55%)]"
        aria-hidden
      />
      <header className="relative z-10 border-b border-black/5 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6 lg:px-8">
          <SiteLogo />
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-black/5 bg-white/90 p-8 shadow-xl shadow-brand-teal/5 backdrop-blur-sm">
            <div className="mb-8 text-center">
              <h1 className="font-heading text-3xl font-semibold tracking-tight text-brand-ink">
                {title}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            </div>
            {children}
          </div>
          {footer ? (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              {footer}
            </div>
          ) : null}
        </div>
      </main>

      <footer className="relative z-10 py-6 text-center text-xs text-muted-foreground">
        <Link href="/" className="hover:text-brand-teal">
          ← Back to home
        </Link>
      </footer>
    </div>
  )
}
