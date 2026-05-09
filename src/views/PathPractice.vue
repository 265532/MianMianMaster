<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Sparkles, Clock, PlayCircle, X, ChevronLeft } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const pathName = ref(route.query.path as string || '简历押题专项')
const practiceProgress = ref(0)
const isPracticeStarted = ref(false)

// 开始练习
const startPathPractice = () => {
  isPracticeStarted.value = true
  practiceProgress.value = 0
  
  // 模拟练习进度
  const interval = setInterval(() => {
    practiceProgress.value += 10
    if (practiceProgress.value >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        alert(`${pathName.value}练习完成！`)  
        router.push('/knowledge')
      }, 1000)
    }
  }, 500)
}

// 返回知识库
const goBack = () => {
  router.push('/knowledge')
}

// 获取路径详情
const getPathDetails = () => {
  return {
    title: pathName.value,
    description: pathName.value === '简历押题专项' ? '预测面试官可能会提问的问题，帮助您提前准备' : '模拟完整的面试流程，包括技术面、行为面等环节',
    type: pathName.value === '简历押题专项' ? '预测' : '模拟',
    questionCount: pathName.value === '简历押题专项' ? '20' : '10',
    difficulty: pathName.value === '简历押题专项' ? '中等' : '困难',
    estimatedTime: pathName.value === '简历押题专项' ? '30' : '60',
    passRate: pathName.value === '简历押题专项' ? '85' : '75'
  }
}

const pathDetails = getPathDetails()
</script>

<template>
  <div class="flex flex-col gap-8 max-w-7xl mx-auto">
    <!-- 顶部导航 -->
    <div class="sticky top-0 z-10 bg-white shadow-sm border-b border-neutral-border">
      <div class="px-4 py-4 flex items-center gap-4">
        <button @click="goBack" class="p-2 hover:bg-neutral-bg rounded-full transition-colors">
          <ChevronLeft :size="20" class="text-neutral-title" />
        </button>
        <h1 class="text-xl font-bold text-neutral-title">专项通关路径 - {{ pathName }}</h1>
      </div>
    </div>

    <!-- 主内容 -->
    <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border">
      <div class="p-6 bg-neutral-bg rounded-[24px]">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h4 class="text-lg font-bold text-neutral-title mb-2">{{ pathDetails.title }}</h4>
            <p class="text-sm text-neutral-helper">
              {{ pathDetails.description }}
            </p>
          </div>
          <div class="text-right">
            <span class="text-xs font-bold text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
              {{ pathDetails.type }}
            </span>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div class="p-4 bg-white rounded-xl text-center">
            <p class="text-lg font-black text-primary">{{ pathDetails.questionCount }}</p>
            <p class="text-xs text-neutral-helper">题目数量</p>
          </div>
          <div class="p-4 bg-white rounded-xl text-center">
            <p class="text-lg font-black text-primary">{{ pathDetails.difficulty }}</p>
            <p class="text-xs text-neutral-helper">难度</p>
          </div>
          <div class="p-4 bg-white rounded-xl text-center">
            <p class="text-lg font-black text-primary">{{ pathDetails.estimatedTime }}分钟</p>
            <p class="text-xs text-neutral-helper">预计时间</p>
          </div>
          <div class="p-4 bg-white rounded-xl text-center">
            <p class="text-lg font-black text-primary">{{ pathDetails.passRate }}%</p>
            <p class="text-xs text-neutral-helper">通过率</p>
          </div>
        </div>
      </div>
      
      <div v-if="isPracticeStarted" class="mt-8">
        <h4 class="text-sm font-bold text-neutral-title mb-4">练习进度</h4>
        <div class="space-y-2">
          <div class="flex justify-between text-sm font-medium">
            <span>进度</span>
            <span>{{ practiceProgress }}%</span>
          </div>
          <div class="h-2 bg-neutral-bg rounded-full overflow-hidden">
            <div class="h-full gradient-primary transition-all duration-300 ease-out" :style="{ width: practiceProgress + '%' }"></div>
          </div>
        </div>
        <div class="mt-6 p-6 bg-primary/5 rounded-xl border border-primary/20">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center text-white">
              <Clock :size="24" />
            </div>
            <div>
              <h5 class="text-sm font-bold text-neutral-title">练习进行中</h5>
              <p class="text-xs text-neutral-helper">请耐心等待练习完成...</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex gap-4 justify-end pt-8 border-t border-neutral-border">
        <button @click="goBack" class="px-6 py-3 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all">
          取消
        </button>
        <button v-if="!isPracticeStarted" @click="startPathPractice" class="px-8 py-3 gradient-primary text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center gap-2 group">
          <PlayCircle :size="16" class="group-hover:scale-110 transition-transform" />
          开始练习
        </button>
        <button v-else class="px-8 py-3 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all flex items-center gap-2">
          <Clock :size="16" />
          练习中...
        </button>
      </div>
    </div>
  </div>
</template>
