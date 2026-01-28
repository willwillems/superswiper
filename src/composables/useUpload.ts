import { ref } from 'vue'
import { db } from '@/db'
import { useImageCompression } from './useImageCompression'

export function useUpload() {
  const { compressImage } = useImageCompression()
  const isUploading = ref(false)
  const error = ref<string | null>(null)

  async function uploadImage(file: File): Promise<string> {
    isUploading.value = true
    error.value = null

    try {
      const compressed = await compressImage(file)
      const filename = `${crypto.randomUUID()}.jpg`
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
