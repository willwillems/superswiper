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
  <Transition name="xp-popup">
    <div
      v-if="isVisible"
      class="pointer-events-none absolute inset-x-0 top-0 flex justify-center"
      aria-live="polite"
    >
      <span
        class="rounded-full px-3 py-1 text-lg font-bold"
        :class="[
          displayAction === 'keep' ? 'bg-keep/20 text-keep' : 'bg-discard/20 text-discard',
        ]"
      >
        +{{ displayAmount }} XP
      </span>
    </div>
  </Transition>
</template>

<style scoped>
.xp-popup-enter-active {
  animation: xp-float 600ms ease-out forwards;
}

.xp-popup-leave-active {
  animation: xp-float 600ms ease-out forwards;
}

@keyframes xp-float {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-50px);
  }
}
</style>
