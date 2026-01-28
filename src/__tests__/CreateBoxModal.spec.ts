import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CreateBoxModal from '../components/CreateBoxModal.vue'

describe('CreateBoxModal', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('does not render when closed', () => {
    mount(CreateBoxModal, {
      props: { open: false },
    })
    expect(document.body.textContent).not.toContain('Create New Box')
  })

  it('renders modal content when open', () => {
    mount(CreateBoxModal, {
      props: { open: true },
    })
    expect(document.body.textContent).toContain('Create New Box')
  })

  it('displays input field with placeholder', () => {
    mount(CreateBoxModal, {
      props: { open: true },
    })
    const input = document.body.querySelector('input')
    expect(input).toBeTruthy()
    expect(input?.placeholder).toContain('Box name')
  })

  it('displays Cancel and Create buttons', () => {
    mount(CreateBoxModal, {
      props: { open: true },
    })
    expect(document.body.textContent).toContain('Cancel')
    expect(document.body.textContent).toContain('Create')
  })

  it('Create button is disabled when input is empty', () => {
    mount(CreateBoxModal, {
      props: { open: true },
    })
    const buttons = document.body.querySelectorAll('button')
    const createButton = Array.from(buttons).find((b) => b.textContent?.includes('Create'))
    expect(createButton?.hasAttribute('disabled')).toBe(true)
  })

  it('Create button is enabled when input has value', async () => {
    mount(CreateBoxModal, {
      props: { open: true },
    })
    const input = document.body.querySelector('input') as HTMLInputElement
    input.value = 'Kitchen'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    await new Promise((resolve) => setTimeout(resolve, 0))

    const buttons = document.body.querySelectorAll('button')
    const createButton = Array.from(buttons).find((b) => b.textContent?.includes('Create'))
    expect(createButton?.hasAttribute('disabled')).toBe(false)
  })

  it('Create button is disabled when input is only whitespace', async () => {
    mount(CreateBoxModal, {
      props: { open: true },
    })
    const input = document.body.querySelector('input') as HTMLInputElement
    input.value = '   '
    input.dispatchEvent(new Event('input', { bubbles: true }))

    await new Promise((resolve) => setTimeout(resolve, 0))

    const buttons = document.body.querySelectorAll('button')
    const createButton = Array.from(buttons).find((b) => b.textContent?.includes('Create'))
    expect(createButton?.hasAttribute('disabled')).toBe(true)
  })

  it('emits create with trimmed name when Create is clicked', async () => {
    const wrapper = mount(CreateBoxModal, {
      props: { open: true },
    })
    const input = document.body.querySelector('input') as HTMLInputElement
    input.value = '  Kitchen  '
    input.dispatchEvent(new Event('input', { bubbles: true }))

    await new Promise((resolve) => setTimeout(resolve, 0))

    const buttons = document.body.querySelectorAll('button')
    const createButton = Array.from(buttons).find((b) => b.textContent?.includes('Create'))
    createButton?.click()

    expect(wrapper.emitted('create')?.[0]).toEqual(['Kitchen'])
  })

  it('clears input after creating', async () => {
    mount(CreateBoxModal, {
      props: { open: true },
    })
    const input = document.body.querySelector('input') as HTMLInputElement
    input.value = 'Kitchen'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    await new Promise((resolve) => setTimeout(resolve, 0))

    const buttons = document.body.querySelectorAll('button')
    const createButton = Array.from(buttons).find((b) => b.textContent?.includes('Create'))
    createButton?.click()

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(input.value).toBe('')
  })

  it('emits close after creating', async () => {
    const wrapper = mount(CreateBoxModal, {
      props: { open: true },
    })
    const input = document.body.querySelector('input') as HTMLInputElement
    input.value = 'Kitchen'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    await new Promise((resolve) => setTimeout(resolve, 0))

    const buttons = document.body.querySelectorAll('button')
    const createButton = Array.from(buttons).find((b) => b.textContent?.includes('Create'))
    createButton?.click()

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('emits close when Cancel is clicked', async () => {
    const wrapper = mount(CreateBoxModal, {
      props: { open: true },
    })

    const buttons = document.body.querySelectorAll('button')
    const cancelButton = Array.from(buttons).find((b) => b.textContent?.includes('Cancel'))
    cancelButton?.click()

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('emits close when backdrop is clicked', async () => {
    const wrapper = mount(CreateBoxModal, {
      props: { open: true },
    })

    const backdrop = document.body.querySelector('.backdrop-blur-sm')
    backdrop?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('submits on Enter key press', async () => {
    const wrapper = mount(CreateBoxModal, {
      props: { open: true },
    })
    const input = document.body.querySelector('input') as HTMLInputElement
    input.value = 'Kitchen'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    await new Promise((resolve) => setTimeout(resolve, 0))

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

    expect(wrapper.emitted('create')?.[0]).toEqual(['Kitchen'])
  })

  it('does not submit on Enter with empty input', async () => {
    const wrapper = mount(CreateBoxModal, {
      props: { open: true },
    })
    const input = document.body.querySelector('input') as HTMLInputElement
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

    expect(wrapper.emitted('create')).toBeFalsy()
  })
})
