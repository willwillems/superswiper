import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ConfettiExplosion from '../components/ConfettiExplosion.vue'

describe('ConfettiExplosion', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not render particles when trigger is false', () => {
    mount(ConfettiExplosion, {
      props: { trigger: false },
    })
    const particles = document.body.querySelectorAll('.confetti-particle')
    expect(particles.length).toBe(0)
  })

  it('renders particles when trigger becomes true', async () => {
    const wrapper = mount(ConfettiExplosion, {
      props: { trigger: false },
    })

    await wrapper.setProps({ trigger: true })
    await nextTick()

    const particles = document.body.querySelectorAll('.confetti-particle')
    expect(particles.length).toBe(50)
  })

  it('creates particles with different colors', async () => {
    const wrapper = mount(ConfettiExplosion, {
      props: { trigger: false },
    })

    await wrapper.setProps({ trigger: true })
    await nextTick()

    const particles = document.body.querySelectorAll('.confetti-particle')
    const colors = new Set<string>()
    particles.forEach((particle) => {
      const style = (particle as HTMLElement).style.backgroundColor
      if (style) colors.add(style)
    })
    expect(colors.size).toBeGreaterThan(1)
  })

  it('emits complete after animation duration (2 seconds)', async () => {
    const wrapper = mount(ConfettiExplosion, {
      props: { trigger: false },
    })

    await wrapper.setProps({ trigger: true })
    await nextTick()

    expect(wrapper.emitted('complete')).toBeFalsy()

    vi.advanceTimersByTime(2000)
    await nextTick()

    expect(wrapper.emitted('complete')).toHaveLength(1)
  })

  it('cleans up particles after animation completes', async () => {
    const wrapper = mount(ConfettiExplosion, {
      props: { trigger: false },
    })

    await wrapper.setProps({ trigger: true })
    await nextTick()

    let particles = document.body.querySelectorAll('.confetti-particle')
    expect(particles.length).toBe(50)

    vi.advanceTimersByTime(2000)
    await nextTick()

    particles = document.body.querySelectorAll('.confetti-particle')
    expect(particles.length).toBe(0)
  })

  it('does not retrigger while animation is active', async () => {
    const wrapper = mount(ConfettiExplosion, {
      props: { trigger: false },
    })

    await wrapper.setProps({ trigger: true })
    await nextTick()

    const initialParticles = document.body.querySelectorAll('.confetti-particle')
    expect(initialParticles.length).toBe(50)

    // Setting trigger to false and back to true while active
    await wrapper.setProps({ trigger: false })
    await wrapper.setProps({ trigger: true })
    await nextTick()

    // Should still have the same 50 particles (not 100)
    const particles = document.body.querySelectorAll('.confetti-particle')
    expect(particles.length).toBe(50)
  })

  it('can trigger again after animation completes', async () => {
    const wrapper = mount(ConfettiExplosion, {
      props: { trigger: false },
    })

    // First trigger
    await wrapper.setProps({ trigger: true })
    await nextTick()

    vi.advanceTimersByTime(2000)
    await nextTick()

    expect(wrapper.emitted('complete')).toHaveLength(1)

    // Reset and trigger again
    await wrapper.setProps({ trigger: false })
    await wrapper.setProps({ trigger: true })
    await nextTick()

    const particles = document.body.querySelectorAll('.confetti-particle')
    expect(particles.length).toBe(50)

    vi.advanceTimersByTime(2000)
    await nextTick()

    expect(wrapper.emitted('complete')).toHaveLength(2)
  })

  it('applies CSS custom properties for animation', async () => {
    const wrapper = mount(ConfettiExplosion, {
      props: { trigger: false },
    })

    await wrapper.setProps({ trigger: true })
    await nextTick()

    const particle = document.body.querySelector('.confetti-particle') as HTMLElement
    expect(particle.style.getPropertyValue('--x')).toBeTruthy()
    expect(particle.style.getPropertyValue('--y')).toBeTruthy()
    expect(particle.style.getPropertyValue('--rotation')).toBeTruthy()
    expect(particle.style.getPropertyValue('--scale')).toBeTruthy()
    expect(particle.style.getPropertyValue('--delay')).toBeTruthy()
  })

  it('renders inside a Teleport to body', async () => {
    const wrapper = mount(ConfettiExplosion, {
      props: { trigger: false },
    })

    await wrapper.setProps({ trigger: true })
    await nextTick()

    // Should be rendered in body, not in component
    expect(wrapper.find('.confetti-particle').exists()).toBe(false)
    expect(document.body.querySelectorAll('.confetti-particle').length).toBe(50)
  })

  it('has pointer-events-none on container', async () => {
    const wrapper = mount(ConfettiExplosion, {
      props: { trigger: false },
    })

    await wrapper.setProps({ trigger: true })
    await nextTick()

    const container = document.body.querySelector('.pointer-events-none')
    expect(container).toBeTruthy()
  })
})
