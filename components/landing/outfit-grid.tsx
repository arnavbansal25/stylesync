import { OutfitCard } from "@/components/landing/outfit-card"
import { SectionHeading } from "@/components/landing/section-heading"
import { SectionShell } from "@/components/landing/section-shell"
import { outfitLooks } from "@/lib/landing"

export function OutfitGrid() {
  return (
    <SectionShell id="lookbook" className="bg-white py-8 sm:py-12">
      <SectionHeading
        eyebrow="Smart Closet"
        title="Try looks on your photo"
        description="Mix outfits on your photo and save a set that already looks like you."
        className="mb-8"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
        {outfitLooks.map((look) => (
          <OutfitCard key={look.src} {...look} />
        ))}
      </div>
    </SectionShell>
  )
}
