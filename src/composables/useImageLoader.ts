import { ref, watch, type Ref } from 'vue'
import { useUpload } from './useUpload'

export type ImageLoadState = 'loading' | 'loaded' | 'error'

export function useImageLoader(photoPath: Ref<string> | string) {
  const { getImageUrl } = useUpload()

  const imageUrl = ref<string | null>(null)
  const state = ref<ImageLoadState>('loading')

  async function loadImage() {
    state.value = 'loading'
    imageUrl.value = null

    const path = typeof photoPath === 'string' ? photoPath : photoPath.value
    if (!path) {
      state.value = 'error'
      return
    }

    const url = await getImageUrl(path)
    if (!url) {
      state.value = 'error'
      return
    }

    imageUrl.value = url
  }

  function handleImageLoad() {
    state.value = 'loaded'
  }

  function handleImageError() {
    state.value = 'error'
  }

  if (typeof photoPath === 'string') {
    loadImage()
  } else {
    watch(photoPath, loadImage, { immediate: true })
  }

  return {
    imageUrl,
    state,
    handleImageLoad,
    handleImageError,
  }
}
