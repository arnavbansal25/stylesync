"use client"

import { useCallback, useRef, useState, type PointerEvent } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

type BeforeAfterSliderProps = {
  alt: string
  className?: string
  /** Same image on both sides (landing demos); use with before/after class filters. */
  src?: string
  beforeClassName?: string
  afterClassName?: string
  /** Distinct before/after URLs (e.g. studio result compare). */
  beforeSrc?: string
  afterSrc?: string
  objectFit?: "cover" | "contain"
}

function imageNeedsUnoptimized(src: string) {
  return (
    src.startsWith("blob:") ||
    src.startsWith("http") ||
    src.startsWith("/api/")
  )
}

export function BeforeAfterSlider({
  src,
  alt,
  beforeClassName,
  afterClassName,
  beforeSrc: beforeSrcProp,
  afterSrc: afterSrcProp,
  objectFit = "cover",
  className,
}: BeforeAfterSliderProps) {
  const beforeSrc = beforeSrcProp ?? src
  const afterSrc = afterSrcProp ?? src
  const fitClass = objectFit === "contain" ? "object-contain" : "object-cover"
  /** Divider position: left of line = before, right = after. */
  const [position, setPosition] = useState(50)
  const dragging = useRef(false)
  const frame = useRef<HTMLDivElement>(null)

  const moveTo = useCallback((clientX: number) => {
    const node = frame.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const next = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(96, Math.max(4, next)))
  }, [])

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.preventDefault()
      dragging.current = true
      event.currentTarget.setPointerCapture(event.pointerId)
      moveTo(event.clientX)
    },
    [moveTo]
  )

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!dragging.current) return
      event.preventDefault()
      moveTo(event.clientX)
    },
    [moveTo]
  )

  const endDrag = useCallback((event: PointerEvent<HTMLDivElement>) => {
    dragging.current = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }, [])

  const imageClass = cn(
    fitClass,
    "pointer-events-none select-none [-webkit-user-drag:none]"
  )

  if (!beforeSrc || !afterSrc) {
    return null
  }

  return (
    <div
      ref={frame}
      className={cn(
        "relative h-full w-full overflow-hidden select-none touch-none",
        className
      )}
    >
      <Image
        src={beforeSrc}
        alt={`Before — ${alt}`}
        fill
        draggable={false}
        sizes="(max-width: 768px) 100vw, 50vw"
        className={cn(imageClass, beforeClassName)}
        unoptimized={imageNeedsUnoptimized(beforeSrc)}
      />
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      >
        <Image
          src={afterSrc}
          alt={`After — ${alt}`}
          fill
          draggable={false}
          sizes="(max-width: 768px) 100vw, 50vw"
          className={cn(imageClass, afterClassName)}
          unoptimized={imageNeedsUnoptimized(afterSrc)}
        />
      </div>

      <span className="pointer-events-none absolute top-3 left-3 text-[10px] font-semibold tracking-[0.18em] text-white uppercase drop-shadow">
        Before
      </span>
      <span className="pointer-events-none absolute top-3 right-3 text-[10px] font-semibold tracking-[0.18em] text-white uppercase drop-shadow">
        After
      </span>

      <div
        aria-hidden
        className="absolute inset-0 z-20 cursor-ew-resize touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={() => {
          dragging.current = false
        }}
      />

      <div
        className="pointer-events-none absolute inset-y-0 z-10 flex w-8 -translate-x-1/2 flex-col items-center"
        style={{ left: `${position}%` }}
      >
        <span className="h-full w-px bg-linear-to-b from-brand-teal via-white to-brand-teal" />
        <span
          className="absolute top-1/2 flex -translate-y-1/2 flex-col items-center justify-center rounded-full bg-brand-teal px-1.5 py-2 text-[9px] font-bold leading-none text-white shadow-md"
          aria-hidden="true"
        >
          <span>B</span>
          <span className="my-0.5 h-px w-3 bg-white/80" />
          <span>A</span>
        </span>
      </div>
    </div>
  )
}
