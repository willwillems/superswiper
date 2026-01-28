import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BottomNav from '../components/BottomNav.vue'

vi.mock('vue-router', () => ({
  useRoute: () => ({ name: 'swipe' }),
  useRouter: () => ({ push: vi.fn() }),
}))

describe('BottomNav', () => {
  it('renders navigation tabs', () => {
    const wrapper = mount(BottomNav)
    expect(wrapper.text()).toContain('Swipe')
    expect(wrapper.text()).toContain('Add')
    expect(wrapper.text()).toContain('Items')
  })

  it('highlights active tab', () => {
    const wrapper = mount(BottomNav)
    const buttons = wrapper.findAll('button')
    expect(buttons[0]?.classes()).toContain('text-accent')
  })
})
