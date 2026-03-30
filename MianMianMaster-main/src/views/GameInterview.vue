<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Gamepad2, 
  ChevronRight, 
  Trophy, 
  Zap, 
  Brain, 
  Target,
  CheckCircle,
  Star,
  BarChart3,
  Users,
  Clock,
  Award as AwardIcon,
  Settings,
  HelpCircle,
  Volume2,
  VolumeX,
  X,
  Briefcase,
  Building,
  User
} from 'lucide-vue-next'

const router = useRouter()

// 游戏关卡数据 - 模拟真实面试场景
const gameLevels = [
  {
    id: 1, 
    name: '关卡 01', 
    title: '初级：校招面试', 
    status: '已解锁', 
    progress: 100, 
    description: '模拟校招面试场景，面试官会问一些基础的技术问题和行为问题', 
    interviews: 5, 
    completed: 5, 
    timeSpent: '45分钟', 
    successRate: '80%', 
    面试官: '初级面试官',
    公司: '互联网公司',
    面试类型: '校招',
    问题数量: 8,
    时间限制: 30,
    难度: '简单',
    奖励: '校招面试认证'
  },
  {
    id: 2, 
    name: '关卡 02', 
    title: '中级：社招面试', 
    status: '已解锁', 
    progress: 30, 
    description: '模拟社招面试场景，面试官会问一些项目经验和技术深度的问题', 
    interviews: 8, 
    completed: 2, 
    timeSpent: '30分钟', 
    successRate: '65%', 
    面试官: '中级面试官',
    公司: '科技公司',
    面试类型: '社招',
    问题数量: 10,
    时间限制: 45,
    难度: '中等',
    奖励: '社招面试认证'
  },
  {
    id: 3, 
    name: '关卡 03', 
    title: '高级：资深工程师面试', 
    status: '待解锁', 
    progress: 0, 
    description: '模拟资深工程师面试场景，面试官会问一些复杂的技术问题和系统设计问题', 
    interviews: 10, 
    completed: 0, 
    timeSpent: '0分钟', 
    successRate: '0%', 
    面试官: '高级面试官',
    公司: '大型科技公司',
    面试类型: '社招',
    问题数量: 12,
    时间限制: 60,
    难度: '困难',
    奖励: '资深工程师面试认证'
  },
  {
    id: 4, 
    name: '关卡 04', 
    title: '专家：技术总监面试', 
    status: '待解锁', 
    progress: 0, 
    description: '模拟技术总监面试场景，面试官会问一些战略和管理相关的问题', 
    interviews: 6, 
    completed: 0, 
    timeSpent: '0分钟', 
    successRate: '0%', 
    面试官: '技术总监',
    公司: '知名企业',
    面试类型: '高管',
    问题数量: 8,
    时间限制: 90,
    难度: '专家',
    奖励: '技术总监面试认证'
  },
  {
    id: 5, 
    name: '关卡 05', 
    title: '大师：CTO 面试', 
    status: '待解锁', 
    progress: 0, 
    description: '模拟 CTO 面试场景，面试官会问一些公司战略和技术愿景的问题', 
    interviews: 4, 
    completed: 0, 
    timeSpent: '0分钟', 
    successRate: '0%', 
    面试官: 'CTO',
    公司: '行业巨头',
    面试类型: '高管',
    问题数量: 6,
    时间限制: 120,
    难度: '大师',
    奖励: 'CTO 面试认证'
  }
]

// 游戏统计数据
const gameStats = [
  { label: '已完成关卡', value: '1', icon: Trophy, color: 'text-auxiliary-orange' },
  { label: '总面试次数', value: '7', icon: Users, color: 'text-primary' },
  { label: '成功率', value: '75%', icon: CheckCircle, color: 'text-auxiliary-green' },
  { label: '总游戏时间', value: '75分钟', icon: Clock, color: 'text-auxiliary-blue' }
]

