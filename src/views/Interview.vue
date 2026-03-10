<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  Mic, 
  Send, 
  SkipForward, 
  Square, 
  Clock,
  AlertCircle,
  Brain,
  MessageCircle,
  Sparkles,
  Zap,
  Target,
  Languages,
  Users,
  Trophy,
  History,
  CheckCircle2,
  ChevronRight
} from 'lucide-vue-next'

const timeLeft = ref(60)
const interviewTime = ref(0)
const isRecording = ref(false)
const answerText = ref('')
const currentQuestion = ref('请结合你的项目经历，谈谈你对 Vue3 响应式原理的理解，以及它与 Vue2 相比有哪些优势？')
const answeredCount = ref(3)
const totalQuestions = ref(5)

// New Feature States
const interviewMode = ref('technical') // technical, group, leaderless
const difficulty = ref('medium') // easy, medium, hard
const language = ref('zh') // zh, en, jp, de
const showModelAnswer = ref(false)
const isFinished = ref(false)

const fluencyScore = ref(85)
const logicScore = ref(78)
const matchingScore = ref(92)

let timer: number
let interviewTimer: number

onMounted(() => {
  startTimers()
})

const startTimers = () => {
  timer = setInterval(() => {
    if (timeLeft.value > 0) timeLeft.value--
  }, 1000)

  interviewTimer = setInterval(() => {
    interviewTime.value++
  }, 1000)
}

onUnmounted(() => {
  clearInterval(timer)
  clearInterval(interviewTimer)
})

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const toggleRecording = () => {
  isRecording.value = !isRecording.value
}

