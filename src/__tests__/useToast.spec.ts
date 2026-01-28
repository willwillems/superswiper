import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

// We need to reset the module between tests to clear shared state
let useToast: typeof import('../composables/useToast').useToast

describe('useToast', () => {
  beforeEach(async () => {
    vi.useFakeTimers()
    vi.resetModules()
    const module = await import('../composables/useToast')
    useToast = module.useToast
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with empty toasts', () => {
    const { toasts } = useToast()
    expect(toasts.value).toHaveLength(0)
  })

  it('adds toast with addToast', () => {
    const { toasts, addToast } = useToast()
    addToast('Test message', 'info')
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0]).toMatchObject({
      message: 'Test message',
      type: 'info',
    })
  })

  it('adds toast with success helper', () => {
    const { toasts, success } = useToast()
    success('Success message')
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0]).toMatchObject({
      message: 'Success message',
      type: 'success',
    })
  })

  it('adds toast with error helper', () => {
    const { toasts, error } = useToast()
    error('Error message')
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0]).toMatchObject({
      message: 'Error message',
      type: 'error',
    })
  })

  it('adds toast with info helper', () => {
    const { toasts, info } = useToast()
    info('Info message')
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0]).toMatchObject({
      message: 'Info message',
      type: 'info',
    })
  })

  it('assigns unique ids to toasts', () => {
    const { toasts, addToast } = useToast()
    addToast('First')
    addToast('Second')
    expect(toasts.value[0]?.id).not.toBe(toasts.value[1]?.id)
  })

  it('removes toast by id', () => {
    const { toasts, addToast, removeToast } = useToast()
    addToast('First')
    addToast('Second')
    const firstId = toasts.value[0]?.id ?? -1
    removeToast(firstId)
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0]?.message).toBe('Second')
  })

  it('auto-removes toast after 4 seconds', () => {
    const { toasts, addToast } = useToast()
    addToast('Auto-remove')
    expect(toasts.value).toHaveLength(1)

    vi.advanceTimersByTime(3999)
    expect(toasts.value).toHaveLength(1)

    vi.advanceTimersByTime(1)
    expect(toasts.value).toHaveLength(0)
  })

  it('handles multiple toasts with staggered removal', () => {
    const { toasts, addToast } = useToast()

    addToast('First')
    vi.advanceTimersByTime(2000)
    addToast('Second')

    expect(toasts.value).toHaveLength(2)

    vi.advanceTimersByTime(2000)
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0]?.message).toBe('Second')

    vi.advanceTimersByTime(2000)
    expect(toasts.value).toHaveLength(0)
  })

  it('does nothing when removing non-existent id', () => {
    const { toasts, addToast, removeToast } = useToast()
    addToast('Test')
    removeToast(999)
    expect(toasts.value).toHaveLength(1)
  })

  it('shares state across multiple instances', () => {
    const instance1 = useToast()
    const instance2 = useToast()

    instance1.addToast('Shared')
    expect(instance2.toasts.value).toHaveLength(1)
  })

  it('defaults type to info when not specified', () => {
    const { toasts, addToast } = useToast()
    addToast('Default type')
    expect(toasts.value[0]?.type).toBe('info')
  })
})
