<script setup lang="ts">
import { 
  MessageSquare, 
  UserCircle, 
  Bot, 
  Award, 
  ChevronRight, 
  Mic, 
  PlayCircle,
  FileText,
  RotateCcw,
  Sparkles,
  History
} from 'lucide-vue-next'

const communityPosts = [
  { id: 1, author: '匿名同学', type: '前端面试', content: '刚刚结束了某大厂的二面，AI 点评说我的逻辑非常清晰，分享给大家...', likes: 128, comments: 24 },
  { id: 2, author: '面霸', type: '后端复盘', content: '关于 Java 线程池的深度分析报告已出具，内含 AI 针对性的优化建议...', likes: 256, comments: 48 },
]
</script>

<template>
  <div class="flex flex-col gap-8 max-w-7xl mx-auto">
    <!-- Header: Community Section -->
    <div class="gradient-primary p-10 rounded-[40px] text-white relative overflow-hidden shadow-xl">
      <div class="relative z-10 max-w-2xl">
        <h1 class="text-4xl font-black mb-4 tracking-tight">面试复盘社区</h1>
        <p class="text-white/80 mb-8 text-lg leading-relaxed">匿名分享面试录音与文本报告，获取 AI 和资深面试官点评，共同在“面试智慧树”下成长。</p>
        <div class="flex flex-wrap gap-4">
          <button class="px-8 py-4 bg-white text-primary font-bold rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-2">
            <Mic :size="20" />
            匿名分享复盘报告
          </button>
          <button class="px-8 py-4 bg-white/20 backdrop-blur-md text-white font-bold rounded-2xl hover:bg-white/30 transition-all">我的历史存档</button>
        </div>
      </div>
      <div class="absolute -right-20 -top-20 opacity-10">
        <MessageSquare :size="320" />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      <!-- Left: Community Posts -->
      <div class="lg:col-span-8 space-y-8">
        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-xl font-bold text-neutral-title flex items-center gap-3">
              <div class="w-2 h-6 gradient-primary rounded-full"></div>
              社群优质动态
            </h2>
            <div class="flex bg-neutral-bg p-1 rounded-xl">
              <button class="px-4 py-2 bg-white text-primary font-bold rounded-lg text-xs shadow-sm">热门复盘</button>
              <button class="px-4 py-2 text-neutral-helper text-xs font-bold hover:text-neutral-body">最新发布</button>
            </div>
          </div>
          
          <div class="space-y-6">
            <div v-for="post in communityPosts" :key="post.id" class="p-8 bg-neutral-bg rounded-[32px] hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-neutral-border group cursor-pointer relative overflow-hidden">
              <div class="flex items-center gap-4 mb-4 relative z-10">
                <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm group-hover:gradient-primary group-hover:text-white transition-all">
                  <UserCircle :size="24" />
                </div>
                <div>
                  <h4 class="text-sm font-bold text-neutral-title">{{ post.author }}</h4>
                  <p class="text-[10px] text-neutral-helper uppercase font-bold">{{ post.type }}</p>
                </div>
              </div>
              <p class="text-sm text-neutral-body leading-relaxed mb-6 relative z-10 line-clamp-3">
                {{ post.content }}
              </p>
              <div class="flex items-center gap-6 relative z-10">
                <div class="flex items-center gap-2 text-xs text-neutral-helper">
                  <Sparkles :size="16" class="text-primary" />
                  <span class="font-bold">AI 已点评</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-neutral-helper">
                  <MessageSquare :size="16" />
                  <span class="font-bold">{{ post.comments }} 讨论</span>
                </div>
              </div>
              <div class="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:scale-110 transition-transform">
                <Bot :size="140" />
              </div>
            </div>
          </div>
        </div>

        <!-- Meeting Records Management -->
        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border">
          <h2 class="text-xl font-bold text-neutral-title mb-8 flex items-center gap-3">
            <History :size="24" class="text-primary" />
            多轮会议记录管理
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-6 bg-neutral-bg rounded-[24px] border border-neutral-border flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-auxiliary-orange shadow-sm group-hover:gradient-yellow-orange group-hover:text-white transition-all">
                  <PlayCircle :size="24" />
                </div>
                <div>
                  <h4 class="text-sm font-bold text-neutral-title">本地存档上传</h4>
                  <p class="text-[10px] text-neutral-helper leading-tight">支持回放并自动分析不足</p>
                </div>
              </div>
              <button class="p-2 text-neutral-helper hover:text-primary transition-colors"><ChevronRight :size="20" /></button>
            </div>
            <div class="p-6 bg-neutral-bg rounded-[24px] border border-neutral-border flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:gradient-primary group-hover:text-white transition-all">
                  <FileText :size="24" />
                </div>
                <div>
                  <h4 class="text-sm font-bold text-neutral-title">AI 优化提升方案</h4>
                  <p class="text-[10px] text-neutral-helper leading-tight">基于录音文本出具修改方案</p>
                </div>
              </div>
              <button class="p-2 text-neutral-helper hover:text-primary transition-colors"><ChevronRight :size="20" /></button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Knowledge Tree -->
      <div class="lg:col-span-4 space-y-8">
        <div class="bg-neutral-title p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden h-full flex flex-col">
          <div class="relative z-10 flex-1">
            <div class="flex items-center gap-3 mb-8">
              <Award :size="32" class="text-auxiliary-orange" />
              <h2 class="text-2xl font-black italic">面试智慧树</h2>
            </div>
            <p class="text-white/60 text-sm mb-8 leading-relaxed">系统整合社群优质点评，通过算法聚合生成“智慧树”优化课程。为您的个人人格与能力进行精准对标参考。</p>
            
            <div class="space-y-4">
              <div v-for="node in [{n:'逻辑层分析', v:92}, {n:'表达结构', v:85}, {n:'专业深度', v:78}]" :key="node.n" class="space-y-2">
                <div class="flex justify-between text-[10px] font-bold uppercase text-white/40 tracking-widest">
                  <span>{{ node.n }}</span>
                  <span>{{ node.v }}%</span>
                </div>
                <div class="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full bg-primary" :style="{width: node.v + '%'}"></div>
                </div>
              </div>
            </div>
          </div>
          
          <button class="w-full mt-8 py-4 bg-white text-neutral-title font-bold rounded-2xl shadow-lg hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group relative z-10">
            解锁智慧课程
            <ChevronRight :size="20" class="group-hover:translate-x-1 transition-transform" />
          </button>

          <div class="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform">
            <Sparkles :size="240" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
