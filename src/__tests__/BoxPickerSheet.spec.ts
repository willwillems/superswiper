import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import BoxPickerSheet from '../components/BoxPickerSheet.vue'

const mockBoxes = ref([
  { id: 'box-1', name: 'Kitchen', gradient: 0, createdAt: 1000, items: [{ id: 'item-1' }, { id: 'item-2' }] },
  { id: 'box-2', name: 'Garage', gradient: 3, createdAt: 2000, items: [{ id: 'item-3' }] },
  { id: 'box-3', name: 'Empty Box', gradient: 5, createdAt: 3000, items: [] },
])

const mockIsLoading = ref(false)

vi.mock('../composables/useBoxes', () => ({
  useBoxes: () => ({
    sortedBoxes: mockBoxes,
    isLoading: mockIsLoading,
  }),
}))

describe('BoxPickerSheet', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    mockBoxes.value = [
      { id: 'box-1', name: 'Kitchen', gradient: 0, createdAt: 1000, items: [{ id: 'item-1' }, { id: 'item-2' }] },
      { id: 'box-2', name: 'Garage', gradient: 3, createdAt: 2000, items: [{ id: 'item-3' }] },
      { id: 'box-3', name: 'Empty Box', gradient: 5, createdAt: 3000, items: [] },
    ]
    mockIsLoading.value = false
  })

  it('does not render when closed', () => {
    mount(BoxPickerSheet, {
      props: { open: false },
    })
    expect(document.body.textContent).not.toContain('Where does this item belong')
  })

  it('renders modal content when open', () => {
    mount(BoxPickerSheet, {
      props: { open: true },
    })
    expect(document.body.textContent).toContain('Where does this item belong?')
  })

  it('displays all boxes', () => {
    mount(BoxPickerSheet, {
      props: { open: true },
    })
    expect(document.body.textContent).toContain('Kitchen')
    expect(document.body.textContent).toContain('Garage')
    expect(document.body.textContent).toContain('Empty Box')
  })

  it('displays item counts for each box', () => {
    mount(BoxPickerSheet, {
      props: { open: true },
    })
    expect(document.body.textContent).toContain('2 items')
    expect(document.body.textContent).toContain('1 items')
    expect(document.body.textContent).toContain('0 items')
  })

  it('displays "New Box" button', () => {
    mount(BoxPickerSheet, {
      props: { open: true },
    })
    expect(document.body.textContent).toContain('New Box')
  })

  it('shows loading state', () => {
    mockIsLoading.value = true
    mount(BoxPickerSheet, {
      props: { open: true },
    })
    expect(document.body.textContent).toContain('Loading boxes...')
  })

  it('emits select with boxId when box is clicked', async () => {
    const wrapper = mount(BoxPickerSheet, {
      props: { open: true },
    })

    const buttons = document.body.querySelectorAll('button')
    const kitchenButton = Array.from(buttons).find((b) => b.textContent?.includes('Kitchen'))
    kitchenButton?.click()

    expect(wrapper.emitted('select')?.[0]).toEqual(['box-1'])
  })

  it('emits close after selecting a box', async () => {
    const wrapper = mount(BoxPickerSheet, {
      props: { open: true },
    })

    const buttons = document.body.querySelectorAll('button')
    const kitchenButton = Array.from(buttons).find((b) => b.textContent?.includes('Kitchen'))
    kitchenButton?.click()

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('emits createNew when "New Box" is clicked', async () => {
    const wrapper = mount(BoxPickerSheet, {
      props: { open: true },
    })

    const buttons = document.body.querySelectorAll('button')
    const newBoxButton = Array.from(buttons).find((b) => b.textContent?.includes('New Box'))
    newBoxButton?.click()

    expect(wrapper.emitted('createNew')).toHaveLength(1)
  })

  it('does not emit close when "New Box" is clicked', async () => {
    const wrapper = mount(BoxPickerSheet, {
      props: { open: true },
    })

    const buttons = document.body.querySelectorAll('button')
    const newBoxButton = Array.from(buttons).find((b) => b.textContent?.includes('New Box'))
    newBoxButton?.click()

    expect(wrapper.emitted('close')).toBeFalsy()
  })

  it('emits close when backdrop is clicked', async () => {
    const wrapper = mount(BoxPickerSheet, {
      props: { open: true },
    })

    const backdrop = document.body.querySelector('.backdrop-blur-sm')
    backdrop?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('applies gradient class to box buttons', () => {
    mount(BoxPickerSheet, {
      props: { open: true },
    })

    const buttons = document.body.querySelectorAll('button')
    const kitchenButton = Array.from(buttons).find((b) => b.textContent?.includes('Kitchen'))
    expect(kitchenButton?.classList.contains('box-gradient-0')).toBe(true)
  })
})
