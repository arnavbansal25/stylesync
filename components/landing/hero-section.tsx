import Image from "next/image"
import { CtaButton } from "@/components/landing/cta-button"
import { InteractiveShowcase } from "@/components/landing/interactive-showcase"
import { brand } from "@/lib/landing"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#e8c9a8]">
      <Image
        src="https://images.unsplash.com/photo-1612817288484-6f916006741e?auto=format&fit=crop&w=2000&q=80"
        alt="Warm studio lighting on gold beauty products"
        fill
        preload
        sizes="100vw"
        className="object-cover object-[30%_center]"
        // priority
      />
      <div className="absolute inset-0 bg-linear-to-r from-[#f3e3d4]/95 via-[#f3e3d4]/55 to-transparent" />

      <div className="relative mx-auto grid w-full max-w-6xl items-end gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-6 lg:px-8 lg:py-12">
        <div className="max-w-sm pb-2 lg:pb-8">
          <h1 className="font-heading text-[2rem] leading-[1.08] font-medium tracking-tight text-brand-ink uppercase sm:text-5xl lg:text-[3.15rem]">
            {brand.tagline}
          </h1>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-ink/75 sm:text-[15px]">
            All-in-one AI fashion and beauty studio. See the photorealistic
            power of our AI photo editor.
          </p>
          <CtaButton tone="teal" className="mt-7 px-7" render={<a href="#download" />}>
            Download Now
          </CtaButton>
        </div>

        <InteractiveShowcase className="lg:-mr-6 xl:-mr-16" />
      </div>
    </section>
  )
}
