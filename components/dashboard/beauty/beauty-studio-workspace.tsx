"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  beautyLookOptionsByTool,
  beautyTestImages,
  beautyTools,
  type BeautyToolId,
} from "@/lib/beauty-studio"
import { BeautyResultPanel } from "@/components/dashboard/beauty/beauty-result-panel"
import { BeautyToolPicker } from "@/components/dashboard/beauty/beauty-tool-picker"
import { ChooseLookSection } from "@/components/dashboard/beauty/choose-look-section"
import {
  SourceImageSection,
  type SourceImageValue,
} from "@/components/dashboard/beauty/source-image-section"
import { BeautyToolSettings } from "@/components/dashboard/beauty/beauty-tool-settings"
import { StudioPanelSection } from "@/components/dashboard/beauty/studio-panel-section"
import { Button } from "@/components/ui/button"
import { BEAUTY_GENERATION_CREDIT_COST } from "@/lib/dashboard"
import {
  defaultBeautyYouCamSettings,
  type BeautyYouCamSettings,
} from "@/lib/beauty-youcam-settings"
import { Loader2 } from "lucide-react"

function sourcePreviewUrl(value: SourceImageValue): string | null {
  if (value.kind === "upload") return value.previewUrl
  if (value.kind === "test") return value.src
  return null
}

export function BeautyStudioWorkspace() {
  const router = useRouter()
  const [selectedToolId, setSelectedToolId] =
    useState<BeautyToolId>("makeup-transfer")
  const [sourceImage, setSourceImage] = useState<SourceImageValue>({
    kind: "none",
  })
  const [selectedLookId, setSelectedLookId] = useState<string | null>(null)
  const [resultPreviewSrc, setResultPreviewSrc] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [youcamSettings, setYoucamSettings] = useState<BeautyYouCamSettings>(
    () => defaultBeautyYouCamSettings("makeup-transfer")
  )

  const lookOptions = beautyLookOptionsByTool[selectedToolId]
  const sourcePreview = useMemo(
    () => sourcePreviewUrl(sourceImage),
    [sourceImage]
  )

  const selectedToolName =
    beautyTools.find((t) => t.id === selectedToolId)?.name ?? "Beauty"

  const canGenerate =
    sourceImage.kind !== "none" &&
    selectedLookId !== null &&
    !isGenerating

  function onToolChange(id: BeautyToolId) {
    setSelectedToolId(id)
    setSelectedLookId(null)
    setResultPreviewSrc(null)
    setErrorMessage(null)
    setYoucamSettings(defaultBeautyYouCamSettings(id))
  }

  async function onGenerate() {
    if (!canGenerate || !selectedLookId) return

    setIsGenerating(true)
    setErrorMessage(null)

    const form = new FormData()
    form.set("toolId", selectedToolId)
    form.set("lookId", selectedLookId)
    form.set("youcamSettings", JSON.stringify(youcamSettings))

    if (sourceImage.kind === "upload") {
      form.set("file", sourceImage.file)
    } else if (sourceImage.kind === "test") {
      form.set("testImageId", sourceImage.testId)
    }

    try {
      const res = await fetch("/api/studio/beauty/generate", {
        method: "POST",
        body: form,
      })
      const body = (await res.json()) as {
        error?: string
        previewUrl?: string
        resultUrl?: string
        remainingCredits?: number
      }

      if (!res.ok) {
        setErrorMessage(body.error ?? "Generation failed")
        return
      }

      const previewSrc = body.previewUrl ?? body.resultUrl
      if (previewSrc) {
        setResultPreviewSrc(previewSrc)
      }
      router.refresh()
    } catch {
      setErrorMessage("Network error — try again")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="mb-6 sm:mb-8">
        <p className="text-[10px] font-semibold tracking-wide text-brand-teal-dark uppercase sm:text-xs">
          Beauty AI
        </p>
        <h1 className="mt-1 font-heading text-2xl font-semibold tracking-tight text-brand-ink sm:text-3xl">
          Beauty
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Virtual makeup, glow, and beauty enhancements powered by YouCam AI.
          Pick a tool, set your source photo, choose a look, and generate.
        </p>
      </header>

      <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start">
        <div className="flex flex-col gap-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1">
          <StudioPanelSection
            title="Choose & customize"
            description="Select which Beauty AI workflow you want to run."
          >
            <BeautyToolPicker
              tools={beautyTools}
              selectedId={selectedToolId}
              onSelect={onToolChange}
            />
          </StudioPanelSection>

          <StudioPanelSection
            title="Source image"
            description="Upload your portrait or try a sample image."
          >
            <SourceImageSection
              testImages={beautyTestImages}
              value={sourceImage}
              onChange={(value) => {
                setSourceImage(value)
                setResultPreviewSrc(null)
              }}
            />
          </StudioPanelSection>

          <StudioPanelSection
            title="Choose look"
            description={`Styles and references for ${selectedToolName}.`}
          >
            <ChooseLookSection
              toolId={selectedToolId}
              options={lookOptions}
              selectedLookId={selectedLookId}
              onSelectLook={setSelectedLookId}
            />
          </StudioPanelSection>

          <StudioPanelSection
            title="YouCam settings"
            description="API parameters for the selected Beauty AI workflow."
          >
            <BeautyToolSettings
              toolId={selectedToolId}
              selectedLookId={selectedLookId}
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
                Generating…
              </>
            ) : (
              `Generate with AI (${BEAUTY_GENERATION_CREDIT_COST} credits)`
            )}
          </Button>
          {errorMessage ? (
            <p className="text-center text-xs text-destructive" role="alert">
              {errorMessage}
            </p>
          ) : (
            <p className="text-center text-[11px] text-muted-foreground">
              Each run uses {BEAUTY_GENERATION_CREDIT_COST} credits. Results are
              saved to your studio account.
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
