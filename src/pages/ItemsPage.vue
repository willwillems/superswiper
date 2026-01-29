<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBoxes } from '@/composables/useBoxes'
import { useItems } from '@/composables/useItems'
import { useUserStats } from '@/composables/useUserStats'
import BoxCard from '@/components/BoxCard.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'

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

interface DiscardCategory {
  key: 'trash' | 'donate' | 'sell'
  label: string
  icon: string
  gradient: string
}

const discardCategories: DiscardCategory[] = [
  {
    key: 'trash',
    label: 'Trash',
    icon: '🗑️',
    gradient: 'linear-gradient(135deg, #6b7280, #9ca3af)',
  },
  {
    key: 'donate',
    label: 'Donate',
    icon: '🎁',
    gradient: 'linear-gradient(135deg, #f97316, #fb923c)',
  },
  {
    key: 'sell',
    label: 'Sell',
    icon: '💰',
    gradient: 'linear-gradient(135deg, #14b8a6, #2dd4bf)',
  },
]

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
      <div class="flex items-center gap-2">
        <span
          class="flex size-7 items-center justify-center rounded-full text-sm shadow-sm"
          :style="{ background: 'var(--gradient-accent)' }"
          aria-hidden="true"
        >
          📦
        </span>
        <h2 class="text-lg font-semibold">Boxes</h2>
      </div>

      <div v-if="boxesLoading" class="grid grid-cols-2 gap-3">
        <div v-for="i in 4" :key="i" class="flex h-28 flex-col justify-center gap-2 rounded-2xl bg-surface p-3">
          <SkeletonLoader width="70%" height="1rem" rounded="lg" />
          <SkeletonLoader width="40%" height="0.75rem" rounded="lg" />
        </div>
      </div>

      <div v-else-if="sortedBoxes.length === 0" class="grid grid-cols-2 gap-3">
        <div
          class="flex h-28 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-text-muted/30 bg-surface/50"
        >
          <span class="text-2xl">📦</span>
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
      <div class="flex items-center gap-2">
        <span
          class="flex size-7 items-center justify-center rounded-full text-sm shadow-sm"
          :style="{ background: 'var(--gradient-discard)' }"
          aria-hidden="true"
        >
          ♻️
        </span>
        <h2 class="text-lg font-semibold">Discarded</h2>
      </div>

      <div v-if="itemsLoading" class="flex flex-col gap-2">
        <div v-for="i in 3" :key="i" class="flex items-center justify-between rounded-2xl bg-surface px-4 py-3.5">
          <div class="flex items-center gap-3">
            <SkeletonLoader width="2.75rem" height="2.75rem" rounded="full" />
            <SkeletonLoader width="4rem" height="1rem" rounded="lg" />
          </div>
          <SkeletonLoader width="2rem" height="1.25rem" rounded="full" />
        </div>
      </div>

      <div v-else class="flex flex-col gap-2">
        <button
          v-for="category in discardCategories"
          :key="category.key"
          class="group flex items-center justify-between rounded-2xl bg-surface px-4 py-3.5 shadow-sm transition-all duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98]"
          @click="navigateToCategory(category.key)"
        >
          <span class="flex items-center gap-3">
            <span
              class="flex size-11 shrink-0 items-center justify-center rounded-full text-xl shadow-md transition-transform duration-100 group-active:scale-90"
              :style="{ background: category.gradient }"
              aria-hidden="true"
            >
              {{ category.icon }}
            </span>
            <span class="text-base font-semibold">{{ category.label }}</span>
          </span>
          <span class="flex min-w-8 items-center justify-center rounded-full bg-text-muted/10 px-2.5 py-1 text-sm font-medium text-text-muted">
            {{ getCategoryCount(category.key) }}
          </span>
        </button>
      </div>
    </section>
  </div>
</template>
