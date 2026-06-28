"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { BeautyResultPanel } from "@/components/dashboard/beauty/beauty-result-panel"
import { StudioPanelSection } from "@/components/dashboard/beauty/studio-panel-section"
import {
  SourceImageSection,
  type SourceImageValue,
} from "@/components/dashboard/beauty/source-image-section"
import { ExtrasPresetCards } from "@/components/dashboard/extras/extras-preset-cards"
import { ExtrasToolGrid } from "@/components/dashboard/extras/extras-tool-grid"
import { ExtrasToolSettings } from "@/components/dashboard/extras/extras-tool-settings"
import { Button } from "@/components/ui/button"
import { STUDIO_GENERATION_CREDIT_COST } from "@/lib/studio-generation-cost"
import {
  extrasPresetOptionsByTool,
  extrasTestImagesByTool,
  extrasTools,
  extrasToolById,
  type ExtrasToolId,
} from "@/lib/extras-studio"
import {
  defaultExtrasYouCamSettings,
  type ExtrasYouCamSettings,
} from "@/lib/extras-youcam-settings"
import { Loader2, Wand2 } from "lucide-react"

function sourcePreviewUrl(value: SourceImageValue): string | null {
  if (value.kind === "upload") return value.previewUrl
  if (value.kind === "test") return value.src
  return null
}

const toolHints: Record<ExtrasToolId, string> = {
  "object-remover":
    "JPEG works best — we auto-mask the center subject area to remove.",
  "bg-remove": "Products and portraits on simple backgrounds work great.",
  colorize: "Use black-and-white or faded vintage photos.",
  "photo-extender": "Landscape photos with room to grow at the edges.",
  headshot: "Face and shoulders visible, good lighting, one person only.",
}

export function ExtrasStudioWorkspace() {
  const router = useRouter()
  const [selectedToolId, setSelectedToolId] =
    useState<ExtrasToolId>("bg-remove")
  const [sourceImage, setSourceImage] = useState<SourceImageValue>({
    kind: "none",
  })
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(
    () => extrasPresetOptionsByTool["bg-remove"][0]?.id ?? null
  )
  const [resultPreviewSrc, setResultPreviewSrc] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [youcamSettings, setYoucamSettings] = useState<ExtrasYouCamSettings>(
    () => defaultExtrasYouCamSettings("bg-remove")
  )

  const presetOptions = extrasPresetOptionsByTool[selectedToolId]
  const testImages = extrasTestImagesByTool[selectedToolId]
  const sourcePreview = useMemo(
    () => sourcePreviewUrl(sourceImage),
    [sourceImage]
  )

  const selectedTool = extrasToolById(selectedToolId)

  const canGenerate =
    sourceImage.kind !== "none" &&
    selectedPresetId !== null &&
    !isGenerating

  function onToolChange(id: ExtrasToolId) {
    setSelectedToolId(id)
    const presets = extrasPresetOptionsByTool[id]
    setSelectedPresetId(presets[0]?.id ?? null)
    setResultPreviewSrc(null)
    setErrorMessage(null)
    setSourceImage({ kind: "none" })
    setYoucamSettings(defaultExtrasYouCamSettings(id))
  }

  async function onGenerate() {
    if (!canGenerate || !selectedPresetId) return

    setIsGenerating(true)
    setErrorMessage(null)

    const form = new FormData()
    form.set("toolId", selectedToolId)
    form.set("presetId", selectedPresetId)
    form.set("youcamSettings", JSON.stringify(youcamSettings))

    if (sourceImage.kind === "upload") {
      form.set("file", sourceImage.file)
    } else if (sourceImage.kind === "test") {
      form.set("testImageId", sourceImage.testId)
    }

    try {
      const res = await fetch("/api/studio/extras/generate", {
        method: "POST",
        body: form,
      })
      const body = (await res.json()) as {
        error?: string
        previewUrl?: string
        resultUrl?: string
      }

      if (!res.ok) {
        setErrorMessage(body.error ?? "Generation failed")
        return
      }

      const previewSrc = body.previewUrl ?? body.resultUrl
      if (previewSrc) setResultPreviewSrc(previewSrc)
      router.refresh()
    } catch {
      setErrorMessage("Network error — try again")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header
        className="relative mb-6 overflow-hidden rounded-2xl border border-brand-teal/15 bg-linear-to-br from-brand-teal/12 via-white to-brand-gold/10 px-5 py-6 sm:mb-8 sm:px-8 sm:py-7"
      >
        <div
          className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-brand-gold/20 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-10 left-1/3 size-40 rounded-full bg-brand-teal/15 blur-3xl"
          aria-hidden
        />
        <div className="relative flex items-start gap-3">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-brand-teal/20"
          >
            <Wand2 className="size-5 text-brand-teal" aria-hidden />
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-wide text-brand-teal-dark uppercase sm:text-xs">
              AI Extras
            </p>
            <h1 className="mt-0.5 font-heading text-2xl font-semibold tracking-tight text-brand-ink sm:text-3xl">
              Creative photo tools
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Remove objects, cut backgrounds, colorize, extend frames, and craft
              pro headshots — powered by YouCam AI in one playful workspace.
            </p>
          </div>
        </div>
      </header>

      <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-start">
        <div className="flex flex-col gap-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1">
          <StudioPanelSection
            title="Pick a tool"
            description="Tap a card to switch workflows."
          >
            <ExtrasToolGrid
              tools={extrasTools}
              selectedId={selectedToolId}
              onSelect={onToolChange}
            />
          </StudioPanelSection>

          <StudioPanelSection
            title="Your photo"
            description={toolHints[selectedToolId]}
          >
            <SourceImageSection
              testImages={testImages}
              value={sourceImage}
              onChange={(value) => {
                setSourceImage(value)
                setResultPreviewSrc(null)
              }}
            />
          </StudioPanelSection>

          <StudioPanelSection
            title="Style & preset"
            description={`Options for ${selectedTool.name}.`}
          >
            <ExtrasPresetCards
              options={presetOptions}
              selectedId={selectedPresetId}
              onSelect={setSelectedPresetId}
            />
          </StudioPanelSection>

          <StudioPanelSection title="Fine-tune" description="Optional API tweaks.">
            <ExtrasToolSettings
              toolId={selectedToolId}
              value={youcamSettings}
              onChange={setYoucamSettings}
            />
          </StudioPanelSection>

          <Button
            type="button"
            size="lg"
            disabled={!canGenerate}
            onClick={onGenerate}
            className="w-full bg-brand-gold text-white hover:bg-brand-gold-dark disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Creating magic…
              </>
            ) : (
              `Generate (${STUDIO_GENERATION_CREDIT_COST} credits)`
            )}
          </Button>
          {errorMessage ? (
            <p className="text-center text-xs text-destructive" role="alert">
              {errorMessage}
            </p>
          ) : (
            <p className="text-center text-[11px] text-muted-foreground">
              Each run uses {STUDIO_GENERATION_CREDIT_COST} credits. Results save
              to your studio.
            </p>
          )}
        </div>

        <BeautyResultPanel
          sourcePreviewSrc={sourcePreview}
          resultPreviewSrc={resultPreviewSrc}
          isGenerating={isGenerating}
        />
      </div>
    </main>
  )
}
