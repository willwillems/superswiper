<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useBoxes } from '@/composables/useBoxes'
import { useFocusTrap, useEscapeKey, useUniqueId } from '@/composables/useAccessibility'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  select: [boxId: string]
  createNew: []
}>()

const sheetRef = ref<HTMLElement | null>(null)
const titleId = useUniqueId('box-picker-title')

const isOpen = toRef(props, 'open')
useFocusTrap(sheetRef, isOpen)
useEscapeKey(isOpen, () => emit('close'))

const { sortedBoxes, isLoading } = useBoxes()

const boxIcons = ['📦', '🏠', '🛋️', '🍳', '🛏️', '🚗', '📚', '🎮'] as const

function handleSelect(boxId: string) {
  emit('select', boxId)
  emit('close')
}

function handleCreateNew() {
  emit('createNew')
}

function handleBackdropClick() {
  emit('close')
}

function getGradientStyle(gradient: number): string {
  const gradients = [
    'linear-gradient(135deg, #f97316, #fb923c)',
    'linear-gradient(135deg, #ec4899, #f472b6)',
    'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    'linear-gradient(135deg, #3b82f6, #60a5fa)',
    'linear-gradient(135deg, #06b6d4, #22d3ee)',
    'linear-gradient(135deg, #10b981, #34d399)',
    'linear-gradient(135deg, #eab308, #facc15)',
    'linear-gradient(135deg, #ef4444, #f87171)',
  ] as const
  return gradients[gradient % gradients.length] ?? gradients[0]
}

function getBoxIcon(gradient: number): string {
  return boxIcons[gradient % boxIcons.length] ?? boxIcons[0]
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        @click="handleBackdropClick"
      />
    </Transition>

    <Transition name="slide-up">
      <div
        v-if="open"
        ref="sheetRef"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        class="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] overflow-y-auto rounded-t-3xl bg-surface p-6 pb-safe"
      >
        <div class="mx-auto mb-4 h-1 w-12 rounded-full bg-text-muted/30" aria-hidden="true" />

        <h2 :id="titleId" class="mb-4 text-center text-lg font-semibold">
          Where does this item belong?
        </h2>

        <div v-if="isLoading" class="flex justify-center py-8" role="status" aria-label="Loading boxes">
          <span class="animate-pulse text-text-muted">Loading boxes...</span>
        </div>

        <div v-else class="flex flex-col gap-3" role="group" aria-label="Available boxes">
          <button
            v-for="box in sortedBoxes"
            :key="box.id"
            :aria-label="`${box.name}, ${box.items?.length ?? 0} items`"
            class="box-option group flex min-h-14 items-center gap-4 rounded-2xl bg-background px-4 py-3 text-left transition-all duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.97]"
            @click="handleSelect(box.id)"
          >
            <span
              class="flex size-11 shrink-0 items-center justify-center rounded-full text-2xl shadow-md transition-transform duration-100 group-active:scale-90"
              :style="{ background: getGradientStyle(box.gradient) }"
              aria-hidden="true"
            >
              {{ getBoxIcon(box.gradient) }}
            </span>
            <span class="flex flex-col">
              <span class="text-lg font-semibold">{{ box.name }}</span>
              <span class="text-sm text-text-muted">
                {{ box.items?.length ?? 0 }} {{ (box.items?.length ?? 0) === 1 ? 'item' : 'items' }}
              </span>
            </span>
          </button>

          <button
            aria-label="Create a new box"
            class="group flex min-h-14 items-center gap-4 rounded-2xl border-2 border-dashed border-text-muted/30 px-4 py-3 text-left transition-all duration-100 hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.97]"
            @click="handleCreateNew"
          >
            <span
              class="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/20 text-2xl transition-transform duration-100 group-active:scale-90 group-hover:bg-accent/30"
              aria-hidden="true"
            >
              ➕
            </span>
            <span class="flex flex-col">
              <span class="text-lg font-semibold text-text-muted group-hover:text-accent">New Box</span>
              <span class="text-sm text-text-muted">Create a new location</span>
            </span>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active {
  transition: opacity 0.25s ease-out;
}

.fade-leave-active {
  transition: opacity 0.2s ease-in;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active {
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
}

.slide-up-leave-active {
  transition: transform 0.25s cubic-bezier(0.32, 0, 0.67, 0);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
