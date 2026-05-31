<template>
  <div class="flex flex-col items-center justify-center py-16 px-8">
    <div class="text-5xl mb-4">{{ icon }}</div>
    <h3 class="text-lg font-bold text-neutral-title mb-2">{{ title }}</h3>
    <p class="text-sm text-neutral-helper text-center max-w-xs mb-6">{{ description }}</p>
    <button
      v-if="actionText"
      @click="$emit('action')"
      class="px-6 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
    >
      {{ actionText }}
    </button>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  icon?: string
  title?: string
  description?: string
  actionText?: string
}>(), {
  icon: '📭',
  title: '暂无数据',
  description: '这里还没有任何内容',
  actionText: ''
})

defineEmits<{
  action: []
}>()
</script>
