<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUpload } from '@/composables/useUpload'
import { useItems } from '@/composables/useItems'
import { useToast } from '@/composables/useToast'

type Mode = 'camera' | 'upload'

const mode = ref<Mode>('camera')
const { uploadImage, error: uploadError } = useUpload()
const { createItem } = useItems()
const toast = useToast()

watch(uploadError, (err) => {
  if (err) {
    toast.error(err)
  }
})

const cameraInput = ref<HTMLInputElement | null>(null)
const uploadInput = ref<HTMLInputElement | null>(null)
const itemsAdded = ref(0)
const isProcessing = ref(false)
const pendingUploads = ref(0)

async function handleCapture(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  isProcessing.value = true
  try {
    const path = await uploadImage(file)
    await createItem(path)
    itemsAdded.value++
  } finally {
    isProcessing.value = false
    input.value = ''
  }
}

async function handleUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files?.length) return

  pendingUploads.value = files.length
  isProcessing.value = true

  for (const file of Array.from(files)) {
    try {
      const path = await uploadImage(file)
      await createItem(path)
      itemsAdded.value++
    } finally {
      pendingUploads.value--
    }
  }

  isProcessing.value = false
  input.value = ''
}

function triggerCamera() {
  cameraInput.value?.click()
}

function triggerUpload() {
  uploadInput.value?.click()
}
</script>

<template>
  <div class="flex flex-1 flex-col gap-6 p-6">
    <div class="flex gap-2">
      <button
        :class="[
          'flex-1 rounded-xl py-3 text-sm font-medium transition-all active:scale-95',
          mode === 'camera'
            ? 'bg-accent text-white'
            : 'bg-surface text-text-muted',
        ]"
        @click="mode = 'camera'"
      >
        Camera
      </button>
      <button
        :class="[
          'flex-1 rounded-xl py-3 text-sm font-medium transition-all active:scale-95',
          mode === 'upload'
            ? 'bg-accent text-white'
            : 'bg-surface text-text-muted',
        ]"
        @click="mode = 'upload'"
      >
        Upload
      </button>
    </div>

    <div class="flex flex-1 flex-col items-center justify-center gap-6">
      <template v-if="mode === 'camera'">
        <p class="text-center text-text-muted">
          Take a photo of an item to add it
        </p>
        <button
          :disabled="isProcessing"
          class="flex h-32 w-32 items-center justify-center rounded-full bg-accent text-5xl text-white shadow-lg transition-transform active:scale-95 disabled:opacity-50"
          @click="triggerCamera"
        >
          <span v-if="isProcessing" class="animate-pulse">...</span>
          <span v-else>📷</span>
        </button>
        <input
          ref="cameraInput"
          type="file"
          accept="image/*"
          capture="environment"
          class="hidden"
          @change="handleCapture"
        />
      </template>

      <template v-else>
        <p class="text-center text-text-muted">
          Select photos from your library
        </p>
        <button
          :disabled="isProcessing"
          class="flex h-32 w-32 items-center justify-center rounded-full bg-accent text-5xl text-white shadow-lg transition-transform active:scale-95 disabled:opacity-50"
          @click="triggerUpload"
        >
          <span v-if="isProcessing" class="animate-pulse">...</span>
          <span v-else>📁</span>
        </button>
        <input
          ref="uploadInput"
          type="file"
          accept="image/*"
          multiple
          class="hidden"
          @change="handleUpload"
        />
        <p v-if="pendingUploads > 0" class="text-sm text-text-muted">
          {{ pendingUploads }} remaining...
        </p>
      </template>

      <p v-if="uploadError" class="text-sm text-discard">
        {{ uploadError }}
      </p>
    </div>

    <div
      v-if="itemsAdded > 0"
      class="rounded-xl bg-keep/20 px-4 py-3 text-center"
    >
      <span class="text-keep">{{ itemsAdded }} item{{ itemsAdded !== 1 ? 's' : '' }} added this session</span>
    </div>
  </div>
</template>
