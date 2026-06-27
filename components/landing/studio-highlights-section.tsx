import { CategoryHighlight } from "@/components/landing/category-highlight"
import { FashionIllustration } from "@/components/landing/fashion-illustration"
import { HairIllustration } from "@/components/landing/hair-illustration"
import { SectionShell } from "@/components/landing/section-shell"

export function StudioHighlightsSection() {
  return (
    <SectionShell className="bg-[#fbf7f8] py-10 sm:py-16">
      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryHighlight
          id="try-on"
          eyebrow="Studio"
          title="Fashion & Try-On"
          description="Virtual clothing on a photo you already have. Mix dresses, coats, and sets without a fitting room."
          media={<FashionIllustration className="mx-auto h-44 w-full" />}
        />
        <CategoryHighlight
          id="hair-beard"
          eyebrow="Studio"
          title="Hair & Beard"
          description="Preview color, cuts, and facial hair on your face before you sit in the chair."
          media={<HairIllustration className="mx-auto h-44 w-full" />}
        />
      </div>
      <div id="skin-face" className="sr-only">
        Skin and face studio
      </div>
    </SectionShell>
  )
}
