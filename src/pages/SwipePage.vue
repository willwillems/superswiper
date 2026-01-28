<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useItems } from '@/composables/useItems'
import { useBoxes } from '@/composables/useBoxes'
import { useStreak } from '@/composables/useStreak'
import { useToast } from '@/composables/useToast'
import SwipeCard from '@/components/SwipeCard.vue'
import SwipeCardBackground from '@/components/SwipeCardBackground.vue'
import DiscardSheet from '@/components/DiscardSheet.vue'
import BoxPickerSheet from '@/components/BoxPickerSheet.vue'
import CreateBoxModal from '@/components/CreateBoxModal.vue'
import ConfettiExplosion from '@/components/ConfettiExplosion.vue'
import EmptyState from '@/components/EmptyState.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'

const router = useRouter()
const { unsortedItems, isLoading, error: itemsError, discardItem, keepItem } = useItems()
const { createBox, error: boxesError } = useBoxes()
const { sessionStreak, shouldTriggerConfetti, incrementStreak, clearConfettiTrigger } = useStreak()
const toast = useToast()

watch(itemsError, (err) => {
  if (err?.message) toast.error(err.message)
})

watch(boxesError, (err) => {
  if (err?.message) toast.error(err.message)
})

const currentIndex = ref(0)
const showDiscardSheet = ref(false)
const showBoxPicker = ref(false)
const showCreateBox = ref(false)
const pendingItemId = ref<string | null>(null)
const isProcessing = ref(false)

const currentItem = computed(() => unsortedItems.value[currentIndex.value])

// Show up to 3 cards in the stack for visual depth
const stackedCards = computed(() =>
  unsortedItems.value.slice(currentIndex.value, currentIndex.value + 3),
)

// Background cards in the stack (excluding current card)
const backgroundCards = computed(() => stackedCards.value.slice(1))

function handleSwipeLeft() {
  if (!currentItem.value || isProcessing.value) return
  isProcessing.value = true
  pendingItemId.value = currentItem.value.id
  showDiscardSheet.value = true
}

function handleSwipeRight() {
  if (!currentItem.value || isProcessing.value) return
  isProcessing.value = true
  pendingItemId.value = currentItem.value.id
  showBoxPicker.value = true
}

async function handleDiscardSelect(status: 'trash' | 'donate' | 'sell') {
  if (!pendingItemId.value) return

  try {
    await discardItem(pendingItemId.value, status)
    incrementStreak()
    advanceToNext()
  } catch {
    toast.error('Failed to sort item. Please try again.')
  } finally {
    pendingItemId.value = null
    isProcessing.value = false
  }
}

async function handleBoxSelect(boxId: string) {
  if (!pendingItemId.value) return

  try {
    await keepItem(pendingItemId.value, boxId)
    incrementStreak()
    advanceToNext()
  } catch {
    toast.error('Failed to sort item. Please try again.')
  } finally {
    pendingItemId.value = null
    isProcessing.value = false
  }
}

function handleCreateNewBox() {
  showBoxPicker.value = false
  showCreateBox.value = true
}

async function handleCreateBox(name: string) {
  try {
    const boxId = await createBox(name)

    if (pendingItemId.value) {
      await keepItem(pendingItemId.value, boxId)
      incrementStreak()
      advanceToNext()
    }
  } catch {
    toast.error('Failed to create box. Please try again.')
  } finally {
    pendingItemId.value = null
    isProcessing.value = false
  }
}

function advanceToNext() {
  // The sorted item will be filtered out by the subscription, so just ensure
  // the index stays within bounds. After the subscription updates, the array
  // length decreases by 1, so if we're at the last item, we need to go back.
  if (currentIndex.value >= unsortedItems.value.length - 1) {
    currentIndex.value = Math.max(0, unsortedItems.value.length - 2)
  }
}

function handleCloseDiscardSheet() {
  showDiscardSheet.value = false
  pendingItemId.value = null
  isProcessing.value = false
}

function handleCloseBoxPicker() {
  showBoxPicker.value = false
  pendingItemId.value = null
  isProcessing.value = false
}

function handleCloseCreateBox() {
  showCreateBox.value = false
  if (pendingItemId.value) {
    showBoxPicker.value = true
  } else {
    isProcessing.value = false
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
      <div class="relative w-full max-w-sm">
        <!-- Background cards for stack visual depth (rendered back-to-front) -->
        <SwipeCardBackground
          v-for="(item, index) in backgroundCards.slice().reverse()"
          :key="item.id"
          :photo-path="item.photoPath"
          :stack-index="backgroundCards.length - index"
        />

        <!-- Current (top) card - interactive -->
        <SwipeCard
          :key="currentItem.id"
          :photo-path="currentItem.photoPath"
          :name="currentItem.name"
          @swipe-left="handleSwipeLeft"
          @swipe-right="handleSwipeRight"
        />
      </div>

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
