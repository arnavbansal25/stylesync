"use client"

import Link from "next/link"
import { ChevronDown, Menu } from "lucide-react"
import { SiteHeaderAuth } from "@/components/auth/site-header-auth"
import { SiteLogo } from "@/components/landing/site-logo"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { featureLinks, navLinks } from "@/lib/landing"
import { cn } from "@/lib/utils"

const secondaryNav = navLinks.filter((link) => link.label !== "Home")

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <SiteLogo />

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          <Link
            href="/"
            className="border-b-2 border-brand-teal px-3 py-2 text-sm font-medium text-brand-teal"
          >
            Home
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-brand-ink/80 hover:bg-muted hover:text-brand-ink"
            >
              Features
              <ChevronDown className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-56">
              {featureLinks.map((item) => (
                <DropdownMenuItem
                  key={item.href}
                  render={<Link href={item.href} />}
                >
                  <span>
                    <span className="block font-medium">{item.label}</span>
                    <span className="block text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {secondaryNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-brand-ink/80 hover:text-brand-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <SiteHeaderAuth className="hidden lg:block" />

        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="lg:hidden" />
            }
          >
            <Menu className="size-5" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle>
                <SiteLogo />
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-2 py-2 text-sm font-medium",
                    link.label === "Home" && "text-brand-teal"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {featureLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-2 py-2 text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-auto p-4">
              <SiteHeaderAuth />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
