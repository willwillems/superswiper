import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useImageLoader } from '../composables/useImageLoader'

vi.mock('../composables/useUpload', () => ({
  useUpload: () => ({
    getImageUrl: vi.fn((path: string) => {
      if (path === 'valid-path') return Promise.resolve('https://example.com/image.jpg')
      if (path === 'error-path') return Promise.resolve(null)
      return Promise.resolve(null)
    }),
  }),
}))

describe('useImageLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts in loading state', () => {
    const { state } = useImageLoader('valid-path')
    expect(state.value).toBe('loading')
  })

  it('loads image url from path', async () => {
    const { imageUrl, state } = useImageLoader('valid-path')
    await vi.waitFor(() => expect(imageUrl.value).toBe('https://example.com/image.jpg'))
    expect(state.value).toBe('loading')
  })

  it('sets error state when path is empty', async () => {
    const { state, imageUrl } = useImageLoader('')
    await vi.waitFor(() => expect(state.value).toBe('error'))
    expect(imageUrl.value).toBeNull()
  })

  it('sets error state when getImageUrl returns null', async () => {
    const { state, imageUrl } = useImageLoader('error-path')
    await vi.waitFor(() => expect(state.value).toBe('error'))
    expect(imageUrl.value).toBeNull()
  })

  it('provides handleImageLoad callback', async () => {
    const { state, handleImageLoad } = useImageLoader('valid-path')
    await vi.waitFor(() => expect(state.value).toBe('loading'))
    handleImageLoad()
    expect(state.value).toBe('loaded')
  })

  it('provides handleImageError callback', async () => {
    const { state, handleImageError } = useImageLoader('valid-path')
    await vi.waitFor(() => expect(state.value).toBe('loading'))
    handleImageError()
    expect(state.value).toBe('error')
  })

  it('reloads when reactive path changes', async () => {
    const pathRef = ref('valid-path')
    const { imageUrl, state } = useImageLoader(pathRef)

    await vi.waitFor(() => expect(imageUrl.value).toBe('https://example.com/image.jpg'))

    pathRef.value = 'error-path'
    await nextTick()
    await vi.waitFor(() => expect(state.value).toBe('error'))
  })

  it('handles ref with empty initial value', async () => {
    const pathRef = ref('')
    const { state } = useImageLoader(pathRef)
    await vi.waitFor(() => expect(state.value).toBe('error'))
  })
})
