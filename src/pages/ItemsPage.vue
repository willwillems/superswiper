<script setup lang="ts">
// Placeholder for items overview
</script>

<template>
  <div class="flex flex-1 flex-col gap-6 p-6">
    <h1 class="text-2xl font-bold">Your Items</h1>

    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold text-text-muted">Boxes</h2>
      <div class="grid grid-cols-2 gap-3">
        <div class="box-gradient-2 flex h-24 items-center justify-center rounded-xl">
          <span class="font-medium text-white">No boxes yet</span>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold text-text-muted">Discarded</h2>
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
          <span>Trash</span>
          <span class="text-text-muted">0</span>
        </div>
        <div class="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
          <span>Donate</span>
          <span class="text-text-muted">0</span>
        </div>
        <div class="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
          <span>Sell</span>
          <span class="text-text-muted">0</span>
        </div>
      </div>
    </section>
  </div>
</template>
