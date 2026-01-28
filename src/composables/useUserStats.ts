import { onUnmounted, ref, watch } from 'vue'
import { db } from '@/db'
import { useAuth } from './useAuth'

interface UserStats {
  itemsSorted: number
}

export function useUserStats() {
  const { user, isAuthenticated } = useAuth()

  const stats = ref<UserStats>({ itemsSorted: 0 })
  const isLoading = ref(true)

  let unsubscribe: (() => void) | null = null

  function subscribe(userId: string) {
    unsubscribe?.()

    unsubscribe = db.subscribeQuery(
      { $users: { $: { where: { id: userId } } } },
      (resp) => {
        isLoading.value = false
        if (!resp.error && resp.data?.$users?.[0]) {
          stats.value = {
            itemsSorted: resp.data.$users[0].itemsSorted ?? 0,
          }
        }
      }
    )
  }

  watch(
    () => user.value?.id,
    (userId) => {
      if (userId && isAuthenticated.value) {
        subscribe(userId)
      } else {
        unsubscribe?.()
        unsubscribe = null
        stats.value = { itemsSorted: 0 }
        isLoading.value = !isAuthenticated.value
      }
    },
    { immediate: true }
  )

  onUnmounted(() => {
    unsubscribe?.()
  })

  return {
    stats,
    isLoading,
  }
}
