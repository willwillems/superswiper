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
    :aria-label="`${name} box, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`"
    :class="[
      'flex h-24 flex-col items-center justify-center rounded-xl text-white transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-[0.98]',
      getGradientClass(gradient),
    ]"
  >
    <span class="w-full truncate px-2 font-semibold" aria-hidden="true">{{ name }}</span>
    <span class="text-sm text-white/70" aria-hidden="true">
      {{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }}
    </span>
  </button>
</template>
