<script setup lang="ts">
defineProps<{
  name: string
  gradient: number
  itemCount: number
}>()

function getGradientClass(gradient: number): string {
  return `box-gradient-${gradient}`
}
</script>

<template>
  <button
    :class="[
      'flex h-24 flex-col items-center justify-center rounded-xl text-white transition-transform active:scale-[0.98]',
      getGradientClass(gradient),
    ]"
  >
    <span class="w-full truncate px-2 font-semibold">{{ name }}</span>
    <span class="text-sm text-white/70">
      {{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }}
    </span>
  </button>
</template>
