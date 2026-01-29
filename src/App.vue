<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppShell from '@/components/AppShell.vue'
import { useTheme } from '@/composables/useTheme'

useTheme()
</script>

<template>
  <AppShell>
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </AppShell>
</template>

<style scoped>
.page-enter-active {
  transition:
    opacity 0.25s ease-out,
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.page-leave-active {
  transition:
    opacity 0.15s ease-in,
    transform 0.2s ease-in;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
