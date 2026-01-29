<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useXpStore } from '@/stores/xpStore'
import BottomNav from '@/components/BottomNav.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import SoundToggle from '@/components/SoundToggle.vue'
import NotificationToggle from '@/components/NotificationToggle.vue'

const route = useRoute()
const router = useRouter()
const { isAuthenticated, logout } = useAuth()
const { formattedTotal } = useXpStore()

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
        <div class="mr-2 flex items-center gap-1 text-sm font-semibold text-accent">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-4"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
              clip-rule="evenodd"
            />
          </svg>
          <span>{{ formattedTotal }}</span>
        </div>
        <NotificationToggle />
        <SoundToggle />
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
