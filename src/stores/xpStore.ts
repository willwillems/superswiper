import { ref, computed, watch } from 'vue'

const XP_STORAGE_KEY = 'superswiper-xp'
const XP_PER_ACTION = 5
const XP_MILESTONE_INTERVAL = 100

export type XpActionType = 'keep' | 'discard' | 'undo'

export interface XpHistoryEntry {
  amount: number
  action: XpActionType
  timestamp: number
}

export interface XpState {
  total: number
  history: XpHistoryEntry[]
}

function loadFromStorage(): XpState {
  try {
    const stored = localStorage.getItem(XP_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as XpState
      return {
        total: typeof parsed.total === 'number' ? parsed.total : 0,
        history: Array.isArray(parsed.history) ? parsed.history : [],
      }
    }
  } catch {
    // Invalid data, start fresh
  }
  return { total: 0, history: [] }
}

function saveToStorage(state: XpState): void {
  try {
    localStorage.setItem(XP_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage unavailable or full
  }
}

const initialState = loadFromStorage()
const total = ref(initialState.total)
const history = ref<XpHistoryEntry[]>(initialState.history)
const shouldTriggerMilestone = ref(false)
const lastEarnedXp = ref<{ amount: number; action: XpActionType } | null>(null)

watch(
  [total, history],
  () => {
    saveToStorage({ total: total.value, history: history.value })
  },
  { deep: true }
)

export function useXpStore() {
  function addXp(action: XpActionType): number {
    if (action === 'undo') {
      return 0
    }

    const previousTotal = total.value
    const amount = XP_PER_ACTION

    total.value += amount
    history.value.push({
      amount,
      action,
      timestamp: Date.now(),
    })

    lastEarnedXp.value = { amount, action }

    const previousMilestone = Math.floor(previousTotal / XP_MILESTONE_INTERVAL)
    const currentMilestone = Math.floor(total.value / XP_MILESTONE_INTERVAL)
    if (currentMilestone > previousMilestone) {
      shouldTriggerMilestone.value = true
    }

    return amount
  }

  function clearMilestoneTrigger() {
    shouldTriggerMilestone.value = false
  }

  function clearLastEarnedXp() {
    lastEarnedXp.value = null
  }

  const formattedTotal = computed(() => {
    if (total.value >= 1000) {
      return `${(total.value / 1000).toFixed(1)}k`
    }
    return total.value.toString()
  })

  return {
    total,
    history,
    formattedTotal,
    shouldTriggerMilestone,
    lastEarnedXp,
    addXp,
    clearMilestoneTrigger,
    clearLastEarnedXp,
    XP_PER_ACTION,
    XP_MILESTONE_INTERVAL,
  }
}
