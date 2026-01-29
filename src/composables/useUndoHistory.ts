import { ref, computed } from 'vue'
import type { ItemStatus } from './useItems'

export interface UndoAction {
  itemId: string
  itemName: string
  previousStatus: ItemStatus
  previousBoxId?: string
  newStatus: ItemStatus
  newBoxId?: string
  streakBefore: number
  timestamp: number
}

const MAX_HISTORY = 10
const undoStack = ref<UndoAction[]>([])

export function useUndoHistory() {
  function recordSort(action: Omit<UndoAction, 'timestamp'>) {
    undoStack.value.push({
      ...action,
      timestamp: Date.now(),
    })

    if (undoStack.value.length > MAX_HISTORY) {
      undoStack.value.shift()
    }
  }

  function popUndo(): UndoAction | null {
    return undoStack.value.pop() ?? null
  }

  function clearHistory() {
    undoStack.value = []
  }

  const canUndo = computed(() => undoStack.value.length > 0)

  const lastAction = computed(() =>
    undoStack.value.length > 0
      ? undoStack.value[undoStack.value.length - 1]
      : null
  )

  return {
    undoStack,
    canUndo,
    lastAction,
    recordSort,
    popUndo,
    clearHistory,
  }
}
