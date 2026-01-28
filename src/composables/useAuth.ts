import { computed, ref, watch } from 'vue'
import { db } from '@/db'
import type { User } from '@instantdb/core'

type AuthState = 'loading' | 'unauthenticated' | 'authenticated'

const authState = ref<AuthState>('loading')
const user = ref<User | null>(null)
const error = ref<string | null>(null)

db.subscribeAuth((authResult) => {
  if (authResult.user) {
    user.value = authResult.user
    authState.value = 'authenticated'
  } else {
    user.value = null
    authState.value = 'unauthenticated'
  }
  error.value = null
})

export function useAuth() {
  const isLoading = computed(() => authState.value === 'loading')
  const isAuthenticated = computed(() => authState.value === 'authenticated')

  async function sendMagicCode(email: string) {
    error.value = null
    try {
      await db.auth.sendMagicCode({ email })
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to send code'
      throw e
    }
  }

  async function verifyMagicCode(email: string, code: string) {
    error.value = null
    try {
      await db.auth.signInWithMagicCode({ email, code })
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Invalid code'
      throw e
    }
  }

  async function logout() {
    error.value = null
    try {
      await db.auth.signOut()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to logout'
      throw e
    }
  }

  function waitForAuth(): Promise<boolean> {
    return new Promise((resolve) => {
      if (authState.value !== 'loading') {
        resolve(authState.value === 'authenticated')
        return
      }
      const stop = watch(
        authState,
        (state) => {
          if (state !== 'loading') {
            stop()
            resolve(state === 'authenticated')
          }
        },
        { immediate: true }
      )
    })
  }

  return {
    user,
    error,
    isLoading,
    isAuthenticated,
    authState,
    sendMagicCode,
    verifyMagicCode,
    logout,
    waitForAuth,
  }
}
