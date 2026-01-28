import { computed, onUnmounted, ref, watch } from 'vue'
import { db } from '@/db'
import { useAuth } from './useAuth'
import { id } from '@instantdb/core'

interface Box {
  id: string
  name: string
  gradient: number
  createdAt: number
  items?: { id: string }[]
}

const GRADIENT_COUNT = 8

export function useBoxes() {
  const { user, isAuthenticated } = useAuth()

  const isLoading = ref(true)
  const error = ref<{ message: string } | null>(null)
  const boxes = ref<Box[]>([])

  let unsubscribe: (() => void) | null = null

  function subscribe(userId: string) {
    unsubscribe?.()

    unsubscribe = db.subscribeQuery(
      {
        boxes: {
          $: {
            where: { 'owner.id': userId },
            order: { serverCreatedAt: 'desc' },
          },
          items: {},
        },
      },
      (resp) => {
        isLoading.value = false
        if (resp.error) {
          error.value = resp.error
          boxes.value = []
        } else {
          error.value = null
          boxes.value = (resp.data?.boxes ?? []) as Box[]
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
        boxes.value = []
        isLoading.value = !isAuthenticated.value
      }
    },
    { immediate: true }
  )

  onUnmounted(() => {
    unsubscribe?.()
  })

  const sortedBoxes = computed(() =>
    [...boxes.value].sort(
      (a, b) => (b.items?.length ?? 0) - (a.items?.length ?? 0)
    )
  )

  async function createBox(name: string): Promise<string> {
    const userId = user.value?.id
    if (!userId) throw new Error('Not authenticated')

    const boxId = id()
    const gradient = Math.floor(Math.random() * GRADIENT_COUNT)

    await db.transact([
      db.tx.boxes![boxId]!.update({
        name,
        gradient,
        createdAt: Date.now(),
      }),
      db.tx.boxes![boxId]!.link({ owner: userId }),
    ])

    return boxId
  }

  return {
    boxes,
    sortedBoxes,
    isLoading,
    error,
    createBox,
  }
}
