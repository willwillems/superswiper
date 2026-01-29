import { describe, it, expect, beforeEach } from 'vitest'
import { useUndoHistory } from '../composables/useUndoHistory'

describe('useUndoHistory', () => {
  beforeEach(() => {
    const { clearHistory } = useUndoHistory()
    clearHistory()
  })

  it('starts with empty undo stack', () => {
    const { undoStack, canUndo } = useUndoHistory()
    expect(undoStack.value).toHaveLength(0)
    expect(canUndo.value).toBe(false)
  })

  it('records sort actions', () => {
    const { undoStack, canUndo, recordSort } = useUndoHistory()

    recordSort({
      itemId: 'item-1',
      itemName: 'Test Item',
      previousStatus: 'unsorted',
      newStatus: 'trash',
      streakBefore: 0,
    })

    expect(undoStack.value).toHaveLength(1)
    expect(canUndo.value).toBe(true)

    const action = undoStack.value[0]!
    expect(action.itemId).toBe('item-1')
    expect(action.itemName).toBe('Test Item')
    expect(action.previousStatus).toBe('unsorted')
    expect(action.newStatus).toBe('trash')
  })

  it('records sort actions with box IDs', () => {
    const { undoStack, recordSort } = useUndoHistory()

    recordSort({
      itemId: 'item-1',
      itemName: 'Test Item',
      previousStatus: 'unsorted',
      newStatus: 'kept',
      newBoxId: 'box-123',
      streakBefore: 3,
    })

    const action = undoStack.value[0]!
    expect(action.newBoxId).toBe('box-123')
    expect(action.streakBefore).toBe(3)
  })

  it('adds timestamp to recorded actions', () => {
    const { undoStack, recordSort } = useUndoHistory()
    const before = Date.now()

    recordSort({
      itemId: 'item-1',
      itemName: 'Test Item',
      previousStatus: 'unsorted',
      newStatus: 'donate',
      streakBefore: 0,
    })

    const after = Date.now()
    const action = undoStack.value[0]!
    expect(action.timestamp).toBeGreaterThanOrEqual(before)
    expect(action.timestamp).toBeLessThanOrEqual(after)
  })

  it('pops undo action from stack', () => {
    const { undoStack, canUndo, recordSort, popUndo } = useUndoHistory()

    recordSort({
      itemId: 'item-1',
      itemName: 'Test Item',
      previousStatus: 'unsorted',
      newStatus: 'sell',
      streakBefore: 0,
    })

    const action = popUndo()

    expect(action).not.toBeNull()
    expect(action?.itemId).toBe('item-1')
    expect(undoStack.value).toHaveLength(0)
    expect(canUndo.value).toBe(false)
  })

  it('returns null when popping empty stack', () => {
    const { popUndo } = useUndoHistory()
    const action = popUndo()
    expect(action).toBeNull()
  })

  it('returns last action without removing it', () => {
    const { undoStack, lastAction, recordSort } = useUndoHistory()

    recordSort({
      itemId: 'item-1',
      itemName: 'First Item',
      previousStatus: 'unsorted',
      newStatus: 'trash',
      streakBefore: 0,
    })

    recordSort({
      itemId: 'item-2',
      itemName: 'Second Item',
      previousStatus: 'unsorted',
      newStatus: 'donate',
      streakBefore: 1,
    })

    expect(lastAction.value?.itemId).toBe('item-2')
    expect(undoStack.value).toHaveLength(2)
  })

  it('limits history to 10 actions', () => {
    const { undoStack, recordSort } = useUndoHistory()

    for (let i = 0; i < 15; i++) {
      recordSort({
        itemId: `item-${i}`,
        itemName: `Item ${i}`,
        previousStatus: 'unsorted',
        newStatus: 'trash',
        streakBefore: i,
      })
    }

    expect(undoStack.value).toHaveLength(10)
    expect(undoStack.value[0]!.itemId).toBe('item-5')
    expect(undoStack.value[9]!.itemId).toBe('item-14')
  })

  it('clears history', () => {
    const { undoStack, canUndo, recordSort, clearHistory } = useUndoHistory()

    recordSort({
      itemId: 'item-1',
      itemName: 'Test Item',
      previousStatus: 'unsorted',
      newStatus: 'trash',
      streakBefore: 0,
    })

    clearHistory()

    expect(undoStack.value).toHaveLength(0)
    expect(canUndo.value).toBe(false)
  })

  it('shares state across multiple instances', () => {
    const instance1 = useUndoHistory()
    const instance2 = useUndoHistory()

    instance1.recordSort({
      itemId: 'item-1',
      itemName: 'Test Item',
      previousStatus: 'unsorted',
      newStatus: 'trash',
      streakBefore: 0,
    })

    expect(instance2.undoStack.value).toHaveLength(1)
    expect(instance2.canUndo.value).toBe(true)
  })

  it('pops actions in LIFO order', () => {
    const { recordSort, popUndo } = useUndoHistory()

    recordSort({
      itemId: 'item-1',
      itemName: 'First',
      previousStatus: 'unsorted',
      newStatus: 'trash',
      streakBefore: 0,
    })

    recordSort({
      itemId: 'item-2',
      itemName: 'Second',
      previousStatus: 'unsorted',
      newStatus: 'donate',
      streakBefore: 1,
    })

    recordSort({
      itemId: 'item-3',
      itemName: 'Third',
      previousStatus: 'unsorted',
      newStatus: 'sell',
      streakBefore: 2,
    })

    expect(popUndo()?.itemId).toBe('item-3')
    expect(popUndo()?.itemId).toBe('item-2')
    expect(popUndo()?.itemId).toBe('item-1')
    expect(popUndo()).toBeNull()
  })
})
