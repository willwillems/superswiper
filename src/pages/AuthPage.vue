<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { sendMagicCode, verifyMagicCode, error } = useAuth()

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
      />
      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full rounded-xl bg-accent px-4 py-3 font-semibold text-white transition-transform active:scale-95 disabled:opacity-50"
      >
        {{ isSubmitting ? 'Sending...' : 'Send Magic Code' }}
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
      />
      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full rounded-xl bg-accent px-4 py-3 font-semibold text-white transition-transform active:scale-95 disabled:opacity-50"
      >
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
