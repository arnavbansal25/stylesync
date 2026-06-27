export function FashionIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 280 180"
      className={className}
      role="img"
      aria-label="Illustrated outfits for virtual try-on"
    >
      <rect x="18" y="28" width="54" height="118" rx="12" fill="#f3c4d4" />
      <path d="M28 46h34l-6 96H34z" fill="#e36b8f" />
      <path d="M32 46c4 10 16 10 20 0" fill="#f7d5e0" />
      <circle cx="45" cy="34" r="6" fill="#2c2c2c" />

      <rect x="86" y="36" width="52" height="110" rx="12" fill="#d9f3ef" />
      <path d="M96 52h32l-5 88H101z" fill="#3ecfc4" />
      <path d="M100 52c3 8 14 8 18 0" fill="#b7ebe6" />

      <circle cx="196" cy="46" r="22" fill="#f1d3b5" />
      <path d="M176 40c8-22 40-22 48 2 2 14-8 22-24 22s-26-8-24-24z" fill="#7b4fc9" />
      <path d="M176 78c8 28 32 28 40 0" fill="#f1d3b5" />
      <path d="M168 92h56l-8 62h-40z" fill="#5b3fa0" />
    </svg>
  )
}
