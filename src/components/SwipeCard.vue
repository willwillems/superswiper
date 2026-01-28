<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSwipe } from '@/composables/useSwipe'
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

const {
  state,
  direction,
  progress,
  cardStyle,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
} = useSwipe(cardRef, {
  onSwipeLeft: () => emit('swipeLeft'),
  onSwipeRight: () => emit('swipeRight'),
})

const overlayStyle = computed(() => {
  if (!state.value.isDragging || !direction.value) {
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
    class="relative aspect-[3/4] w-full max-w-sm cursor-grab overflow-hidden rounded-2xl bg-surface shadow-xl select-none active:cursor-grabbing"
    :style="cardStyle"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
    @pointercancel="handlePointerUp"
  >
    <img
      v-if="imageUrl"
      :src="imageUrl"
      :alt="name"
      class="absolute inset-0 h-full w-full object-cover"
    />
    <div
      v-else
      class="absolute inset-0 flex items-center justify-center bg-surface"
    >
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
      <span class="rotate-[-15deg] rounded-lg border-4 border-keep px-4 py-2 text-3xl font-bold text-keep">
        KEEP
      </span>
    </div>

    <div
      v-if="showDiscard"
      class="pointer-events-none absolute inset-0 flex items-center justify-center bg-discard/30"
      :style="overlayStyle"
    >
      <span class="rotate-[15deg] rounded-lg border-4 border-discard px-4 py-2 text-3xl font-bold text-discard">
        DISCARD
      </span>
    </div>
  </div>
</template>
