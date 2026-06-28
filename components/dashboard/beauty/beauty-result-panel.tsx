"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { Download, ImageOff, Loader2, Sparkles } from "lucide-react"
import { BeforeAfterSlider } from "@/components/landing/before-after-slider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ResultViewMode = "compare" | "after"

type BeautyResultPanelProps = {
  sourcePreviewSrc: string | null
  resultPreviewSrc: string | null
  isGenerating?: boolean
  className?: string
}

async function downloadImage(url: string, filename = "beauty-result.jpg") {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Download failed")
  const blob = await res.blob()
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = objectUrl
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(objectUrl)
}

export function BeautyResultPanel({
  sourcePreviewSrc,
  resultPreviewSrc,
  isGenerating = false,
  className,
}: BeautyResultPanelProps) {
  const [viewMode, setViewMode] = useState<ResultViewMode>("compare")
  const [isDownloading, setIsDownloading] = useState(false)

  const showingSourceOnly = !resultPreviewSrc && Boolean(sourcePreviewSrc)
  const canCompare = Boolean(sourcePreviewSrc && resultPreviewSrc)
  const displaySrc = resultPreviewSrc ?? sourcePreviewSrc

  const onDownload = useCallback(async () => {
    if (!resultPreviewSrc) return
    setIsDownloading(true)
    try {
      await downloadImage(resultPreviewSrc)
    } catch {
      window.open(resultPreviewSrc, "_blank", "noopener,noreferrer")
    } finally {
      setIsDownloading(false)
    }
  }, [resultPreviewSrc])

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border border-black/5 bg-white/90 shadow-sm",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <h3 className="font-heading text-sm font-semibold text-brand-ink sm:text-[15px]">
            Result
          </h3>
          <p className="text-xs text-muted-foreground">
            {isGenerating
              ? "Running YouCam AI — this can take up to a minute"
              : resultPreviewSrc
                ? viewMode === "compare" && canCompare
                  ? "Drag the slider to compare before and after"
                  : "Your AI beauty edit"
                : showingSourceOnly
                  ? "Source preview — generate to see your edit"
                  : "Upload a photo to get started"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {canCompare ? (
            <div
              className="inline-flex rounded-full bg-brand-blush/80 p-0.5 ring-1 ring-black/5"
              role="tablist"
              aria-label="Result preview mode"
            >
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === "compare"}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase transition-colors",
                  viewMode === "compare"
                    ? "bg-white text-brand-ink shadow-sm"
                    : "text-muted-foreground hover:text-brand-ink"
                )}
                onClick={() => setViewMode("compare")}
              >
                Compare
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === "after"}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase transition-colors",
                  viewMode === "after"
                    ? "bg-white text-brand-ink shadow-sm"
                    : "text-muted-foreground hover:text-brand-ink"
                )}
                onClick={() => setViewMode("after")}
              >
                After
              </button>
            </div>
          ) : null}
          {resultPreviewSrc ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs"
                disabled={isDownloading}
                onClick={onDownload}
              >
                <Download className="size-3.5" aria-hidden />
                {isDownloading ? "Saving…" : "Download"}
              </Button>
              <span
                className="inline-flex items-center gap-1 rounded-full bg-brand-teal/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-brand-teal-dark uppercase"
              >
                <Sparkles className="size-3" aria-hidden />
                Generated
              </span>
            </>
          ) : null}
        </div>
      </div>

      <div className="relative flex items-center justify-center p-4 sm:p-5">
        {isGenerating ? (
          <div className="flex min-h-[14rem] flex-col items-center justify-center gap-3 py-8 text-center">
            <Loader2
              className="size-10 animate-spin text-brand-teal"
              aria-hidden
            />
            <p className="text-sm text-muted-foreground">Generating…</p>
          </div>
        ) : displaySrc ? (
          <div
            className="relative aspect-[4/5] w-full max-h-[min(42vh,22rem)] max-w-md"
          >
            {canCompare && viewMode === "compare" ? (
              <BeforeAfterSlider
                beforeSrc={sourcePreviewSrc!}
                afterSrc={resultPreviewSrc!}
                alt="Beauty edit"
                objectFit="contain"
                className="h-full rounded-xl bg-brand-blush/30"
              />
            ) : (
              <Image
                src={displaySrc}
                alt={
                  resultPreviewSrc
                    ? "Generated beauty result"
                    : "Source image preview"
                }
                fill
                sizes="(max-width: 1024px) 100vw, 28rem"
                className="rounded-xl object-contain"
                unoptimized={
                  displaySrc.startsWith("blob:") ||
                  displaySrc.startsWith("http") ||
                  displaySrc.startsWith("/api/")
                }
                priority
              />
            )}
          </div>
        ) : (
          <div className="flex min-h-[14rem] max-w-sm flex-col items-center justify-center py-8 text-center">
            <div
              className="flex size-14 items-center justify-center rounded-2xl bg-brand-blush ring-1 ring-black/5"
            >
              <ImageOff className="size-7 text-brand-teal/70" aria-hidden />
            </div>
            <p className="mt-4 font-heading text-lg font-semibold text-brand-ink">
              Your result will appear here
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Choose a tool, add a source image, then generate when you are
              ready. This panel stays focused on your output.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
