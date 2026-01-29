<script setup lang="ts">
import { computed } from 'vue'
import { useShare, type ShareableCategory } from '@/composables/useShare'
import type { Item } from '@/composables/useItems'

const props = defineProps<{
  open: boolean
  items: Item[]
  category: ShareableCategory
}>()

const emit = defineEmits<{
  close: []
}>()

const { shareItems, canUseNativeShare } = useShare()

const title = computed(() =>
  props.category === 'donate' ? 'Share Donate List' : 'Share Sell List'
)

const itemCount = computed(() => props.items.length)

async function handleShare(method: 'native' | 'copy') {
  await shareItems(props.items, props.category, method)
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

        <h2 class="mb-2 text-center text-lg font-semibold">{{ title }}</h2>
        <p class="mb-4 text-center text-sm text-text-muted">
          {{ itemCount }} item{{ itemCount === 1 ? '' : 's' }}
        </p>

        <div class="flex flex-col gap-3">
          <button
            v-if="canUseNativeShare"
            class="flex items-center gap-4 rounded-xl bg-background px-4 py-4 text-left transition-transform active:scale-[0.98]"
            @click="handleShare('native')"
          >
            <span class="text-2xl">📤</span>
            <span class="text-lg font-medium">Share</span>
          </button>

          <button
            class="flex items-center gap-4 rounded-xl bg-background px-4 py-4 text-left transition-transform active:scale-[0.98]"
            @click="handleShare('copy')"
          >
            <span class="text-2xl">📋</span>
            <span class="text-lg font-medium">Copy to Clipboard</span>
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
