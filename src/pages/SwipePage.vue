<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useItems } from '@/composables/useItems'
import { useBoxes } from '@/composables/useBoxes'
import { useStreak } from '@/composables/useStreak'
import SwipeCard from '@/components/SwipeCard.vue'
import DiscardSheet from '@/components/DiscardSheet.vue'
import BoxPickerSheet from '@/components/BoxPickerSheet.vue'
import CreateBoxModal from '@/components/CreateBoxModal.vue'
import ConfettiExplosion from '@/components/ConfettiExplosion.vue'
import EmptyState from '@/components/EmptyState.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'

const router = useRouter()
const { unsortedItems, isLoading, discardItem, keepItem } = useItems()
const { createBox } = useBoxes()
const { sessionStreak, shouldTriggerConfetti, incrementStreak, clearConfettiTrigger } = useStreak()

const currentIndex = ref(0)
const showDiscardSheet = ref(false)
const showBoxPicker = ref(false)
const showCreateBox = ref(false)
const pendingItemId = ref<string | null>(null)

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
  incrementStreak()
  pendingItemId.value = null
  advanceToNext()
}

async function handleBoxSelect(boxId: string) {
  if (!pendingItemId.value) return

  await keepItem(pendingItemId.value, boxId)
  incrementStreak()
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
    incrementStreak()
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

    <div v-if="isLoading" class="flex w-full max-w-sm flex-col items-center gap-4">
      <div class="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-surface">
        <SkeletonLoader width="100%" height="100%" rounded="2xl" />
        <div class="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4">
          <SkeletonLoader width="60%" height="1.5rem" rounded="lg" />
          <SkeletonLoader width="40%" height="1rem" rounded="lg" />
        </div>
      </div>
      <div class="flex items-center gap-4">
        <SkeletonLoader width="4rem" height="1rem" rounded="lg" />
        <SkeletonLoader width="0.5rem" height="0.5rem" rounded="full" />
        <SkeletonLoader width="4rem" height="1rem" rounded="lg" />
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

    <EmptyState
      v-else
      icon="🎉"
      title="All caught up!"
      description="You've sorted all your items"
      action-label="Add more items"
      @action="goToAddItems"
    />

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

    <ConfettiExplosion
      :trigger="shouldTriggerConfetti"
      @complete="clearConfettiTrigger"
    />
  </div>
</template>
