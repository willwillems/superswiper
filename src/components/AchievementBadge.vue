<script setup lang="ts">
defineProps<{
  icon: string
  name: string
  description: string
  unlocked: boolean
  unlockedAt?: number
}>()

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <div
    class="flex flex-col gap-2 rounded-xl p-4 transition-all"
    :class="unlocked ? 'bg-surface' : 'bg-surface/50 opacity-60'"
  >
    <div class="flex items-center gap-3">
      <span
        class="flex h-10 w-10 items-center justify-center rounded-lg text-xl"
        :class="unlocked ? 'bg-accent/20' : 'bg-background grayscale'"
      >
        {{ icon }}
      </span>
      <div class="flex flex-1 flex-col gap-0.5">
        <span class="text-sm font-medium" :class="unlocked ? '' : 'text-text-muted'">
          {{ name }}
        </span>
        <span class="text-xs text-text-muted">{{ description }}</span>
      </div>
      <span
        v-if="unlocked"
        class="flex h-6 w-6 items-center justify-center rounded-full bg-keep/20 text-xs text-keep"
      >
        ✓
      </span>
    </div>
    <span v-if="unlocked && unlockedAt" class="text-[10px] text-text-muted">
      Unlocked {{ formatDate(unlockedAt) }}
    </span>
  </div>
</template>
