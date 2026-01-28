<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBoxes } from '@/composables/useBoxes'
import { useItems } from '@/composables/useItems'
import { useUserStats } from '@/composables/useUserStats'
import BoxCard from '@/components/BoxCard.vue'

const router = useRouter()
const { sortedBoxes, isLoading: boxesLoading } = useBoxes()
const { trashItems, donateItems, sellItems, isLoading: itemsLoading } = useItems()
const { stats } = useUserStats()

const isAnimating = ref(false)
let previousCount = stats.value.itemsSorted

watch(
  () => stats.value.itemsSorted,
  (newCount) => {
    if (newCount > previousCount && previousCount > 0) {
      isAnimating.value = true
      setTimeout(() => {
        isAnimating.value = false
      }, 300)
    }
    previousCount = newCount
  }
)

const discardCategories = [
  { key: 'trash', label: 'Trash', icon: '🗑️' },
  { key: 'donate', label: 'Donate', icon: '🎁' },
  { key: 'sell', label: 'Sell', icon: '💰' },
] as const

function getCategoryCount(key: 'trash' | 'donate' | 'sell'): number {
  if (key === 'trash') return trashItems.value.length
  if (key === 'donate') return donateItems.value.length
  return sellItems.value.length
}

function navigateToBox(boxId: string) {
  router.push({ name: 'items-box', params: { boxId } })
}

function navigateToCategory(category: string) {
  router.push({ name: 'items-category', params: { category } })
}
</script>

<template>
  <div class="flex flex-1 flex-col gap-6 p-6">
    <header class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Your Items</h1>
      <div
        v-if="stats.itemsSorted > 0"
        :class="[
          'rounded-full bg-accent/20 px-3 py-1 text-sm font-medium text-accent transition-transform',
          isAnimating && 'animate-bounce-once',
        ]"
      >
        {{ stats.itemsSorted }} sorted
      </div>
    </header>

    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold text-text-muted">Boxes</h2>

      <div v-if="boxesLoading" class="flex justify-center py-8">
        <span class="animate-pulse text-text-muted">Loading...</span>
      </div>

      <div v-else-if="sortedBoxes.length === 0" class="grid grid-cols-2 gap-3">
        <div
          class="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-text-muted/30"
        >
          <span class="text-sm text-text-muted">No boxes yet</span>
        </div>
      </div>

      <div v-else class="grid grid-cols-2 gap-3">
        <BoxCard
          v-for="box in sortedBoxes"
          :key="box.id"
          :name="box.name"
          :gradient="box.gradient"
          :item-count="box.items?.length ?? 0"
          @click="navigateToBox(box.id)"
        />
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold text-text-muted">Discarded</h2>

      <div v-if="itemsLoading" class="flex justify-center py-4">
        <span class="animate-pulse text-text-muted">Loading...</span>
      </div>

      <div v-else class="flex flex-col gap-2">
        <button
          v-for="category in discardCategories"
          :key="category.key"
          class="flex items-center justify-between rounded-xl bg-surface px-4 py-3 transition-transform active:scale-[0.98]"
          @click="navigateToCategory(category.key)"
        >
          <span class="flex items-center gap-2">
            <span>{{ category.icon }}</span>
            <span>{{ category.label }}</span>
          </span>
          <span class="text-text-muted">{{ getCategoryCount(category.key) }}</span>
        </button>
      </div>
    </section>
  </div>
</template>
