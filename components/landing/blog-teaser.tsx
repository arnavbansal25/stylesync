import { SectionHeading } from "@/components/landing/section-heading"
import { SectionShell } from "@/components/landing/section-shell"

const posts = [
  {
    title: "How to retouch skin without losing texture",
    kicker: "Skin & Face",
  },
  {
    title: "Virtual try-on outfits that photograph true-to-life",
    kicker: "Fashion",
  },
  {
    title: "Beard maps: preview a fade before the chair",
    kicker: "Hair & Beard",
  },
] as const

export function BlogTeaser() {
  return (
    <SectionShell id="blog" className="bg-white py-6 sm:py-10">
      <SectionHeading
        eyebrow="Style Blog"
        title="Looks, how-tos, and studio notes"
        className="mb-8"
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.title}
            className="rounded-3xl bg-[#f7f3ee] p-5 ring-1 ring-black/5"
          >
            <p className="text-[11px] font-semibold tracking-[0.18em] text-brand-teal uppercase">
              {post.kicker}
            </p>
            <h3 className="mt-3 font-heading text-xl text-brand-ink">
              {post.title}
            </h3>
          </article>
        ))}
      </div>
    </SectionShell>
  )
}
