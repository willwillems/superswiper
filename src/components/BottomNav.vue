<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const tabs = [
  { name: 'swipe', label: 'Swipe', icon: '↔', description: 'Swipe through items to sort them' },
  { name: 'add', label: 'Add', icon: '+', description: 'Add new items to sort' },
  { name: 'items', label: 'Items', icon: '☐', description: 'View all sorted items' },
] as const

const activeTab = computed(() => {
  if (route.name === 'swipe') return 'swipe'
  if (route.name === 'add') return 'add'
  if (route.name?.toString().startsWith('items')) return 'items'
  return null
})

const activeTabIndex = computed(() => {
  const index = tabs.findIndex((t) => t.name === activeTab.value)
  return index >= 0 ? index : 0
})

function navigate(name: string) {
  router.push({ name })
}

function navigatePrevious() {
  const prevIndex = (activeTabIndex.value - 1 + tabs.length) % tabs.length
  const tab = tabs[prevIndex]
  if (tab) navigate(tab.name)
}

function navigateNext() {
  const nextIndex = (activeTabIndex.value + 1) % tabs.length
  const tab = tabs[nextIndex]
  if (tab) navigate(tab.name)
}
</script>

<template>
  <nav
    class="flex items-stretch border-t border-border bg-surface pb-safe"
    role="tablist"
    aria-label="Main navigation"
  >
    <button
      v-for="tab in tabs"
      :key="tab.name"
      role="tab"
      :aria-selected="activeTab === tab.name"
      :aria-label="tab.description"
      :tabindex="activeTab === tab.name ? 0 : -1"
      class="flex flex-1 flex-col items-center gap-1 pb-2 pt-3 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset active:scale-95"
      :class="activeTab === tab.name ? 'text-accent' : 'text-text-muted'"
      @click="navigate(tab.name)"
      @keydown.left.prevent="navigatePrevious"
      @keydown.right.prevent="navigateNext"
    >
      <span class="text-xl" aria-hidden="true">{{ tab.icon }}</span>
      <span class="text-xs font-medium">{{ tab.label }}</span>
    </button>
  </nav>
</template>
