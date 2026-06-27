import { Suspense } from "react"
import { BlogTeaser } from "@/components/landing/blog-teaser"
import { FeatureStrip } from "@/components/landing/feature-strip"
import { HeroSection } from "@/components/landing/hero-section"
import { OutfitGrid } from "@/components/landing/outfit-grid"
import { PricingTeaser } from "@/components/landing/pricing-teaser"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"
import { SiteHeaderWithAuth } from "@/components/landing/site-header-with-auth"
import { StudioHighlightsSection } from "@/components/landing/studio-highlights-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"

export function LandingPage() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <Suspense fallback={<SiteHeader authPending />}>
        <SiteHeaderWithAuth />
      </Suspense>
      <main className="flex-1">
        <HeroSection />
        <FeatureStrip />
        <StudioHighlightsSection />
        <OutfitGrid />
        <BlogTeaser />
        <TestimonialsSection />
        <PricingTeaser />
      </main>
      <SiteFooter />
    </div>
  )
}
