import { redirect } from "next/navigation"
import { MyProjectsView } from "@/components/dashboard/projects/my-projects-view"
import { getDashboardUser } from "@/lib/dashboard-session"
import { fetchStudioProjectsPage } from "@/lib/studio-projects-data"

type ProjectsPageProps = {
  searchParams?: Promise<{ page?: string }>
}

function parsePageParam(raw: string | undefined): number {
  const n = Number.parseInt(raw ?? "1", 10)
  if (!Number.isFinite(n) || n < 1) return 1
  return n
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const user = await getDashboardUser()
  if (!user) {
    redirect("/sign-in")
  }

  const params = searchParams ? await searchParams : {}
  const requestedPage = parsePageParam(params.page)
  const data = await fetchStudioProjectsPage(user.id, requestedPage)

  return <MyProjectsView data={data} />
}
