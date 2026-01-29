import { computed } from 'vue'
import { useItems, type Item } from './useItems'
import { useBoxes } from './useBoxes'
import { useUserStats } from './useUserStats'

interface CategoryStats {
  kept: number
  trash: number
  donate: number
  sell: number
  unsorted: number
}

interface BoxStats {
  id: string
  name: string
  gradient: number
  count: number
}

interface SortingTrend {
  date: string
  count: number
}

export function useStatistics() {
  const { items, keptItems, trashItems, donateItems, sellItems, unsortedItems, isLoading: itemsLoading } = useItems()
  const { boxes, isLoading: boxesLoading } = useBoxes()
  const { stats, isLoading: statsLoading } = useUserStats()

  const isLoading = computed(() => itemsLoading.value || boxesLoading.value || statsLoading.value)

  const totalItems = computed(() => items.value.length)

  const sortedItems = computed(() =>
    items.value.filter((item) => item.status !== 'unsorted')
  )

  const categoryStats = computed<CategoryStats>(() => ({
    kept: keptItems.value.length,
    trash: trashItems.value.length,
    donate: donateItems.value.length,
    sell: sellItems.value.length,
    unsorted: unsortedItems.value.length,
  }))

  const discardedCount = computed(() =>
    categoryStats.value.trash + categoryStats.value.donate + categoryStats.value.sell
  )

  const boxStats = computed<BoxStats[]>(() =>
    boxes.value
      .map((box) => ({
        id: box.id,
        name: box.name,
        gradient: box.gradient,
        count: box.items?.length ?? 0,
      }))
      .sort((a, b) => b.count - a.count)
  )

  const sortingTrends = computed<SortingTrend[]>(() => {
    const sortedWithDate = sortedItems.value
      .filter((item): item is Item & { sortedAt: number } => item.sortedAt != null)

    const countsByDate = new Map<string, number>()

    for (const item of sortedWithDate) {
      const date = new Date(item.sortedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
      countsByDate.set(date, (countsByDate.get(date) ?? 0) + 1)
    }

    return Array.from(countsByDate.entries())
      .map(([date, count]) => ({ date, count }))
      .slice(-7)
  })

  const sortingRate = computed(() => {
    if (totalItems.value === 0) return 0
    return Math.round((sortedItems.value.length / totalItems.value) * 100)
  })

  const keepRate = computed(() => {
    if (sortedItems.value.length === 0) return 0
    return Math.round((categoryStats.value.kept / sortedItems.value.length) * 100)
  })

  const discardRate = computed(() => {
    if (sortedItems.value.length === 0) return 0
    return Math.round((discardedCount.value / sortedItems.value.length) * 100)
  })

  return {
    isLoading,
    totalItems,
    sortedCount: computed(() => sortedItems.value.length),
    itemsSorted: computed(() => stats.value.itemsSorted),
    categoryStats,
    discardedCount,
    boxStats,
    sortingTrends,
    sortingRate,
    keepRate,
    discardRate,
  }
}
