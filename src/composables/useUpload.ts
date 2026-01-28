import { ref } from 'vue'
import { db } from '@/db'
import { useImageCompression } from './useImageCompression'

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for non-secure contexts or older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function useUpload() {
  const { compressImage } = useImageCompression()
  const isUploading = ref(false)
  const error = ref<string | null>(null)

  async function uploadImage(file: File): Promise<string> {
    isUploading.value = true
    error.value = null

    try {
      const compressed = await compressImage(file)
      const filename = `${generateUUID()}.jpg`
      const uploadFile = new File([compressed], filename, { type: 'image/jpeg' })

      const result = await db.storage.uploadFile(filename, uploadFile)
      return result.data.id
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Upload failed'
      throw e
    } finally {
      isUploading.value = false
    }
  }

  async function getImageUrl(fileId: string): Promise<string | null> {
    return new Promise((resolve) => {
      const unsubscribe = db.subscribeQuery(
        { $files: { $: { where: { id: fileId } } } },
        (resp) => {
          unsubscribe()
          if (resp.error || !resp.data?.$files?.[0]?.url) {
            resolve(null)
          } else {
            resolve(resp.data.$files[0].url)
          }
        }
      )
    })
  }

  return {
    isUploading,
    error,
    uploadImage,
    getImageUrl,
  }
}
