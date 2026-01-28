<script setup lang="ts">
import { useToast, type Toast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()

function getTypeClasses(type: Toast['type']): string {
  switch (type) {
    case 'success':
      return 'bg-keep text-white'
    case 'error':
      return 'bg-discard text-white'
    case 'info':
      return 'bg-surface text-text-primary'
  }
}

function getIcon(type: Toast['type']): string {
  switch (type) {
    case 'success':
      return '✓'
    case 'error':
      return '!'
    case 'info':
      return 'ℹ'
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="pointer-events-none fixed inset-x-0 top-0 z-[100] flex flex-col items-center gap-2 p-4 pt-safe">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg"
          :class="getTypeClasses(toast.type)"
          @click="removeToast(toast.id)"
        >
          <span class="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
            {{ getIcon(toast.type) }}
          </span>
          <span class="text-sm font-medium">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.2s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
