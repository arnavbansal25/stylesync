"use client"

import { useCallback, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

type BeforeAfterSliderProps = {
  src: string
  alt: string
  beforeClassName?: string
  afterClassName?: string
  className?: string
}

export function BeforeAfterSlider({
  src,
  alt,
  beforeClassName,
  afterClassName,
  className,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(52)
  const dragging = useRef(false)
  const frame = useRef<HTMLDivElement>(null)

  const moveTo = useCallback((clientX: number) => {
    const node = frame.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const next = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(96, Math.max(4, next)))
  }, [])

  return (
    <div
      ref={frame}
      className={cn("relative h-full w-full cursor-ew-resize overflow-hidden", className)}
      onPointerDown={(event) => {
        dragging.current = true
        event.currentTarget.setPointerCapture(event.pointerId)
        moveTo(event.clientX)
      }}
      onPointerMove={(event) => {
        if (dragging.current) moveTo(event.clientX)
      }}
      onPointerUp={() => {
        dragging.current = false
      }}
      onPointerCancel={() => {
        dragging.current = false
      }}
    >
      <Image
        src={src}
        alt={`Before — ${alt}`}
        fill
        sizes="(max-width: 768px) 80vw, 220px"
        className={cn("object-cover", beforeClassName)}
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={src}
          alt={`After — ${alt}`}
          fill
          sizes="(max-width: 768px) 80vw, 220px"
          className={cn("object-cover", afterClassName)}
        />
      </div>

      <span className="pointer-events-none absolute top-3 left-3 text-[10px] font-semibold tracking-[0.18em] text-white uppercase drop-shadow">
        Before
      </span>
      <span className="pointer-events-none absolute top-3 right-3 text-[10px] font-semibold tracking-[0.18em] text-white uppercase drop-shadow">
        After
      </span>

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
