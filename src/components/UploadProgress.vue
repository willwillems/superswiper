<script setup lang="ts">
import type { UploadItem, UploadStatus } from '@/composables/useUpload'

defineProps<{
  items: UploadItem[]
  onRetry?: () => void
  onClear?: () => void
}>()

function getStatusLabel(status: UploadStatus): string {
  switch (status) {
    case 'pending':
      return 'Waiting'
    case 'compressing':
      return 'Compressing'
    case 'uploading':
      return 'Uploading'
    case 'success':
      return 'Done'
    case 'failed':
      return 'Failed'
  }
}

function getStatusClasses(status: UploadStatus): string {
  switch (status) {
    case 'pending':
      return 'bg-text-muted/20 text-text-muted'
    case 'compressing':
    case 'uploading':
      return 'bg-accent/20 text-accent'
    case 'success':
      return 'bg-keep/20 text-keep'
    case 'failed':
      return 'bg-discard/20 text-discard'
  }
}

function truncateFilename(name: string, maxLength = 20): string {
  if (name.length <= maxLength) return name
  const ext = name.lastIndexOf('.') > 0 ? name.slice(name.lastIndexOf('.')) : ''
  const base = name.slice(0, name.length - ext.length)
  const truncatedBase = base.slice(0, maxLength - ext.length - 3)
  return `${truncatedBase}...${ext}`
}
</script>

<template>
  <div class="flex flex-col gap-3 rounded-2xl bg-surface p-4">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-text-primary">
        Upload Progress
      </span>
      <div v-if="onClear" class="flex gap-2">
        <button
          class="text-xs text-text-muted transition-colors hover:text-text-primary"
          aria-label="Clear upload list"
          @click="onClear"
        >
          Clear
        </button>
      </div>
    </div>

    <div class="flex max-h-48 flex-col gap-2 overflow-y-auto">
      <TransitionGroup name="item">
        <div
          v-for="item in items"
          :key="item.id"
          class="flex items-center gap-3 rounded-xl bg-background/50 px-3 py-2"
        >
          <div
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm"
            :class="getStatusClasses(item.status)"
            role="status"
            :aria-label="getStatusLabel(item.status)"
          >
            <span v-if="item.status === 'pending'" class="text-xs" aria-hidden="true">⏳</span>
            <span
              v-else-if="item.status === 'compressing' || item.status === 'uploading'"
              class="animate-spin text-xs"
              aria-hidden="true"
            >
              ⟳
            </span>
            <span v-else-if="item.status === 'success'" class="text-xs" aria-hidden="true">✓</span>
            <span v-else-if="item.status === 'failed'" class="text-xs" aria-hidden="true">✕</span>
          </div>

          <div class="flex min-w-0 flex-1 flex-col">
            <span class="truncate text-sm text-text-primary">
              {{ truncateFilename(item.file.name) }}
            </span>
            <span class="text-xs text-text-muted">
              {{ getStatusLabel(item.status) }}
              <template v-if="item.error"> - {{ item.error }}</template>
            </span>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <button
      v-if="items.some((item) => item.status === 'failed') && onRetry"
      class="flex items-center justify-center gap-2 rounded-xl bg-discard/20 py-2 text-sm font-medium text-discard transition-all active:scale-95"
      aria-label="Retry failed uploads"
      @click="onRetry"
    >
      <span aria-hidden="true">⟳</span>
      Retry Failed
    </button>
  </div>
</template>

<style scoped>
.item-enter-active {
  transition: all 0.3s ease-out;
}

.item-leave-active {
  transition: all 0.2s ease-in;
}

.item-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.item-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.item-move {
  transition: transform 0.3s ease;
}
</style>
