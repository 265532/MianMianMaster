<script setup lang="ts">
import { 
  BookOpen, 
  Search, 
  ChevronRight, 
  Zap, 
  Code2, 
  FileText, 
  Database, 
  Cpu, 
  Layout, 
  Layers,
  Sparkles,
  PlayCircle
} from 'lucide-vue-next'

const categories = [
  { id: 1, name: '前端开发', icon: Layout, count: 450, color: 'text-primary' },
  { id: 2, name: '后端架构', icon: Database, count: 320, color: 'text-auxiliary-orange' },
  { id: 3, name: '算法数据结构', icon: Cpu, count: 280, color: 'text-auxiliary-green' },
  { id: 4, name: '系统设计', icon: Layers, count: 150, color: 'text-neutral-title' },
]

const recentTopics = [
  { id: 1, title: 'Vue3 响应式底层原理深度解析', type: '前端', views: '2.4k' },
  { id: 2, title: 'MySQL 索引优化与事务隔离级别', type: '后端', views: '1.8k' },
  { id: 3, title: '动态规划：从入门到大厂实战题解', type: '算法', views: '3.1k' },
]
</script>

<template>
  <div class="flex flex-col gap-8 max-w-7xl mx-auto">
    <!-- Header: Knowledge Base -->
    <div class="gradient-primary p-10 rounded-[40px] text-white relative overflow-hidden shadow-xl">
      <div class="relative z-10 max-w-2xl">
        <h1 class="text-4xl font-black mb-4 tracking-tight">AI 面试知识库</h1>
        <p class="text-white/80 mb-8 text-lg leading-relaxed">系统化的面试知识图谱，结合大厂真实题库，为您提供全方位的技术储备与解题思路。</p>
        
        <!-- Search Box -->
        <div class="relative max-w-lg group">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform" :size="20" />
          <input 
            type="text" 
            placeholder="搜索知识点、面试真题、大厂面经..." 
            class="w-full pl-12 pr-6 py-4 bg-white text-neutral-title rounded-2xl shadow-lg border-none focus:ring-4 focus:ring-white/20 transition-all text-sm font-medium"
          />
        </div>
      </div>
      <div class="absolute -right-20 -bottom-20 opacity-10">
        <BookOpen :size="320" />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      <!-- Left: Categories & Topics -->
      <div class="lg:col-span-8 space-y-8">
        <!-- Knowledge Categories -->
        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border">
          <h2 class="text-xl font-bold text-neutral-title mb-8 flex items-center gap-3">
            <div class="w-2 h-6 gradient-primary rounded-full"></div>
            知识分类
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="cat in categories" :key="cat.id" class="p-6 bg-neutral-bg rounded-[24px] hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-neutral-border group cursor-pointer text-center">
              <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:gradient-primary group-hover:text-white transition-all">
                <cat.icon :size="24" />
              </div>
              <h3 class="text-sm font-bold text-neutral-title mb-1">{{ cat.name }}</h3>
              <p class="text-[10px] text-neutral-helper font-bold uppercase">{{ cat.count }} 知识点</p>
            </div>
          </div>
        </div>

        <!-- Recent Hot Topics -->
        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-xl font-bold text-neutral-title flex items-center gap-3">
              <Zap :size="24" class="text-primary" />
              热门面试解析
            </h2>
            <button class="text-primary text-xs font-bold hover:underline flex items-center gap-1">查看全部 <ChevronRight :size="14" /></button>
          </div>
          <div class="space-y-4">
            <div v-for="topic in recentTopics" :key="topic.id" class="p-6 bg-neutral-bg rounded-[24px] hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border group cursor-pointer flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:gradient-primary group-hover:text-white transition-all">
                  <Code2 :size="20" />
                </div>
                <div>
                  <h4 class="text-sm font-bold text-neutral-title group-hover:text-primary transition-colors">{{ topic.title }}</h4>
                  <div class="flex items-center gap-3 mt-1">
                    <span class="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full">{{ topic.type }}</span>
                    <span class="text-[10px] text-neutral-helper">{{ topic.views }} 阅读</span>
                  </div>
                </div>
              </div>
              <ChevronRight :size="18" class="text-neutral-helper group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Learning Path & Certification -->
      <div class="lg:col-span-4 space-y-8">
        <div class="bg-neutral-title p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden h-full flex flex-col">
          <div class="relative z-10 flex-1">
            <div class="flex items-center gap-3 mb-8">
              <Sparkles :size="32" class="text-auxiliary-orange" />
              <h2 class="text-2xl font-black italic">专项通关路径</h2>
            </div>
            <p class="text-white/60 text-sm mb-8 leading-relaxed">基于 AI 模型分析判断，为您推荐最适合的通关路径。不仅预测面试问题，还提供解题思路和回答要点。</p>
            
            <div class="space-y-6">
              <div v-for="path in [{n:'简历押题专项', d:'预测面试官提问', i:FileText}, {n:'沉浸式综合模拟', d:'模拟完整面试流程', i:PlayCircle}]" :key="path.n" class="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <div class="p-2 bg-primary/20 rounded-xl text-primary"><component :is="path.i" :size="20" /></div>
                <div>
                  <h4 class="text-sm font-bold">{{ path.n }}</h4>
                  <p class="text-[10px] text-white/40">{{ path.d }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <button class="w-full mt-8 py-4 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 group relative z-10">
            开启首次练习
            <ChevronRight :size="20" class="group-hover:translate-x-1 transition-transform" />
          </button>

          <div class="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform">
            <Database :size="240" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
