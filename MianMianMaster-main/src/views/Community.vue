<script setup lang="ts">
import { 
  MessageSquare, 
  UserCircle, 
  Bot, 
  Award, 
  ChevronRight, 
  Mic, 
  FileText,
  Sparkles,
  Zap,
  Heart,
  Share2,
  Bookmark,
  Clock,
  Users
} from 'lucide-vue-next'

const communityPosts = [
  { id: 1, author: '匿名同学', type: '前端面试', content: '刚刚结束了某大厂的二面，AI 点评说我的逻辑非常清晰，分享给大家我的面试经验和准备方法。首先，我在面试前做了充分的准备，包括公司背景、技术栈和常见面试题。其次，我在面试过程中保持冷静，有条理地回答问题。最后，我主动询问了公司的技术栈和团队文化。希望这些经验对大家有所帮助！', likes: 128, comments: 24, time: '2小时前', avatar: '👨‍💻' },
  { id: 2, author: '面霸', type: '后端复盘', content: '关于 Java 线程池的深度分析报告已出具，内含 AI 针对性的优化建议。线程池是 Java 并发编程中的重要概念，合理使用线程池可以提高系统的性能和稳定性。在面试中，线程池也是高频考点，包括线程池的参数、工作原理和最佳实践等。我整理了一份详细的分析报告，希望对大家的面试有所帮助。', likes: 256, comments: 48, time: '4小时前', avatar: '💻' },
  { id: 3, author: '求职小白', type: '产品经理', content: '第一次面试产品经理岗位，紧张到说话结巴，AI 给了我很多表达技巧的建议。AI 建议我在面试前多练习自我介绍和常见问题的回答，保持语速适中，逻辑清晰。同时，AI 还帮我分析了产品经理面试的重点，包括产品思维、沟通能力和用户体验意识等。现在我已经掌握了一些面试技巧，希望下次面试能够表现更好。', likes: 96, comments: 18, time: '6小时前', avatar: '👩‍💼' },
  { id: 4, author: '技术大牛', type: '算法面试', content: '分享一道字节跳动的算法题，AI 提供了三种解法，从时间复杂度和空间复杂度分析。这道题是关于数组操作的，要求在 O(n) 的时间复杂度内解决。AI 提供的三种解法分别是暴力法、哈希表法和双指针法，其中双指针法是最优解。通过这道题，我对数组操作和时间复杂度分析有了更深入的理解。', likes: 320, comments: 56, time: '8小时前', avatar: '🧠' },
  { id: 5, author: 'HR 视角', type: '面试技巧', content: '作为 HR，我来分享一下面试官最看重的几个点，希望对大家有帮助。首先，面试官看重候选人的专业能力和技术水平，这是基础。其次，面试官关注候选人的沟通能力和团队协作能力，因为这些能力在工作中非常重要。最后，面试官会考察候选人的学习能力和适应能力，因为技术在不断发展，需要持续学习。', likes: 180, comments: 32, time: '1天前', avatar: '👥' },
  { id: 6, author: '前端专家', type: '技术分享', content: 'Vue3 和 React 的深度对比，包括响应式原理、组件化和性能优化等方面。Vue3 采用了 Proxy 实现响应式，而 React 采用了虚拟 DOM 和 setState。在组件化方面，Vue3 提供了 Composition API，而 React 提供了 Hooks。在性能优化方面，两者都有各自的优势和最佳实践。希望这份对比能够帮助大家选择适合自己的前端框架。', likes: 210, comments: 42, time: '1天前', avatar: '🎨' },
  { id: 7, author: '后端工程师', type: '经验分享', content: '如何准备系统设计面试，包括架构设计、数据库设计和性能优化等方面。系统设计面试是大厂面试的重要环节，需要候选人具备全局视野和系统思维。我整理了一份系统设计面试的准备指南，包括常见的设计模式、分布式系统原理和最佳实践等。希望对大家的面试有所帮助。', likes: 175, comments: 38, time: '2天前', avatar: '⚙️' }
]

// 评论数据
const comments: Record<number, { id: number; author: string; content: string; time: string }[]> = {
  1: [
    { id: 1, author: '面试新手', content: '谢谢分享，很有帮助！', time: '1小时前' },
    { id: 2, author: '技术爱好者', content: '请问你是如何准备技术面试的？', time: '1.5小时前' }
  ],
  2: [
    { id: 1, author: 'Java 开发者', content: '线程池的分析很详细，学习了！', time: '3小时前' },
    { id: 2, author: '后端工程师', content: '请问线程池的核心参数如何设置？', time: '3.5小时前' }
  ]
}

