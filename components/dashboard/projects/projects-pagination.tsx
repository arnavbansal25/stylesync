import Link from "next/link"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type ProjectsPaginationProps = {
  page: number
  totalPages: number
}

function pageHref(page: number) {
  if (page <= 1) return "/studio/projects"
  return `/studio/projects?page=${page}`
}

function pageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages: (number | "ellipsis")[] = [1]
  if (current > 3) pages.push("ellipsis")
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let p = start; p <= end; p++) pages.push(p)
  if (current < total - 2) pages.push("ellipsis")
  pages.push(total)
  return pages
}

export function ProjectsPagination({
  page,
  totalPages,
}: ProjectsPaginationProps) {
  if (totalPages <= 1) return null

  const numbers = pageNumbers(page, totalPages)
  const prevDisabled = page <= 1
  const nextDisabled = page >= totalPages

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        <PaginationItem>
          {prevDisabled ? (
            <PaginationPrevious
              href={pageHref(page - 1)}
              className="pointer-events-none opacity-50"
              tabIndex={-1}
              aria-disabled
            />
          ) : (
            <PaginationPrevious href={pageHref(page - 1)} />
          )}
        </PaginationItem>

        {numbers.map((n, idx) =>
          n === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={n}>
              <PaginationLink
                href={pageHref(n)}
                isActive={n === page}
                size="icon"
                className={
                  n === page
                    ? "border-brand-teal/40 bg-brand-teal/10 text-brand-ink"
                    : undefined
                }
              >
                {n}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          {nextDisabled ? (
            <PaginationNext
              href={pageHref(page + 1)}
              className="pointer-events-none opacity-50"
              tabIndex={-1}
              aria-disabled
            />
          ) : (
            <PaginationNext href={pageHref(page + 1)} />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
