<script setup lang="ts">
import { useImageLoader } from '@/composables/useImageLoader'

interface Props {
  photoPath: string
  stackIndex: number
}

const props = defineProps<Props>()

const { imageUrl, state, handleImageLoad, handleImageError } = useImageLoader(props.photoPath)

const scale = 1 - props.stackIndex * 0.04
const translateY = props.stackIndex * 8
const brightness = 1 - props.stackIndex * 0.1
</script>

<template>
  <div
    class="absolute inset-0 aspect-[3/4] overflow-hidden rounded-3xl bg-surface shadow-lg"
    aria-hidden="true"
    :style="{
      transform: `scale(${scale}) translateY(${translateY}px)`,
      zIndex: -stackIndex,
      filter: `brightness(${brightness})`,
      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease-out',
    }"
  >
    <img
      v-if="imageUrl && state !== 'error'"
      :src="imageUrl"
      alt=""
      class="h-full w-full object-cover opacity-80"
      @load="handleImageLoad"
      @error="handleImageError"
    />
    <div v-else class="h-full w-full bg-surface" />
  </div>
</template>
