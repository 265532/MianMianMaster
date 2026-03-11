<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { 
  User, 
  ArrowRight, 
  FileText, 
  CheckCircle,
  TrendingUp,
  Calendar,
  Briefcase,
  Target,
  Award,
  Zap,
  BookOpen,
  History,
  Sparkles,
  PieChart,
  ShieldCheck,
  FileBadge,
  Gamepad2,
  ChevronRight,
  Search,
  Code2,
  FileWarning,
  Activity
} from 'lucide-vue-next'

const chartRef = ref<HTMLElement | null>(null)
let myChart: echarts.ECharts | null = null
const isChartLoading = ref(true)

const interviewHistory = [
  { id: 1, date: '2024-03-01', position: '前端开发工程师', score: 88, status: '已认证' },
  { id: 2, date: '2024-02-28', position: 'Java 开发工程师', score: 82, status: '已认证' },
  { id: 3, date: '2023-11-15', position: 'UI 设计师', score: 91, status: '已认证' },
]

const stats = [
  { label: '累计面试', value: '12', icon: History, color: 'text-primary' },
  { label: '平均匹配度', value: '86.5%', icon: Target, color: 'text-auxiliary-orange' },
  { label: 'AI 能力认证', value: '8', icon: ShieldCheck, color: 'text-auxiliary-green' },
]

const initChart = () => {
  if (chartRef.value) {
    isChartLoading.value = false
    myChart = echarts.init(chartRef.value)
    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        borderColor: '#18C5C7',
        borderWidth: 1,
        textStyle: { color: '#1E293B' }
      },
      legend: {
        data: ['当前能力', '岗位要求'],
        bottom: 0,
        icon: 'circle'
      },
      radar: {
        indicator: [
          { name: '技术深度', max: 100 },
          { name: '逻辑思维', max: 100 },
          { name: '表达能力', max: 100 },
          { name: '项目经验', max: 100 },
          { name: '学习潜力', max: 100 }
        ],
        splitArea: { show: false },
        axisLine: { lineStyle: { color: '#F1F5F9' } }
      },
      series: [
        {
          name: '能力对比',
          type: 'radar',
          data: [
            {
              value: [85, 78, 92, 70, 88],
              name: '当前能力',
              itemStyle: { color: '#18C5C7' },
              areaStyle: { color: 'rgba(24, 197, 199, 0.2)' }
            },
            {
              value: [90, 85, 80, 90, 85],
              name: '岗位要求',
              itemStyle: { color: '#FFC585' },
              lineStyle: { type: 'dashed' }
            }
          ]
        }
      ]
    }
    myChart.setOption(option)
  }
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  myChart?.dispose()
})

const handleResize = () => {
  myChart?.resize()
}
</script>

