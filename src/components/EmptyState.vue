<script setup lang="ts">
defineProps<{
  icon?: string
  title: string
  description?: string
  actionLabel?: string
}>()

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-6 text-center">
    <div v-if="icon" class="text-6xl">{{ icon }}</div>
    <div>
      <h2 class="text-xl font-semibold">{{ title }}</h2>
      <p v-if="description" class="mt-1 text-text-muted">{{ description }}</p>
    </div>
    <button
      v-if="actionLabel"
      class="rounded-xl bg-accent px-6 py-3 font-medium text-white transition-transform active:scale-95"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>
