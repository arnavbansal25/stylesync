import Link from "next/link"
import { FolderKanban, Plus } from "lucide-react"
import { ProjectGenerationCard } from "@/components/dashboard/projects/project-generation-card"
import { ProjectsBanner } from "@/components/dashboard/projects/projects-banner"
import { ProjectsPagination } from "@/components/dashboard/projects/projects-pagination"
import { Button } from "@/components/ui/button"
import type { StudioProjectsPageResult } from "@/lib/studio-projects-data"

type MyProjectsViewProps = {
  data: StudioProjectsPageResult
}

export function MyProjectsView({ data }: MyProjectsViewProps) {
  const { items, page, total, totalPages } = data

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <ProjectsBanner totalProjects={total} />

      <section className="mt-10 sm:mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-heading text-xl font-semibold tracking-tight text-brand-ink sm:text-2xl">
              Gallery
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Newest generations first — up to {data.pageSize} per page.
            </p>
          </div>
          {total > 0 ? (
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
          ) : null}
        </div>

        {items.length === 0 ? (
          <div
            className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-teal/25 bg-white/70 px-6 py-14 text-center"
          >
            <div
              className="flex size-12 items-center justify-center rounded-full bg-brand-blush/80 text-brand-teal"
            >
              <FolderKanban className="size-6" aria-hidden />
            </div>
            <p className="mt-4 font-medium text-brand-ink">No projects yet</p>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Run Beauty, Fashion, or AI Extras in the studio. Each completed
              generation will appear here automatically.
            </p>
            <Button
              className="mt-6 bg-brand-teal text-white hover:bg-brand-teal-dark"
              render={<Link href="/studio/ai/beauty" />}
            >
              <Plus className="size-4" aria-hidden />
              Start with Beauty
            </Button>
          </div>
        ) : (
          <ul className="mt-6 grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((project) => (
              <li key={`${project.category}-${project.id}`}>
                <ProjectGenerationCard project={project} />
              </li>
            ))}
          </ul>
        )}

        <ProjectsPagination page={page} totalPages={totalPages} />
      </section>
    </main>
  )
}
