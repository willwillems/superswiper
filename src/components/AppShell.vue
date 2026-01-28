<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import BottomNav from '@/components/BottomNav.vue'

const route = useRoute()
const router = useRouter()
const { isAuthenticated, logout } = useAuth()

const showNav = computed(() => isAuthenticated.value && route.name !== 'auth')
const showHeader = computed(() => isAuthenticated.value && route.name !== 'auth')

async function handleLogout() {
  await logout()
  router.replace({ name: 'auth' })
}
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <header
      v-if="showHeader"
      class="flex items-center justify-between px-4 pt-safe"
    >
      <h1 class="py-3 text-lg font-bold">SuperSwiper</h1>
      <button
        class="rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:bg-surface hover:text-text-primary"
        @click="handleLogout"
      >
        Logout
      </button>
    </header>

    <main class="flex flex-1 flex-col">
      <slot />
    </main>

    <BottomNav v-if="showNav" />
  </div>
</template>
