<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDrag } from '@vueuse/gesture'
import { useImageLoader } from '@/composables/useImageLoader'
import ImageFallback from '@/components/ImageFallback.vue'

interface Props {
  photoPath: string
  name: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  swipeLeft: []
  swipeRight: []
}>()

const cardRef = ref<HTMLElement | null>(null)
const { imageUrl, state, handleImageLoad, handleImageError } = useImageLoader(props.photoPath)

const DISTANCE_THRESHOLD = 100
const VELOCITY_THRESHOLD = 0.5
const MAX_ROTATION = 15
const FLY_OFF_ROTATION = 30
const FLY_OFF_DURATION = 350

const deltaX = ref(0)
const deltaY = ref(0)
const isDragging = ref(false)
const isFlyingOff = ref(false)
const flyOffDirection = ref<'left' | 'right' | null>(null)

function flyOff(direction: 'left' | 'right') {
  isFlyingOff.value = true
  flyOffDirection.value = direction
  const flyDistance = window.innerWidth + 200
  deltaX.value = direction === 'right' ? flyDistance : -flyDistance

  setTimeout(() => {
    if (direction === 'right') {
      emit('swipeRight')
    } else {
      emit('swipeLeft')
    }
  }, FLY_OFF_DURATION)
}

function handleKeyDown(event: KeyboardEvent) {
  if (isFlyingOff.value) return

  if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
    event.preventDefault()
    flyOff('left')
  } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
    event.preventDefault()
    flyOff('right')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

useDrag(
  ({ movement: [mx, my], dragging, last, velocities: [vx] }) => {
    if (isFlyingOff.value) return

    isDragging.value = dragging

    if (dragging) {
      deltaX.value = mx
      deltaY.value = my
    }

    if (last) {
      const swipedRight = mx > DISTANCE_THRESHOLD || (mx > 0 && vx > VELOCITY_THRESHOLD)
      const swipedLeft = mx < -DISTANCE_THRESHOLD || (mx < 0 && vx > VELOCITY_THRESHOLD)

      if (swipedRight) {
        flyOff('right')
      } else if (swipedLeft) {
        flyOff('left')
      } else {
        deltaX.value = 0
        deltaY.value = 0
      }
    }
  },
  { domTarget: cardRef },
)

type SwipeDirection = 'left' | 'right' | null

const direction = computed<SwipeDirection>(() => {
  if (isFlyingOff.value) {
    return deltaX.value > 0 ? 'right' : 'left'
  }
  if (Math.abs(deltaX.value) < DISTANCE_THRESHOLD) return null
  return deltaX.value > 0 ? 'right' : 'left'
})

const progress = computed(() => Math.min(1, Math.abs(deltaX.value) / DISTANCE_THRESHOLD))

const rotation = computed(() => {
  if (isFlyingOff.value) {
    const maxRotation = flyOffDirection.value === 'right' ? FLY_OFF_ROTATION : -FLY_OFF_ROTATION
    return maxRotation
  }
  const rotationAmount = (deltaX.value / DISTANCE_THRESHOLD) * MAX_ROTATION
  return Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, rotationAmount))
})

const cardStyle = computed(() => ({
  transform: `translate(${deltaX.value}px, ${deltaY.value}px) rotate(${rotation.value}deg)`,
  transition: isDragging.value
    ? 'none'
    : isFlyingOff.value
      ? `transform ${FLY_OFF_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
      : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
}))

const overlayStyle = computed(() => {
  if (isFlyingOff.value) {
    return { opacity: 1 }
  }
  if (!isDragging.value || !direction.value) {
    return { opacity: 0 }
  }
  return { opacity: progress.value }
})

const showKeep = computed(() => direction.value === 'right')
const showDiscard = computed(() => direction.value === 'left')
</script>

<template>
  <div
    ref="cardRef"
    role="region"
    :aria-label="`Item card for ${name}. Swipe left to discard, swipe right to keep. Use arrow keys or A/D keys as keyboard shortcuts.`"
    tabindex="0"
    class="relative aspect-[3/4] w-full max-w-sm cursor-grab overflow-hidden rounded-3xl bg-surface shadow-xl select-none touch-none focus:outline-none focus-visible:ring-4 focus-visible:ring-accent active:cursor-grabbing"
    :style="cardStyle"
  >
    <img
      v-if="imageUrl && state !== 'error'"
      :src="imageUrl"
      :alt="name"
      draggable="false"
      class="pointer-events-none absolute inset-0 h-full w-full object-cover"
      @load="handleImageLoad"
      @error="handleImageError"
    />
    <div
      v-else-if="state === 'loading'"
      class="absolute inset-0 flex items-center justify-center bg-surface"
      role="status"
      aria-label="Loading image"
    >
      <span class="animate-pulse text-text-muted">Loading...</span>
    </div>
    <ImageFallback v-else size="lg" class="absolute inset-0" />

    <div
      class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-16"
    >
      <p class="line-clamp-2 text-lg font-semibold text-white">{{ name }}</p>
    </div>

    <div
      v-if="showKeep"
      class="pointer-events-none absolute inset-0 flex items-center justify-center bg-keep/30"
      :style="overlayStyle"
      aria-hidden="true"
    >
      <span
        class="rotate-[-15deg] rounded-lg border-4 border-keep px-4 py-2 text-3xl font-bold text-keep"
      >
        KEEP
      </span>
    </div>

    <div
      v-if="showDiscard"
      class="pointer-events-none absolute inset-0 flex items-center justify-center bg-discard/30"
      :style="overlayStyle"
      aria-hidden="true"
    >
      <span
        class="rotate-[15deg] rounded-lg border-4 border-discard px-4 py-2 text-3xl font-bold text-discard"
      >
        DISCARD
      </span>
    </div>
  </div>
</template>
