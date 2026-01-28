import { computed, onUnmounted, ref, watch } from 'vue'
import { db } from '@/db'
import { useAuth } from './useAuth'
import { id } from '@instantdb/core'

export type ItemStatus = 'unsorted' | 'kept' | 'trash' | 'donate' | 'sell'

interface Item {
  id: string
  name: string
  photoPath: string
  status: string
  createdAt: number
  sortedAt?: number
}

export function useItems() {
  const { user, isAuthenticated } = useAuth()

  const isLoading = ref(true)
  const error = ref<{ message: string } | null>(null)
  const items = ref<Item[]>([])

  let unsubscribe: (() => void) | null = null

  function subscribe(userId: string) {
    unsubscribe?.()

    unsubscribe = db.subscribeQuery(
      {
        items: {
          $: {
            where: { 'owner.id': userId },
            order: { serverCreatedAt: 'desc' },
          },
        },
      },
      (resp) => {
        isLoading.value = false
        if (resp.error) {
          error.value = resp.error
          items.value = []
        } else {
          error.value = null
          items.value = (resp.data?.items ?? []) as Item[]
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
        items.value = []
        isLoading.value = !isAuthenticated.value
      }
    },
    { immediate: true }
  )

  onUnmounted(() => {
    unsubscribe?.()
  })

  const unsortedItems = computed(() =>
    items.value.filter((item) => item.status === 'unsorted')
  )

  async function createItem(photoPath: string, name = 'Item') {
    const userId = user.value?.id
    if (!userId) throw new Error('Not authenticated')

    const itemId = id()
    await db.transact([
      db.tx.items![itemId]!.update({
        name,
        photoPath,
        status: 'unsorted',
        createdAt: Date.now(),
      }),
      db.tx.items![itemId]!.link({ owner: userId }),
    ])

    return itemId
  }

  async function discardItem(
    itemId: string,
    status: 'trash' | 'donate' | 'sell'
  ) {
    const userId = user.value?.id
    if (!userId) throw new Error('Not authenticated')

    await db.transact([
      db.tx.items![itemId]!.update({
        status,
        sortedAt: Date.now(),
      }),
      db.tx.$users![userId]!.merge({
        itemsSorted: (db.tx.$users![userId] as unknown as { itemsSorted: number }).itemsSorted ?? 0,
      }),
    ])

    await incrementItemsSorted(userId)
  }

  async function keepItem(itemId: string, boxId: string) {
    const userId = user.value?.id
    if (!userId) throw new Error('Not authenticated')

    await db.transact([
      db.tx.items![itemId]!.update({
        status: 'kept',
        sortedAt: Date.now(),
      }),
      db.tx.items![itemId]!.link({ box: boxId }),
    ])

    await incrementItemsSorted(userId)
  }

  async function incrementItemsSorted(userId: string) {
    const result = await db.queryOnce({
      $users: { $: { where: { id: userId } } },
    })
    const currentCount = result.data?.$users?.[0]?.itemsSorted ?? 0

    await db.transact([
      db.tx.$users![userId]!.update({
        itemsSorted: currentCount + 1,
      }),
    ])
  }

  return {
    items,
    unsortedItems,
    isLoading,
    error,
    createItem,
    discardItem,
    keepItem,
  }
}
