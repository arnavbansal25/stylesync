import { fashionLookOptionsByTool as looksByTool } from "@/lib/fashion-looks"

export type FashionToolId =
  | "clothes-vto"
  | "bag-vto"
  | "shoes-vto"
  | "hat-vto"

export type FashionTool = {
  id: FashionToolId
  name: string
  shortDescription: string
  image: string
}

export const fashionTools: FashionTool[] = [
  {
    id: "clothes-vto",
    name: "AI Clothes Virtual Try-On",
    shortDescription: "Swap outfits on a full-body photo using a clothing reference.",
    image: "/ai-photo-editing-images/ai-virtual-cloth-try-on.webp",
  },
  {
    id: "bag-vto",
    name: "AI Bag Virtual Try-On",
    shortDescription: "Preview handbags and totes on your portrait.",
    image: "/ai-photo-editing-images/bag-try-on.png",
  },
  {
    id: "shoes-vto",
    name: "AI Shoes Virtual Try-On",
    shortDescription: "See sneakers, heels, and boots on your photo.",
    image: "/ai-photo-editing-images/shoes-try-on.jpg",
  },
  {
    id: "hat-vto",
    name: "AI Hat Virtual Try-On",
    shortDescription: "Try caps, fedoras, and beanies with realistic placement.",
    image: "/ai-photo-editing-images/hat-try-on.jpg",
  },
]

export type FashionTestImage = {
  id: string
  label: string
  src: string
}

/** Sample portraits and full-body shots for fashion VTO (`public/fashion-samples`, headshots). */
export const fashionTestImagesByTool: Record<FashionToolId, FashionTestImage[]> = {
  "clothes-vto": [
    {
      id: "fullbody-01",
      label: "Full body 1",
      src: "/fashion-samples/source/fullbody_01.jpg",
    },
    {
      id: "fullbody-02",
      label: "Full body 2",
      src: "/fashion-samples/source/fullbody_02.jpg",
    },
    {
      id: "youcam-clothes",
      label: "YouCam sample",
      src: "/fashion-samples/source/clothes_03_cccd5d4803.jpeg",
    },
    {
      id: "sample-portrait",
      label: "Studio sample",
      src: "/fashion-samples/source/sample_Image_1_202b6bf6e6.jpg",
    },
  ],
  "bag-vto": [
    { id: "girl1", label: "Portrait 1", src: "/normal-headshot/girl1.png" },
    { id: "girl2", label: "Portrait 2", src: "/normal-headshot/girl2.png" },
    { id: "girl3", label: "Portrait 3", src: "/normal-headshot/girl3.png" },
    { id: "boy1", label: "Portrait 4", src: "/normal-headshot/boy1.png" },
  ],
  "shoes-vto": [
    {
      id: "fullbody-01",
      label: "Full body 1",
      src: "/fashion-samples/source/fullbody_01.jpg",
    },
    {
      id: "fullbody-02",
      label: "Full body 2",
      src: "/fashion-samples/source/fullbody_02.jpg",
    },
    {
      id: "youcam-clothes",
      label: "YouCam full body",
      src: "/fashion-samples/source/clothes_03_cccd5d4803.jpeg",
    },
  ],
  "hat-vto": [
    { id: "girl1", label: "Portrait 1", src: "/normal-headshot/girl1.png" },
    { id: "girl2", label: "Portrait 2", src: "/normal-headshot/girl2.png" },
    { id: "girl4", label: "Portrait 3", src: "/normal-headshot/girl4.png" },
    { id: "boy1", label: "Portrait 4", src: "/normal-headshot/boy1.png" },
  ],
}

export type FashionLookOption = {
  id: string
  label: string
  thumbnail?: string
}

export const fashionLookOptionsByTool: Record<FashionToolId, FashionLookOption[]> =
  looksByTool()

export function fashionToolById(id: FashionToolId): FashionTool {
  const tool = fashionTools.find((t) => t.id === id)
  if (!tool) {
    return fashionTools[0]
  }
  return tool
}
