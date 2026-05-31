<template>
  <div class="skeleton-wrapper" :class="{ 'animate-pulse': animate }">
    <div v-if="type === 'card'" class="space-y-4">
      <div class="h-4 bg-neutral-border/30 rounded-lg w-3/4"></div>
      <div class="h-3 bg-neutral-border/30 rounded-lg w-full"></div>
      <div class="h-3 bg-neutral-border/30 rounded-lg w-5/6"></div>
      <div class="flex gap-3 mt-4">
        <div class="h-8 w-16 bg-neutral-border/30 rounded-full"></div>
        <div class="h-8 w-16 bg-neutral-border/30 rounded-full"></div>
      </div>
    </div>

    <div v-else-if="type === 'post'" class="p-6 bg-neutral-bg rounded-[32px] space-y-4">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 bg-neutral-border/30 rounded-full"></div>
        <div class="flex-1 space-y-2">
          <div class="h-3 bg-neutral-border/30 rounded-lg w-24"></div>
          <div class="h-2 bg-neutral-border/30 rounded-lg w-16"></div>
        </div>
      </div>
      <div class="space-y-2">
        <div class="h-3 bg-neutral-border/30 rounded-lg w-full"></div>
        <div class="h-3 bg-neutral-border/30 rounded-lg w-4/5"></div>
        <div class="h-3 bg-neutral-border/30 rounded-lg w-3/5"></div>
      </div>
      <div class="flex gap-6 pt-3 border-t border-neutral-border/30">
        <div class="h-3 bg-neutral-border/30 rounded-lg w-12"></div>
        <div class="h-3 bg-neutral-border/30 rounded-lg w-12"></div>
        <div class="h-3 bg-neutral-border/30 rounded-lg w-12"></div>
      </div>
    </div>

    <div v-else-if="type === 'list'" class="space-y-3">
      <div v-for="i in rows" :key="i" class="flex items-center gap-4 p-3 bg-neutral-bg rounded-2xl">
        <div class="w-10 h-10 bg-neutral-border/30 rounded-full shrink-0"></div>
        <div class="flex-1 space-y-2">
          <div class="h-3 bg-neutral-border/30 rounded-lg w-1/3"></div>
          <div class="h-2 bg-neutral-border/30 rounded-lg w-1/4"></div>
        </div>
      </div>
    </div>

    <div v-else-if="type === 'chart'" class="space-y-4">
      <div class="h-4 bg-neutral-border/30 rounded-lg w-1/4"></div>
      <div class="h-48 bg-neutral-border/30 rounded-2xl"></div>
    </div>

    <div v-else class="space-y-3">
      <div v-for="i in rows" :key="i" class="h-4 bg-neutral-border/30 rounded-lg" :style="{ width: getWidth(i) }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  type?: 'card' | 'post' | 'list' | 'chart' | 'text'
  rows?: number
  animate?: boolean
}>(), {
  type: 'text',
  rows: 3,
  animate: true
})

function getWidth(index: number): string {
  const widths = ['100%', '85%', '70%', '90%', '60%', '80%', '75%']
  return widths[(index - 1) % widths.length]
}
</script>
