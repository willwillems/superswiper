<script setup lang="ts">
import { useBoxes } from '@/composables/useBoxes'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  select: [boxId: string]
  createNew: []
}>()

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
        class="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] overflow-y-auto rounded-t-3xl bg-surface p-6 pb-safe"
      >
        <div class="mx-auto mb-4 h-1 w-12 rounded-full bg-text-muted/30" />

        <h2 class="mb-4 text-center text-lg font-semibold">
          Where does this item belong?
        </h2>

        <div v-if="isLoading" class="flex justify-center py-8">
          <span class="animate-pulse text-text-muted">Loading boxes...</span>
        </div>

        <div v-else class="grid grid-cols-2 gap-3">
          <button
            v-for="box in sortedBoxes"
            :key="box.id"
            :class="[
              'flex h-24 flex-col items-center justify-center rounded-xl text-white transition-transform active:scale-[0.98]',
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
            class="flex h-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-text-muted/30 text-text-muted transition-all hover:border-accent hover:text-accent active:scale-95"
            @click="handleCreateNew"
          >
            <span class="text-2xl">+</span>
            <span class="text-sm font-medium">New Box</span>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
