<script setup lang="ts">
import { ref, watch, toRef } from 'vue'
import { useFocusTrap, useEscapeKey, useUniqueId } from '@/composables/useAccessibility'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  create: [name: string]
}>()

const boxName = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const modalRef = ref<HTMLElement | null>(null)
const titleId = useUniqueId('create-box-title')
const inputId = useUniqueId('box-name-input')

const isOpen = toRef(props, 'open')
useFocusTrap(modalRef, isOpen)
useEscapeKey(isOpen, () => emit('close'))

watch(
  () => inputRef.value,
  (input) => {
    if (input) {
      input.focus()
    }
  }
)

function handleSubmit() {
  const name = boxName.value.trim()
  if (!name) return

  emit('create', name)
  boxName.value = ''
  emit('close')
}

function handleBackdropClick() {
  emit('close')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    handleSubmit()
  }
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

    <Transition name="scale">
      <div
        v-if="open"
        ref="modalRef"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        class="fixed inset-x-4 top-1/2 z-50 -translate-y-1/2 rounded-2xl bg-surface p-6"
      >
        <h2 :id="titleId" class="mb-4 text-center text-lg font-semibold">Create New Box</h2>

        <label :for="inputId" class="sr-only">Box name</label>
        <input
          :id="inputId"
          ref="inputRef"
          v-model="boxName"
          type="text"
          placeholder="Box name (e.g., Kitchen, Garage)"
          class="mb-4 w-full rounded-xl bg-background px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
          @keydown="handleKeydown"
        />

        <div class="flex gap-3">
          <button
            class="flex-1 rounded-xl bg-background px-4 py-3 font-medium text-text-muted transition-all hover:bg-background/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
            @click="handleBackdropClick"
          >
            Cancel
          </button>
          <button
            :disabled="!boxName.trim()"
            :aria-disabled="!boxName.trim()"
            class="flex-1 rounded-xl bg-accent px-4 py-3 font-medium text-white transition-all hover:bg-accent-light focus:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95 disabled:opacity-50"
            @click="handleSubmit"
          >
            Create
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
  transform: translateY(-50%) scale(0.95);
}
</style>
