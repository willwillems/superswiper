<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useUpload, type UploadItem } from '@/composables/useUpload'
import { useItems } from '@/composables/useItems'
import { useToast } from '@/composables/useToast'
import { useSound } from '@/composables/useSound'
import UploadProgress from '@/components/UploadProgress.vue'

const {
  uploadImage,
  error: uploadError,
  uploadQueue,
  addToQueue,
  processQueueItem,
  retryFailed,
  clearQueue,
  failedCount,
} = useUpload()
const { createItem } = useItems()
const toast = useToast()
const { playUploadSound } = useSound()

watch(uploadError, (err) => {
  if (err) {
    toast.error(err)
  }
})

const cameraInput = ref<HTMLInputElement | null>(null)
const uploadInput = ref<HTMLInputElement | null>(null)
const itemsAdded = ref(0)
const isCameraProcessing = ref(false)
const isUploadProcessing = ref(false)

const showUploadProgress = computed(() => uploadQueue.value.length > 0)

async function handleCapture(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  isCameraProcessing.value = true
  try {
    const path = await uploadImage(file)
    await createItem(path)
    playUploadSound()
    itemsAdded.value++
  } finally {
    isCameraProcessing.value = false
    input.value = ''
  }
}

async function processUploadQueue(items: UploadItem[]) {
  isUploadProcessing.value = true

  for (const item of items) {
    if (item.status !== 'pending') continue
    try {
      const fileId = await processQueueItem(item)
      await createItem(fileId)
      playUploadSound()
      itemsAdded.value++
    } catch {
      // Error is already captured in the queue item
    }
  }

  isUploadProcessing.value = false
}

async function handleUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files?.length) return

  const items = addToQueue(Array.from(files))
  input.value = ''

  await processUploadQueue(items)
}

async function handleRetryFailed() {
  await retryFailed()
  const pendingItems = uploadQueue.value.filter(
    (item) => item.status === 'pending'
  )
  await processUploadQueue(pendingItems)
}

function handleClearQueue() {
  clearQueue()
}

function triggerCamera() {
  cameraInput.value?.click()
}

function triggerUpload() {
  uploadInput.value?.click()
}
</script>

<template>
  <div class="flex flex-1 flex-col items-center justify-center gap-8 p-6">
    <div class="flex w-full max-w-sm flex-col gap-4">
      <!-- Camera Button -->
      <button
        :disabled="isCameraProcessing"
        class="group flex w-full items-center gap-4 rounded-2xl bg-surface p-5 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
        @click="triggerCamera"
      >
        <div
          class="flex size-16 shrink-0 items-center justify-center rounded-full shadow-md"
          :style="{ background: 'var(--gradient-accent)' }"
        >
          <svg
            v-if="!isCameraProcessing"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-7 text-white"
            aria-hidden="true"
          >
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
          <span v-else class="text-xl text-white animate-pulse">...</span>
        </div>
        <div class="flex flex-col items-start gap-1">
          <span class="text-lg font-semibold text-text-primary">Take Photo</span>
          <span class="text-sm text-text-muted">Snap a quick pic of your item</span>
        </div>
      </button>
      <input
        ref="cameraInput"
        type="file"
        accept="image/*"
        capture="environment"
        class="hidden"
        @change="handleCapture"
      />

      <!-- Upload Button -->
      <button
        :disabled="isUploadProcessing"
        class="group flex w-full items-center gap-4 rounded-2xl bg-surface p-5 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
        @click="triggerUpload"
      >
        <div
          class="flex size-16 shrink-0 items-center justify-center rounded-full shadow-md"
          :style="{ background: 'var(--gradient-keep)' }"
        >
          <svg
            v-if="!isUploadProcessing"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-7 text-white"
            aria-hidden="true"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          <span v-else class="text-xl text-white animate-pulse">...</span>
        </div>
        <div class="flex flex-col items-start gap-1">
          <span class="text-lg font-semibold text-text-primary">Upload Photos</span>
          <span class="text-sm text-text-muted">Select from your gallery</span>
        </div>
      </button>
      <input
        ref="uploadInput"
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        @change="handleUpload"
      />
    </div>

    <p class="max-w-xs text-center text-sm text-text-muted">
      Add items you want to sort. The more you add, the more satisfying the swiping!
    </p>

    <p v-if="uploadError" class="text-sm text-discard">
      {{ uploadError }}
    </p>

    <UploadProgress
      v-if="showUploadProgress"
      :items="uploadQueue"
      :on-retry="failedCount > 0 ? handleRetryFailed : undefined"
      :on-clear="handleClearQueue"
    />

    <div
      v-if="itemsAdded > 0"
      class="rounded-2xl px-5 py-3 text-center shadow-md"
      :style="{ background: 'var(--gradient-keep)' }"
    >
      <span class="font-semibold text-white">
        {{ itemsAdded }} item{{ itemsAdded !== 1 ? 's' : '' }} added!
      </span>
    </div>
  </div>
</template>
