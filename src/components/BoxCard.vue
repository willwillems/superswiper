<script setup lang="ts">
defineProps<{
  name: string
  gradient: number
  itemCount: number
}>()

const boxIcons = ['📦', '🏠', '🛋️', '🍳', '🛏️', '🚗', '📚', '🎮'] as const

function getGradientStyle(gradient: number): string {
  const gradients = [
    'linear-gradient(135deg, #f97316, #fb923c)',
    'linear-gradient(135deg, #ec4899, #f472b6)',
    'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    'linear-gradient(135deg, #3b82f6, #60a5fa)',
    'linear-gradient(135deg, #06b6d4, #22d3ee)',
    'linear-gradient(135deg, #10b981, #34d399)',
    'linear-gradient(135deg, #eab308, #facc15)',
    'linear-gradient(135deg, #ef4444, #f87171)',
  ] as const
  return gradients[gradient % gradients.length] ?? gradients[0]
}

function getBoxIcon(gradient: number): string {
  return boxIcons[gradient % boxIcons.length] ?? boxIcons[0]
}
</script>

<template>
  <button
    :aria-label="`${name} box, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`"
    class="group flex h-28 flex-col items-center justify-center gap-2 rounded-2xl bg-surface shadow-md transition-all duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.97]"
  >
    <span
      class="flex size-12 items-center justify-center rounded-full text-2xl shadow-sm transition-transform duration-100 group-active:scale-90"
      :style="{ background: getGradientStyle(gradient) }"
      aria-hidden="true"
    >
      {{ getBoxIcon(gradient) }}
    </span>
    <span class="flex flex-col items-center gap-0.5 px-2">
      <span class="max-w-full truncate font-semibold" aria-hidden="true">{{ name }}</span>
      <span class="text-xs text-text-muted" aria-hidden="true">
        {{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }}
      </span>
    </span>
  </button>
</template>
