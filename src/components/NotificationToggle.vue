<script setup lang="ts">
import { useNotifications } from '@/composables/useNotifications'
import { useToast } from '@/composables/useToast'

const {
  notificationsEnabled,
  isSupported,
  isDenied,
  isRegistering,
  toggleNotifications,
} = useNotifications()
const { success, error } = useToast()

async function handleToggle() {
  if (!isSupported.value) {
    error('Notifications are not supported in this browser')
    return
  }

  if (isDenied.value) {
    error('Notifications are blocked. Please enable them in your browser settings.')
    return
  }

  const enabled = await toggleNotifications()
  if (enabled) {
    success('Reminders enabled! We\'ll nudge you to declutter.')
  }
}
</script>

<template>
  <button
    v-if="isSupported"
    class="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
    :aria-label="notificationsEnabled ? 'Disable reminder notifications' : 'Enable reminder notifications'"
    :disabled="isRegistering"
    @click="handleToggle"
  >
    <svg
      v-if="isRegistering"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      class="size-5 animate-spin"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke-width="2" stroke-dasharray="31.4 31.4" />
    </svg>
    <svg
      v-else-if="notificationsEnabled"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="size-5"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
        clip-rule="evenodd"
      />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="size-5"
      aria-hidden="true"
    >
      <path
        d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM20.57 16.476c-.223.082-.448.161-.674.238L7.319 4.137A6.75 6.75 0 0 1 18.75 9v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206Z"
      />
      <path
        d="M5.25 9c0-.184.007-.366.022-.546l10.384 10.384a3.751 3.751 0 0 1-7.396-1.119 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Z"
      />
    </svg>
  </button>
</template>
