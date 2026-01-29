import { ref, computed, watch, readonly } from 'vue'
import { useUserStats } from './useUserStats'
import { useToast } from './useToast'
import { useSound } from './useSound'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  threshold: number
  category: 'milestone' | 'streak' | 'special'
}

export interface UnlockedAchievement {
  id: string
  unlockedAt: number
}

const STORAGE_KEY = 'superswiper-achievements'

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    name: 'First Step',
    description: 'Sort your first item',
    icon: '👣',
    threshold: 1,
    category: 'milestone',
  },
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Sort 5 items',
    icon: '🌱',
    threshold: 5,
    category: 'milestone',
  },
  {
    id: 'making-progress',
    name: 'Making Progress',
    description: 'Sort 10 items',
    icon: '📈',
    threshold: 10,
    category: 'milestone',
  },
  {
    id: 'declutter-rookie',
    name: 'Declutter Rookie',
    description: 'Sort 25 items',
    icon: '🧹',
    threshold: 25,
    category: 'milestone',
  },
  {
    id: 'half-century',
    name: 'Half Century',
    description: 'Sort 50 items',
    icon: '🎯',
    threshold: 50,
    category: 'milestone',
  },
  {
    id: 'century-club',
    name: 'Century Club',
    description: 'Sort 100 items',
    icon: '💯',
    threshold: 100,
    category: 'milestone',
  },
  {
    id: 'declutter-pro',
    name: 'Declutter Pro',
    description: 'Sort 250 items',
    icon: '⭐',
    threshold: 250,
    category: 'milestone',
  },
  {
    id: 'master-organizer',
    name: 'Master Organizer',
    description: 'Sort 500 items',
    icon: '🏆',
    threshold: 500,
    category: 'milestone',
  },
  {
    id: 'legendary',
    name: 'Legendary',
    description: 'Sort 1000 items',
    icon: '👑',
    threshold: 1000,
    category: 'milestone',
  },
]

function loadUnlockedAchievements(): UnlockedAchievement[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveUnlockedAchievements(achievements: UnlockedAchievement[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements))
}

const unlockedAchievements = ref<UnlockedAchievement[]>(loadUnlockedAchievements())
const newlyUnlocked = ref<Achievement | null>(null)

export function useAchievements() {
  const { stats } = useUserStats()
  const toast = useToast()
  const { playCelebrationSound } = useSound()

  const allAchievements = computed(() => ACHIEVEMENTS)

  const unlockedIds = computed(() =>
    new Set(unlockedAchievements.value.map((a) => a.id))
  )

  const achievementsWithStatus = computed(() =>
    ACHIEVEMENTS.map((achievement) => ({
      ...achievement,
      unlocked: unlockedIds.value.has(achievement.id),
      unlockedAt: unlockedAchievements.value.find((a) => a.id === achievement.id)?.unlockedAt,
    }))
  )

  const unlockedCount = computed(() => unlockedAchievements.value.length)
  const totalCount = computed(() => ACHIEVEMENTS.length)

  const nextAchievement = computed(() =>
    ACHIEVEMENTS.find((a) => !unlockedIds.value.has(a.id))
  )

  const progressToNext = computed(() => {
    if (!nextAchievement.value) return 100
    const current = stats.value.itemsSorted
    const target = nextAchievement.value.threshold
    const previousThreshold = ACHIEVEMENTS
      .filter((a) => a.threshold < target && unlockedIds.value.has(a.id))
      .reduce((max, a) => Math.max(max, a.threshold), 0)

    const progress = ((current - previousThreshold) / (target - previousThreshold)) * 100
    return Math.min(100, Math.max(0, progress))
  })

  function checkAndUnlockAchievements(itemsSorted: number) {
    const newUnlocks: Achievement[] = []

    for (const achievement of ACHIEVEMENTS) {
      if (
        itemsSorted >= achievement.threshold &&
        !unlockedIds.value.has(achievement.id)
      ) {
        newUnlocks.push(achievement)
        unlockedAchievements.value.push({
          id: achievement.id,
          unlockedAt: Date.now(),
        })
      }
    }

    if (newUnlocks.length > 0) {
      saveUnlockedAchievements(unlockedAchievements.value)

      // Show the most significant achievement unlocked (last in sorted array)
      const mostSignificant = newUnlocks[newUnlocks.length - 1] as Achievement
      newlyUnlocked.value = mostSignificant
      toast.success(`${mostSignificant.icon} Achievement unlocked: ${mostSignificant.name}!`)
      playCelebrationSound()
    }

    return newUnlocks
  }

  function clearNewlyUnlocked() {
    newlyUnlocked.value = null
  }

  // Watch for changes in itemsSorted and check for new achievements
  watch(
    () => stats.value.itemsSorted,
    (newCount, oldCount) => {
      if (newCount > (oldCount ?? 0)) {
        checkAndUnlockAchievements(newCount)
      }
    }
  )

  return {
    allAchievements,
    achievementsWithStatus,
    unlockedAchievements: readonly(unlockedAchievements),
    unlockedCount,
    totalCount,
    nextAchievement,
    progressToNext,
    newlyUnlocked: readonly(newlyUnlocked),
    checkAndUnlockAchievements,
    clearNewlyUnlocked,
  }
}
