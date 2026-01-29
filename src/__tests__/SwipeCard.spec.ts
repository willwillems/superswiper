import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import SwipeCard from '../components/SwipeCard.vue'

vi.mock('@vueuse/gesture', () => ({
  useDrag: vi.fn((callback) => {
    // Store the callback so tests can trigger it
    ;(globalThis as unknown as { __dragCallback: typeof callback }).__dragCallback = callback
  }),
}))

vi.mock('../composables/useImageLoader', () => ({
  useImageLoader: () => ({
    imageUrl: ref('https://example.com/test.jpg'),
    state: ref('loaded'),
    handleImageLoad: vi.fn(),
    handleImageError: vi.fn(),
  }),
}))

function triggerDrag(params: {
  movement: [number, number]
  dragging: boolean
  last: boolean
  velocities: [number, number]
}) {
  const callback = (globalThis as unknown as { __dragCallback: (p: typeof params) => void }).__dragCallback
  callback(params)
}

describe('SwipeCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with item name', () => {
    const wrapper = mount(SwipeCard, {
      props: {
        photoPath: 'test-path',
        name: 'Test Item',
      },
    })
    expect(wrapper.text()).toContain('Test Item')
  })

  it('renders the item image', () => {
    const wrapper = mount(SwipeCard, {
      props: {
        photoPath: 'test-path',
        name: 'Test Item',
      },
    })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/test.jpg')
    expect(img.attributes('alt')).toBe('Test Item')
  })

  it('does not show overlays initially', () => {
    const wrapper = mount(SwipeCard, {
      props: {
        photoPath: 'test-path',
        name: 'Test Item',
      },
    })
    expect(wrapper.text()).not.toContain('KEEP')
    expect(wrapper.text()).not.toContain('DISCARD')
  })

  it('shows KEEP overlay when dragged right past threshold', async () => {
    const wrapper = mount(SwipeCard, {
      props: {
        photoPath: 'test-path',
        name: 'Test Item',
      },
    })

    triggerDrag({
      movement: [150, 0],
      dragging: true,
      last: false,
      velocities: [0, 0],
    })
    await nextTick()

    expect(wrapper.text()).toContain('KEEP')
    expect(wrapper.text()).not.toContain('DISCARD')
  })

  it('shows DISCARD overlay when dragged left past threshold', async () => {
    const wrapper = mount(SwipeCard, {
      props: {
        photoPath: 'test-path',
        name: 'Test Item',
      },
    })

    triggerDrag({
      movement: [-150, 0],
      dragging: true,
      last: false,
      velocities: [0, 0],
    })
    await nextTick()

    expect(wrapper.text()).toContain('DISCARD')
    expect(wrapper.text()).not.toContain('KEEP')
  })

  it('does not show overlay when drag is below threshold', async () => {
    const wrapper = mount(SwipeCard, {
      props: {
        photoPath: 'test-path',
        name: 'Test Item',
      },
    })

    triggerDrag({
      movement: [50, 0],
      dragging: true,
      last: false,
      velocities: [0, 0],
    })
    await nextTick()

    expect(wrapper.text()).not.toContain('KEEP')
    expect(wrapper.text()).not.toContain('DISCARD')
  })

  it('emits swipeRight when released past threshold', async () => {
    vi.useFakeTimers()
    const wrapper = mount(SwipeCard, {
      props: {
        photoPath: 'test-path',
        name: 'Test Item',
      },
    })

    triggerDrag({
      movement: [150, 0],
      dragging: false,
      last: true,
      velocities: [0, 0],
    })
    await nextTick()

    // Wait for fly-off animation (350ms as defined in FLY_OFF_DURATION)
    vi.advanceTimersByTime(350)
    await nextTick()

    expect(wrapper.emitted('swipeRight')).toHaveLength(1)
    vi.useRealTimers()
  })

  it('emits swipeLeft when released past threshold on left', async () => {
    vi.useFakeTimers()
    const wrapper = mount(SwipeCard, {
      props: {
        photoPath: 'test-path',
        name: 'Test Item',
      },
    })

    triggerDrag({
      movement: [-150, 0],
      dragging: false,
      last: true,
      velocities: [0, 0],
    })
    await nextTick()

    vi.advanceTimersByTime(350)
    await nextTick()

    expect(wrapper.emitted('swipeLeft')).toHaveLength(1)
    vi.useRealTimers()
  })

  it('does not emit when released below threshold', async () => {
    const wrapper = mount(SwipeCard, {
      props: {
        photoPath: 'test-path',
        name: 'Test Item',
      },
    })

    triggerDrag({
      movement: [50, 0],
      dragging: false,
      last: true,
      velocities: [0, 0],
    })
    await nextTick()

    expect(wrapper.emitted('swipeLeft')).toBeFalsy()
    expect(wrapper.emitted('swipeRight')).toBeFalsy()
  })

  it('emits swipeRight with high velocity even below distance threshold', async () => {
    vi.useFakeTimers()
    const wrapper = mount(SwipeCard, {
      props: {
        photoPath: 'test-path',
        name: 'Test Item',
      },
    })

    triggerDrag({
      movement: [50, 0],
      dragging: false,
      last: true,
      velocities: [1.0, 0],
    })
    await nextTick()

    vi.advanceTimersByTime(350)
    await nextTick()

    expect(wrapper.emitted('swipeRight')).toHaveLength(1)
    vi.useRealTimers()
  })

  it('emits swipeLeft with high velocity even below distance threshold', async () => {
    vi.useFakeTimers()
    const wrapper = mount(SwipeCard, {
      props: {
        photoPath: 'test-path',
        name: 'Test Item',
      },
    })

    triggerDrag({
      movement: [-50, 0],
      dragging: false,
      last: true,
      velocities: [1.0, 0],
    })
    await nextTick()

    vi.advanceTimersByTime(350)
    await nextTick()

    expect(wrapper.emitted('swipeLeft')).toHaveLength(1)
    vi.useRealTimers()
  })

  it('applies rotation transform during drag', async () => {
    const wrapper = mount(SwipeCard, {
      props: {
        photoPath: 'test-path',
        name: 'Test Item',
      },
    })

    triggerDrag({
      movement: [100, 0],
      dragging: true,
      last: false,
      velocities: [0, 0],
    })
    await nextTick()

    const card = wrapper.find('[class*="rounded-3xl"]')
    expect(card.attributes('style')).toContain('rotate')
  })
})
