<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useItems, type Item, type ItemStatus } from '@/composables/useItems'
import { useBoxes } from '@/composables/useBoxes'
import type { ShareableCategory } from '@/composables/useShare'
import ItemCard from '@/components/ItemCard.vue'
import ItemModal from '@/components/ItemModal.vue'
import ShareSheet from '@/components/ShareSheet.vue'

const route = useRoute()
const router = useRouter()
const { getItemsByStatus, getItemsByBoxId, isLoading } = useItems()
const { boxes } = useBoxes()

const selectedItem = ref<Item | null>(null)
const showModal = ref(false)
const showShareSheet = ref(false)

const isBoxView = computed(() => route.name === 'items-box')

const title = computed(() => {
  if (isBoxView.value) {
    const boxId = route.params.boxId as string
    const box = boxes.value.find((b) => b.id === boxId)
    return box?.name ?? 'Box'
  }
  const category = route.params.category as string
  return category.charAt(0).toUpperCase() + category.slice(1)
})

const isShareableCategory = computed(() => {
  if (isBoxView.value) return false
  const category = route.params.category as string
  return category === 'donate' || category === 'sell'
})

const shareCategory = computed(() => route.params.category as ShareableCategory)

const displayItems = computed(() => {
  if (isBoxView.value) {
    const boxId = route.params.boxId as string
    return getItemsByBoxId(boxId)
  }
  const category = route.params.category as ItemStatus
  return getItemsByStatus(category)
})

function openItemModal(item: Item) {
  selectedItem.value = item
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedItem.value = null
}

function openShareSheet() {
  showShareSheet.value = true
}

function closeShareSheet() {
  showShareSheet.value = false
}
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 p-6">
    <header class="flex items-center gap-3">
      <button
        class="flex h-10 w-10 items-center justify-center rounded-full bg-surface transition-transform active:scale-95"
        aria-label="Go back"
        @click="router.back()"
      >
        <span aria-hidden="true">←</span>
      </button>
      <h1 class="flex-1 text-xl font-bold">{{ title }}</h1>
      <span class="text-text-muted">{{ displayItems.length }} items</span>
      <button
        v-if="isShareableCategory && displayItems.length > 0"
        class="flex h-10 w-10 items-center justify-center rounded-full bg-surface transition-transform active:scale-95"
        aria-label="Share items"
        @click="openShareSheet"
      >
        <span aria-hidden="true">📤</span>
      </button>
    </header>

    <div v-if="isLoading" class="flex flex-1 items-center justify-center">
      <span class="animate-pulse text-text-muted">Loading...</span>
    </div>

    <div
      v-else-if="displayItems.length === 0"
      class="flex flex-1 items-center justify-center"
    >
      <p class="text-text-muted">No items here yet</p>
    </div>

    <div v-else class="grid grid-cols-3 gap-2">
      <ItemCard
        v-for="item in displayItems"
        :key="item.id"
        :id="item.id"
        :name="item.name"
        :photo-path="item.photoPath"
        @click="openItemModal(item)"
      />
    </div>

    <ItemModal
      :open="showModal"
      :item="selectedItem"
      @close="closeModal"
    />

    <ShareSheet
      :open="showShareSheet"
      :items="displayItems"
      :category="shareCategory"
      @close="closeShareSheet"
    />
  </div>
</template>
