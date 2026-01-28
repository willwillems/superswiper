<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useItems } from '@/composables/useItems'
import { useBoxes } from '@/composables/useBoxes'
import SwipeCard from '@/components/SwipeCard.vue'
import DiscardSheet from '@/components/DiscardSheet.vue'
import BoxPickerSheet from '@/components/BoxPickerSheet.vue'
import CreateBoxModal from '@/components/CreateBoxModal.vue'

const router = useRouter()
const { unsortedItems, isLoading, discardItem, keepItem } = useItems()
const { createBox } = useBoxes()

const currentIndex = ref(0)
const showDiscardSheet = ref(false)
const showBoxPicker = ref(false)
const showCreateBox = ref(false)
const pendingItemId = ref<string | null>(null)
const sessionStreak = ref(0)

const currentItem = computed(() => unsortedItems.value[currentIndex.value])

function handleSwipeLeft() {
  if (!currentItem.value) return
  pendingItemId.value = currentItem.value.id
  showDiscardSheet.value = true
}

function handleSwipeRight() {
  if (!currentItem.value) return
  pendingItemId.value = currentItem.value.id
  showBoxPicker.value = true
}

async function handleDiscardSelect(status: 'trash' | 'donate' | 'sell') {
  if (!pendingItemId.value) return

  await discardItem(pendingItemId.value, status)
  sessionStreak.value++
  pendingItemId.value = null
  advanceToNext()
}

async function handleBoxSelect(boxId: string) {
  if (!pendingItemId.value) return

  await keepItem(pendingItemId.value, boxId)
  sessionStreak.value++
  pendingItemId.value = null
  advanceToNext()
}

function handleCreateNewBox() {
  showBoxPicker.value = false
  showCreateBox.value = true
}

async function handleCreateBox(name: string) {
  const boxId = await createBox(name)

  if (pendingItemId.value) {
    await keepItem(pendingItemId.value, boxId)
    sessionStreak.value++
    pendingItemId.value = null
    advanceToNext()
  }
}

function advanceToNext() {
  if (currentIndex.value >= unsortedItems.value.length - 1) {
    currentIndex.value = 0
  }
}

function handleCloseDiscardSheet() {
  showDiscardSheet.value = false
  pendingItemId.value = null
}

function handleCloseBoxPicker() {
  showBoxPicker.value = false
  pendingItemId.value = null
}

function handleCloseCreateBox() {
  showCreateBox.value = false
  if (pendingItemId.value) {
    showBoxPicker.value = true
  }
}

function goToAddItems() {
  router.push({ name: 'add' })
}
</script>

<template>
  <div class="flex flex-1 flex-col items-center justify-center gap-6 p-6">
    <div v-if="sessionStreak > 0" class="flex items-center gap-2">
      <span class="text-2xl">🔥</span>
      <span class="text-lg font-semibold text-keep">{{ sessionStreak }} sorted</span>
    </div>

    <div v-if="isLoading" class="flex flex-col items-center gap-4">
      <div class="flex h-64 w-full max-w-sm items-center justify-center rounded-2xl bg-surface">
        <span class="animate-pulse text-text-muted">Loading items...</span>
      </div>
    </div>

    <div v-else-if="currentItem" class="flex w-full flex-col items-center gap-4">
      <SwipeCard
        :key="currentItem.id"
        :photo-path="currentItem.photoPath"
        :name="currentItem.name"
        @swipe-left="handleSwipeLeft"
        @swipe-right="handleSwipeRight"
      />

      <div class="flex items-center gap-4 text-text-muted">
        <span class="flex items-center gap-1">
          <span>←</span>
          <span class="text-sm">Discard</span>
        </span>
        <span class="text-xs">|</span>
        <span class="flex items-center gap-1">
          <span class="text-sm">Keep</span>
          <span>→</span>
        </span>
      </div>
    </div>

    <div v-else class="flex flex-col items-center gap-6 text-center">
      <div class="text-6xl">🎉</div>
      <div>
        <h2 class="text-xl font-semibold">All caught up!</h2>
        <p class="text-text-muted">You've sorted all your items</p>
      </div>
      <button
        class="rounded-xl bg-accent px-6 py-3 font-medium text-white transition-transform active:scale-95"
        @click="goToAddItems"
      >
        Add more items
      </button>
    </div>

    <DiscardSheet
      :open="showDiscardSheet"
      @close="handleCloseDiscardSheet"
      @select="handleDiscardSelect"
    />

    <BoxPickerSheet
      :open="showBoxPicker"
      @close="handleCloseBoxPicker"
      @select="handleBoxSelect"
      @create-new="handleCreateNewBox"
    />

    <CreateBoxModal
      :open="showCreateBox"
      @close="handleCloseCreateBox"
      @create="handleCreateBox"
    />
  </div>
</template>
