<script setup lang="ts">
import { 
  TrendingUp, 
  BookOpen, 
  RotateCcw, 
  Trophy, 
  ChevronRight, 
  PieChart, 
  Zap,
  PlayCircle
} from 'lucide-vue-next'

const stats = [
  { label: '已掌握能力', value: '72%', icon: PieChart, color: 'text-primary' },
  { label: '技能缺口', value: '28%', icon: TrendingUp, color: 'text-auxiliary-orange' },
  { label: '专属题库', value: '12 组', icon: BookOpen, color: 'text-auxiliary-green' }
]
</script>

<template>
  <div class="flex flex-col gap-8 max-w-7xl mx-auto">
    <!-- Header: Growth Tracking -->
    <div class="gradient-primary p-10 rounded-[40px] text-white relative overflow-hidden shadow-xl">
      <div class="relative z-10 max-w-2xl">
        <h1 class="text-4xl font-black mb-4 tracking-tight">个性化能力提升</h1>
        <p class="text-white/80 mb-8 text-lg leading-relaxed">强化学习引擎，覆盖错题本与上料存档，让每一次技能进阶都清晰可见。</p>
        <div class="flex flex-wrap gap-4">
          <div v-for="stat in stats" :key="stat.label" class="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10 flex items-center gap-4">
            <stat.icon :size="24" :class="stat.color" />
            <div>
              <p class="text-[10px] text-white/60 uppercase font-bold">{{ stat.label }}</p>
              <p class="text-xl font-black">{{ stat.value }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute -right-10 -bottom-10 opacity-10">
        <TrendingUp :size="280" />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      <!-- Left: Learning Engine & Paths -->
      <div class="lg:col-span-8 space-y-8">
        <!-- Growth Track Map -->
        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl gradient-cyan-yellow flex items-center justify-center text-primary shadow-md">
                <TrendingUp :size="20" />
              </div>
              <div>
                <h2 class="text-lg font-bold text-neutral-title tracking-tight">成长轨迹可视化</h2>
                <p class="text-xs text-neutral-helper">历程数据图谱：展示已掌握能力</p>
              </div>
            </div>
            <button class="px-4 py-2 bg-neutral-bg text-neutral-body text-xs font-bold rounded-xl hover:bg-neutral-border/50 transition-all">全屏查看</button>
          </div>
          
          <div class="p-8 bg-neutral-bg rounded-[32px] relative overflow-hidden border border-neutral-border/50 group hover:bg-white hover:shadow-lg transition-all">
            <div class="flex flex-col gap-6">
              <div v-for="skill in [{name:'Vue3 核心原理', progress:85, status:'已掌握', icon:Zap}, {name:'前端工程化架构', progress:45, status:'强化中', icon:TrendingUp}, {name:'TypeScript 深度实践', progress:15, status:'待进行', icon:BookOpen}]" :key="skill.name" class="p-4 bg-white rounded-2xl border border-neutral-border flex items-center justify-between group-hover:shadow-sm transition-all">
                <div class="flex items-center gap-4">
                  <div class="p-2 bg-neutral-bg rounded-xl text-primary"><skill.icon :size="20" /></div>
                  <div>
                    <h4 class="text-sm font-bold text-neutral-title">{{ skill.name }}</h4>
                    <p class="text-[10px] text-neutral-helper">标注目标岗位所需技能</p>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-2">
                  <div class="h-2 w-32 bg-neutral-bg rounded-full overflow-hidden">
                    <div class="h-full bg-primary" :style="{width: skill.progress + '%'}"></div>
                  </div>
                  <span class="text-[10px] font-bold uppercase" :class="skill.status === '已掌握' ? 'text-auxiliary-green' : 'text-primary'">{{ skill.status }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reinforcement Learning -->
        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border">
          <h2 class="text-xl font-bold text-neutral-title mb-8 flex items-center gap-3">
            <RotateCcw :size="24" class="text-primary" />
            强化学习引擎
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-8 gradient-yellow-orange rounded-[32px] text-white shadow-lg relative overflow-hidden group cursor-pointer active:scale-95 transition-all">
              <div class="relative z-10">
                <h3 class="text-2xl font-black mb-2">错题本复盘</h3>
                <p class="text-white/80 text-sm mb-6 leading-relaxed">系统自动存档所有历史面试中的薄弱知识点，助您精准突击。</p>
                <button class="px-6 py-3 bg-white text-auxiliary-orange font-bold rounded-xl shadow-md">进入复盘</button>
              </div>
              <div class="absolute -right-6 -bottom-6 opacity-20 group-hover:scale-110 transition-transform">
                <RotateCcw :size="140" />
              </div>
            </div>
            <div class="p-8 bg-neutral-title rounded-[32px] text-white shadow-lg relative overflow-hidden group cursor-pointer active:scale-95 transition-all">
              <div class="relative z-10">
                <h3 class="text-2xl font-black mb-2">上料存档中心</h3>
                <p class="text-white/80 text-sm mb-6 leading-relaxed">管理您的所有视频学习上料及面试存档记录，随时回看提升。</p>
                <button class="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-md">管理存档</button>
              </div>
              <div class="absolute -right-6 -bottom-6 opacity-20 group-hover:scale-110 transition-transform">
                <Trophy :size="140" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Job Exclusive Banks -->
      <div class="lg:col-span-4 space-y-8">
        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border flex flex-col h-full">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 rounded-2xl gradient-cyan-yellow flex items-center justify-center text-primary shadow-md">
              <BookOpen :size="20" />
            </div>
            <h2 class="text-lg font-bold text-neutral-title">岗位专属题库</h2>
          </div>
          
          <div class="space-y-4 flex-1">
            <div v-for="bank in [{n:'Java 核心面试题', c:'1200+ 题'}, {n:'Go 并发编程专场', c:'800+ 题'}, {n:'Vue3 源码深度解析', c:'450+ 题'}, {n:'MySQL 性能优化', c:'600+ 题'}]" :key="bank.n" class="p-4 bg-neutral-bg rounded-[20px] group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border flex items-center justify-between cursor-pointer">
              <div>
                <h4 class="text-sm font-bold text-neutral-title">{{ bank.n }}</h4>
                <p class="text-[10px] text-neutral-helper">支持面试复盘与同行衡量</p>
              </div>
              <div class="p-2 bg-white rounded-xl text-primary group-hover:gradient-primary group-hover:text-white transition-all shadow-sm">
                <ChevronRight :size="16" />
              </div>
            </div>
          </div>

          <div class="mt-8 p-6 bg-primary/5 rounded-[24px] border border-primary/20 flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center text-white">
              <PlayCircle :size="24" />
            </div>
            <div>
              <p class="text-xs font-bold text-primary">个性化推荐</p>
              <p class="text-[10px] text-neutral-body leading-tight">基于您的匹配度推荐专属题库</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
