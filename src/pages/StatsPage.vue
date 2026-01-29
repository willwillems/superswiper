<script setup lang="ts">
import { useStatistics } from '@/composables/useStatistics'
import { useAchievements } from '@/composables/useAchievements'
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

const categoryLabels = {
  kept: { label: 'Kept', icon: '✓', color: 'bg-keep' },
  trash: { label: 'Trash', icon: '🗑️', color: 'bg-discard' },
  donate: { label: 'Donate', icon: '🎁', color: 'bg-amber-500' },
  sell: { label: 'Sell', icon: '💰', color: 'bg-emerald-500' },
} as const
</script>

<template>
  <div class="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
    <header>
      <h1 class="text-2xl font-bold">Statistics</h1>
      <p class="text-sm text-text-muted">Your decluttering progress at a glance</p>
    </header>

    <section v-if="isLoading" class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-3">
        <div v-for="i in 4" :key="i" class="flex flex-col gap-2 rounded-xl bg-surface p-4">
          <SkeletonLoader width="60%" height="0.75rem" rounded="lg" />
          <SkeletonLoader width="40%" height="1.5rem" rounded="lg" />
        </div>
      </div>
      <div class="flex flex-col gap-2 rounded-xl bg-surface p-4">
        <SkeletonLoader width="30%" height="0.75rem" rounded="lg" />
        <SkeletonLoader width="100%" height="0.5rem" rounded="full" />
      </div>
    </section>

    <template v-else>
      <section class="grid grid-cols-2 gap-3">
        <div class="flex flex-col gap-1 rounded-xl bg-surface p-4">
          <span class="text-xs text-text-muted">Total Items</span>
          <span class="text-2xl font-bold">{{ totalItems }}</span>
        </div>
        <div class="flex flex-col gap-1 rounded-xl bg-surface p-4">
          <span class="text-xs text-text-muted">Items Sorted</span>
          <span class="text-2xl font-bold text-accent">{{ itemsSorted }}</span>
        </div>
        <div class="flex flex-col gap-1 rounded-xl bg-surface p-4">
          <span class="text-xs text-text-muted">Kept</span>
          <span class="text-2xl font-bold text-keep">{{ categoryStats.kept }}</span>
        </div>
        <div class="flex flex-col gap-1 rounded-xl bg-surface p-4">
          <span class="text-xs text-text-muted">Discarded</span>
          <span class="text-2xl font-bold text-discard">{{ discardedCount }}</span>
        </div>
      </section>

      <section class="flex flex-col gap-3 rounded-xl bg-surface p-4">
        <h2 class="text-sm font-semibold text-text-muted">Sorting Progress</h2>
        <div class="flex flex-col gap-2">
          <div class="flex justify-between text-sm">
            <span>{{ sortedCount }} of {{ totalItems }} sorted</span>
            <span class="font-medium text-accent">{{ sortingRate }}%</span>
          </div>
          <div class="h-2 overflow-hidden rounded-full bg-background">
            <div
              class="h-full rounded-full bg-accent transition-all duration-500"
              :style="{ width: `${sortingRate}%` }"
            />
          </div>
        </div>
      </section>

      <section v-if="sortedCount > 0" class="flex flex-col gap-3 rounded-xl bg-surface p-4">
        <h2 class="text-sm font-semibold text-text-muted">Keep vs Discard</h2>
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
              class="h-full bg-keep transition-all duration-500"
              :style="{ width: `${keepRate}%` }"
            />
            <div
              class="h-full bg-discard transition-all duration-500"
              :style="{ width: `${discardRate}%` }"
            />
          </div>
        </div>
        <div class="flex justify-between text-xs">
          <span class="text-keep">{{ keepRate }}% kept</span>
          <span class="text-discard">{{ discardRate }}% discarded</span>
        </div>
      </section>

      <section class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-semibold text-text-muted">Achievements</h2>
          <span class="text-xs text-text-muted">{{ unlockedCount }} / {{ totalCount }}</span>
        </div>
        <div v-if="nextAchievement" class="flex flex-col gap-2 rounded-xl bg-surface p-4">
          <div class="flex items-center gap-2 text-sm">
            <span>{{ nextAchievement.icon }}</span>
            <span class="text-text-muted">Next:</span>
            <span class="font-medium">{{ nextAchievement.name }}</span>
          </div>
          <div class="h-2 overflow-hidden rounded-full bg-background">
            <div
              class="h-full rounded-full bg-accent transition-all duration-500"
              :style="{ width: `${progressToNext}%` }"
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
        <h2 class="text-sm font-semibold text-text-muted">Category Breakdown</h2>
        <div class="flex flex-col gap-2">
          <div
            v-for="(info, key) in categoryLabels"
            :key="key"
            class="flex items-center justify-between rounded-xl bg-surface px-4 py-3"
          >
            <span class="flex items-center gap-2">
              <span
                class="flex h-6 w-6 items-center justify-center rounded-md text-sm"
                :class="info.color"
              >
                {{ info.icon }}
              </span>
              <span>{{ info.label }}</span>
            </span>
            <span class="font-medium">{{ categoryStats[key] }}</span>
          </div>
        </div>
      </section>

      <section v-if="boxStats.length > 0" class="flex flex-col gap-3">
        <h2 class="text-sm font-semibold text-text-muted">Items by Box</h2>
        <div class="flex flex-col gap-2">
          <div
            v-for="box in boxStats"
            :key="box.id"
            class="flex items-center gap-3 rounded-xl bg-surface px-4 py-3"
          >
            <div
              class="h-8 w-8 rounded-lg"
              :class="`box-gradient-${box.gradient}`"
            />
            <span class="flex-1 truncate">{{ box.name }}</span>
            <span class="font-medium">{{ box.count }}</span>
          </div>
        </div>
      </section>

      <section v-if="sortingTrends.length > 0" class="flex flex-col gap-3">
        <h2 class="text-sm font-semibold text-text-muted">Recent Activity</h2>
        <div class="flex items-end gap-1 rounded-xl bg-surface p-4" style="height: 120px;">
          <div
            v-for="trend in sortingTrends"
            :key="trend.date"
            class="flex flex-1 flex-col items-center gap-1"
          >
            <div
              class="w-full rounded-t bg-accent transition-all duration-300"
              :style="{
                height: `${Math.max(8, (trend.count / Math.max(...sortingTrends.map(t => t.count))) * 60)}px`
              }"
            />
            <span class="text-[10px] text-text-muted">{{ trend.date.split(' ')[0] }}</span>
          </div>
        </div>
      </section>

      <section
        v-if="totalItems === 0"
        class="flex flex-col items-center gap-4 rounded-xl bg-surface p-8 text-center"
      >
        <span class="text-4xl">📊</span>
        <div class="flex flex-col gap-1">
          <h2 class="font-semibold">No items yet</h2>
          <p class="text-sm text-text-muted">Start adding items to see your statistics</p>
        </div>
      </section>
    </template>
  </div>
</template>
