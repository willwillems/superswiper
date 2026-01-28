import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UploadProgress from '../components/UploadProgress.vue'
import type { UploadItem } from '../composables/useUpload'

function createMockFile(name: string): File {
  return new File([''], name, { type: 'image/jpeg' })
}

function createUploadItem(overrides: Partial<UploadItem> = {}): UploadItem {
  return {
    id: 'item-1',
    file: createMockFile('test-image.jpg'),
    status: 'pending',
    ...overrides,
  }
}

describe('UploadProgress', () => {
  it('renders header', () => {
    const wrapper = mount(UploadProgress, {
      props: {
        items: [],
      },
    })
    expect(wrapper.text()).toContain('Upload Progress')
  })

  it('renders upload items', () => {
    const wrapper = mount(UploadProgress, {
      props: {
        items: [
          createUploadItem({ id: 'item-1', file: createMockFile('photo1.jpg') }),
          createUploadItem({ id: 'item-2', file: createMockFile('photo2.jpg') }),
        ],
      },
    })
    expect(wrapper.text()).toContain('photo1.jpg')
    expect(wrapper.text()).toContain('photo2.jpg')
  })

  it('displays "Waiting" status for pending items', () => {
    const wrapper = mount(UploadProgress, {
      props: {
        items: [createUploadItem({ status: 'pending' })],
      },
    })
    expect(wrapper.text()).toContain('Waiting')
  })

  it('displays "Compressing" status for compressing items', () => {
    const wrapper = mount(UploadProgress, {
      props: {
        items: [createUploadItem({ status: 'compressing' })],
      },
    })
    expect(wrapper.text()).toContain('Compressing')
  })

  it('displays "Uploading" status for uploading items', () => {
    const wrapper = mount(UploadProgress, {
      props: {
        items: [createUploadItem({ status: 'uploading' })],
      },
    })
    expect(wrapper.text()).toContain('Uploading')
  })

  it('displays "Done" status for success items', () => {
    const wrapper = mount(UploadProgress, {
      props: {
        items: [createUploadItem({ status: 'success' })],
      },
    })
    expect(wrapper.text()).toContain('Done')
  })

  it('displays "Failed" status for failed items', () => {
    const wrapper = mount(UploadProgress, {
      props: {
        items: [createUploadItem({ status: 'failed' })],
      },
    })
    expect(wrapper.text()).toContain('Failed')
  })

  it('displays error message for failed items', () => {
    const wrapper = mount(UploadProgress, {
      props: {
        items: [createUploadItem({ status: 'failed', error: 'Network error' })],
      },
    })
    expect(wrapper.text()).toContain('Network error')
  })

  it('truncates long filenames', () => {
    const wrapper = mount(UploadProgress, {
      props: {
        items: [createUploadItem({ file: createMockFile('very-long-filename-that-should-be-truncated.jpg') })],
      },
    })
    expect(wrapper.text()).toContain('...')
    expect(wrapper.text()).toContain('.jpg')
  })

  it('shows Clear button when onClear is provided', () => {
    const wrapper = mount(UploadProgress, {
      props: {
        items: [createUploadItem()],
        onClear: vi.fn(),
      },
    })
    expect(wrapper.text()).toContain('Clear')
  })

  it('does not show Clear button when onClear is not provided', () => {
    const wrapper = mount(UploadProgress, {
      props: {
        items: [createUploadItem()],
      },
    })
    expect(wrapper.text()).not.toContain('Clear')
  })

  it('calls onClear when Clear button is clicked', async () => {
    const onClear = vi.fn()
    const wrapper = mount(UploadProgress, {
      props: {
        items: [createUploadItem()],
        onClear,
      },
    })
    await wrapper.find('button').trigger('click')
    expect(onClear).toHaveBeenCalledOnce()
  })

  it('shows Retry button when there are failed items and onRetry is provided', () => {
    const wrapper = mount(UploadProgress, {
      props: {
        items: [createUploadItem({ status: 'failed' })],
        onRetry: vi.fn(),
      },
    })
    expect(wrapper.text()).toContain('Retry Failed')
  })

  it('does not show Retry button when no failed items', () => {
    const wrapper = mount(UploadProgress, {
      props: {
        items: [createUploadItem({ status: 'success' })],
        onRetry: vi.fn(),
      },
    })
    expect(wrapper.text()).not.toContain('Retry Failed')
  })

  it('does not show Retry button when onRetry is not provided', () => {
    const wrapper = mount(UploadProgress, {
      props: {
        items: [createUploadItem({ status: 'failed' })],
      },
    })
    expect(wrapper.text()).not.toContain('Retry Failed')
  })

  it('calls onRetry when Retry button is clicked', async () => {
    const onRetry = vi.fn()
    const wrapper = mount(UploadProgress, {
      props: {
        items: [createUploadItem({ status: 'failed' })],
        onRetry,
      },
    })
    const retryButton = wrapper.findAll('button').find((b) => b.text().includes('Retry'))
    await retryButton?.trigger('click')
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('applies correct status icon for pending', () => {
    const wrapper = mount(UploadProgress, {
      props: {
        items: [createUploadItem({ status: 'pending' })],
      },
    })
    expect(wrapper.text()).toContain('⏳')
  })

  it('applies correct status icon for success', () => {
    const wrapper = mount(UploadProgress, {
      props: {
        items: [createUploadItem({ status: 'success' })],
      },
    })
    expect(wrapper.text()).toContain('✓')
  })

  it('applies correct status icon for failed', () => {
    const wrapper = mount(UploadProgress, {
      props: {
        items: [createUploadItem({ status: 'failed' })],
      },
    })
    expect(wrapper.text()).toContain('✕')
  })
})
