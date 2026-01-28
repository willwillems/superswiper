<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isBoxView = computed(() => route.name === 'items-box')
const title = computed(() => {
  if (isBoxView.value) {
    return `Box: ${route.params.boxId}`
  }
  const category = route.params.category as string
  return category.charAt(0).toUpperCase() + category.slice(1)
})
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 p-6">
    <header class="flex items-center gap-3">
      <button
        class="flex h-10 w-10 items-center justify-center rounded-full bg-surface transition-transform active:scale-95"
        @click="router.back()"
      >
        ←
      </button>
      <h1 class="text-xl font-bold">{{ title }}</h1>
      <span class="text-text-muted">0 items</span>
    </header>

    <div class="flex flex-1 items-center justify-center">
      <p class="text-text-muted">No items here yet</p>
    </div>
  </div>
</template>
