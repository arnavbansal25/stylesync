"use client"

import Image from "next/image"
import { ImageIcon, Upload } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import type { BeautyTestImage } from "@/lib/beauty-studio"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type SourceImageValue =
  | { kind: "none" }
  | { kind: "upload"; previewUrl: string; fileName: string; file: File }
  | { kind: "test"; src: string; testId: string }

type SourceImageSectionProps = {
  testImages: BeautyTestImage[]
  value: SourceImageValue
  onChange: (value: SourceImageValue) => void
}

const ACCEPT = "image/jpeg,image/png,image/webp"

export function SourceImageSection({
  testImages,
  value,
  onChange,
}: SourceImageSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const previewSrc =
    value.kind === "upload"
      ? value.previewUrl
      : value.kind === "test"
        ? value.src
        : null

  const revokeIfUpload = useCallback((v: SourceImageValue) => {
    if (v.kind === "upload") {
      URL.revokeObjectURL(v.previewUrl)
    }
  }, [])

  const valueRef = useRef(value)
  valueRef.current = value

  useEffect(() => {
    return () => {
      revokeIfUpload(valueRef.current)
    }
  }, [revokeIfUpload])

  function applyFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return
    revokeIfUpload(value)
    const previewUrl = URL.createObjectURL(file)
    onChange({
      kind: "upload",
      previewUrl,
      fileName: file.name,
      file,
    })
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    applyFile(e.dataTransfer.files[0])
  }

  function selectTestImage(test: BeautyTestImage) {
    revokeIfUpload(value)
    onChange({ kind: "test", src: test.src, testId: test.id })
  }

  function clearImage() {
    revokeIfUpload(value)
    onChange({ kind: "none" })
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="upload" className="gap-4">
        <TabsList className="grid w-full grid-cols-2 bg-brand-blush/60">
          <TabsTrigger value="upload">Upload image</TabsTrigger>
          <TabsTrigger value="test">Test images</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-0">
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={cn(
              "flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors",
              isDragging
                ? "border-brand-teal bg-brand-teal/5"
                : "border-brand-teal/25 bg-brand-blush/20"
            )}
          >
            <div
              className="flex size-11 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5"
            >
              <Upload className="size-5 text-brand-teal" aria-hidden />
            </div>
            <p className="mt-3 text-sm font-medium text-brand-ink">
              Drag and drop your photo
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              JPG, PNG, or WebP — clear, well-lit photos work best
            </p>
            <Button
              type="button"
              size="sm"
              className="mt-4 bg-brand-teal text-white hover:bg-brand-teal-dark"
              onClick={() => inputRef.current?.click()}
            >
              Browse files
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              className="sr-only"
              onChange={(e) => {
                applyFile(e.target.files?.[0])
                e.target.value = ""
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="test" className="mt-0">
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {testImages.map((test) => {
              const selected =
                value.kind === "test" && value.testId === test.id
              return (
                <li key={test.id}>
                  <button
                    type="button"
                    onClick={() => selectTestImage(test)}
                    className={cn(
                      "group relative aspect-square w-full overflow-hidden rounded-lg border outline-none transition-all focus-visible:ring-3 focus-visible:ring-brand-teal/30",
                      selected
                        ? "border-brand-teal ring-2 ring-brand-teal/40"
                        : "border-black/5 hover:border-brand-teal/30"
                    )}
                    aria-pressed={selected}
                  >
                    <Image
                      src={test.src}
                      alt={test.label}
                      fill
                      sizes="(max-width: 640px) 50vw, 120px"
                      className="object-cover transition-transform group-hover:scale-[1.02]"
                    />
                    <span
                      className="absolute inset-x-0 bottom-0 bg-linear-to-t from-brand-ink/70 to-transparent px-1.5 py-1.5 text-[10px] font-medium text-white"
                    >
                      {test.label}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </TabsContent>
      </Tabs>

      {previewSrc ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-brand-ink">Preview</p>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="text-muted-foreground"
              onClick={clearImage}
            >
              Remove
            </Button>
          </div>
          <div
            className="relative aspect-[4/5] max-h-56 w-full overflow-hidden rounded-xl border border-black/5 bg-brand-blush/30"
          >
            <Image
              src={previewSrc}
              alt="Selected source image"
              fill
              sizes="(max-width: 1024px) 100vw, 400px"
              className="object-contain"
              unoptimized={value.kind === "upload"}
            />
          </div>
          {value.kind === "upload" ? (
            <p className="truncate text-[11px] text-muted-foreground">
              {value.fileName}
            </p>
          ) : null}
        </div>
      ) : (
        <div
          className="flex items-center gap-2 rounded-lg border border-dashed border-black/10 bg-muted/30 px-3 py-2.5 text-xs text-muted-foreground"
        >
          <ImageIcon className="size-4 shrink-0 opacity-60" aria-hidden />
          No source image selected yet
        </div>
      )}
    </div>
  )
}
