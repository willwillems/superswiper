<script setup lang="ts">
import type { ItemStatus } from '@/composables/useItems'

type DiscardStatus = Extract<ItemStatus, 'trash' | 'donate' | 'sell'>

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  select: [status: DiscardStatus]
}>()

const options: { status: DiscardStatus; label: string; icon: string }[] = [
  { status: 'trash', label: 'Trash', icon: '🗑️' },
  { status: 'donate', label: 'Donate', icon: '🎁' },
  { status: 'sell', label: 'Sell', icon: '💰' },
]

function handleSelect(status: DiscardStatus) {
  emit('select', status)
  emit('close')
}

function handleBackdropClick() {
  emit('close')
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
        class="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-surface p-6 pb-safe"
      >
        <div class="mx-auto mb-4 h-1 w-12 rounded-full bg-text-muted/30" />

        <h2 class="mb-4 text-center text-lg font-semibold">
          What do you want to do with this item?
        </h2>

        <div class="flex flex-col gap-3">
          <button
            v-for="option in options"
            :key="option.status"
            class="flex items-center gap-4 rounded-xl bg-background px-4 py-4 text-left transition-transform active:scale-[0.98]"
            @click="handleSelect(option.status)"
          >
            <span class="text-2xl">{{ option.icon }}</span>
            <span class="text-lg font-medium">{{ option.label }}</span>
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
