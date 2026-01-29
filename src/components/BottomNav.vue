<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const tabs = [
  { name: 'swipe', label: 'Swipe', description: 'Swipe through items to sort them' },
  { name: 'add', label: 'Add', description: 'Add new items to sort' },
  { name: 'items', label: 'Items', description: 'View all sorted items' },
  { name: 'stats', label: 'Stats', description: 'View your decluttering statistics' },
] as const

const activeTab = computed(() => {
  if (route.name === 'swipe') return 'swipe'
  if (route.name === 'add') return 'add'
  if (route.name === 'stats') return 'stats'
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
      class="relative flex flex-1 flex-col items-center gap-1 pb-3 pt-3 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
      :class="[
        activeTab === tab.name ? 'text-accent' : 'text-text-muted hover:text-text-primary',
        'active:scale-90 active:opacity-80',
      ]"
      @click="navigate(tab.name)"
      @keydown.left.prevent="navigatePrevious"
      @keydown.right.prevent="navigateNext"
    >
      <!-- Icon container with scale effect for active state -->
      <span
        class="transition-transform duration-200"
        :class="activeTab === tab.name ? 'scale-110' : ''"
      >
        <!-- Swipe icon: flame (filled for more presence) -->
        <svg
          v-if="tab.name === 'swipe'"
          class="size-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M12 23a7.5 7.5 0 0 1-5.138-12.963C8.204 8.774 11.5 6.5 11 1.5c6 4 9 8 3 14 1 0 2.5 0 5-2.47.27.773.5 1.604.5 2.47A7.5 7.5 0 0 1 12 23Z"
          />
        </svg>

        <!-- Add icon: plus circle -->
        <svg
          v-else-if="tab.name === 'add'"
          class="size-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>

        <!-- Items icon: squares/grid -->
        <svg
          v-else-if="tab.name === 'items'"
          class="size-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
          />
        </svg>

        <!-- Stats icon: chart bar -->
        <svg
          v-else-if="tab.name === 'stats'"
          class="size-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
          />
        </svg>
      </span>

      <span
        class="text-xs transition-all duration-200"
        :class="activeTab === tab.name ? 'font-semibold' : 'font-medium'"
      >
        {{ tab.label }}
      </span>

      <!-- Active indicator underline with animation -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 scale-x-0"
        enter-to-class="opacity-100 scale-x-100"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 scale-x-100"
        leave-to-class="opacity-0 scale-x-0"
      >
        <span
          v-if="activeTab === tab.name"
          class="absolute bottom-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-accent"
        />
      </Transition>
    </button>
  </nav>
</template>
