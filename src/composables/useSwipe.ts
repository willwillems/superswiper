import { ref, computed, type Ref } from 'vue'

export type SwipeDirection = 'left' | 'right' | null

interface SwipeState {
  deltaX: number
  deltaY: number
  isDragging: boolean
}

interface UseSwipeOptions {
  threshold?: number
  maxRotation?: number
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}

const DEFAULT_THRESHOLD = 100
const DEFAULT_MAX_ROTATION = 15

export function useSwipe(
  elementRef: Ref<HTMLElement | null>,
  options: UseSwipeOptions = {}
) {
  const {
    threshold = DEFAULT_THRESHOLD,
    maxRotation = DEFAULT_MAX_ROTATION,
    onSwipeLeft,
    onSwipeRight,
  } = options

  const state = ref<SwipeState>({
    deltaX: 0,
    deltaY: 0,
    isDragging: false,
  })

  let startX = 0
  let startY = 0

  const direction = computed<SwipeDirection>(() => {
    if (Math.abs(state.value.deltaX) < threshold) return null
    return state.value.deltaX > 0 ? 'right' : 'left'
  })

  const progress = computed(() => {
    return Math.min(1, Math.abs(state.value.deltaX) / threshold)
  })

  const rotation = computed(() => {
    const rotationAmount = (state.value.deltaX / threshold) * maxRotation
    return Math.max(-maxRotation, Math.min(maxRotation, rotationAmount))
  })

  const cardStyle = computed(() => {
    const { deltaX, deltaY, isDragging } = state.value
    return {
      transform: `translate(${deltaX}px, ${deltaY}px) rotate(${rotation.value}deg)`,
      transition: isDragging ? 'none' : 'transform 0.3s ease-out',
    }
  })

  function handlePointerDown(event: PointerEvent) {
    const el = elementRef.value
    if (!el) return

    el.setPointerCapture(event.pointerId)
    startX = event.clientX
    startY = event.clientY
    state.value.isDragging = true
  }

  function handlePointerMove(event: PointerEvent) {
    if (!state.value.isDragging) return

    state.value.deltaX = event.clientX - startX
    state.value.deltaY = event.clientY - startY
  }

  function handlePointerUp() {
    if (!state.value.isDragging) return

    state.value.isDragging = false

    if (direction.value === 'left') {
      onSwipeLeft?.()
    } else if (direction.value === 'right') {
      onSwipeRight?.()
    }

    state.value.deltaX = 0
    state.value.deltaY = 0
  }

  function reset() {
    state.value = { deltaX: 0, deltaY: 0, isDragging: false }
  }

  return {
    state,
    direction,
    progress,
    rotation,
    cardStyle,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    reset,
  }
}
