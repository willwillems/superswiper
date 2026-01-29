import { describe, it, expect, beforeEach } from 'vitest'
import { useStreak } from '../composables/useStreak'

describe('useStreak', () => {
  beforeEach(() => {
    const { resetSessionStreak, clearConfettiTrigger } = useStreak()
    resetSessionStreak()
    clearConfettiTrigger()
  })

  it('starts with zero streak', () => {
    const { sessionStreak } = useStreak()
    expect(sessionStreak.value).toBe(0)
  })

  it('increments streak on sort', () => {
    const { sessionStreak, incrementStreak } = useStreak()
    incrementStreak()
    expect(sessionStreak.value).toBe(1)
    incrementStreak()
    expect(sessionStreak.value).toBe(2)
  })

  it('resets streak to zero', () => {
    const { sessionStreak, incrementStreak, resetSessionStreak } = useStreak()
    incrementStreak()
    incrementStreak()
    resetSessionStreak()
    expect(sessionStreak.value).toBe(0)
  })

  it('displays empty string when streak is zero', () => {
    const { streakDisplay } = useStreak()
    expect(streakDisplay.value).toBe('')
  })

  it('displays formatted streak when greater than zero', () => {
    const { streakDisplay, incrementStreak } = useStreak()
    incrementStreak()
    expect(streakDisplay.value).toBe('1 sorted')
    incrementStreak()
    expect(streakDisplay.value).toBe('2 sorted')
  })

  it('triggers confetti at threshold of 5', () => {
    const { shouldTriggerConfetti, incrementStreak, CONFETTI_THRESHOLD } = useStreak()
    expect(CONFETTI_THRESHOLD).toBe(5)
    expect(shouldTriggerConfetti.value).toBe(false)

    for (let i = 0; i < 4; i++) {
      incrementStreak()
    }
    expect(shouldTriggerConfetti.value).toBe(false)

    incrementStreak()
    expect(shouldTriggerConfetti.value).toBe(true)
  })

  it('does not trigger confetti again after threshold', () => {
    const { shouldTriggerConfetti, incrementStreak, clearConfettiTrigger } = useStreak()

    for (let i = 0; i < 5; i++) {
      incrementStreak()
    }
    expect(shouldTriggerConfetti.value).toBe(true)

    clearConfettiTrigger()
    expect(shouldTriggerConfetti.value).toBe(false)

    incrementStreak()
    expect(shouldTriggerConfetti.value).toBe(false)
  })

  it('clears confetti trigger', () => {
    const { shouldTriggerConfetti, incrementStreak, clearConfettiTrigger } = useStreak()

    for (let i = 0; i < 5; i++) {
      incrementStreak()
    }
    clearConfettiTrigger()
    expect(shouldTriggerConfetti.value).toBe(false)
  })

  it('shares state across multiple instances', () => {
    const instance1 = useStreak()
    const instance2 = useStreak()

    instance1.incrementStreak()
    expect(instance2.sessionStreak.value).toBe(1)
  })

  it('sets streak to specific value', () => {
    const { sessionStreak, incrementStreak, setStreak } = useStreak()
    incrementStreak()
    incrementStreak()
    incrementStreak()
    expect(sessionStreak.value).toBe(3)

    setStreak(1)
    expect(sessionStreak.value).toBe(1)
  })

  it('does not set streak below zero', () => {
    const { sessionStreak, setStreak } = useStreak()
    setStreak(-5)
    expect(sessionStreak.value).toBe(0)
  })
})
