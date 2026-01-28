<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const tabs = [
  { name: 'swipe', label: 'Swipe', icon: '↔' },
  { name: 'add', label: 'Add', icon: '+' },
  { name: 'items', label: 'Items', icon: '☐' },
] as const

const activeTab = computed(() => {
  if (route.name === 'swipe') return 'swipe'
  if (route.name === 'add') return 'add'
  if (route.name?.toString().startsWith('items')) return 'items'
  return null
})

function navigate(name: string) {
  router.push({ name })
}
</script>

<template>
  <nav class="flex items-stretch border-t border-white/10 bg-surface pb-safe">
    <button
      v-for="tab in tabs"
      :key="tab.name"
      class="flex flex-1 flex-col items-center gap-1 pb-2 pt-3 transition-colors"
      :class="activeTab === tab.name ? 'text-accent' : 'text-text-muted'"
      @click="navigate(tab.name)"
    >
      <span class="text-xl">{{ tab.icon }}</span>
      <span class="text-xs font-medium">{{ tab.label }}</span>
    </button>
  </nav>
</template>
