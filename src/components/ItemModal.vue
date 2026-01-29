<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useItems } from '@/composables/useItems'
import { useBoxes } from '@/composables/useBoxes'
import { useToast } from '@/composables/useToast'
import { useImageLoader, type ImageLoadState } from '@/composables/useImageLoader'
import { useFocusTrap, useEscapeKey, useUniqueId } from '@/composables/useAccessibility'
import ImageFallback from '@/components/ImageFallback.vue'

const toast = useToast()

const props = defineProps<{
  open: boolean
  item: {
    id: string
    name: string
    photoPath: string
    status: string
    box?: { id: string; name: string }
  } | null
}>()

const emit = defineEmits<{
  close: []
}>()

const { updateItemName, moveItem } = useItems()
const { sortedBoxes } = useBoxes()

const photoPath = ref('')
const imageUrl = ref<string | null>(null)
const imageState = ref<ImageLoadState>('loading')
const editedName = ref('')
const showDestinationPicker = ref(false)
const isSaving = ref(false)

const modalRef = ref<HTMLElement | null>(null)
const destinationPickerRef = ref<HTMLElement | null>(null)
const modalTitleId = useUniqueId('item-modal-title')
const destinationTitleId = useUniqueId('destination-title')
const nameInputId = useUniqueId('item-name')

useFocusTrap(modalRef, computed(() => props.open && !showDestinationPicker.value))
useEscapeKey(computed(() => props.open && !showDestinationPicker.value), () => emit('close'))

useFocusTrap(destinationPickerRef, showDestinationPicker)
useEscapeKey(showDestinationPicker, () => (showDestinationPicker.value = false))

const discardOptions = [
  { key: 'trash' as const, label: 'Trash', icon: '🗑️' },
  { key: 'donate' as const, label: 'Donate', icon: '🎁' },
  { key: 'sell' as const, label: 'Sell', icon: '💰' },
]

const currentLocation = computed(() => {
  if (!props.item) return ''
  if (props.item.status === 'kept' && props.item.box) {
    return props.item.box.name
  }
  return props.item.status.charAt(0).toUpperCase() + props.item.status.slice(1)
})

const {
  imageUrl: loadedImageUrl,
  state: loadedImageState,
  handleImageLoad,
  handleImageError,
} = useImageLoader(photoPath)

watch(
  () => props.item,
  (item) => {
    if (item) {
      editedName.value = item.name
      photoPath.value = item.photoPath
    }
  },
  { immediate: true }
)

watch(loadedImageUrl, (url) => {
  imageUrl.value = url
})

watch(loadedImageState, (state) => {
  imageState.value = state
})

function handleBackdropClick() {
  emit('close')
}

async function saveName() {
  if (!props.item || editedName.value === props.item.name) return

  isSaving.value = true
  try {
    await updateItemName(props.item.id, editedName.value)
  } catch {
    toast.error('Failed to save name. Please try again.')
  } finally {
    isSaving.value = false
  }
}

async function handleMoveToBox(boxId: string) {
  if (!props.item) return

  isSaving.value = true
  try {
    await moveItem(props.item.id, { boxId })
    showDestinationPicker.value = false
    emit('close')
  } catch {
    toast.error('Failed to move item. Please try again.')
  } finally {
    isSaving.value = false
  }
}

async function handleMoveToCategory(status: 'trash' | 'donate' | 'sell') {
  if (!props.item) return

  isSaving.value = true
  try {
    await moveItem(props.item.id, { status })
    showDestinationPicker.value = false
    emit('close')
  } catch {
    toast.error('Failed to move item. Please try again.')
  } finally {
    isSaving.value = false
  }
}

