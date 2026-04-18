<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ChevronLeft, 
  Zap, 
  BookOpen, 
  Clock, 
  Target, 
  CheckCircle, 
  XCircle,
  ArrowRight
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const isLoading = ref(true)
const currentQuestionIndex = ref(0)
const selectedAnswers = ref<Record<number, string>>({})
const showResult = ref(false)



// 模拟题库数据
const questionBanks = {
  [1]: {
    id: 1,
    title: '高频算法 50 题',
    description: '涵盖面试中常见的算法题，包括排序、查找、动态规划等',
    category: '算法',
    questionCount: 24,
    estimatedTime: '45分钟',
    passRate: 75,
    questions: [
      {
        id: 101,
        title: '两数之和',
        description: '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。',
        type: 'multiple-choice',
        difficulty: 'easy',
        options: [
          { id: 'a', text: '暴力枚举法' },
          { id: 'b', text: '哈希表法' },
          { id: 'c', text: '双指针法' },
          { id: 'd', text: '排序法' }
        ],
        correctAnswer: 'b'
      },
      {
        id: 102,
        title: '三数之和',
        description: '给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0？请你找出所有和为 0 且不重复的三元组。',
        type: 'essay',
        difficulty: 'medium',
        options: [],
        correctAnswer: '使用排序 + 双指针法。首先对数组进行排序，然后遍历数组，对于每个元素，使用双指针在其右侧寻找两个元素，使得三数之和为0。需要注意去重处理。'
      },
      {
        id: 103,
        title: '最长回文子串',
        description: '给你一个字符串 s，找到 s 中最长的回文子串。',
        type: 'essay',
        difficulty: 'medium',
        options: [],
        correctAnswer: '可以使用动态规划或中心扩展法。中心扩展法的思路是遍历每个字符，以该字符为中心向两边扩展，找到最长的回文子串。需要考虑奇数和偶数长度的回文。'
      }
    ]
  },
  [2]: {
    id: 2,
    title: '前端框架高频题',
    description: 'Vue、React、Angular 等前端框架的常见面试题',
    category: '前端',
    questionCount: 32,
    estimatedTime: '60分钟',
    passRate: 65,
    questions: [
      {
        id: 201,
        title: 'Vue3 的响应式原理',
        description: '请解释 Vue3 的响应式原理。',
        type: 'essay',
        difficulty: 'medium',
        options: [],
        correctAnswer: 'Vue3 使用 Proxy 实现响应式，相比 Vue2 的 Object.defineProperty，Proxy 可以监听对象的所有属性，包括新增和删除的属性，并且可以监听数组的变化。'
      },
      {
        id: 202,
        title: 'React 的生命周期',
        description: '请描述 React 的生命周期。',
        type: 'essay',
        difficulty: 'easy',
        options: [],
        correctAnswer: 'React 的生命周期包括：挂载阶段（componentDidMount）、更新阶段（componentDidUpdate）和卸载阶段（componentWillUnmount）。在 React 16.3 之后，引入了新的生命周期方法，如 getDerivedStateFromProps、getSnapshotBeforeUpdate 等。'
      },
      {
        id: 203,
        title: '虚拟 DOM 的工作原理',
        description: '请解释虚拟 DOM 的工作原理。',
        type: 'essay',
        difficulty: 'hard',
        options: [],
        correctAnswer: '虚拟 DOM 是对真实 DOM 的抽象，是一个轻量级的 JavaScript 对象。当组件状态变化时，React 会创建一个新的虚拟 DOM 树，然后与旧的虚拟 DOM 树进行比较，找出差异，最后只更新需要变化的部分，从而提高性能。'
      }
    ]
  },
  [3]: {
    id: 3,
    title: '系统设计基础',
    description: '分布式系统、微服务、缓存等系统设计相关问题',
    category: '后端',
    questionCount: 18,
    estimatedTime: '90分钟',
    passRate: 55,
    questions: [
      {
        id: 301,
        title: '如何设计一个高可用的系统',
        description: '请简述如何设计一个高可用的系统。',
        type: 'essay',
        difficulty: 'hard',
        options: [],
        correctAnswer: '设计高可用系统需要考虑：1. 冗余设计：多实例部署，避免单点故障；2. 负载均衡：分发请求，提高系统吞吐量；3. 故障检测：及时发现和处理故障；4. 自动恢复：故障发生后自动切换到备用系统；5. 监控告警：实时监控系统状态，及时发现问题。'
      },
      {
        id: 302,
        title: '缓存的设计与使用',
        description: '请简述缓存的设计与使用原则。',
        type: 'essay',
        difficulty: 'medium',
        options: [],
        correctAnswer: '缓存设计与使用原则包括：1. 缓存策略：选择合适的缓存策略，如 LRU、LFU 等；2. 缓存一致性：确保缓存与数据源的一致性；3. 缓存穿透：防止查询不存在的数据导致缓存失效；4. 缓存击穿：防止热点数据过期导致的数据库压力；5. 缓存雪崩：防止大量缓存同时过期导致的系统压力。'
      }
    ]
  }
}

// 根据路由参数获取题库数据
const practiceData = ref(questionBanks[Number(route.params.id)] || questionBanks[1])

// 监听路由参数变化，更新题库数据
watch(() => route.params.id, (newId) => {
  practiceData.value = questionBanks[Number(newId)] || questionBanks[1]
  // 重置练习状态
  currentQuestionIndex.value = 0
  selectedAnswers.value = {}
  showResult.value = false
  // 重置加载状态
  isLoading.value = false
})

const currentQuestion = computed(() => {
  return practiceData.value.questions[currentQuestionIndex.value]
})

const progress = computed(() => {
  return ((currentQuestionIndex.value + 1) / practiceData.value.questions.length) * 100
})

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value === practiceData.value.questions.length - 1
})

const submitPractice = () => {
  showResult.value = true
}

const nextQuestion = () => {
  if (!isLastQuestion.value) {
    currentQuestionIndex.value++
  } else {
    submitPractice()
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const handleAnswerSelect = (optionId: string) => {
  selectedAnswers.value[currentQuestion.value.id] = optionId
}

const handleEssayAnswer = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  selectedAnswers.value[currentQuestion.value.id] = target.value
}

const restartPractice = () => {
  currentQuestionIndex.value = 0
  selectedAnswers.value = {}
  showResult.value = false
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  // 模拟加载
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
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
