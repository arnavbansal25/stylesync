import Link from "next/link"
import { CtaButton } from "@/components/landing/cta-button"
import { SectionHeading } from "@/components/landing/section-heading"
import { SectionShell } from "@/components/landing/section-shell"

export function PricingTeaser() {
  return (
    <SectionShell id="pricing" className="bg-white py-16">
      <div
        id="download"
        className="flex flex-col items-start justify-between gap-6 rounded-[28px] bg-brand-ink px-8 py-10 text-white sm:flex-row sm:items-center"
      >
        <SectionHeading
          title="Start free trial"
          description="Edit one look on us, then keep the studio for skin, hair, and try-on."
          className="max-w-lg [&_h2]:text-white [&_p]:text-white/70"
        />
        <CtaButton tone="gold" className="shrink-0" render={<Link href="/#pricing" />}>
          Start Free Trial
        </CtaButton>
      </div>
    </SectionShell>
  )
}
