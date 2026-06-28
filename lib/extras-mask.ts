import { deflateSync } from "node:zlib"
import { jpegDimensions } from "@/lib/extras-image-size"

/** Grayscale PNG mask — white ellipse marks the region to remove (YouCam generative-fill). */
export function generateRemovalMaskPng(sourceBytes: Buffer): Buffer {
  const { width: w, height: h } = jpegDimensions(sourceBytes)
  return encodeGrayscalePng(w, h, (x, y) => {
    const cx = w / 2
    const cy = h / 2
    const rx = w * 0.17
    const ry = h * 0.25
    const inside =
      ((x - cx) * (x - cx)) / (rx * rx) + ((y - cy) * (y - cy)) / (ry * ry) <= 1
    return inside ? 255 : 0
  })
}

function encodeGrayscalePng(
  w: number,
  h: number,
  pixel: (x: number, y: number) => number
): Buffer {
  const raw = Buffer.alloc((w + 1) * h)
  for (let y = 0; y < h; y++) {
    raw[y * (w + 1)] = 0
    for (let x = 0; x < w; x++) {
      raw[y * (w + 1) + 1 + x] = pixel(x, y)
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8
  ihdr[9] = 0
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0
  const idat = deflateSync(raw, { level: 9 })
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", idat),
    pngChunk("IEND", Buffer.alloc(0)),
  ])
}

function pngChunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type)
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([len, typeBuf, data, crcBuf])
}

const crcTable: number[] = []
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  }
  crcTable[n] = c
}

function crc32(buf: Buffer, prev = 0): number {
  let c = prev ^ -1
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  }
  return (c ^ -1) >>> 0
}
