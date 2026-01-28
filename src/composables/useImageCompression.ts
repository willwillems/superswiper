const MAX_DIMENSION = 1200
const JPEG_QUALITY = 0.8

export function useImageCompression() {
  async function compressImage(file: File): Promise<Blob> {
    const bitmap = await createImageBitmap(file)
    const { width, height } = bitmap

    const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height))
    const targetWidth = Math.round(width * scale)
    const targetHeight = Math.round(height * scale)

    const canvas = new OffscreenCanvas(targetWidth, targetHeight)
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Failed to get canvas context')

    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight)
    bitmap.close()

    return canvas.convertToBlob({ type: 'image/jpeg', quality: JPEG_QUALITY })
  }

  return { compressImage }
}
