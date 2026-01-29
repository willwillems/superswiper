<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { sendMagicCode, verifyMagicCode, signInAsGuest, error, clearError } = useAuth()

const step = ref<'email' | 'code'>('email')
const email = ref('')
const code = ref('')
const isSubmitting = ref(false)

async function handleEmailSubmit() {
  if (!email.value.trim()) return
  isSubmitting.value = true
  try {
    await sendMagicCode(email.value)
    step.value = 'code'
  } catch {
    // error is set by useAuth
  } finally {
    isSubmitting.value = false
  }
}

async function handleCodeSubmit() {
  if (!code.value.trim()) return
  isSubmitting.value = true
  try {
    await verifyMagicCode(email.value, code.value)
    router.replace({ name: 'swipe' })
  } catch {
    // error is set by useAuth
  } finally {
    isSubmitting.value = false
  }
}

function handleBack() {
  step.value = 'email'
  code.value = ''
  clearError()
}

async function handleGuestSignIn() {
  isSubmitting.value = true
  try {
    await signInAsGuest()
    router.replace({ name: 'swipe' })
  } catch {
    // error is set by useAuth
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-dvh flex-col items-center justify-center gap-8 p-6">
    <div class="flex flex-col items-center gap-2">
      <h1 class="text-3xl font-bold">SuperSwiper</h1>
      <p class="text-text-muted">Declutter with a swipe</p>
    </div>

    <form
      v-if="step === 'email'"
      class="flex w-full max-w-sm flex-col gap-4"
      @submit.prevent="handleEmailSubmit"
    >
      <input
        v-model="email"
        type="email"
        placeholder="your@email.com"
        autocomplete="email"
        required
        class="w-full rounded-xl bg-surface px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
        @input="clearError"
      />
      <button
        type="submit"
        :disabled="isSubmitting"
        class="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 font-semibold text-white transition-transform active:scale-95 disabled:opacity-50"
      >
        <svg
          v-if="isSubmitting"
          class="h-5 w-5 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {{ isSubmitting ? 'Sending...' : 'Send Magic Code' }}
      </button>

      <div class="flex items-center gap-3">
        <div class="h-px flex-1 bg-border" />
        <span class="text-sm text-text-muted">or</span>
        <div class="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        :disabled="isSubmitting"
        class="w-full rounded-xl border border-border px-4 py-3 font-semibold text-text-primary transition-transform active:scale-95 disabled:opacity-50"
        @click="handleGuestSignIn"
      >
        Continue as Guest
      </button>
    </form>

    <form
      v-else
      class="flex w-full max-w-sm flex-col gap-4"
      @submit.prevent="handleCodeSubmit"
    >
      <p class="text-center text-text-muted">
        Enter the code sent to <strong class="text-text-primary">{{ email }}</strong>
      </p>
      <input
        v-model="code"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        placeholder="000000"
        autocomplete="one-time-code"
        required
        class="w-full rounded-xl bg-surface px-4 py-3 text-center text-2xl tracking-widest text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
        @input="clearError"
      />
      <button
        type="submit"
        :disabled="isSubmitting"
        class="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 font-semibold text-white transition-transform active:scale-95 disabled:opacity-50"
      >
        <svg
          v-if="isSubmitting"
          class="h-5 w-5 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {{ isSubmitting ? 'Verifying...' : 'Verify Code' }}
      </button>
      <button
        type="button"
        class="text-text-muted transition-colors hover:text-text-primary"
        @click="handleBack"
      >
        Use different email
      </button>
    </form>

    <p v-if="error" class="max-w-sm text-center text-discard">
      {{ error }}
    </p>
  </div>
</template>
