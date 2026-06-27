type StudioSectionPageProps = {
  title: string
  description: string
}

export function StudioSectionPage({ title, description }: StudioSectionPageProps) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="font-heading text-2xl font-semibold tracking-tight text-brand-ink sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 max-w-xl text-muted-foreground">{description}</p>
      <div
        className="mt-8 flex min-h-[12rem] items-center justify-center rounded-2xl border border-dashed border-brand-teal/30 bg-white/60 px-6 text-center text-sm text-muted-foreground"
      >
        Editor coming soon — your dashboard layout is ready.
      </div>
    </main>
  )
}
