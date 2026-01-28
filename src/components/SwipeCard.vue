<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDrag } from '@vueuse/gesture'
import { useUpload } from '@/composables/useUpload'

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
const { getImageUrl } = useUpload()
const imageUrl = ref<string | null>(null)

const DISTANCE_THRESHOLD = 100
const VELOCITY_THRESHOLD = 0.5
const MAX_ROTATION = 15

const deltaX = ref(0)
const deltaY = ref(0)
const isDragging = ref(false)

useDrag(
  ({ movement: [mx, my], dragging, last, velocities: [vx] }) => {
    isDragging.value = dragging

    if (dragging) {
      deltaX.value = mx
      deltaY.value = my
    }

    if (last) {
      const swipedRight = mx > DISTANCE_THRESHOLD || (mx > 0 && vx > VELOCITY_THRESHOLD)
      const swipedLeft = mx < -DISTANCE_THRESHOLD || (mx < 0 && vx > VELOCITY_THRESHOLD)

      if (swipedRight) {
        emit('swipeRight')
      } else if (swipedLeft) {
        emit('swipeLeft')
      }

      deltaX.value = 0
      deltaY.value = 0
    }
  },
  { domTarget: cardRef },
)

type SwipeDirection = 'left' | 'right' | null

const direction = computed<SwipeDirection>(() => {
  if (Math.abs(deltaX.value) < DISTANCE_THRESHOLD) return null
  return deltaX.value > 0 ? 'right' : 'left'
})

const progress = computed(() => Math.min(1, Math.abs(deltaX.value) / DISTANCE_THRESHOLD))

const rotation = computed(() => {
  const rotationAmount = (deltaX.value / DISTANCE_THRESHOLD) * MAX_ROTATION
  return Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, rotationAmount))
})

const cardStyle = computed(() => ({
  transform: `translate(${deltaX.value}px, ${deltaY.value}px) rotate(${rotation.value}deg)`,
  transition: isDragging.value ? 'none' : 'transform 0.3s ease-out',
}))

const overlayStyle = computed(() => {
  if (!isDragging.value || !direction.value) {
    return { opacity: 0 }
  }
  return { opacity: progress.value }
})

const showKeep = computed(() => direction.value === 'right')
const showDiscard = computed(() => direction.value === 'left')

getImageUrl(props.photoPath).then((url) => {
  imageUrl.value = url
})
</script>

<template>
  <div
    ref="cardRef"
    class="relative aspect-[3/4] w-full max-w-sm cursor-grab overflow-hidden rounded-2xl bg-surface shadow-xl select-none touch-none active:cursor-grabbing"
    :style="cardStyle"
  >
    <img
      v-if="imageUrl"
      :src="imageUrl"
      :alt="name"
      class="absolute inset-0 h-full w-full object-cover"
    />
    <div v-else class="absolute inset-0 flex items-center justify-center bg-surface">
      <span class="animate-pulse text-text-muted">Loading...</span>
    </div>

    <div
      class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-16"
    >
      <p class="text-lg font-semibold text-white">{{ name }}</p>
    </div>

    <div
      v-if="showKeep"
      class="pointer-events-none absolute inset-0 flex items-center justify-center bg-keep/30"
      :style="overlayStyle"
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
    >
      <span
        class="rotate-[15deg] rounded-lg border-4 border-discard px-4 py-2 text-3xl font-bold text-discard"
      >
        DISCARD
      </span>
    </div>
  </div>
</template>
