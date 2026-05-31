<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { 
  ChevronLeft, 
  Zap, 
  Clock, 
  Target, 
  CheckCircle, 
  ArrowRight
} from 'lucide-vue-next'
import { usePracticeStore } from '@/stores/practice'

const route = useRoute()
const router = useRouter()
const practiceStore = usePracticeStore()
const { currentBank, currentQuestionIndex, selectedAnswers, showResult, loading: isLoading } = storeToRefs(practiceStore)



const practiceData = computed(() => currentBank.value || { id: 0, title: '', description: '', category: '', questionCount: 0, estimatedTime: '', passRate: 0, questions: [] })

watch(() => route.params.id, (newId) => {
  const bankId = Number(newId)
  const bank = practiceStore.banks.find(b => b.id === bankId)
  if (bank) {
    practiceStore.selectBank(bank)
  }
  practiceStore.resetPractice()
})

const currentQuestion = computed(() => {
  return practiceData.value.questions[currentQuestionIndex.value]
})

const progress = computed(() => {
  if (!practiceData.value.questions.length) return 0
  return ((currentQuestionIndex.value + 1) / practiceData.value.questions.length) * 100
})

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value === practiceData.value.questions.length - 1
})

const submitPractice = () => {
  practiceStore.submitPractice()
}

const nextQuestion = () => {
  if (!isLastQuestion.value) {
    practiceStore.nextQuestion()
  } else {
    submitPractice()
  }
}

const previousQuestion = () => {
  practiceStore.prevQuestion()
}

const handleAnswerSelect = (optionId: string) => {
  if (currentQuestion.value) {
    practiceStore.selectAnswer(currentQuestion.value.id, optionId)
  }
}

const handleEssayAnswer = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  if (currentQuestion.value) {
    practiceStore.selectAnswer(currentQuestion.value.id, target.value)
  }
}

const restartPractice = () => {
  practiceStore.resetPractice()
}

const goBack = () => {
  router.back()
}

onMounted(async () => {
  await practiceStore.fetchBanks()
  const bankId = Number(route.params.id)
  const bank = practiceStore.banks.find(b => b.id === bankId)
  if (bank) {
    practiceStore.selectBank(bank)
  }
})
</script>

<template>
  <div class="min-h-screen bg-neutral-page w-full">
    <!-- 顶部导航 -->
    <header class="sticky top-0 z-10 bg-white shadow-sm border-b border-neutral-border">
      <div class="px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button @click="goBack" class="p-2 text-neutral-helper hover:text-neutral-title">
            <ChevronLeft :size="20" />
          </button>
          <h1 class="text-xl font-bold text-neutral-title">{{ practiceData.title }}</h1>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 text-sm text-neutral-helper">
            <Clock :size="16" />
            <span>{{ practiceData.estimatedTime }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-neutral-helper">
            <Target :size="16" />
            <span>{{ practiceData.passRate }}% 通过率</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="px-4 py-8">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="flex items-center justify-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>

      <!-- 练习内容 -->
      <div v-else>
        <!-- 进度条 -->
        <div class="mb-4">
          <div class="flex justify-between text-sm text-neutral-helper mb-2">
            <span>进度</span>
            <span>{{ currentQuestionIndex + 1 }} / {{ practiceData.questions.length }}</span>
          </div>
          <div class="h-2 bg-neutral-bg rounded-full overflow-hidden">
            <div class="h-full bg-primary transition-all duration-500 ease-out" :style="{ width: progress + '%' }"></div>
          </div>
        </div>

        <!-- 结果页面 -->
        <div v-if="showResult" class="text-center py-12">
          <div class="w-24 h-24 rounded-full bg-auxiliary-green/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle :size="48" class="text-auxiliary-green" />
          </div>
          <h2 class="text-2xl font-bold text-neutral-title mb-4">练习完成！</h2>
          <p class="text-sm text-neutral-helper mb-8">
            你已经完成了 {{ practiceData.title }} 的练习，继续加油！
          </p>
          <div class="flex gap-4 justify-center">
            <button @click="restartPractice" class="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark hover:shadow-lg transition-all flex items-center gap-2">
              <Zap :size="16" />
              重新练习
            </button>
            <button @click="goBack" class="px-8 py-3 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all flex items-center gap-2">
              <ChevronLeft :size="16" />
              返回
            </button>
          </div>
        </div>

        <!-- 题目页面 -->
        <div v-else class="space-y-4">
          <!-- 题目信息 -->
          <div class="bg-white rounded-[32px] p-6 shadow-sm border border-neutral-border">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {{ currentQuestionIndex + 1 }}
              </div>
              <div>
                <h3 class="text-lg font-bold text-neutral-title mb-2">{{ currentQuestion.title }}</h3>
                <p class="text-sm text-neutral-helper">{{ currentQuestion.description }}</p>
              </div>
            </div>

            <!-- 选择题 -->
            <div v-if="currentQuestion.type === 'multiple-choice'" class="space-y-3 mt-6">
              <div 
                v-for="option in currentQuestion.options" 
                :key="option.id"
                class="p-4 bg-neutral-bg rounded-xl border border-neutral-border hover:bg-white hover:border-primary transition-all cursor-pointer"
                :class="selectedAnswers[currentQuestion.id] === option.id ? 'border-primary bg-primary/5' : ''"
                @click="handleAnswerSelect(option.id)"
              >
                <div class="flex items-center gap-3">
                  <div class="w-6 h-6 rounded-full border-2 border-neutral-border flex items-center justify-center" :class="selectedAnswers[currentQuestion.id] === option.id ? 'border-primary bg-primary text-white' : ''">
                    {{ selectedAnswers[currentQuestion.id] === option.id ? '✓' : option.id }}
                  </div>
                  <span class="text-sm text-neutral-title">{{ option.text }}</span>
                </div>
              </div>
            </div>

            <!-- 简答题 -->
            <div v-else-if="currentQuestion.type === 'essay'" class="mt-6">
              <textarea 
                v-model="selectedAnswers[currentQuestion.id]"
                @input="handleEssayAnswer"
                class="w-full p-4 bg-neutral-bg rounded-xl border border-neutral-border focus:border-primary focus:outline-none transition-all"
                rows="5"
                placeholder="请输入你的答案..."
              ></textarea>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex items-center justify-between">
            <button 
              @click="previousQuestion"
              :disabled="currentQuestionIndex === 0"
              class="px-6 py-3 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all flex items-center gap-2" 
              :class="currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''"
            >
              <ChevronLeft :size="16" />
              上一题
            </button>
            <button 
              @click="nextQuestion"
              class="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark hover:shadow-lg transition-all flex items-center gap-2"
            >
              {{ isLastQuestion ? '提交' : '下一题' }}
              <ArrowRight :size="16" />
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 加载动画 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
