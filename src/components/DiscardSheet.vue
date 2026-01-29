<script setup lang="ts">
import { ref, toRef } from 'vue'
import type { ItemStatus } from '@/composables/useItems'
import { useFocusTrap, useEscapeKey, useUniqueId } from '@/composables/useAccessibility'

type DiscardStatus = Extract<ItemStatus, 'trash' | 'donate' | 'sell'>

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  select: [status: DiscardStatus]
}>()

const sheetRef = ref<HTMLElement | null>(null)
const titleId = useUniqueId('discard-sheet-title')

const isOpen = toRef(props, 'open')
useFocusTrap(sheetRef, isOpen)
useEscapeKey(isOpen, () => emit('close'))

interface DiscardOption {
  status: DiscardStatus
  label: string
  icon: string
  gradient: string
  iconBgClass: string
}

const options: DiscardOption[] = [
  {
    status: 'trash',
    label: 'Trash',
    icon: '🗑️',
    gradient: 'linear-gradient(135deg, #6b7280, #9ca3af)',
    iconBgClass: 'bg-gray-500/20',
  },
  {
    status: 'donate',
    label: 'Donate',
    icon: '🎁',
    gradient: 'linear-gradient(135deg, #f97316, #fb923c)',
    iconBgClass: 'bg-orange-500/20',
  },
  {
    status: 'sell',
    label: 'Sell',
    icon: '💰',
    gradient: 'linear-gradient(135deg, #14b8a6, #2dd4bf)',
    iconBgClass: 'bg-teal-500/20',
  },
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
        class="fixed inset-0 z-40 bg-backdrop backdrop-blur-sm"
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
        class="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-surface p-6 pb-safe"
      >
        <div class="mx-auto mb-4 h-1 w-12 rounded-full bg-text-muted/30" aria-hidden="true" />

        <h2 :id="titleId" class="mb-4 text-center text-lg font-semibold">
          What do you want to do with this item?
        </h2>

        <div class="flex flex-col gap-3" role="group" aria-label="Discard options">
          <button
            v-for="option in options"
            :key="option.status"
            :aria-label="`${option.label} this item`"
            class="discard-option group flex min-h-14 items-center gap-4 rounded-2xl bg-background px-4 py-3 text-left transition-all duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.97]"
            @click="handleSelect(option.status)"
          >
            <span
              class="flex size-11 shrink-0 items-center justify-center rounded-full text-2xl shadow-md transition-transform duration-100 group-active:scale-90"
              :class="option.iconBgClass"
              :style="{ background: option.gradient }"
              aria-hidden="true"
            >
              {{ option.icon }}
            </span>
            <span class="text-lg font-semibold">{{ option.label }}</span>
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
