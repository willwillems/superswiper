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

function getGradientClass(gradient: number): string {
  return `box-gradient-${gradient}`
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

        <div v-else class="grid grid-cols-2 gap-3" role="group" aria-label="Available boxes">
          <button
            v-for="box in sortedBoxes"
            :key="box.id"
            :aria-label="`${box.name}, ${box.items?.length ?? 0} items`"
            :class="[
              'flex h-24 flex-col items-center justify-center rounded-xl text-white transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-[0.98]',
              getGradientClass(box.gradient),
            ]"
            @click="handleSelect(box.id)"
          >
            <span class="font-semibold">{{ box.name }}</span>
            <span class="text-sm text-white/70">
              {{ box.items?.length ?? 0 }} items
            </span>
          </button>

          <button
            aria-label="Create a new box"
            class="flex h-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-text-muted/30 text-text-muted transition-all hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
            @click="handleCreateNew"
          >
            <span class="text-2xl" aria-hidden="true">+</span>
            <span class="text-sm font-medium">New Box</span>
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
