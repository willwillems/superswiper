<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useUpload } from '@/composables/useUpload'
import { useItems } from '@/composables/useItems'
import { useBoxes } from '@/composables/useBoxes'

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

const { getImageUrl } = useUpload()
const { updateItemName, moveItem } = useItems()
const { sortedBoxes } = useBoxes()

const imageUrl = ref<string | null>(null)
const editedName = ref('')
const showDestinationPicker = ref(false)
const isSaving = ref(false)

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

watch(
  () => props.item,
  async (item) => {
    if (item) {
      editedName.value = item.name
      imageUrl.value = await getImageUrl(item.photoPath)
    }
  },
  { immediate: true }
)

function handleBackdropClick() {
  emit('close')
}

async function saveName() {
  if (!props.item || editedName.value === props.item.name) return

  isSaving.value = true
  try {
    await updateItemName(props.item.id, editedName.value)
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
        class="fixed inset-4 z-50 flex flex-col overflow-hidden rounded-2xl bg-surface"
      >
        <div class="relative flex-1 overflow-hidden">
          <img
            v-if="imageUrl"
            :src="imageUrl"
            :alt="item.name"
            class="h-full w-full object-contain bg-black"
          />
          <div v-else class="flex h-full items-center justify-center bg-black">
            <span class="animate-pulse text-text-muted">Loading...</span>
          </div>

          <button
            class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-transform active:scale-95"
            @click="emit('close')"
          >
            ×
          </button>
        </div>

        <div class="flex flex-col gap-4 p-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm text-text-muted">Name</label>
            <input
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
              class="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-transform active:scale-95"
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
        class="fixed inset-x-0 bottom-0 z-70 max-h-[70vh] overflow-y-auto rounded-t-3xl bg-surface p-6 pb-safe"
      >
        <div class="mx-auto mb-4 h-1 w-12 rounded-full bg-text-muted/30" />

        <h2 class="mb-4 text-center text-lg font-semibold">Move to...</h2>

        <div v-if="sortedBoxes.length > 0" class="mb-4">
          <h3 class="mb-2 text-sm font-medium text-text-muted">Boxes</h3>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="box in sortedBoxes"
              :key="box.id"
              :class="[
                'flex h-16 flex-col items-center justify-center rounded-xl text-white transition-transform active:scale-[0.98]',
                getGradientClass(box.gradient),
              ]"
              :disabled="isSaving"
              @click="handleMoveToBox(box.id)"
            >
              <span class="font-semibold">{{ box.name }}</span>
            </button>
          </div>
        </div>

        <div>
          <h3 class="mb-2 text-sm font-medium text-text-muted">Discard</h3>
          <div class="flex flex-col gap-2">
            <button
              v-for="option in discardOptions"
              :key="option.key"
              class="flex items-center gap-3 rounded-xl bg-background px-4 py-3 transition-transform active:scale-[0.98]"
              :disabled="isSaving"
              @click="handleMoveToCategory(option.key)"
            >
              <span>{{ option.icon }}</span>
              <span>{{ option.label }}</span>
            </button>
          </div>
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

.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
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
