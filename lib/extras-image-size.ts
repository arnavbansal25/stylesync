/** Read JPEG width/height from buffer (SOF marker). */
export function jpegDimensions(bytes: Buffer): { width: number; height: number } {
  let i = 2
  while (i < bytes.length) {
    if (bytes[i] !== 0xff) break
    const marker = bytes[i + 1]
    if (marker === 0xc0 || marker === 0xc2 || marker === 0xc1) {
      return {
        height: bytes.readUInt16BE(i + 5),
        width: bytes.readUInt16BE(i + 7),
      }
    }
    const segmentLength = bytes.readUInt16BE(i + 2)
    i += 2 + segmentLength
  }
  throw new Error("Could not read JPEG dimensions")
}
