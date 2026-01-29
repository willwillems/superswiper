<script setup lang="ts">
import { useImageLoader } from '@/composables/useImageLoader'
import ImageFallback from '@/components/ImageFallback.vue'

const props = defineProps<{
  id: string
  name: string
  photoPath: string
}>()

defineEmits<{
  click: []
}>()

const { imageUrl, state, handleImageLoad, handleImageError } = useImageLoader(props.photoPath)
</script>

<template>
  <button
    :aria-label="`View details for ${name}`"
    class="group relative aspect-square overflow-hidden rounded-xl bg-surface transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98]"
    @click="$emit('click')"
  >
    <img
      v-if="imageUrl && state !== 'error'"
      :src="imageUrl"
      :alt="name"
      class="h-full w-full object-cover"
      @load="handleImageLoad"
      @error="handleImageError"
    />
    <div
      v-else-if="state === 'loading'"
      class="flex h-full w-full items-center justify-center bg-surface"
      role="status"
      aria-label="Loading image"
    >
      <span class="animate-pulse text-text-muted" aria-hidden="true">...</span>
    </div>
    <ImageFallback v-else size="sm" />

    <div
      class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-2"
    >
      <span class="line-clamp-1 text-sm font-medium text-white" aria-hidden="true">{{ name }}</span>
    </div>
  </button>
</template>
