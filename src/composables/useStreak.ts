import { ref, computed } from 'vue'

const CONFETTI_THRESHOLD = 5

const sessionStreak = ref(0)

export function useStreak() {
  const shouldTriggerConfetti = ref(false)

  function incrementStreak() {
    sessionStreak.value++
    if (sessionStreak.value === CONFETTI_THRESHOLD) {
      shouldTriggerConfetti.value = true
    }
  }

  function resetSessionStreak() {
    sessionStreak.value = 0
  }

  function setStreak(value: number) {
    sessionStreak.value = Math.max(0, value)
  }

  function clearConfettiTrigger() {
    shouldTriggerConfetti.value = false
  }

  const streakDisplay = computed(() =>
    sessionStreak.value > 0 ? `${sessionStreak.value} sorted` : ''
  )

  return {
    sessionStreak,
    streakDisplay,
    shouldTriggerConfetti,
    incrementStreak,
    resetSessionStreak,
    setStreak,
    clearConfettiTrigger,
    CONFETTI_THRESHOLD,
  }
}