// 排行榜数据
const leaderboard = [
  { rank: 1, name: '面霸', score: 980, level: 5, avatar: '👑', completedLevels: 5, totalInterviews: 20, successRate: '95%' },
  { rank: 2, name: '技术大牛', score: 950, level: 5, avatar: '💻', completedLevels: 5, totalInterviews: 18, successRate: '92%' },
  { rank: 3, name: '算法王者', score: 920, level: 4, avatar: '🧠', completedLevels: 4, totalInterviews: 15, successRate: '88%' },
  { rank: 4, name: '前端专家', score: 880, level: 4, avatar: '🎨', completedLevels: 4, totalInterviews: 14, successRate: '85%' },
  { rank: 5, name: '后端达人', score: 850, level: 4, avatar: '⚙️', completedLevels: 4, totalInterviews: 12, successRate: '82%' },
  { rank: 6, name: '全栈工程师', score: 820, level: 4, avatar: '🛠️', completedLevels: 4, totalInterviews: 10, successRate: '80%' },
  { rank: 7, name: '产品经理', score: 780, level: 3, avatar: '📱', completedLevels: 3, totalInterviews: 8, successRate: '78%' },
  { rank: 8, name: '数据分析师', score: 750, level: 3, avatar: '📊', completedLevels: 3, totalInterviews: 7, successRate: '75%' },
  { rank: 9, name: 'UI设计师', score: 720, level: 3, avatar: '🎯', completedLevels: 3, totalInterviews: 6, successRate: '72%' },
  { rank: 10, name: '测试工程师', score: 690, level: 3, avatar: '🧪', completedLevels: 3, totalInterviews: 5, successRate: '70%' },
  { rank: 42, name: '王同学', score: 480, level: 2, avatar: '👨‍💻', completedLevels: 2, totalInterviews: 7, successRate: '75%' }
]

// 技能认证数据
const certifications = [
  { id: 1, name: '基础知识认证', status: '已认证', level: 1, description: '掌握了编程基础知识', icon: Brain },
  { id: 2, name: '项目经验认证', status: '进行中', level: 2, description: '正在积累项目经验', icon: Target },
  { id: 3, name: '高级技能认证', status: '未解锁', level: 3, description: '完成关卡 03 解锁', icon: Zap },
  { id: 4, name: '系统设计认证', status: '未解锁', level: 4, description: '完成关卡 04 解锁', icon: BarChart3 },
  { id: 5, name: '综合能力认证', status: '未解锁', level: 5, description: '完成关卡 05 解锁', icon: Users }
]

// 成就数据
const achievements = [
  { id: 1, name: '面试新手', description: '完成第一次模拟面试', unlocked: true, icon: Star },
  { id: 2, name: '面试达人', description: '连续通过 3 次面试', unlocked: true, icon: Zap },
  { id: 3, name: '面霸', description: '通过所有初级面试', unlocked: true, icon: Trophy },
  { id: 4, name: '技术专家', description: '通过高级工程师面试', unlocked: false, icon: Brain },
  { id: 5, name: '职场精英', description: '通过 CTO 面试', unlocked: false, icon: Users }
]

// 状态管理
const activeTab = ref('levels')
const isLeaderboardOpen = ref(false)
const isSettingsOpen = ref(false)
const isHelpOpen = ref(false)
const isAchievementDetailOpen = ref(false)
const isCertificationDetailOpen = ref(false)
interface Achievement {
  id: number;
  name: string;
  description: string;
  unlocked: boolean;
  icon: any;
}

interface Certification {
  id: number;
  name: string;
  status: string;
  level: number;
  description: string;
  icon: any;
}

const selectedAchievement = ref<Achievement | null>(null)
const selectedCertification = ref<Certification | null>(null)
const currentVolume = ref(70)
const soundEnabled = ref(true)

// 方法
const startLevel = (levelId: number) => {
  console.log(`开始挑战关卡 ${levelId}`)
  // 跳转到关卡挑战页面
  router.push(`/game-interview/level/${levelId}`)
}