function getGradientClass(gradient: number): string {
  return `box-gradient-${gradient}`
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open && item"
        class="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
        @click="handleBackdropClick"
      />
    </Transition>

    <Transition name="scale">
      <div
        v-if="open && item"
        ref="modalRef"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="modalTitleId"
        class="fixed inset-4 z-50 flex flex-col overflow-hidden rounded-2xl bg-surface"
      >
        <div class="relative flex-1 overflow-hidden bg-black">
          <img
            v-if="imageUrl && imageState !== 'error'"
            :src="imageUrl"
            :alt="item.name"
            class="h-full w-full object-contain"
            @load="handleImageLoad"
            @error="handleImageError"
          />
          <div
            v-else-if="imageState === 'loading'"
            class="flex h-full items-center justify-center"
            role="status"
            aria-label="Loading image"
          >
            <span class="animate-pulse text-text-muted">Loading...</span>
          </div>
          <ImageFallback v-else size="lg" />

          <button
            class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95"
            aria-label="Close item details"
            @click="emit('close')"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div class="flex flex-col gap-4 p-4">
          <h2 :id="modalTitleId" class="sr-only">Item details for {{ item.name }}</h2>
          <div class="flex flex-col gap-2">
            <label :for="nameInputId" class="text-sm text-text-muted">Name</label>
            <input
              :id="nameInputId"
              v-model="editedName"
              type="text"
              class="rounded-lg bg-background px-4 py-3 text-white outline-none ring-accent focus:ring-2"
              @blur="saveName"
              @keydown.enter="($event.target as HTMLInputElement).blur()"
            />
          </div>

          <div class="flex items-center justify-between">
            <div class="text-sm">
              <span class="text-text-muted">Location: </span>
              <span class="font-medium">{{ currentLocation }}</span>
            </div>
            <button
              class="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95"
              aria-haspopup="dialog"
              :aria-expanded="showDestinationPicker"
              @click="showDestinationPicker = true"
            >
              Move to...
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div
        v-if="showDestinationPicker"
        class="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm"
        @click="showDestinationPicker = false"
      />
    </Transition>

    <Transition name="slide-up">
      <div
        v-if="showDestinationPicker"
        ref="destinationPickerRef"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="destinationTitleId"
        class="fixed inset-x-0 bottom-0 z-70 max-h-[70vh] overflow-y-auto rounded-t-3xl bg-surface p-6 pb-safe"
      >
        <div class="mx-auto mb-4 h-1 w-12 rounded-full bg-text-muted/30" aria-hidden="true" />

        <h2 :id="destinationTitleId" class="mb-4 text-center text-lg font-semibold">Move to...</h2>

        <div v-if="sortedBoxes.length > 0" class="mb-4">
          <h3 class="mb-2 text-sm font-medium text-text-muted">Boxes</h3>
          <div class="grid grid-cols-2 gap-3" role="group" aria-label="Available boxes">
            <button
              v-for="box in sortedBoxes"
              :key="box.id"
              :class="[
                'flex h-16 flex-col items-center justify-center rounded-xl text-white transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-[0.98]',
                getGradientClass(box.gradient),
              ]"
              :disabled="isSaving"
              :aria-label="`Move to ${box.name}`"
              @click="handleMoveToBox(box.id)"
            >
              <span class="font-semibold">{{ box.name }}</span>
            </button>
          </div>
        </div>

        <div>
          <h3 class="mb-2 text-sm font-medium text-text-muted">Discard</h3>
          <div class="flex flex-col gap-2" role="group" aria-label="Discard options">
            <button
              v-for="option in discardOptions"
              :key="option.key"
              class="flex items-center gap-3 rounded-xl bg-background px-4 py-3 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98]"
              :disabled="isSaving"
              :aria-label="`Move to ${option.label}`"
              @click="handleMoveToCategory(option.key)"
            >
              <span aria-hidden="true">{{ option.icon }}</span>
              <span>{{ option.label }}</span>
            </button>
          </div>
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

.scale-enter-active {
  transition:
    opacity 0.25s ease-out,
    transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

.scale-leave-active {
  transition:
    opacity 0.2s ease-in,
    transform 0.2s cubic-bezier(0.32, 0, 0.67, 0);
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
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
