<script setup lang="ts">
import { ref, watch } from 'vue'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  create: [name: string]
}>()

const boxName = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

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
        class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        @click="handleBackdropClick"
      />
    </Transition>

    <Transition name="scale">
      <div
        v-if="open"
        class="fixed inset-x-4 top-1/2 z-50 -translate-y-1/2 rounded-2xl bg-surface p-6"
      >
        <h2 class="mb-4 text-center text-lg font-semibold">Create New Box</h2>

        <input
          ref="inputRef"
          v-model="boxName"
          type="text"
          placeholder="Box name (e.g., Kitchen, Garage)"
          class="mb-4 w-full rounded-xl bg-background px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
          @keydown="handleKeydown"
        />

        <div class="flex gap-3">
          <button
            class="flex-1 rounded-xl bg-background px-4 py-3 font-medium text-text-muted transition-all hover:bg-background/80 active:scale-95"
            @click="handleBackdropClick"
          >
            Cancel
          </button>
          <button
            :disabled="!boxName.trim()"
            class="flex-1 rounded-xl bg-accent px-4 py-3 font-medium text-white transition-all hover:bg-accent-light active:scale-95 disabled:opacity-50"
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
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: translateY(-50%) scale(0.95);
}
</style>