const startGame = () => {
  // 找到第一个已解锁的关卡
  const firstUnlockedLevel = gameLevels.find(level => level.status === '已解锁')
  if (firstUnlockedLevel) {
    router.push(`/game-interview/level/${firstUnlockedLevel.id}`)
  }
}

const toggleLeaderboard = () => {
  isLeaderboardOpen.value = !isLeaderboardOpen.value
}

const toggleSettings = () => {
  isSettingsOpen.value = !isSettingsOpen.value
}

const toggleHelp = () => {
  isHelpOpen.value = !isHelpOpen.value
}



const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value
}

const adjustVolume = (value: number) => {
  currentVolume.value = value
}



const viewAchievementDetail = (achievement: Achievement) => {
  selectedAchievement.value = achievement
  isAchievementDetailOpen.value = true
}

const viewCertificationDetail = (cert: Certification) => {
  selectedCertification.value = cert
  isCertificationDetailOpen.value = true
}

const closeAchievementDetail = () => {
  isAchievementDetailOpen.value = false
  selectedAchievement.value = null
}

const closeCertificationDetail = () => {
  isCertificationDetailOpen.value = false
  selectedCertification.value = null
}
</script>

<template>
  <div class="flex flex-col gap-8 max-w-7xl mx-auto">
    <!-- Hero: Game-based Interview -->
    <div class="gradient-primary p-10 rounded-[40px] text-white relative overflow-hidden shadow-xl">
      <div class="relative z-10 max-w-2xl">
        <h1 class="text-4xl font-black mb-4">游戏式面试</h1>
        <p class="text-white/80 mb-8 text-lg">通过闯关模式，让面试准备变得更加有趣和有效。每完成一个关卡，你将获得相应的技能认证。</p>
        <div class="flex flex-wrap gap-4">
          <button @click="startGame" class="px-8 py-4 bg-white text-primary font-bold rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-2">
            <Gamepad2 :size="20" />
            开始游戏闯关
          </button>
          <button @click="toggleLeaderboard" class="px-8 py-4 bg-white/20 backdrop-blur-md text-white font-bold rounded-2xl hover:bg-white/30 transition-all flex items-center gap-2">
            <Users :size="20" />
            查看排行榜
          </button>
          <button @click="toggleSettings" class="px-8 py-4 bg-white/20 backdrop-blur-md text-white font-bold rounded-2xl hover:bg-white/30 transition-all flex items-center gap-2">
            <Settings :size="20" />
            设置
          </button>
          <button @click="toggleHelp" class="px-8 py-4 bg-white/20 backdrop-blur-md text-white font-bold rounded-2xl hover:bg-white/30 transition-all flex items-center gap-2">
            <HelpCircle :size="20" />
            帮助
          </button>
        </div>
      </div>
      <div class="absolute -right-20 -bottom-20 opacity-10">
        <Gamepad2 :size="320" />
      </div>
    </div>

    <!-- Game Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in gameStats" :key="stat.label" class="bg-white p-8 rounded-[24px] shadow-sm border border-neutral-border flex flex-col items-center justify-center gap-4 group hover:shadow-md transition-all">
        <stat.icon :size="32" :class="stat.color" class="group-hover:scale-110 transition-transform" />
        <div class="text-center">
          <p class="text-3xl font-black text-neutral-title">{{ stat.value }}</p>
          <p class="text-xs text-neutral-helper uppercase font-bold mt-1">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <!-- Main Content Tabs -->
    <div class="bg-white rounded-[32px] shadow-sm border border-neutral-border overflow-hidden">
      <!-- Tab Navigation -->
      <div class="flex border-b border-neutral-border">
        <button 
          @click="activeTab = 'levels'" 
          class="flex-1 py-4 px-6 font-bold transition-all" 
          :class="activeTab === 'levels' ? 'text-primary border-b-2 border-primary' : 'text-neutral-helper hover:text-neutral-title'"
        >
          闯关模式
        </button>
        <button 
          @click="activeTab = 'achievements'" 
          class="flex-1 py-4 px-6 font-bold transition-all" 
          :class="activeTab === 'achievements' ? 'text-primary border-b-2 border-primary' : 'text-neutral-helper hover:text-neutral-title'"
        >
          成就系统
        </button>
        <button 
          @click="activeTab = 'certifications'" 
          class="flex-1 py-4 px-6 font-bold transition-all" 
          :class="activeTab === 'certifications' ? 'text-primary border-b-2 border-primary' : 'text-neutral-helper hover:text-neutral-title'"
        >
          技能认证
        </button>
      </div>

      <!-- Tab Content -->
      <div class="p-8">
        <!-- Levels Tab -->
        <div v-if="activeTab === 'levels'" class="space-y-6">
          <div v-for="level in gameLevels" :key="level.id" class="p-6 bg-neutral-bg rounded-[24px] relative overflow-hidden group hover:shadow-md transition-all border border-transparent hover:border-neutral-border">
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <p class="text-[10px] font-bold text-primary uppercase">{{ level.name }}</p>
                  <span v-if="level.status === '已解锁'" class="px-2 py-1 bg-auxiliary-green/10 text-auxiliary-green text-[10px] font-bold rounded-full">已解锁</span>
                  <span v-else class="px-2 py-1 bg-neutral-border/50 text-neutral-helper text-[10px] font-bold rounded-full">未解锁</span>
                </div>
                <h4 class="font-bold text-neutral-title mb-2">{{ level.title }}</h4>
                <p class="text-sm text-neutral-helper mb-4">{{ level.description }}</p>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:gradient-primary group-hover:text-white transition-all">
                <Trophy :size="24" />
              </div>
            </div>
            
            <!-- 面试场景信息 -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div class="flex items-center gap-2">
                <Building :size="16" class="text-neutral-helper" />
                <div>
                  <div class="text-xs text-neutral-helper">公司</div>
                  <div class="text-sm font-bold text-neutral-title">{{ level.公司 }}</div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Briefcase :size="16" class="text-neutral-helper" />
                <div>
                  <div class="text-xs text-neutral-helper">面试类型</div>
                  <div class="text-sm font-bold text-neutral-title">{{ level.面试类型 }}</div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <User :size="16" class="text-neutral-helper" />
                <div>
                  <div class="text-xs text-neutral-helper">面试官</div>
                  <div class="text-sm font-bold text-neutral-title">{{ level.面试官 }}</div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Trophy :size="16" class="text-neutral-helper" />
                <div>
                  <div class="text-xs text-neutral-helper">难度</div>
                  <div class="text-sm font-bold text-neutral-title">{{ level.难度 }}</div>
                </div>
              </div>
            </div>
            
            <!-- 进度信息 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <div class="flex justify-between text-xs text-neutral-helper mb-1">
                  <span>进度</span>
                  <span>{{ level.progress }}%</span>
                </div>
                <div class="h-2 bg-white rounded-full overflow-hidden">
                  <div class="h-full bg-primary transition-all duration-1000" :style="{width: level.progress + '%'}"></div>
                </div>
              </div>
              <div>
                <div class="text-xs text-neutral-helper mb-1">面试进度</div>
                <div class="text-sm font-bold text-neutral-title">{{ level.completed }}/{{ level.interviews }} 次</div>
              </div>
              <div>
                <div class="text-xs text-neutral-helper mb-1">成功率</div>
                <div class="text-sm font-bold text-neutral-title">{{ level.successRate }}</div>
              </div>
            </div>
            
            <!-- 其他信息 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <div class="text-xs text-neutral-helper mb-1">问题数量</div>
                <div class="text-sm font-bold text-neutral-title">{{ level.问题数量 }} 题</div>
              </div>
              <div>
                <div class="text-xs text-neutral-helper mb-1">时间限制</div>
                <div class="text-sm font-bold text-neutral-title">{{ level.时间限制 }} 分钟</div>
              </div>
              <div>
                <div class="text-xs text-neutral-helper mb-1">奖励</div>
                <div class="text-sm font-bold text-neutral-title">{{ level.奖励 }}</div>
              </div>
            </div>
            
            <div class="flex items-center justify-between mb-4">
              <div class="text-xs text-neutral-helper">用时: {{ level.timeSpent }}</div>
            </div>
            
            <div class="flex justify-end">
              <button 
                @click="startLevel(level.id)" 
                class="px-6 py-2 rounded-xl font-bold text-sm transition-all" 
                :class="level.status === '已解锁' ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-neutral-border text-neutral-helper cursor-not-allowed'"
              >
                {{ level.status === '已解锁' ? '开始面试' : '未解锁' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Achievements Tab -->
        <div v-if="activeTab === 'achievements'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="achievement in achievements" :key="achievement.id" @click="viewAchievementDetail(achievement)" class="p-6 bg-neutral-bg rounded-[24px] relative overflow-hidden group hover:shadow-md transition-all border border-transparent hover:border-neutral-border cursor-pointer">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm" :class="achievement.unlocked ? 'bg-white text-primary group-hover:gradient-primary group-hover:text-white' : 'bg-neutral-border text-neutral-helper'">
                <component :is="achievement.icon" :size="24" />
              </div>
              <h3 class="font-bold text-neutral-title mb-1">{{ achievement.name }}</h3>
              <p class="text-sm text-neutral-helper mb-4">{{ achievement.description }}</p>
              <div class="flex items-center justify-between mt-auto">
                <span class="text-xs font-bold" :class="achievement.unlocked ? 'text-auxiliary-green' : 'text-neutral-helper'">{{ achievement.unlocked ? '已获得' : '未获得' }}</span>
                <ChevronRight :size="16" class="text-neutral-helper" />
              </div>
            </div>
          </div>
        </div>

        <!-- Certifications Tab -->
        <div v-if="activeTab === 'certifications'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="cert in certifications" :key="cert.id" @click="viewCertificationDetail(cert)" class="p-6 bg-neutral-bg rounded-[24px] relative overflow-hidden group hover:shadow-md transition-all border border-transparent hover:border-neutral-border cursor-pointer">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm" :class="cert.status === '已认证' ? 'bg-white text-primary group-hover:gradient-primary group-hover:text-white' : 'bg-neutral-border text-neutral-helper'">
                <component :is="cert.icon" :size="24" />
              </div>
              <h3 class="font-bold text-neutral-title mb-1">{{ cert.name }}</h3>
              <p class="text-sm text-neutral-helper mb-4">{{ cert.description }}</p>
              <div class="flex items-center justify-between mt-auto">
                <span class="text-xs font-bold" :class="cert.status === '已认证' ? 'text-auxiliary-green' : 'text-neutral-helper'">{{ cert.status }}</span>
                <ChevronRight :size="16" class="text-neutral-helper" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Leaderboard Modal -->
    <div v-if="isLeaderboardOpen" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-[32px] w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div class="p-8 border-b border-neutral-border flex justify-between items-center">
          <h3 class="text-xl font-bold text-neutral-title flex items-center gap-2">
            <Users :size="24" class="text-primary" />
            排行榜
          </h3>
          <button @click="toggleLeaderboard" class="p-2 text-neutral-helper hover:text-neutral-title">
            <X :size="24" />
          </button>
        </div>
        <div class="p-8">
          <div class="space-y-4">
            <div v-for="item in leaderboard" :key="item.rank" class="flex items-center justify-between p-4 rounded-[20px]" :class="item.name === '王同学' ? 'bg-primary/10 border border-primary/20' : 'bg-neutral-bg'">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg" :class="item.rank <= 3 ? 'bg-auxiliary-orange text-white' : 'bg-neutral-border text-neutral-helper'">
                  {{ item.rank }}
                </div>
                <div class="text-2xl">{{ item.avatar }}</div>
                <div>
                  <h4 class="font-bold text-neutral-title">{{ item.name }}</h4>
                  <div class="flex flex-wrap gap-2 text-xs text-neutral-helper">
                    <span>关卡 {{ item.level }}</span>
                    <span>•</span>
                    <span>已完成 {{ item.completedLevels }} 关</span>
                    <span>•</span>
                    <span>成功率 {{ item.successRate }}</span>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <p class="font-black text-neutral-title text-xl">{{ item.score }}</p>
                <p class="text-xs text-neutral-helper">积分</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <div v-if="isSettingsOpen" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-[32px] w-full max-w-md">
        <div class="p-8 border-b border-neutral-border flex justify-between items-center">
          <h3 class="text-xl font-bold text-neutral-title flex items-center gap-2">
            <Settings :size="24" class="text-primary" />
            设置
          </h3>
          <button @click="toggleSettings" class="p-2 text-neutral-helper hover:text-neutral-title">
            <X :size="24" />
          </button>
        </div>
        <div class="p-8 space-y-6">
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-sm font-bold text-neutral-title">音效</label>
              <button @click="toggleSound" class="p-2 rounded-full" :class="soundEnabled ? 'bg-primary/10 text-primary' : 'bg-neutral-border text-neutral-helper'">
                <Volume2 v-if="soundEnabled" :size="20" />
                <VolumeX v-else :size="20" />
              </button>
            </div>
            <div v-if="soundEnabled" class="flex items-center gap-2">
              <input 
                type="range" 
                min="0" 
                max="100" 
                v-model.number="currentVolume" 
                @input="adjustVolume(currentVolume)"
                class="flex-1 h-2 bg-neutral-border rounded-full appearance-none cursor-pointer"
              />
              <span class="text-sm font-bold text-neutral-title w-10 text-center">{{ currentVolume }}%</span>
            </div>
          </div>
          <div>
            <label class="text-sm font-bold text-neutral-title block mb-2">难度设置</label>
            <div class="flex gap-2">
              <button class="flex-1 py-2 rounded-xl font-bold text-sm bg-primary text-white">简单</button>
              <button class="flex-1 py-2 rounded-xl font-bold text-sm bg-neutral-bg text-neutral-title">中等</button>
              <button class="flex-1 py-2 rounded-xl font-bold text-sm bg-neutral-bg text-neutral-title">困难</button>
            </div>
          </div>
          <div>
            <label class="text-sm font-bold text-neutral-title block mb-2">通知设置</label>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm text-neutral-body">关卡解锁通知</span>
                <input type="checkbox" checked class="w-5 h-5 rounded-full border-2 border-primary bg-primary text-white" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-neutral-body">成就获得通知</span>
                <input type="checkbox" checked class="w-5 h-5 rounded-full border-2 border-primary bg-primary text-white" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-neutral-body">排行榜更新通知</span>
                <input type="checkbox" class="w-5 h-5 rounded-full border-2 border-neutral-border" />
              </div>
            </div>
          </div>
          <div>
            <label class="text-sm font-bold text-neutral-title block mb-2">语言设置</label>
            <div class="flex gap-2">
              <button class="flex-1 py-2 rounded-xl font-bold text-sm bg-primary text-white">中文</button>
              <button class="flex-1 py-2 rounded-xl font-bold text-sm bg-neutral-bg text-neutral-title">英文</button>
            </div>
          </div>
          <div>
            <label class="text-sm font-bold text-neutral-title block mb-2">主题设置</label>
            <div class="flex gap-2">
              <button class="flex-1 py-2 rounded-xl font-bold text-sm bg-primary text-white">浅色</button>
              <button class="flex-1 py-2 rounded-xl font-bold text-sm bg-neutral-bg text-neutral-title">深色</button>
            </div>
          </div>
          <div>
            <label class="text-sm font-bold text-neutral-title block mb-2">数据设置</label>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm text-neutral-body">自动保存进度</span>
                <input type="checkbox" checked class="w-5 h-5 rounded-full border-2 border-primary bg-primary text-white" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-neutral-body">清除缓存</span>
                <button class="text-sm text-primary font-bold">清除</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Help Modal -->
    <div v-if="isHelpOpen" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-[32px] w-full max-w-md">
        <div class="p-8 border-b border-neutral-border flex justify-between items-center">
          <h3 class="text-xl font-bold text-neutral-title flex items-center gap-2">
            <HelpCircle :size="24" class="text-primary" />
            帮助中心
          </h3>
          <button @click="toggleHelp" class="p-2 text-neutral-helper hover:text-neutral-title">
            <X :size="24" />
          </button>
        </div>
        <div class="p-8 space-y-4">
          <div class="p-4 bg-neutral-bg rounded-[20px]">
            <h4 class="font-bold text-neutral-title mb-2">如何开始游戏？</h4>
            <p class="text-sm text-neutral-body">点击首页的"开始游戏闯关"按钮，选择已解锁的关卡即可开始挑战。每个关卡都有不同的难度和挑战目标。</p>
          </div>
          <div class="p-4 bg-neutral-bg rounded-[20px]">
            <h4 class="font-bold text-neutral-title mb-2">如何获得成就？</h4>
            <p class="text-sm text-neutral-body">完成特定的游戏目标，如连续答对10题、5分钟内完成10题、通过所有初级面试等，即可获得相应的成就。成就可以在成就系统页面查看。</p>
          </div>
          <div class="p-4 bg-neutral-bg rounded-[20px]">
            <h4 class="font-bold text-neutral-title mb-2">如何解锁技能认证？</h4>
            <p class="text-sm text-neutral-body">完成相应的关卡后，系统会自动解锁对应的技能认证，证明你的能力水平。技能认证可以在技能认证页面查看详细信息。</p>
          </div>
          <div class="p-4 bg-neutral-bg rounded-[20px]">
            <h4 class="font-bold text-neutral-title mb-2">如何查看排行榜？</h4>
            <p class="text-sm text-neutral-body">点击首页的"查看排行榜"按钮，即可查看所有用户的排名情况。排行榜显示用户的积分、关卡进度和成功率等信息。</p>
          </div>
          <div class="p-4 bg-neutral-bg rounded-[20px]">
            <h4 class="font-bold text-neutral-title mb-2">如何提高面试成功率？</h4>
            <p class="text-sm text-neutral-body">1. 充分准备常见面试问题<br>2. 练习回答技巧，注意逻辑和结构<br>3. 查看示例回答，学习优秀的回答方式<br>4. 多次练习，积累经验</p>
          </div>
          <div class="p-4 bg-neutral-bg rounded-[20px]">
            <h4 class="font-bold text-neutral-title mb-2">游戏积分规则</h4>
            <p class="text-sm text-neutral-body">1. 完成面试关卡：+100积分<br>2. 答对问题：+10-30积分/题<br>3. 获得成就：+50-200积分/个<br>4. 排行榜排名奖励：+50-500积分/周</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Achievement Detail Modal -->
    <div v-if="isAchievementDetailOpen" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-[32px] w-full max-w-md">
        <div class="p-8 border-b border-neutral-border flex justify-between items-center">
          <h3 class="text-xl font-bold text-neutral-title flex items-center gap-2">
            <Trophy :size="24" class="text-primary" />
            成就详情
          </h3>
          <button @click="closeAchievementDetail" class="p-2 text-neutral-helper hover:text-neutral-title">
            <X :size="24" />
          </button>
        </div>
        <div class="p-8 space-y-6">
          <div class="flex flex-col items-center">
            <div class="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm" :class="selectedAchievement?.unlocked ? 'bg-white text-primary' : 'bg-neutral-border text-neutral-helper'">
              <component :is="selectedAchievement?.icon" :size="40" />
            </div>
            <h4 class="text-xl font-bold text-neutral-title mb-2">{{ selectedAchievement?.name }}</h4>
            <p class="text-sm text-neutral-helper mb-4">{{ selectedAchievement?.description }}</p>
            <span class="px-4 py-2 rounded-full text-sm font-bold" :class="selectedAchievement?.unlocked ? 'bg-auxiliary-green/10 text-auxiliary-green' : 'bg-neutral-border/50 text-neutral-helper'">
              {{ selectedAchievement?.unlocked ? '已获得' : '未获得' }}
            </span>
          </div>
          <div v-if="selectedAchievement?.unlocked" class="p-4 bg-neutral-bg rounded-[20px]">
            <h5 class="font-bold text-neutral-title mb-2">获得时间</h5>
            <p class="text-sm text-neutral-body">2024年12月15日 14:30</p>
          </div>
          <div class="p-4 bg-neutral-bg rounded-[20px]">
            <h5 class="font-bold text-neutral-title mb-2">成就价值</h5>
            <p class="text-sm text-neutral-body">+100 积分</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Certification Detail Modal -->
    <div v-if="isCertificationDetailOpen" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-[32px] w-full max-w-md">
        <div class="p-8 border-b border-neutral-border flex justify-between items-center">
          <h3 class="text-xl font-bold text-neutral-title flex items-center gap-2">
            <AwardIcon :size="24" class="text-primary" />
            技能认证详情
          </h3>
          <button @click="closeCertificationDetail" class="p-2 text-neutral-helper hover:text-neutral-title">
            <X :size="24" />
          </button>
        </div>
        <div class="p-8 space-y-6">
          <div class="flex flex-col items-center">
            <div class="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm" :class="selectedCertification?.status === '已认证' ? 'bg-white text-primary' : 'bg-neutral-border text-neutral-helper'">
              <component :is="selectedCertification?.icon" :size="40" />
            </div>
            <h4 class="text-xl font-bold text-neutral-title mb-2">{{ selectedCertification?.name }}</h4>
            <p class="text-sm text-neutral-helper mb-4">{{ selectedCertification?.description }}</p>
            <span class="px-4 py-2 rounded-full text-sm font-bold" :class="selectedCertification?.status === '已认证' ? 'bg-auxiliary-green/10 text-auxiliary-green' : 'bg-neutral-border/50 text-neutral-helper'">
              {{ selectedCertification?.status }}
            </span>
          </div>
          <div v-if="selectedCertification?.status === '已认证'" class="p-4 bg-neutral-bg rounded-[20px]">
            <h5 class="font-bold text-neutral-title mb-2">认证时间</h5>
            <p class="text-sm text-neutral-body">2024年12月15日 14:30</p>
          </div>
          <div class="p-4 bg-neutral-bg rounded-[20px]">
            <h5 class="font-bold text-neutral-title mb-2">认证等级</h5>
            <p class="text-sm text-neutral-body">等级 {{ selectedCertification?.level }}</p>
          </div>
          <div class="p-4 bg-neutral-bg rounded-[20px]">
            <h5 class="font-bold text-neutral-title mb-2">认证技能</h5>
            <p class="text-sm text-neutral-body">{{ selectedCertification?.name.includes('基础知识') ? '编程基础知识、HTML/CSS、JavaScript基础' : 
              selectedCertification?.name.includes('项目经验') ? '项目管理、团队协作、技术文档编写' : 
              selectedCertification?.name.includes('高级技能') ? '系统设计、性能优化、架构设计' : 
              selectedCertification?.name.includes('系统设计') ? '分布式系统、微服务架构、数据库设计' : 
              '综合能力、领导力、战略思维' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义滑块样式 */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #18C5C7;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #18C5C7;
  cursor: pointer;
  border: none;
}
</style>