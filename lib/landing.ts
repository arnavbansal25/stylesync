export const brand = {
  name: "Get Ready AI",
  shortName: "GET READY AI",
  tagline: "Redefine your style. Empower your look.",
} as const

export const navLinks = [
  { href: "/", label: "Home", active: true },
  { href: "/#try-on", label: "Virtual Try-On" },
  { href: "/#blog", label: "Style Blog" },
  { href: "/#pricing", label: "Pricing" },
] as const

export const featureLinks = [
  {
    href: "/#skin-face",
    label: "Skin & Face",
    description: "Retouch glow, contour, and define features.",
  },
  {
    href: "/#try-on",
    label: "Fashion & Try-On",
    description: "Virtual clothing try-on with any outfit.",
  },
  {
    href: "/#hair-beard",
    label: "Hair & Beard",
    description: "Style changes and adjustments for any look.",
  },
] as const

export const showcaseItems = [
  {
    id: "perfect-skin",
    title: "Perfect Skin",
    category: "Skin & Face",
    description: "Retouch your skin, glow, contour and define features.",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=80",
    beforeClassName: "brightness-[0.82] contrast-125 saturate-50",
    afterClassName: "brightness-110 saturate-125",
  },
  {
    id: "hair-art",
    title: "Hair Art",
    category: "Hair & Beard",
    description: "Style clothing trys with Hair & Beard, and styles.",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80",
    beforeClassName: "grayscale contrast-110 brightness-90",
    afterClassName: "saturate-150 brightness-105",
  },
  {
    id: "virtual-try-on",
    title: "Virtual Try-On",
    category: "Fashion",
    description: "Style changes and adjustments for any look.",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
    beforeClassName: "brightness-90 saturate-50",
    afterClassName: "brightness-105 saturate-125",
  },
  {
    id: "facial-definition",
    title: "Facial Definition",
    category: "Style Overhaul",
    description: "Retouch your skin, glow, contour and define features.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
    beforeClassName: "brightness-90 contrast-90 saturate-50",
    afterClassName: "contrast-110 saturate-110 brightness-105",
  },
] as const

export const featureStripItems = [
  {
    id: "skin-face",
    title: "Skin & Face",
    description: "Retouch your skin, glow, contour and define features.",
    href: "/#skin-face",
  },
  {
    id: "fashion-try-on",
    title: "Fashion & Try-On",
    description: "Virtual clothing try-on with various outfits and styles.",
    href: "/#try-on",
  },
  {
    id: "hair-beard",
    title: "Hair & Beard",
    description: "Style changes and adjustments for any look.",
    href: "/#hair-beard",
  },
] as const

export const outfitLooks = [
  {
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    alt: "Editorial look in a black dress",
  },
  {
    src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80",
    alt: "Tailored street style coat",
  },
  {
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
    alt: "Yellow sporty set",
  },
  {
    src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80",
    alt: "Floral summer dress",
  },
  {
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    alt: "Shopping lookbook outfit",
  },
  {
    src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
    alt: "Runway-inspired fashion set",
  },
  {
    src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80",
    alt: "Graphic streetwear look",
  },
  {
    src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80",
    alt: "Evening wear try-on",
  },
  {
    src: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=600&q=80",
    alt: "Menswear suit virtual try-on",
  },
] as const

export const testimonials = [
  {
    name: "Amina Cole",
    quote:
      "The retouch tools made my skin look like a studio session without losing me.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Priya Shah",
    quote:
      "I tried five outfits on one photo and booked the look I actually loved.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Marcus Reed",
    quote:
      "Beard and fade previews saved me from a haircut I would have regretted.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Elena Park",
    quote:
      "It feels like a beauty studio and a stylist in one — and it is actually fun.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
  },
] as const

export const footerColumns = [
  {
    title: "Product",
    links: [
      { href: "/", label: "Home" },
      { href: "/#features", label: "Features" },
      { href: "/#try-on", label: "Virtual Try-On" },
      { href: "/#pricing", label: "Pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/#blog", label: "Style Blog" },
      { href: "/#lookbook", label: "Lookbook" },
      { href: "/#testimonials", label: "Stories" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#features", label: "About" },
      { href: "/#pricing", label: "Start free trial" },
      { href: "/#blog", label: "Support" },
    ],
  },
] as const
