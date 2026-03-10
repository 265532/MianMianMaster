<script setup lang="ts">
import { 
  Target, 
  Sparkles, 
  Gamepad2, 
  ChevronRight, 
  Brain, 
  PieChart,
  UserCheck,
  TrendingUp
} from 'lucide-vue-next'

const assessmentTypes = [
  { name: '岗位技能测评', desc: '基于能力图谱匹配', status: '进行中', color: 'text-primary' },
  { name: '职业心理测评', desc: 'MBTI 专业性格测试', status: '待开始', color: 'text-auxiliary-orange' },
  { name: '综合技术测评', desc: '专业水平与沟通评估', status: '待开始', color: 'text-auxiliary-green' }
]
</script>

<template>
  <div class="flex flex-col gap-8 max-w-7xl mx-auto">
    <!-- Hero: Job Matching -->
    <div class="gradient-primary p-10 rounded-[40px] text-white relative overflow-hidden shadow-xl">
      <div class="relative z-10 max-w-2xl">
        <h1 class="text-4xl font-black mb-4">岗位匹配与职业测评</h1>
        <p class="text-white/80 mb-8 text-lg">基于岗位知识图谱，计算个人能力与目标岗位的匹配百分比，为您推荐最精准的求职方向。</p>
        <div class="flex gap-4">
          <button class="px-8 py-4 bg-white text-primary font-bold rounded-2xl shadow-lg hover:scale-105 transition-all">开始智能匹配测评</button>
          <button class="px-8 py-4 bg-white/20 backdrop-blur-md text-white font-bold rounded-2xl hover:bg-white/30 transition-all">查看分析报告</button>
        </div>
      </div>
      <div class="absolute -right-20 -bottom-20 opacity-10">
        <Target :size="320" />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      <!-- Left: Assessments -->
      <div class="lg:col-span-8 space-y-8">
        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border">
          <h2 class="text-xl font-bold text-neutral-title mb-8 flex items-center gap-3">
            <div class="w-2 h-6 gradient-primary rounded-full"></div>
            一体化分析报告
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="type in assessmentTypes" :key="type.name" class="p-6 bg-neutral-bg rounded-[24px] hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-neutral-border group cursor-pointer">
              <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:gradient-primary group-hover:text-white transition-all">
                <PieChart :size="24" />
              </div>
              <h3 class="font-bold text-neutral-title mb-1">{{ type.name }}</h3>
              <p class="text-xs text-neutral-helper mb-4">{{ type.desc }}</p>
              <div class="flex items-center justify-between mt-auto">
                <span class="text-[10px] font-bold uppercase" :class="type.color">{{ type.status }}</span>
                <ChevronRight :size="16" class="text-neutral-helper" />
              </div>
            </div>
          </div>
        </div>

        <!-- AI Learning Plan -->
        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-xl font-bold text-neutral-title flex items-center gap-3">
              <Sparkles :size="24" class="text-auxiliary-orange" />
              AI 个性化培养方案
            </h2>
          </div>
          <div class="p-8 bg-neutral-title rounded-[32px] text-white relative overflow-hidden">
            <div class="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div class="flex-1">
                <h3 class="text-2xl font-bold mb-4 italic">根据您的测评产出设计</h3>
                <p class="text-white/60 text-sm mb-6 leading-relaxed">系统将结合岗位深度分析，为您量身定制专属的学习路径，覆盖技术盲区与沟通短板。</p>
                <button class="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all">生成我的方案</button>
              </div>
              <div class="w-48 h-48 bg-white/5 rounded-full border border-white/10 flex items-center justify-center">
                <Brain :size="80" class="text-primary opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Gamified Interview -->
      <div class="lg:col-span-4">
        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border h-full flex flex-col">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 rounded-2xl gradient-cyan-yellow flex items-center justify-center text-primary shadow-md">
              <Gamepad2 :size="20" />
            </div>
            <h2 class="text-lg font-bold text-neutral-title">游戏闯关式面试</h2>
          </div>
          
          <div class="space-y-6 flex-1">
            <div v-for="level in [{n:'关卡 01', t:'初级：基础知识接单', s:'已解锁'}, {n:'关卡 02', t:'中级：特定项目经验', s:'待解锁'}, {n:'关卡 03', t:'高级：复杂场景实战', s:'待解锁'}]" :key="level.n" class="p-6 bg-neutral-bg rounded-[24px] relative overflow-hidden group hover:shadow-md transition-all border border-transparent hover:border-neutral-border">
              <p class="text-[10px] font-bold text-primary uppercase mb-1">{{ level.n }}</p>
              <h4 class="font-bold text-neutral-title mb-2">{{ level.t }}</h4>
              <div class="flex items-center gap-2">
                <div class="h-1.5 w-24 bg-white rounded-full overflow-hidden">
                  <div class="h-full bg-primary" :style="{width: level.s === '已解锁' ? '100%' : '0%'}"></div>
                </div>
                <span class="text-[10px] text-neutral-helper">{{ level.s }}</span>
              </div>
            </div>
          </div>

          <button class="w-full mt-8 py-4 gradient-yellow-orange text-white font-bold rounded-2xl shadow-lg hover:shadow-auxiliary-orange/30 transition-all flex items-center justify-center gap-2">
            进入关卡模式
            <ChevronRight :size="20" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
