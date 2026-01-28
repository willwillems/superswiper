import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DiscardSheet from '../components/DiscardSheet.vue'

describe('DiscardSheet', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('does not render when closed', () => {
    mount(DiscardSheet, {
      props: { open: false },
    })
    expect(document.body.textContent).not.toContain('What do you want to do')
  })

  it('renders modal content when open', () => {
    mount(DiscardSheet, {
      props: { open: true },
    })
    expect(document.body.textContent).toContain('What do you want to do with this item?')
  })

  it('displays all discard options', () => {
    mount(DiscardSheet, {
      props: { open: true },
    })
    expect(document.body.textContent).toContain('Trash')
    expect(document.body.textContent).toContain('Donate')
    expect(document.body.textContent).toContain('Sell')
  })

  it('displays option icons', () => {
    mount(DiscardSheet, {
      props: { open: true },
    })
    expect(document.body.textContent).toContain('🗑️')
    expect(document.body.textContent).toContain('🎁')
    expect(document.body.textContent).toContain('💰')
  })

  it('emits select with "trash" when Trash is clicked', async () => {
    const wrapper = mount(DiscardSheet, {
      props: { open: true },
    })

    const buttons = document.body.querySelectorAll('button')
    const trashButton = Array.from(buttons).find((b) => b.textContent?.includes('Trash'))
    trashButton?.click()

    expect(wrapper.emitted('select')?.[0]).toEqual(['trash'])
  })

  it('emits select with "donate" when Donate is clicked', async () => {
    const wrapper = mount(DiscardSheet, {
      props: { open: true },
    })

    const buttons = document.body.querySelectorAll('button')
    const donateButton = Array.from(buttons).find((b) => b.textContent?.includes('Donate'))
    donateButton?.click()

    expect(wrapper.emitted('select')?.[0]).toEqual(['donate'])
  })

  it('emits select with "sell" when Sell is clicked', async () => {
    const wrapper = mount(DiscardSheet, {
      props: { open: true },
    })

    const buttons = document.body.querySelectorAll('button')
    const sellButton = Array.from(buttons).find((b) => b.textContent?.includes('Sell'))
    sellButton?.click()

    expect(wrapper.emitted('select')?.[0]).toEqual(['sell'])
  })

  it('emits close after selecting an option', async () => {
    const wrapper = mount(DiscardSheet, {
      props: { open: true },
    })

    const buttons = document.body.querySelectorAll('button')
    const trashButton = Array.from(buttons).find((b) => b.textContent?.includes('Trash'))
    trashButton?.click()

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('emits close when backdrop is clicked', async () => {
    const wrapper = mount(DiscardSheet, {
      props: { open: true },
    })

    const backdrop = document.body.querySelector('.backdrop-blur-sm')
    backdrop?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
