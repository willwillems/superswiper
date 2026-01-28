import { ref, computed, shallowRef } from 'vue'
import { db } from '@/db'
import { useImageCompression } from './useImageCompression'

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export type UploadStatus = 'pending' | 'compressing' | 'uploading' | 'success' | 'failed'

export interface UploadItem {
  id: string
  file: File
  status: UploadStatus
  error?: string
  fileId?: string
}

export function useUpload() {
  const { compressImage } = useImageCompression()
  const isUploading = ref(false)
  const error = ref<string | null>(null)
  const uploadQueue = shallowRef<UploadItem[]>([])

  const pendingCount = computed(() =>
    uploadQueue.value.filter((item) => item.status === 'pending').length
  )
  const failedCount = computed(() =>
    uploadQueue.value.filter((item) => item.status === 'failed').length
  )
  const successCount = computed(() =>
    uploadQueue.value.filter((item) => item.status === 'success').length
  )
  const currentUpload = computed(() =>
    uploadQueue.value.find(
      (item) => item.status === 'compressing' || item.status === 'uploading'
    )
  )

  function updateQueueItem(id: string, updates: Partial<UploadItem>) {
    uploadQueue.value = uploadQueue.value.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    )
  }

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

  async function processQueueItem(item: UploadItem): Promise<string> {
    updateQueueItem(item.id, { status: 'compressing' })

    try {
      const compressed = await compressImage(item.file)

      updateQueueItem(item.id, { status: 'uploading' })

      const filename = `${generateUUID()}.jpg`
      const uploadFile = new File([compressed], filename, { type: 'image/jpeg' })
      const result = await db.storage.uploadFile(filename, uploadFile)

      updateQueueItem(item.id, { status: 'success', fileId: result.data.id })
      return result.data.id
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Upload failed'
      updateQueueItem(item.id, { status: 'failed', error: errorMessage })
      throw e
    }
  }

  function addToQueue(files: File[]): UploadItem[] {
    const newItems: UploadItem[] = files.map((file) => ({
      id: generateUUID(),
      file,
      status: 'pending' as const,
    }))
    uploadQueue.value = [...uploadQueue.value, ...newItems]
    return newItems
  }

  async function retryFailed(): Promise<void> {
    const failedItems = uploadQueue.value.filter((item) => item.status === 'failed')
    for (const item of failedItems) {
      updateQueueItem(item.id, { status: 'pending', error: undefined })
    }
  }

  function clearQueue() {
    uploadQueue.value = []
  }

  function clearCompleted() {
    uploadQueue.value = uploadQueue.value.filter(
      (item) => item.status !== 'success'
    )
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
    uploadQueue,
    pendingCount,
    failedCount,
    successCount,
    currentUpload,
    addToQueue,
    processQueueItem,
    retryFailed,
    clearQueue,
    clearCompleted,
    updateQueueItem,
  }
}
