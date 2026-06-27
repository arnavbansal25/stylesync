import { SectionHeading } from "@/components/landing/section-heading"
import { SectionShell } from "@/components/landing/section-shell"
import { TestimonialCard } from "@/components/landing/testimonial-card"
import { testimonials } from "@/lib/landing"

export function TestimonialsSection() {
  return (
    <SectionShell id="testimonials" className="bg-brand-blush py-14 sm:py-20">
      <SectionHeading
        title="Testimonials"
        description="Creators, stylists, and first-time editors using Get Ready AI every week."
        className="mb-10"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((item) => (
          <TestimonialCard key={item.name} {...item} />
        ))}
      </div>
    </SectionShell>
  )
}
