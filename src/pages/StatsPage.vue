<script setup lang="ts">
import { useStatistics } from '@/composables/useStatistics'
import { useAchievements } from '@/composables/useAchievements'
import { useXpStore } from '@/stores/xpStore'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import AchievementBadge from '@/components/AchievementBadge.vue'

const {
  isLoading,
  totalItems,
  sortedCount,
  itemsSorted,
  categoryStats,
  discardedCount,
  boxStats,
  sortingTrends,
  sortingRate,
  keepRate,
  discardRate,
} = useStatistics()

const {
  achievementsWithStatus,
  unlockedCount,
  totalCount,
  nextAchievement,
  progressToNext,
} = useAchievements()

const { total: xpTotal } = useXpStore()

interface CategoryInfo {
  label: string
  icon: string
  gradient: string
}

const categoryLabels: Record<'kept' | 'trash' | 'donate' | 'sell', CategoryInfo> = {
  kept: { label: 'Kept', icon: '✓', gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
  trash: { label: 'Trash', icon: '🗑️', gradient: 'linear-gradient(135deg, #6b7280, #9ca3af)' },
  donate: { label: 'Donate', icon: '🎁', gradient: 'linear-gradient(135deg, #f97316, #fb923c)' },
  sell: { label: 'Sell', icon: '💰', gradient: 'linear-gradient(135deg, #14b8a6, #2dd4bf)' },
}
</script>

<template>
  <div class="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
    <header>
      <h1 class="text-2xl font-bold">Statistics</h1>
      <p class="text-sm text-text-muted">Your decluttering progress at a glance</p>
    </header>

    <section v-if="isLoading" class="flex flex-col gap-4">
      <div class="flex flex-col items-center gap-2 rounded-2xl bg-surface p-6">
        <SkeletonLoader width="3rem" height="3rem" rounded="full" />
        <SkeletonLoader width="6rem" height="2rem" rounded="lg" />
        <SkeletonLoader width="8rem" height="0.875rem" rounded="lg" />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div v-for="i in 4" :key="i" class="flex flex-col gap-2 rounded-2xl bg-surface p-4">
          <SkeletonLoader width="60%" height="0.75rem" rounded="lg" />
          <SkeletonLoader width="40%" height="1.5rem" rounded="lg" />
        </div>
      </div>
      <div class="flex flex-col gap-2 rounded-2xl bg-surface p-4">
        <SkeletonLoader width="30%" height="0.75rem" rounded="lg" />
        <SkeletonLoader width="100%" height="0.5rem" rounded="full" />
      </div>
    </section>

    <template v-else>
      <section class="flex flex-col items-center gap-3 rounded-2xl bg-surface p-6">
        <div
          class="flex size-14 items-center justify-center rounded-full shadow-lg"
          :style="{ background: 'var(--gradient-accent)' }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-7 text-white"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="flex flex-col items-center gap-1">
          <span class="text-4xl font-bold text-accent">{{ xpTotal.toLocaleString() }}</span>
          <span class="text-sm font-medium text-text-muted">Total XP Earned</span>
        </div>
      </section>

      <section class="grid grid-cols-2 gap-3">
        <div class="flex flex-col gap-1 rounded-2xl bg-surface p-4">
          <span class="text-xs text-text-muted">Total Items</span>
          <span class="text-2xl font-bold">{{ totalItems }}</span>
        </div>
        <div class="flex flex-col gap-1 rounded-2xl bg-surface p-4">
          <span class="text-xs text-text-muted">Items Sorted</span>
          <span class="text-2xl font-bold text-accent">{{ itemsSorted }}</span>
        </div>
        <div class="flex flex-col gap-1 rounded-2xl bg-surface p-4">
          <span class="text-xs text-text-muted">Kept</span>
          <span class="text-2xl font-bold text-keep">{{ categoryStats.kept }}</span>
        </div>
        <div class="flex flex-col gap-1 rounded-2xl bg-surface p-4">
          <span class="text-xs text-text-muted">Discarded</span>
          <span class="text-2xl font-bold text-discard">{{ discardedCount }}</span>
        </div>
      </section>

      <section class="flex flex-col gap-3 rounded-2xl bg-surface p-4">
        <div class="flex items-center gap-2">
          <span
            class="flex size-7 items-center justify-center rounded-full text-sm shadow-sm"
            :style="{ background: 'var(--gradient-accent)' }"
            aria-hidden="true"
          >
            📊
          </span>
          <h2 class="text-base font-semibold">Sorting Progress</h2>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex justify-between text-sm">
            <span>{{ sortedCount }} of {{ totalItems }} sorted</span>
            <span class="font-semibold text-accent">{{ sortingRate }}%</span>
          </div>
          <div class="h-3 overflow-hidden rounded-full bg-background">
            <div
              class="h-full rounded-full transition-all duration-500"
              :style="{ width: `${sortingRate}%`, background: 'var(--gradient-accent)' }"
            />
          </div>
        </div>
      </section>

      <section v-if="sortedCount > 0" class="flex flex-col gap-3 rounded-2xl bg-surface p-4">
        <div class="flex items-center gap-2">
          <span
            class="flex size-7 items-center justify-center rounded-full text-sm shadow-sm"
            :style="{ background: 'var(--gradient-keep)' }"
            aria-hidden="true"
          >
            ⚖️
          </span>
          <h2 class="text-base font-semibold">Keep vs Discard</h2>
        </div>
        <div class="flex gap-2">
          <div
            class="flex h-3 flex-1 overflow-hidden rounded-full bg-background"
            role="progressbar"
            :aria-valuenow="keepRate"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="Keep vs discard ratio"
          >
            <div
              class="h-full transition-all duration-500"
              :style="{ width: `${keepRate}%`, background: 'var(--gradient-keep)' }"
            />
            <div
              class="h-full transition-all duration-500"
              :style="{ width: `${discardRate}%`, background: 'var(--gradient-discard)' }"
            />
          </div>
        </div>
        <div class="flex justify-between text-xs font-medium">
          <span class="text-keep">{{ keepRate }}% kept</span>
          <span class="text-discard">{{ discardRate }}% discarded</span>
        </div>
      </section>

      <section class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span
              class="flex size-7 items-center justify-center rounded-full text-sm shadow-sm"
              :style="{ background: 'linear-gradient(135deg, #eab308, #facc15)' }"
              aria-hidden="true"
            >
              🏆
            </span>
            <h2 class="text-base font-semibold">Achievements</h2>
          </div>
          <span class="rounded-full bg-text-muted/10 px-2.5 py-1 text-xs font-medium text-text-muted">
            {{ unlockedCount }} / {{ totalCount }}
          </span>
        </div>
        <div v-if="nextAchievement" class="flex flex-col gap-3 rounded-2xl bg-surface p-4">
          <div class="flex items-center gap-2 text-sm">
            <span class="text-lg">{{ nextAchievement.icon }}</span>
            <span class="text-text-muted">Next:</span>
            <span class="font-semibold">{{ nextAchievement.name }}</span>
          </div>
          <div class="h-2.5 overflow-hidden rounded-full bg-background">
            <div
              class="h-full rounded-full transition-all duration-500"
              :style="{ width: `${progressToNext}%`, background: 'linear-gradient(135deg, #eab308, #facc15)' }"
            />
          </div>
          <span class="text-xs text-text-muted">{{ nextAchievement.description }}</span>
        </div>
        <div class="flex flex-col gap-2">
          <AchievementBadge
            v-for="achievement in achievementsWithStatus"
            :key="achievement.id"
            :icon="achievement.icon"
            :name="achievement.name"
            :description="achievement.description"
            :unlocked="achievement.unlocked"
            :unlocked-at="achievement.unlockedAt"
          />
        </div>
      </section>

      <section class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <span
            class="flex size-7 items-center justify-center rounded-full text-sm shadow-sm"
            :style="{ background: 'var(--gradient-discard)' }"
            aria-hidden="true"
          >
            📋
          </span>
          <h2 class="text-base font-semibold">Category Breakdown</h2>
        </div>
        <div class="flex flex-col gap-2">
          <div
            v-for="(info, key) in categoryLabels"
            :key="key"
            class="flex items-center justify-between rounded-2xl bg-surface px-4 py-3.5"
          >
            <span class="flex items-center gap-3">
              <span
                class="flex size-10 items-center justify-center rounded-full text-base shadow-md"
                :style="{ background: info.gradient }"
              >
                {{ info.icon }}
              </span>
              <span class="font-medium">{{ info.label }}</span>
            </span>
            <span class="flex min-w-8 items-center justify-center rounded-full bg-text-muted/10 px-2.5 py-1 text-sm font-semibold text-text-muted">
              {{ categoryStats[key] }}
            </span>
          </div>
        </div>
      </section>

      <section v-if="boxStats.length > 0" class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <span
            class="flex size-7 items-center justify-center rounded-full text-sm shadow-sm"
            :style="{ background: 'var(--gradient-accent)' }"
            aria-hidden="true"
          >
            📦
          </span>
          <h2 class="text-base font-semibold">Items by Box</h2>
        </div>
        <div class="flex flex-col gap-2">
          <div
            v-for="box in boxStats"
            :key="box.id"
            class="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3.5"
          >
            <div
              class="size-10 rounded-full shadow-md"
              :class="`box-gradient-${box.gradient}`"
            />
            <span class="flex-1 truncate font-medium">{{ box.name }}</span>
            <span class="flex min-w-8 items-center justify-center rounded-full bg-text-muted/10 px-2.5 py-1 text-sm font-semibold text-text-muted">
              {{ box.count }}
            </span>
          </div>
        </div>
      </section>

      <section v-if="sortingTrends.length > 0" class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <span
            class="flex size-7 items-center justify-center rounded-full text-sm shadow-sm"
            :style="{ background: 'linear-gradient(135deg, #06b6d4, #22d3ee)' }"
            aria-hidden="true"
          >
            📈
          </span>
          <h2 class="text-base font-semibold">Recent Activity</h2>
        </div>
        <div class="flex items-end gap-1.5 rounded-2xl bg-surface p-4" style="height: 140px;">
          <div
            v-for="trend in sortingTrends"
            :key="trend.date"
            class="flex flex-1 flex-col items-center gap-1.5"
          >
            <div
              class="w-full rounded-t-md transition-all duration-300"
              :style="{
                height: `${Math.max(12, (trend.count / Math.max(...sortingTrends.map(t => t.count))) * 80)}px`,
                background: 'var(--gradient-accent)'
              }"
            />
            <span class="text-[10px] font-medium text-text-muted">{{ trend.date.split(' ')[0] }}</span>
          </div>
        </div>
      </section>

      <section
        v-if="totalItems === 0"
        class="flex flex-col items-center gap-4 rounded-2xl bg-surface p-8 text-center"
      >
        <div
          class="flex size-16 items-center justify-center rounded-full shadow-lg"
          :style="{ background: 'var(--gradient-accent)' }"
        >
          <span class="text-3xl">📊</span>
        </div>
        <div class="flex flex-col gap-2">
          <h2 class="text-lg font-semibold">No items yet</h2>
          <p class="text-sm text-text-muted">Start adding items to see your statistics</p>
        </div>
      </section>
    </template>
  </div>
</template>
