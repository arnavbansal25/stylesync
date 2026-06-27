export function HairIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 280 180"
      className={className}
      role="img"
      aria-label="Illustrated hair and beard styles"
    >
      <circle cx="92" cy="78" r="42" fill="#f1d3b5" />
      <path d="M54 70c10-40 68-44 78-4 6 22-10 36-38 38S50 92 54 70z" fill="#7b4fc9" />
      <path d="M70 108c8 16 36 16 44 0" fill="#f1d3b5" />
      <path d="M78 118c6 14 22 16 28 2" fill="#4a2f27" />

      <circle cx="196" cy="78" r="42" fill="#e7c2a0" />
      <path d="M160 64c8-32 64-34 74 2 4 18-8 30-36 32s-42-12-38-34z" fill="#2b2b2b" />
      <path d="M176 118c8 18 28 18 36 0" fill="#3b2a22" />
      <rect x="232" y="54" width="18" height="8" rx="4" fill="#3ecfc4" />
    </svg>
  )
}
