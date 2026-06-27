import Link from "next/link"
import { SiteLogo } from "@/components/landing/site-logo"
import { SocialIcon } from "@/components/landing/social-icons"
import { brand, footerColumns } from "@/lib/landing"

const socials = [
  { href: "https://x.com", label: "X", name: "x" as const },
  { href: "https://instagram.com", label: "Instagram", name: "instagram" as const },
  { href: "https://tiktok.com", label: "TikTok", name: "tiktok" as const },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-[#fbf7f8]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-6 lg:px-8">
        <div className="md:col-span-2">
          <SiteLogo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            An AI photo studio for skin, hair, and virtual try-on — built to
            show the look before you commit.
          </p>
        </div>
        {footerColumns.map((column) => (
          <div key={column.title}>
            <p className="text-xs font-semibold tracking-[0.16em] text-brand-ink uppercase">
              {column.title}
            </p>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-brand-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-brand-ink uppercase">
            Connect with us
          </p>
          <div className="mt-3 flex gap-3 text-muted-foreground">
            {socials.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className="hover:text-brand-ink"
              >
                <SocialIcon name={item.name} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-black/5">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 {brand.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/#pricing" className="hover:text-brand-ink">
              Privacy Policy
            </Link>
            <Link href="/#pricing" className="hover:text-brand-ink">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
