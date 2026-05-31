<template>
  <div class="flex flex-col items-center py-6">
    <div v-if="loading" class="flex items-center gap-2 text-sm text-neutral-helper">
      <div class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      <span>加载中...</span>
    </div>
    <button
      v-else-if="hasMore"
      @click="$emit('load-more')"
      class="px-6 py-2 text-sm font-bold text-primary bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors"
    >
      加载更多
    </button>
    <p v-else class="text-xs text-neutral-helper">已加载全部内容</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  loading?: boolean
  hasMore?: boolean
}>(), {
  loading: false,
  hasMore: false
})

defineEmits<{
  'load-more': []
}>()
</script>
