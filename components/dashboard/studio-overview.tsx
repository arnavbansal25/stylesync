import { AiToolCard } from "@/components/dashboard/ai-tool-card"
import { RecentProjectsSection } from "@/components/dashboard/recent-projects-section"
import { StudioOverviewBanner } from "@/components/dashboard/studio-overview-banner"
import {
  DASHBOARD_AI_TOOLS_MAX,
  dashboardAiToolCards,
} from "@/lib/dashboard"

export function StudioOverview() {
  const tools = dashboardAiToolCards.slice(0, DASHBOARD_AI_TOOLS_MAX)

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <StudioOverviewBanner />

      <section className="mt-10 sm:mt-12">
        <div className="mb-6">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-brand-ink sm:text-2xl">
            AI tools
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Same categories as the sidebar — open any card to start editing.
          </p>
        </div>
        <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <li key={tool.name}>
              <AiToolCard tool={tool} className="h-full" />
            </li>
          ))}
        </ul>
      </section>

      <RecentProjectsSection />
    </main>
  )
}
