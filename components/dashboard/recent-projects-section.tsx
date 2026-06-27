import Link from "next/link"
import { FolderKanban, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RecentProjectsSection() {
  const projects: { id: string; title: string; updatedAt: string }[] = []

  return (
    <section className="mt-10 sm:mt-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-brand-ink sm:text-2xl">
            Recent projects
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick up where you left off or start something new.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-brand-teal/30 text-brand-ink hover:bg-brand-teal/10"
          render={<Link href="/studio/projects" />}
        >
          View all
        </Button>
      </div>

      {projects.length === 0 ? (
        <div
          className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-teal/25 bg-white/70 px-6 py-12 text-center"
        >
          <div
            className="flex size-12 items-center justify-center rounded-full bg-brand-blush/80 text-brand-teal"
          >
            <FolderKanban className="size-6" aria-hidden />
          </div>
          <p className="mt-4 font-medium text-brand-ink">No projects yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Your saved edits will show up here once you run a tool and save a
            project.
          </p>
          <Button
            className="mt-6 bg-brand-teal text-white hover:bg-brand-teal-dark"
            render={<Link href="/studio/ai/skin-face" />}
          >
            <Plus className="size-4" aria-hidden />
            Start with Skin & Face
          </Button>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li
              key={project.id}
              className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm"
            >
              <p className="font-medium text-brand-ink">{project.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Updated {project.updatedAt}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
