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
  <div class="flex min-h-dvh flex-col items-center justify-center gap-10 p-6">
    <!-- Playful Branding Header -->
    <div class="flex flex-col items-center gap-3">
      <div
        class="flex size-20 items-center justify-center rounded-full shadow-lg"
        :style="{ background: 'var(--gradient-accent)' }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-10 text-white"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <h1 class="text-4xl font-bold text-text-primary">SuperSwiper</h1>
      <p class="text-lg text-text-muted">Declutter your life, one swipe at a time</p>
    </div>

    <!-- Email Form -->
    <form
      v-if="step === 'email'"
      class="flex w-full max-w-sm flex-col gap-5"
      @submit.prevent="handleEmailSubmit"
    >
      <div class="flex flex-col gap-2">
        <label for="email-input" class="text-sm font-medium text-text-muted">
          Enter your email to get started
        </label>
        <input
          id="email-input"
          v-model="email"
          type="email"
          placeholder="your@email.com"
          autocomplete="email"
          required
          class="w-full rounded-2xl bg-surface px-5 py-4 text-text-primary shadow-md placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
          @input="clearError"
        />
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 font-semibold text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
        :style="{ background: 'var(--gradient-accent)' }"
      >
        <svg
          v-if="isSubmitting"
          class="size-5 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
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

      <div class="flex items-center gap-4">
        <div class="h-px flex-1 bg-border" />
        <span class="text-sm font-medium text-text-muted">or</span>
        <div class="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        :disabled="isSubmitting"
        class="group flex w-full items-center justify-center gap-3 rounded-2xl bg-surface px-5 py-4 font-semibold text-text-primary shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
        @click="handleGuestSignIn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-5 text-text-muted"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
            clip-rule="evenodd"
          />
        </svg>
        Continue as Guest
      </button>

      <p class="text-center text-xs text-text-muted">
        Try it out without an account. Your data stays on this device.
      </p>
    </form>

    <!-- Code Verification Form -->
    <form
      v-else
      class="flex w-full max-w-sm flex-col gap-5"
      @submit.prevent="handleCodeSubmit"
    >
      <div class="flex flex-col items-center gap-2">
        <div
          class="flex size-14 items-center justify-center rounded-full"
          :style="{ background: 'var(--gradient-keep)' }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-7 text-white"
            aria-hidden="true"
          >
            <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
            <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
          </svg>
        </div>
        <p class="text-center text-text-muted">
          We sent a magic code to
        </p>
        <p class="font-semibold text-text-primary">{{ email }}</p>
      </div>

      <input
        v-model="code"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        placeholder="000000"
        autocomplete="one-time-code"
        required
        aria-label="Verification code"
        class="w-full rounded-2xl bg-surface px-5 py-4 text-center text-2xl font-semibold tracking-[0.3em] text-text-primary shadow-md placeholder:text-text-muted placeholder:tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-accent"
        @input="clearError"
      />

      <button
        type="submit"
        :disabled="isSubmitting"
        class="flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 font-semibold text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
        :style="{ background: 'var(--gradient-keep)' }"
      >
        <svg
          v-if="isSubmitting"
          class="size-5 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {{ isSubmitting ? 'Verifying...' : 'Verify & Start Swiping' }}
      </button>

      <button
        type="button"
        class="flex items-center justify-center gap-2 text-text-muted transition-colors hover:text-text-primary"
        @click="handleBack"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-4"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
            clip-rule="evenodd"
          />
        </svg>
        Use different email
      </button>
    </form>

    <!-- Error Message -->
    <div
      v-if="error"
      class="flex max-w-sm items-center gap-3 rounded-2xl bg-discard/10 px-5 py-4"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="size-5 shrink-0 text-discard"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
          clip-rule="evenodd"
        />
      </svg>
      <p class="text-sm text-discard">{{ error }}</p>
    </div>
  </div>
</template>