<template>
  <div class="flex flex-col gap-8 max-w-7xl mx-auto">
    <!-- User Profile Hero -->
    <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border relative overflow-hidden">
      <div class="flex flex-col lg:flex-row items-center lg:items-start gap-8 relative z-10">
        <div class="relative">
          <div class="w-32 h-32 rounded-[40px] gradient-cyan-yellow p-1 shadow-lg">
            <div class="w-full h-full bg-white rounded-[38px] p-1 flex items-center justify-center">
              <div class="w-full h-full bg-neutral-bg rounded-[36px] flex items-center justify-center text-neutral-helper">
                <User :size="64" stroke-width="1.5" />
              </div>
            </div>
          </div>
          <div class="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-2xl border-4 border-white shadow-md">
            <ShieldCheck :size="16" />
          </div>
        </div>

        <div class="flex-1 text-center lg:text-left">
          <div class="flex flex-col md:flex-row items-center gap-4 mb-4">
            <h1 class="text-3xl font-black text-neutral-title tracking-tight">王同学</h1>
            <div class="flex gap-2">
              <span class="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">AI 简历已认证</span>
              <span class="px-3 py-1 bg-auxiliary-orange/10 text-auxiliary-orange text-[10px] font-bold rounded-full uppercase tracking-wider">求职 Rank: Top 5%</span>
            </div>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-8">
            <div class="flex items-center gap-2 text-neutral-body">
              <Briefcase :size="16" class="text-neutral-helper" />
              <span>计算机专业 · 大三</span>
            </div>
            <div class="flex items-center gap-2 text-neutral-body">
              <FileBadge :size="16" class="text-neutral-helper" />
              <span>已获得 8 项能力背书</span>
            </div>
          </div>

          <div class="flex flex-wrap justify-center lg:justify-start gap-4">
            <div v-for="stat in stats" :key="stat.label" class="bg-neutral-bg min-w-[120px] px-6 py-4 rounded-3xl flex flex-col items-center justify-center gap-2 group hover:bg-white hover:shadow-md transition-all cursor-default border border-transparent hover:border-neutral-border">
              <stat.icon :size="20" :class="stat.color" class="opacity-80 group-hover:scale-110 transition-transform" />
              <div class="text-center">
                <p class="text-xl font-black text-neutral-title leading-tight">{{ stat.value }}</p>
                <p class="text-[10px] text-neutral-helper uppercase font-bold mt-1 tracking-tighter">{{ stat.label }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <button class="px-6 py-3 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2">
            <Sparkles :size="18" />
            AI 简历诊断
          </button>
          <button class="px-6 py-3 bg-neutral-bg text-neutral-title font-bold rounded-2xl hover:bg-neutral-border/50 transition-all flex items-center gap-2">
            <FileText :size="18" />
            更新个人档案
          </button>
        </div>
      </div>
      <div class="absolute top-0 right-0 w-64 h-64 gradient-primary opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2"></div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      <!-- Left Column -->
      <div class="lg:col-span-8 flex flex-col gap-8">
        <!-- Ability Gap Visualization -->
        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center text-white shadow-md">
                <Target :size="20" />
              </div>
              <div>
                <h2 class="text-lg font-bold text-neutral-title tracking-tight">能力差距可视化图谱</h2>
                <p class="text-xs text-neutral-helper">基于目标岗位：前端开发工程师</p>
              </div>
            </div>
            <button class="px-4 py-2 bg-neutral-bg text-neutral-body text-xs font-bold rounded-xl hover:bg-neutral-border/50 transition-all">重新分析</button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div class="relative h-64">
              <div v-if="isChartLoading" class="absolute inset-0 bg-neutral-bg animate-pulse rounded-2xl"></div>
              <div ref="chartRef" class="w-full h-full"></div>
            </div>
            <div class="space-y-4">
              <p class="text-sm font-bold text-neutral-title">待提升技能项：</p>
              <div class="space-y-3">
                <div v-for="skill in [{name:'Vue3 源码深度', gap:15}, {name:'工程化架构能力', gap:20}]" :key="skill.name" class="p-3 bg-auxiliary-yellow/10 rounded-2xl border border-auxiliary-yellow/30 flex items-center justify-between">
                  <span class="text-xs font-medium text-neutral-body">{{ skill.name }}</span>
                  <span class="text-xs font-bold text-auxiliary-orange">差距 -{{ skill.gap }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Interview Records (Last 2 Years) -->
        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border flex-1 flex flex-col">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl gradient-cyan-yellow flex items-center justify-center text-primary shadow-md">
                <History :size="20" />
              </div>
              <h2 class="text-lg font-bold text-neutral-title tracking-tight">面试实战记录 (近2年)</h2>
            </div>
            <div class="flex items-center gap-2 px-3 py-1.5 bg-neutral-bg rounded-xl border border-neutral-border">
              <Search :size="14" class="text-neutral-helper" />
              <input type="text" placeholder="搜索历史..." class="bg-transparent border-none text-xs focus:ring-0 w-24" />
            </div>
          </div>

          <div class="space-y-4 flex-1">
            <div v-for="item in interviewHistory" :key="item.id" class="group flex items-center justify-between p-4 bg-neutral-bg rounded-[20px] hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border cursor-pointer">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:gradient-primary group-hover:text-white transition-all">
                  <Activity :size="20" />
                </div>
                <div>
                  <h4 class="text-sm font-bold text-neutral-title group-hover:text-primary transition-colors">{{ item.position }}</h4>
                  <p class="text-[11px] text-neutral-helper">{{ item.date }} · 已存入本地存档</p>
                </div>
              </div>
              <div class="flex items-center gap-6">
                <div class="text-right">
                  <p class="text-lg font-black text-neutral-title">{{ item.score }}<span class="text-[10px] font-normal opacity-40 ml-0.5">分</span></p>
                  <span class="text-[10px] font-bold text-auxiliary-green uppercase">{{ item.status }}</span>
                </div>
                <ChevronRight :size="16" class="text-neutral-helper group-hover:text-primary transition-colors" />
              </div>
            </div>
          </div>
          
          <!-- Add some padding at the bottom if history is short to maintain balance -->
          <div v-if="interviewHistory.length < 4" class="flex-1 min-h-[40px]"></div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="lg:col-span-4 flex flex-col gap-8">
        <!-- AI Generated Learning Plan -->
        <div class="bg-neutral-title p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden">
          <div class="relative z-10">
            <div class="flex items-center gap-2 mb-6">
              <Sparkles :size="20" class="text-auxiliary-yellow" />
              <h3 class="font-bold text-lg">AI 学习培养方案</h3>
            </div>
            
            <div class="space-y-6">
              <div class="space-y-2">
                <p class="text-xs font-bold text-white/60 uppercase">阶段一：技术深度强化</p>
                <div class="p-4 bg-white/10 rounded-2xl border border-white/10">
                  <p class="text-sm font-medium mb-2">掌握 Vue3 响应式底层原理</p>
                  <div class="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div class="h-full bg-primary w-2/3"></div>
                  </div>
                </div>
              </div>
              <div class="space-y-2">
                <p class="text-xs font-bold text-white/60 uppercase">阶段二：实战能力进阶</p>
                <div class="p-4 bg-white/10 rounded-2xl border border-white/10">
                  <p class="text-sm font-medium mb-2">独立完成复杂工程架构设计</p>
                  <div class="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div class="h-full bg-auxiliary-orange w-1/4"></div>
                  </div>
                </div>
              </div>
            </div>

            <button class="w-full mt-8 py-4 bg-white text-neutral-title font-bold rounded-2xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group">
              进入学习引擎
              <ArrowRight :size="18" class="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div class="absolute -right-6 -bottom-6 opacity-10">
            <BookOpen :size="160" />
          </div>
        </div>

        <!-- Saved Questions / Mistake Book -->
        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border">
          <h3 class="font-bold text-neutral-title mb-6 flex items-center gap-2">
            <div class="w-2 h-6 gradient-primary rounded-full"></div>
            收藏题库与错题本
          </h3>
          <div class="grid grid-cols-1 gap-4">
            <div class="p-4 bg-neutral-bg rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-white rounded-xl text-primary shadow-sm"><Code2 :size="16" /></div>
                <span class="text-sm font-bold text-neutral-title">高频算法 50 题</span>
              </div>
              <span class="text-[10px] font-bold text-neutral-helper">24 题</span>
            </div>
            <div class="p-4 bg-neutral-bg rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-white rounded-xl text-auxiliary-orange shadow-sm"><FileWarning :size="16" /></div>
                <span class="text-sm font-bold text-neutral-title">面试错题复盘</span>
              </div>
              <span class="text-[10px] font-bold text-neutral-helper">12 题</span>
            </div>
          </div>
        </div>

        <!-- Offer Certification -->
        <div class="gradient-yellow-orange p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden group cursor-pointer flex-1 flex flex-col justify-center">
          <div class="relative z-10">
            <h3 class="text-xl font-black mb-2 italic">OFFER 胜算认证</h3>
            <p class="text-sm opacity-90 mb-6">基于全网同行数据对比</p>
            <div class="flex items-center gap-3">
              <div class="px-4 py-2 bg-white/20 rounded-xl font-black text-xl tracking-tighter">Rank: A+</div>
              <ArrowRight :size="24" class="group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
          <div class="absolute -right-4 -bottom-4 opacity-20">
            <Trophy :size="120" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