const submitAnswer = () => {
  if (answeredCount.value + 1 >= totalQuestions.value) {
    isFinished.value = true
    clearInterval(timer)
    clearInterval(interviewTimer)
  } else {
    answeredCount.value++
    timeLeft.value = 60
    answerText.value = ''
    showModelAnswer.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6 max-w-7xl mx-auto">
    <!-- Header: Mode & Settings -->
    <div class="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-border shadow-sm">
      <div class="flex items-center gap-6">
        <!-- Mode Switcher -->
        <div class="flex bg-neutral-bg p-1 rounded-xl">
          <button 
            v-for="mode in [{id:'technical', label:'技术面试', icon:Zap}, {id:'group', label:'小组面试', icon:Users}, {id:'leaderless', label:'无领导小组', icon:MessageCircle}]"
            :key="mode.id"
            @click="interviewMode = mode.id"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
            :class="interviewMode === mode.id ? 'bg-white text-primary shadow-sm' : 'text-neutral-helper hover:text-neutral-body'"
          >
            <component :is="mode.icon" :size="16" />
            {{ mode.label }}
          </button>
        </div>

        <!-- Difficulty -->
        <div class="flex items-center gap-2 px-4 py-2 bg-neutral-bg rounded-xl">
          <Trophy :size="16" class="text-auxiliary-orange" />
          <select v-model="difficulty" class="bg-transparent border-none text-xs font-bold text-neutral-title focus:ring-0 cursor-pointer">
            <option value="easy">入门难度</option>
            <option value="medium">进阶难度</option>
            <option value="hard">专业难度</option>
          </select>
        </div>

        <!-- Language -->
        <div class="flex items-center gap-2 px-4 py-2 bg-neutral-bg rounded-xl">
          <Languages :size="16" class="text-primary" />
          <select v-model="language" class="bg-transparent border-none text-xs font-bold text-neutral-title focus:ring-0 cursor-pointer">
            <option value="zh">中文 (CN)</option>
            <option value="en">English (US)</option>
            <option value="jp">日本語 (JP)</option>
            <option value="de">Deutsch (DE)</option>
          </select>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl text-primary font-bold text-sm">
          <History :size="16" />
          {{ formatTime(interviewTime) }}
        </div>
      </div>
    </div>

    <div v-if="!isFinished" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      <!-- Left: Interview Area -->
      <div class="lg:col-span-8 flex flex-col gap-6">
        <!-- Question Card -->
        <div class="bg-white rounded-3xl border border-neutral-border p-8 shadow-sm relative overflow-hidden group">
          <div class="flex justify-between items-start mb-6">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl gradient-cyan-yellow flex items-center justify-center text-primary font-bold text-xl shadow-inner">
                Q{{ answeredCount + 1 }}
              </div>
              <div>
                <h2 class="text-lg font-bold text-neutral-title">当前挑战</h2>
                <p class="text-xs text-neutral-helper">智能题库随机生成</p>
              </div>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 bg-neutral-bg rounded-xl">
              <Clock :size="18" class="text-primary" />
              <span class="text-xl font-mono font-bold" :class="timeLeft < 10 ? 'text-auxiliary-orange animate-pulse' : 'text-primary'">
                00:{{ timeLeft.toString().padStart(2, '0') }}
              </span>
            </div>
          </div>
          
          <p class="text-xl text-neutral-title leading-relaxed font-medium mb-6">
            {{ currentQuestion }}
          </p>
          
          <div class="flex items-center gap-4">
            <button 
              @click="showModelAnswer = !showModelAnswer"
              class="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <Sparkles :size="14" />
              {{ showModelAnswer ? '隐藏参考答案' : '查看 AI 参考答案' }}
            </button>
          </div>

          <!-- Model Answer Comparison -->
          <Transition name="fade">
            <div v-if="showModelAnswer" class="mt-6 p-6 bg-primary/5 rounded-2xl border border-primary/20 animate-in slide-in-from-top-4 duration-300">
              <p class="text-xs font-bold text-primary mb-2 uppercase tracking-widest">AI 模型参考答案：</p>
              <p class="text-sm text-neutral-body leading-relaxed">
                Vue3 响应式原理基于 ES6 的 Proxy 实现。相比 Vue2 的 Object.defineProperty，Proxy 可以直接监听对象而非属性，支持数组索引变化监听，且无需递归初始化，极大提升了性能和灵活性。
              </p>
            </div>
          </Transition>
        </div>

        <!-- Answer Area -->
        <div class="bg-white rounded-3xl border border-neutral-border p-8 shadow-sm flex-1 flex flex-col gap-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-2 h-6 gradient-primary rounded-full"></div>
              <h3 class="font-bold text-neutral-title">多维度交互输入</h3>
            </div>
            <div class="flex items-center gap-4">
              <div v-if="isRecording" class="flex items-center gap-2 text-auxiliary-orange bg-auxiliary-orange/10 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                语音识别中...
              </div>
              <span class="text-xs text-neutral-helper">{{ answerText.length }} / 2000 字</span>
            </div>
          </div>

          <textarea 
            v-model="answerText"
            class="w-full h-48 p-6 bg-neutral-bg rounded-2xl border-2 border-transparent focus:border-primary/20 focus:bg-white resize-none text-neutral-title transition-all duration-300 placeholder:text-neutral-helper/50"
            placeholder="支持语音及文字双向输入，AI 将自动分析您的表达深度..."
          ></textarea>

          <div class="flex items-center justify-between">
            <button 
              @click="toggleRecording"
              class="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-md group"
              :class="isRecording ? 'bg-auxiliary-orange text-white' : 'bg-neutral-bg text-neutral-title hover:bg-primary/10 hover:text-primary'"
            >
              <Mic v-if="!isRecording" :size="20" />
              <Square v-else :size="20" />
              {{ isRecording ? '停止说话' : '语音回答' }}
            </button>

            <div class="flex gap-3">
              <button class="px-6 py-3 bg-neutral-bg text-neutral-body font-bold rounded-2xl hover:bg-neutral-border/50 transition-all flex items-center gap-2">
                <SkipForward :size="18" />
                跳过
              </button>
              <button 
                @click="submitAnswer"
                class="px-10 py-3 gradient-primary text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2 transform active:scale-95"
              >
                <Send :size="18" />
                提交并继续
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: AI Analysis -->
      <div class="lg:col-span-4 flex flex-col gap-6">
        <!-- Progress Card -->
        <div class="bg-white rounded-3xl border border-neutral-border p-6 shadow-sm">
          <div class="flex justify-between items-end mb-4">
            <div>
              <p class="text-xs text-neutral-helper uppercase mb-1">已完成题数</p>
              <div class="flex items-baseline gap-1">
                <span class="text-4xl font-black text-primary">{{ answeredCount + 1 }}</span>
                <span class="text-sm text-neutral-helper font-medium">/ {{ totalQuestions }}</span>
              </div>
            </div>
            <div class="text-right">
              <p class="text-xs text-neutral-helper uppercase mb-1">岗位匹配度</p>
              <p class="text-xl font-black text-auxiliary-green">{{ matchingScore }}%</p>
            </div>
          </div>
          <div class="flex gap-1 mb-6">
            <div 
              v-for="i in totalQuestions" 
              :key="i"
              class="h-2 flex-1 rounded-full transition-all duration-500"
              :class="i <= answeredCount + 1 ? 'bg-primary' : 'bg-neutral-bg'"
            ></div>
          </div>
        </div>

        <!-- AI Feedback -->
        <div class="bg-white rounded-3xl border border-neutral-border p-6 shadow-sm flex-1 flex flex-col">
          <h3 class="font-bold text-neutral-title mb-6 flex items-center gap-2">
            <Brain :size="20" class="text-primary" />
            即时能力评估
          </h3>
          
          <div class="space-y-6 flex-1">
            <div v-for="metric in [{label:'专业知识深度', value:fluencyScore}, {label:'表达逻辑条理', value:logicScore}]" :key="metric.label" class="space-y-2">
              <div class="flex justify-between text-xs">
                <span class="text-neutral-body">{{ metric.label }}</span>
                <span class="font-bold text-primary">{{ metric.value }}%</span>
              </div>
              <div class="h-1.5 bg-neutral-bg rounded-full overflow-hidden">
                <div class="h-full bg-primary transition-all duration-1000" :style="{ width: `${metric.value}%` }"></div>
              </div>
            </div>

            <div class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50">
              <p class="text-xs font-bold text-neutral-title mb-1 flex items-center gap-1">
                <AlertCircle :size="12" class="text-auxiliary-orange" />
                面试复盘建议
              </p>
              <p class="text-[11px] text-neutral-body leading-relaxed">
                在回答 Vue3 优势时，如果能对比 **Tree-shaking** 的支持，评分将更高。
              </p>
            </div>
          </div>
        </div>

        <button class="w-full py-4 bg-auxiliary-orange/10 text-auxiliary-orange font-bold rounded-2xl hover:bg-auxiliary-orange hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group shadow-sm">
          <Square :size="18" />
          终止当前面试
        </button>
      </div>
    </div>

    <!-- Final Result / Instant Review Summary -->
    <div v-else class="bg-white rounded-[32px] p-12 shadow-xl border border-neutral-border max-w-4xl mx-auto text-center animate-in zoom-in-95 duration-500">
      <div class="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-lg shadow-primary/30">
        <CheckCircle2 :size="40" />
      </div>
      <h2 class="text-4xl font-black text-neutral-title mb-4 tracking-tight">面试挑战已完成！</h2>
      <p class="text-neutral-helper mb-12">基于 AI 岗位图谱分析，您本次的表现如下：</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="bg-neutral-bg p-6 rounded-3xl border border-neutral-border/50">
          <p class="text-xs text-neutral-helper uppercase mb-2">Offer 胜算 Rank</p>
          <p class="text-3xl font-black text-primary">TOP 15%</p>
        </div>
        <div class="bg-neutral-bg p-6 rounded-3xl border border-neutral-border/50">
          <p class="text-xs text-neutral-helper uppercase mb-2">岗位匹配度</p>
          <p class="text-3xl font-black text-auxiliary-green">89.5%</p>
        </div>
        <div class="bg-neutral-bg p-6 rounded-3xl border border-neutral-border/50">
          <p class="text-xs text-neutral-helper uppercase mb-2">综合技术评分</p>
          <p class="text-3xl font-black text-auxiliary-orange">A+</p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button class="px-10 py-4 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2">
          一键生成多维度报告
          <ChevronRight :size="20" />
        </button>
        <button @click="isFinished = false; answeredCount = 0; startTimers()" class="px-10 py-4 bg-neutral-bg text-neutral-title font-bold rounded-2xl hover:bg-neutral-border/50 transition-all">
          重新复盘通关
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
