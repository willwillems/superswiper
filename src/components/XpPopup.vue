<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import type { XpActionType } from '@/stores/xpStore'

interface Props {
  amount: number | null
  action: XpActionType | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  complete: []
}>()

const isVisible = ref(false)
const displayAmount = ref(0)
const displayAction = ref<XpActionType | null>(null)

let timeoutId: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.amount,
  (newAmount) => {
    if (newAmount && newAmount > 0) {
      displayAmount.value = newAmount
      displayAction.value = props.action
      isVisible.value = true

      if (timeoutId) clearTimeout(timeoutId)

      timeoutId = setTimeout(() => {
        isVisible.value = false
        emit('complete')
      }, 600)
    }
  }
)

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<template>
  <Transition :name="displayAction === 'keep' ? 'xp-popup-right' : 'xp-popup-left'">
    <div
      v-if="isVisible"
      class="pointer-events-none absolute inset-x-0 top-0 flex justify-center"
      aria-live="polite"
    >
      <span
        class="rounded-full px-4 py-1.5 text-lg font-bold shadow-lg"
        :class="[
          displayAction === 'keep'
            ? 'bg-keep/30 text-keep shadow-keep/20'
            : 'bg-discard/30 text-discard shadow-discard/20',
        ]"
      >
        +{{ displayAmount }} XP
      </span>
    </div>
  </Transition>
</template>

<style scoped>
.xp-popup-right-enter-active,
.xp-popup-left-enter-active {
  animation-duration: 700ms;
  animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
  animation-fill-mode: forwards;
}

.xp-popup-right-enter-active {
  animation-name: xp-float-right;
}

.xp-popup-left-enter-active {
  animation-name: xp-float-left;
}

.xp-popup-right-leave-active,
.xp-popup-left-leave-active {
  animation-duration: 200ms;
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;
}

.xp-popup-right-leave-active {
  animation-name: xp-fade-right;
}

.xp-popup-left-leave-active {
  animation-name: xp-fade-left;
}

@keyframes xp-float-right {
  0% {
    opacity: 0;
    transform: translateY(20px) translateX(-10px) scale(0.8);
  }
  20% {
    opacity: 1;
    transform: translateY(0) translateX(0) scale(1.1);
  }
  100% {
    opacity: 0;
    transform: translateY(-60px) translateX(20px) scale(0.9);
  }
}

@keyframes xp-float-left {
  0% {
    opacity: 0;
    transform: translateY(20px) translateX(10px) scale(0.8);
  }
  20% {
    opacity: 1;
    transform: translateY(0) translateX(0) scale(1.1);
  }
  100% {
    opacity: 0;
    transform: translateY(-60px) translateX(-20px) scale(0.9);
  }
}

@keyframes xp-fade-right {
  to {
    opacity: 0;
    transform: translateY(-20px) translateX(10px);
  }
}

@keyframes xp-fade-left {
  to {
    opacity: 0;
    transform: translateY(-20px) translateX(-10px);
  }
}
</style>