// 热门话题
const hotTopics = [
  { id: 1, title: '如何准备大厂面试', posts: 128, participants: 356 },
  { id: 2, title: '前端框架对比', posts: 96, participants: 289 },
  { id: 3, title: '系统设计面试指南', posts: 84, participants: 245 },
  { id: 4, title: '简历优化技巧', posts: 72, participants: 210 }
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
        <!-- 社群优质动态 -->
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
          
          <div class="space-y-8">
            <div v-for="post in communityPosts" :key="post.id" class="p-8 bg-neutral-bg rounded-[32px] hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-neutral-border group cursor-pointer relative overflow-hidden">
              <div class="flex items-center gap-4 mb-4 relative z-10">
                <div class="text-2xl">{{ post.avatar }}</div>
                <div>
                  <h4 class="text-sm font-bold text-neutral-title">{{ post.author }}</h4>
                  <div class="flex items-center gap-4">
                    <span class="text-[10px] text-neutral-helper uppercase font-bold">{{ post.type }}</span>
                    <span class="text-[10px] text-neutral-helper flex items-center gap-1"><Clock :size="12" /> {{ post.time }}</span>
                  </div>
                </div>
              </div>
              <p class="text-sm text-neutral-body leading-relaxed mb-6 relative z-10">
                {{ post.content }}
              </p>
              
              <!-- 评论展示 -->
              <div v-if="comments[post.id]" class="mb-6 relative z-10">
                <div class="space-y-3">
                  <div v-for="comment in comments[post.id]" :key="comment.id" class="p-3 bg-white rounded-xl border border-neutral-border">
                    <div class="flex items-center justify-between mb-1">
                      <h5 class="text-xs font-bold text-neutral-title">{{ comment.author }}</h5>
                      <span class="text-[10px] text-neutral-helper">{{ comment.time }}</span>
                    </div>
                    <p class="text-xs text-neutral-body">{{ comment.content }}</p>
                  </div>
                </div>
                <button class="text-xs text-primary font-bold hover:underline mt-2">查看全部 {{ post.comments }} 条评论</button>
              </div>
              
              <div class="flex items-center gap-4 relative z-10 pt-4 border-t border-neutral-border">
                <button class="flex items-center gap-2 text-xs text-neutral-helper hover:text-primary transition-colors">
                  <Heart :size="16" />
                  <span class="font-bold">{{ post.likes }}</span>
                </button>
                <button class="flex items-center gap-2 text-xs text-neutral-helper hover:text-primary transition-colors">
                  <MessageSquare :size="16" />
                  <span class="font-bold">{{ post.comments }}</span>
                </button>
                <button class="flex items-center gap-2 text-xs text-neutral-helper hover:text-primary transition-colors">
                  <Share2 :size="16" />
                  <span class="font-bold">分享</span>
                </button>
                <button class="flex items-center gap-2 text-xs text-neutral-helper hover:text-primary transition-colors">
                  <Bookmark :size="16" />
                  <span class="font-bold">收藏</span>
                </button>
              </div>
              <div class="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:scale-110 transition-transform">
                <Bot :size="140" />
              </div>
            </div>
          </div>
        </div>

        <!-- 分享复盘表单 -->
        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border">
          <h2 class="text-xl font-bold text-neutral-title mb-6 flex items-center gap-3">
            <Mic :size="24" class="text-primary" />
            分享你的面试复盘
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-neutral-title mb-2">面试类型</label>
              <select class="w-full p-4 border border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-colors">
                <option value="">请选择面试类型</option>
                <option value="frontend">前端面试</option>
                <option value="backend">后端面试</option>
                <option value="fullstack">全栈面试</option>
                <option value="product">产品经理</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-bold text-neutral-title mb-2">复盘内容</label>
              <textarea class="w-full p-4 border border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-colors" rows="5" placeholder="分享你的面试经验、问题和感受..."></textarea>
            </div>
            <div class="flex items-center gap-4">
              <button class="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all">
                <Mic :size="16" class="inline mr-2" />
                语音输入
              </button>
              <button class="px-4 py-2 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all">
                <FileText :size="16" class="inline mr-2" />
                上传文件
              </button>
            </div>
            <div class="flex justify-end">
              <button class="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all">
                发布复盘
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Sidebar -->
      <div class="lg:col-span-4 space-y-8">
        <!-- 面经 -->
        <div class="bg-neutral-title p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden h-full flex flex-col">
          <div class="relative z-10 flex-1">
            <div class="flex items-center gap-3 mb-8">
              <Award :size="32" class="text-auxiliary-orange" />
              <h2 class="text-2xl font-black italic text-white">面经</h2>
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

        <!-- 热门话题 -->
        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border">
          <h2 class="text-xl font-bold text-neutral-title mb-6 flex items-center gap-3">
            <Zap :size="24" class="text-auxiliary-orange" />
            热门话题
          </h2>
          <div class="space-y-4">
            <div v-for="topic in hotTopics" :key="topic.id" class="p-4 bg-neutral-bg rounded-[20px] hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border cursor-pointer">
              <h3 class="text-sm font-bold text-neutral-title mb-2">{{ topic.title }}</h3>
              <div class="flex items-center gap-4">
                <span class="text-xs text-neutral-helper flex items-center gap-1"><MessageSquare :size="12" /> {{ topic.posts }} 帖子</span>
                <span class="text-xs text-neutral-helper flex items-center gap-1"><Users :size="12" /> {{ topic.participants }} 参与者</span>
              </div>
            </div>
          </div>
          <div class="mt-6 flex justify-center">
            <button class="px-6 py-2 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all text-sm">查看全部话题</button>
          </div>
        </div>

        <!-- 活跃用户 -->
        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border">
          <h2 class="text-xl font-bold text-neutral-title mb-6 flex items-center gap-3">
            <UserCircle :size="24" class="text-primary" />
            活跃用户
          </h2>
          <div class="space-y-4">
            <div v-for="(user, index) in [{name: '面霸', posts: 128, avatar: '💻'}, {name: '技术大牛', posts: 96, avatar: '🧠'}, {name: '前端专家', posts: 84, avatar: '🎨'}, {name: 'HR 视角', posts: 72, avatar: '👥'}]" :key="index" class="flex items-center gap-4 p-3 bg-neutral-bg rounded-[20px] hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border cursor-pointer">
              <div class="text-2xl">{{ user.avatar }}</div>
              <div class="flex-1">
                <h3 class="text-sm font-bold text-neutral-title">{{ user.name }}</h3>
                <p class="text-xs text-neutral-helper">{{ user.posts }} 篇帖子</p>
              </div>
              <button class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full hover:bg-primary hover:text-white transition-all">关注</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
