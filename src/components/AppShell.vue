<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import BottomNav from '@/components/BottomNav.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

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
  <ToastContainer />
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-white"
  >
    Skip to main content
  </a>
  <div class="flex min-h-dvh flex-col">
    <header
      v-if="showHeader"
      class="flex items-center justify-between px-4 pt-safe"
      role="banner"
    >
      <h1 class="py-3 text-lg font-bold">SuperSwiper</h1>
      <div class="flex items-center gap-1">
        <ThemeToggle />
        <button
          class="rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:bg-surface hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Log out of your account"
          @click="handleLogout"
        >
          Logout
        </button>
      </div>
    </header>

    <main id="main-content" class="flex flex-1 flex-col" role="main">
      <slot />
    </main>

    <BottomNav v-if="showNav" />
  </div>
</template>
