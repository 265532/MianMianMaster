<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Gamepad2, 
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
    description: '模拟校招面试场景，面试官会问一些基础的技术问题和行为问题，适合刚毕业的学生或实习生', 
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
    奖励: '校招面试认证',
    skills: ['基础知识', '自我介绍', '项目经验', '行为问题'],
    unlockRequirements: null,
    icon: '🎓',
    background: 'bg-blue-50'
  },
  {
    id: 2, 
    name: '关卡 02', 
    title: '中级：社招面试', 
    status: '已解锁', 
    progress: 30, 
    description: '模拟社招面试场景，面试官会问一些项目经验和技术深度的问题，适合有1-3年工作经验的开发者', 
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
    奖励: '社招面试认证',
    skills: ['项目经验', '技术深度', '问题解决', '团队协作'],
    unlockRequirements: { level: 1, progress: 100 },
    icon: '💼',
    background: 'bg-green-50'
  },
  {
    id: 3, 
    name: '关卡 03', 
    title: '高级：资深工程师面试', 
    status: '待解锁', 
    progress: 0, 
    description: '模拟资深工程师面试场景，面试官会问一些复杂的技术问题和系统设计问题，适合有3-5年工作经验的开发者', 
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
    奖励: '资深工程师面试认证',
    skills: ['系统设计', '技术架构', '性能优化', '技术选型'],
    unlockRequirements: { level: 2, progress: 100 },
    icon: '🏆',
    background: 'bg-purple-50'
  },
  {
    id: 4, 
    name: '关卡 04', 
    title: '专家：技术总监面试', 
    status: '待解锁', 
    progress: 0, 
    description: '模拟技术总监面试场景，面试官会问一些战略和管理相关的问题，适合有5-8年工作经验的技术领导者', 
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
    奖励: '技术总监面试认证',
    skills: ['团队管理', '技术战略', '项目规划', '沟通协调'],
    unlockRequirements: { level: 3, progress: 100 },
    icon: '📈',
    background: 'bg-orange-50'
  },
  {
    id: 5, 
    name: '关卡 05', 
    title: '大师：CTO 面试', 
    status: '待解锁', 
    progress: 0, 
    description: '模拟 CTO 面试场景，面试官会问一些公司战略和技术愿景的问题，适合有8年以上工作经验的高级技术领导者', 
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
    奖励: 'CTO 面试认证',
    skills: ['公司战略', '技术愿景', '人才培养', '业务理解'],
    unlockRequirements: { level: 4, progress: 100 },
    icon: '👑',
    background: 'bg-red-50'
  },
  {
    id: 6, 
    name: '关卡 06', 
    title: '挑战：跨领域面试', 
    status: '待解锁', 
    progress: 0, 
    description: '模拟跨领域面试场景，面试官会问一些跨领域的技术问题，适合希望转型或扩展技能的开发者', 
    interviews: 12, 
    completed: 0, 
    timeSpent: '0分钟', 
    successRate: '0%', 
    面试官: '多领域专家',
    公司: '创新企业',
    面试类型: '跨领域',
    问题数量: 15,
    时间限制: 75,
    难度: '困难',
    奖励: '跨领域专家认证',
    skills: ['跨领域知识', '快速学习', '适应性', '创新思维'],
    unlockRequirements: { level: 3, progress: 100 },
    icon: '🔄',
    background: 'bg-teal-50'
  },
  {
    id: 7, 
    name: '关卡 07', 
    title: '终极：FAANG 面试', 
    status: '待解锁', 
    progress: 0, 
    description: '模拟 FAANG 公司的面试场景，面试官会问一些极具挑战性的技术问题和系统设计问题，适合追求顶尖科技公司的开发者', 
    interviews: 8, 
    completed: 0, 
    timeSpent: '0分钟', 
    successRate: '0%', 
    面试官: 'FAANG 面试官',
    公司: 'FAANG 公司',
    面试类型: '高级',
    问题数量: 12,
    时间限制: 90,
    难度: '专家',
    奖励: 'FAANG 面试认证',
    skills: ['算法优化', '系统设计', '编码能力', '问题分析'],
    unlockRequirements: { level: 5, progress: 100 },
    icon: '🚀',
    background: 'bg-indigo-50'
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
  { id: 1, name: '基础知识认证', status: '已认证', level: 1, description: '掌握了编程基础知识和基本面试技巧', icon: Brain, skills: ['编程基础知识', 'HTML/CSS', 'JavaScript基础'], date: '2024-12-10', progress: 100, color: 'bg-blue-100', badge: '⭐', condition: '完成关卡01的所有面试' },
  { id: 2, name: '项目经验认证', status: '进行中', level: 2, description: '具备项目管理和团队协作能力', icon: Target, skills: ['项目管理', '团队协作', '技术文档编写'], date: '2024-12-12', progress: 60, color: 'bg-green-100', badge: '📈', condition: '完成关卡02的所有面试' },
  { id: 3, name: '高级技能认证', status: '未解锁', level: 3, description: '掌握系统设计和性能优化能力', icon: Zap, skills: ['系统设计', '性能优化', '架构设计'], date: null, progress: 0, color: 'bg-purple-100', badge: '⚡', condition: '完成关卡03的所有面试' },
  { id: 4, name: '系统设计认证', status: '未解锁', level: 4, description: '具备分布式系统和微服务架构设计能力', icon: BarChart3, skills: ['分布式系统', '微服务架构', '数据库设计'], date: null, progress: 0, color: 'bg-orange-100', badge: '🏗️', condition: '完成关卡04的所有面试' },
  { id: 5, name: '综合能力认证', status: '未解锁', level: 5, description: '具备综合能力和战略思维', icon: Users, skills: ['综合能力', '领导力', '战略思维'], date: null, progress: 0, color: 'bg-red-100', badge: '🌟', condition: '完成关卡05的所有面试' },
  { id: 6, name: '前端开发认证', status: '未解锁', level: 3, description: '掌握前端开发核心技能', icon: Brain, skills: ['React', 'Vue', 'CSS3', '响应式设计'], date: null, progress: 0, color: 'bg-teal-100', badge: '🎨', condition: '完成前端开发相关面试，答对80%以上前端问题' },
  { id: 7, name: '后端开发认证', status: '未解锁', level: 3, description: '掌握后端开发核心技能', icon: Zap, skills: ['Node.js', 'Python', '数据库', 'API设计'], date: null, progress: 0, color: 'bg-indigo-100', badge: '⚙️', condition: '完成后端开发相关面试，答对80%以上后端问题' },
  { id: 8, name: '面试技巧认证', status: '已认证', level: 1, description: '掌握了基本的面试技巧和方法', icon: Target, skills: ['简历准备', '自我介绍', '行为问题回答', '技术问题回答'], date: '2024-12-10', progress: 100, color: 'bg-yellow-100', badge: '💡', condition: '完成5次面试，成功率达到60%' },
  { id: 9, name: 'FAANG 面试认证', status: '未解锁', level: 5, description: '具备FAANG公司面试所需的核心能力', icon: Trophy, skills: ['算法优化', '系统设计', '编码能力', '问题分析'], date: null, progress: 0, color: 'bg-pink-100', badge: '🚀', condition: '完成关卡07的所有面试' },
  { id: 10, name: '跨领域专家认证', status: '未解锁', level: 4, description: '具备跨领域知识和快速学习能力', icon: Brain, skills: ['跨领域知识', '快速学习', '适应性', '创新思维'], date: null, progress: 0, color: 'bg-lime-100', badge: '🔄', condition: '完成关卡06的所有面试' },
  { id: 11, name: '技术领导力认证', status: '未解锁', level: 4, description: '具备团队管理和技术战略能力', icon: Users, skills: ['团队管理', '技术战略', '项目规划', '沟通协调'], date: null, progress: 0, color: 'bg-amber-100', badge: '👑', condition: '完成关卡04的所有面试' },
  { id: 12, name: 'CTO 思维认证', status: '未解锁', level: 5, description: '具备公司战略和技术愿景规划能力', icon: Trophy, skills: ['公司战略', '技术愿景', '人才培养', '业务理解'], date: null, progress: 0, color: 'bg-rose-100', badge: '🎯', condition: '完成关卡05的所有面试' },
  { id: 13, name: '全栈开发认证', status: '未解锁', level: 3, description: '掌握前端和后端开发全栈技能', icon: Zap, skills: ['前端开发', '后端开发', '数据库', 'DevOps'], date: null, progress: 0, color: 'bg-violet-100', badge: '🛠️', condition: '完成前端和后端开发相关面试，答对75%以上问题' },
  { id: 14, name: '数据结构与算法认证', status: '未解锁', level: 3, description: '掌握数据结构和算法核心知识', icon: Brain, skills: ['数据结构', '算法设计', '复杂度分析', '问题解决'], date: null, progress: 0, color: 'bg-sky-100', badge: '🧠', condition: '在算法相关面试中答对90%以上问题' },
  { id: 15, name: 'DevOps 认证', status: '未解锁', level: 3, description: '掌握DevOps核心技能', icon: Zap, skills: ['CI/CD', '容器化', '自动化测试', '监控'], date: null, progress: 0, color: 'bg-emerald-100', badge: '🔧', condition: '完成DevOps相关面试，答对80%以上问题' },
  { id: 16, name: '产品思维认证', status: '未解锁', level: 3, description: '具备产品规划和用户体验设计能力', icon: Target, skills: ['产品规划', '用户体验', '市场分析', '需求管理'], date: null, progress: 0, color: 'bg-blue-100', badge: '📱', condition: '完成产品相关面试，答对80%以上问题' }
]

// 成就数据
const achievements = [
  { id: 1, name: '面试新手', description: '完成第一次模拟面试', unlocked: true, icon: Star, points: 50, date: '2024-12-10', rarity: 'common', color: 'bg-gray-100', animation: 'pulse', condition: '完成任意一个面试关卡' },
  { id: 2, name: '面试达人', description: '连续通过 3 次面试', unlocked: true, icon: Zap, points: 100, date: '2024-12-12', rarity: 'uncommon', color: 'bg-blue-100', animation: 'bounce', condition: '在同一关卡中连续通过3次面试' },
  { id: 3, name: '面霸', description: '通过所有初级面试', unlocked: true, icon: Trophy, points: 150, date: '2024-12-15', rarity: 'rare', color: 'bg-purple-100', animation: 'wiggle', condition: '完成关卡01的所有面试' },
  { id: 4, name: '技术专家', description: '通过高级工程师面试', unlocked: false, icon: Brain, points: 200, date: null, rarity: 'epic', color: 'bg-green-100', animation: 'spin', condition: '完成关卡03的所有面试' },
  { id: 5, name: '职场精英', description: '通过 CTO 面试', unlocked: false, icon: Users, points: 300, date: null, rarity: 'legendary', color: 'bg-red-100', animation: 'pulse', condition: '完成关卡05的所有面试' },
  { id: 6, name: '答题高手', description: '连续答对 10 题', unlocked: true, icon: CheckCircle, points: 80, date: '2024-12-14', rarity: 'uncommon', color: 'bg-yellow-100', animation: 'bounce', condition: '在一次面试中连续答对10个问题' },
  { id: 7, name: '速度之王', description: '5 分钟内完成 10 题', unlocked: false, icon: Clock, points: 120, date: null, rarity: 'rare', color: 'bg-orange-100', animation: 'wiggle', condition: '在5分钟内完成10个问题的回答' },
  { id: 8, name: '全才', description: '通过所有类型的面试', unlocked: false, icon: AwardIcon, points: 250, date: null, rarity: 'epic', color: 'bg-teal-100', animation: 'spin', condition: '完成校招、社招、高级、高管、跨领域等所有类型的面试' },
  { id: 9, name: '坚持不懈', description: '连续 7 天登录游戏', unlocked: true, icon: Star, points: 60, date: '2024-12-16', rarity: 'common', color: 'bg-gray-100', animation: 'pulse', condition: '连续7天登录游戏' },
  { id: 10, name: '社交达人', description: '邀请 3 位好友加入游戏', unlocked: false, icon: Users, points: 100, date: null, rarity: 'uncommon', color: 'bg-blue-100', animation: 'bounce', condition: '成功邀请3位好友注册并登录游戏' },
  { id: 11, name: 'FAANG 追梦人', description: '通过 FAANG 面试', unlocked: false, icon: Trophy, points: 400, date: null, rarity: 'legendary', color: 'bg-indigo-100', animation: 'pulse', condition: '完成关卡07的所有面试' },
  { id: 12, name: '跨领域专家', description: '通过跨领域面试', unlocked: false, icon: Brain, points: 250, date: null, rarity: 'epic', color: 'bg-purple-100', animation: 'spin', condition: '完成关卡06的所有面试' },
  { id: 13, name: '答题机器', description: '连续答对 20 题', unlocked: false, icon: CheckCircle, points: 150, date: null, rarity: 'rare', color: 'bg-green-100', animation: 'wiggle', condition: '在一次面试中连续答对20个问题' },
  { id: 14, name: '时间管理大师', description: '3 分钟内完成 10 题', unlocked: false, icon: Clock, points: 180, date: null, rarity: 'epic', color: 'bg-red-100', animation: 'spin', condition: '在3分钟内完成10个问题的回答' },
  { id: 15, name: '常胜将军', description: '连续通过 10 次面试', unlocked: false, icon: Trophy, points: 300, date: null, rarity: 'legendary', color: 'bg-orange-100', animation: 'pulse', condition: '在任意关卡中连续通过10次面试' },
  { id: 16, name: '学习标兵', description: '完成所有技能认证', unlocked: false, icon: AwardIcon, points: 450, date: null, rarity: 'legendary', color: 'bg-teal-100', animation: 'pulse', condition: '获得所有16个技能认证' },
  { id: 17, name: '社区贡献者', description: '分享 10 篇面试复盘', unlocked: false, icon: Users, points: 120, date: null, rarity: 'uncommon', color: 'bg-blue-100', animation: 'bounce', condition: '分享10篇面试复盘到社区' },
  { id: 18, name: '关卡大师', description: '完成所有游戏关卡', unlocked: false, icon: Trophy, points: 500, date: null, rarity: 'legendary', color: 'bg-indigo-100', animation: 'pulse', condition: '完成所有7个游戏关卡' },
  { id: 19, name: '知识渊博', description: '回答 100 个不同的问题', unlocked: false, icon: Brain, points: 200, date: null, rarity: 'epic', color: 'bg-purple-100', animation: 'spin', condition: '回答100个不同的面试问题' },
  { id: 20, name: '面试王者', description: '通过 50 次面试', unlocked: false, icon: Trophy, points: 350, date: null, rarity: 'legendary', color: 'bg-red-100', animation: 'pulse', condition: '累计通过50次面试' },
  { id: 21, name: '快速学习者', description: '在 1 周内完成 3 个关卡', unlocked: false, icon: Zap, points: 150, date: null, rarity: 'rare', color: 'bg-yellow-100', animation: 'wiggle', condition: '在7天内完成3个游戏关卡' },
  { id: 22, name: '精益求精', description: '单个关卡成功率达到 100%', unlocked: false, icon: Target, points: 180, date: null, rarity: 'epic', color: 'bg-green-100', animation: 'spin', condition: '在单个关卡中所有面试都通过' }
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
  points: number;
  date: string | null;
  rarity: string;
  condition: string;
}

interface Certification {
  id: number;
  name: string;
  status: string;
  level: number;
  description: string;
  icon: any;
  skills: string[];
  date: string | null;
  progress: number;
  condition: string;
}

const selectedAchievement = ref<Achievement | null>(null)
const selectedCertification = ref<Certification | null>(null)
const currentVolume = ref(70)
const soundEnabled = ref(true)

// 方法
const startLevel = (levelId: number) => {
  console.log(`查看关卡 ${levelId} 详情`)
  // 跳转到关卡详情页面
  router.push(`/game-interview/level/${levelId}/detail`)
}

const startGame = () => {
  // 找到第一个已解锁的关卡
  const firstUnlockedLevel = gameLevels.find(level => level.status === '已解锁')
  if (firstUnlockedLevel) {
    router.push(`/game-interview/level/${firstUnlockedLevel.id}/detail`)
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
          <div v-for="level in gameLevels" :key="level.id" class="p-6 rounded-[24px] relative overflow-hidden group hover:shadow-md transition-all border border-transparent hover:border-neutral-border" :class="level.background">
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
                <span class="text-2xl">{{ level.icon }}</span>
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
            
            <!-- 技能标签 -->
            <div class="mb-4">
              <div class="text-xs text-neutral-helper mb-2">关键技能</div>
              <div class="flex flex-wrap gap-2">
                <span v-for="(skill, index) in level.skills" :key="index" class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                  {{ skill }}
                </span>
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
            <div v-for="achievement in achievements" :key="achievement.id" @click="viewAchievementDetail(achievement)" class="p-6 rounded-[24px] relative overflow-hidden group hover:shadow-md transition-all border border-transparent hover:border-neutral-border cursor-pointer" :class="achievement.unlocked ? achievement.color : 'bg-neutral-bg'">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform" :class="achievement.unlocked ? 'bg-white text-primary group-hover:gradient-primary group-hover:text-white animate-' + achievement.animation : 'bg-neutral-border text-neutral-helper'">
                <component :is="achievement.icon" :size="24" />
              </div>
              <h3 class="font-bold text-neutral-title mb-1">{{ achievement.name }}</h3>
              <p class="text-sm text-neutral-helper mb-4">{{ achievement.description }}</p>
              <div class="flex items-center justify-between mt-auto">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold" :class="achievement.unlocked ? 'text-auxiliary-green' : 'text-neutral-helper'">{{ achievement.unlocked ? '已获得' : '未获得' }}</span>
                  <span class="text-xs font-bold px-2 py-1 rounded-full" :class="
                    achievement.rarity === 'common' ? 'bg-gray-200 text-gray-700' :
                    achievement.rarity === 'uncommon' ? 'bg-blue-200 text-blue-700' :
                    achievement.rarity === 'rare' ? 'bg-purple-200 text-purple-700' :
                    achievement.rarity === 'epic' ? 'bg-pink-200 text-pink-700' :
                    'bg-orange-200 text-orange-700'
                  ">
                    {{ 
                      achievement.rarity === 'common' ? '普通' :
                      achievement.rarity === 'uncommon' ? '优秀' :
                      achievement.rarity === 'rare' ? '稀有' :
                      achievement.rarity === 'epic' ? '史诗' :
                      '传说'
                    }}
                  </span>
                </div>
                <div class="flex items-center gap-1">
                  <Star :size="14" class="text-yellow-400" />
                  <span class="text-xs font-bold text-neutral-title">{{ achievement.points }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Certifications Tab -->
        <div v-if="activeTab === 'certifications'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="cert in certifications" :key="cert.id" @click="viewCertificationDetail(cert)" class="p-6 rounded-[24px] relative overflow-hidden group hover:shadow-md transition-all border border-transparent hover:border-neutral-border cursor-pointer" :class="cert.status === '已认证' ? cert.color : 'bg-neutral-bg'">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform" :class="cert.status === '已认证' ? 'bg-white text-primary group-hover:gradient-primary group-hover:text-white' : 'bg-neutral-border text-neutral-helper'">
                <span class="text-2xl">{{ cert.badge }}</span>
              </div>
              <h3 class="font-bold text-neutral-title mb-1">{{ cert.name }}</h3>
              <p class="text-sm text-neutral-helper mb-4">{{ cert.description }}</p>
              <div class="mb-3">
                <div class="w-full h-2 bg-neutral-border rounded-full overflow-hidden">
                  <div class="h-full bg-primary transition-all duration-1000" :style="{ width: cert.progress + '%' }"></div>
                </div>
                <div class="flex justify-between mt-1">
                  <span class="text-xs text-neutral-helper">0%</span>
                  <span class="text-xs font-bold text-neutral-title">{{ cert.progress }}%</span>
                  <span class="text-xs text-neutral-helper">100%</span>
                </div>
              </div>
              <div class="flex items-center justify-between mt-auto">
                <span class="text-xs font-bold" :class="cert.status === '已认证' ? 'text-auxiliary-green' : cert.status === '进行中' ? 'text-primary' : 'text-neutral-helper'">{{ cert.status }}</span>
                <span class="text-xs font-bold text-neutral-title">等级 {{ cert.level }}</span>
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
    <div v-if="isHelpOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        <div class="p-8 border-b border-neutral-border flex justify-between items-center">
          <h3 class="text-2xl font-black text-neutral-title flex items-center gap-3">
            <HelpCircle :size="28" class="text-primary" />
            游戏式面试帮助中心
          </h3>
          <button @click="toggleHelp" class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all">
            <X :size="20" />
          </button>
        </div>
        <div class="p-8 space-y-6">
          <div class="p-6 bg-neutral-bg rounded-[20px] border border-neutral-border hover:border-primary/20 transition-all hover:shadow-md">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">1</div>
              <div class="flex-1">
                <h4 class="font-bold text-neutral-title mb-2">如何开始游戏？</h4>
                <p class="text-sm text-neutral-body">点击首页的"开始游戏闯关"按钮，选择已解锁的关卡即可开始挑战。每个关卡都有不同的难度和挑战目标，模拟真实的面试场景。</p>
              </div>
            </div>
          </div>
          <div class="p-6 bg-neutral-bg rounded-[20px] border border-neutral-border hover:border-primary/20 transition-all hover:shadow-md">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">2</div>
              <div class="flex-1">
                <h4 class="font-bold text-neutral-title mb-2">如何获得成就？</h4>
                <p class="text-sm text-neutral-body">完成特定的游戏目标，如连续答对10题、5分钟内完成10题、通过所有初级面试等，即可获得相应的成就。成就可以在成就系统页面查看详细信息。</p>
              </div>
            </div>
          </div>
          <div class="p-6 bg-neutral-bg rounded-[20px] border border-neutral-border hover:border-primary/20 transition-all hover:shadow-md">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">3</div>
              <div class="flex-1">
                <h4 class="font-bold text-neutral-title mb-2">如何解锁技能认证？</h4>
                <p class="text-sm text-neutral-body">完成相应的关卡后，系统会自动解锁对应的技能认证，证明你的能力水平。技能认证可以在技能认证页面查看详细信息，包括认证等级和认证技能。</p>
              </div>
            </div>
          </div>
          <div class="p-6 bg-neutral-bg rounded-[20px] border border-neutral-border hover:border-primary/20 transition-all hover:shadow-md">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">4</div>
              <div class="flex-1">
                <h4 class="font-bold text-neutral-title mb-2">如何查看排行榜？</h4>
                <p class="text-sm text-neutral-body">点击首页的"查看排行榜"按钮，即可查看所有用户的排名情况。排行榜显示用户的积分、关卡进度、成功率和总面试次数等信息。</p>
              </div>
            </div>
          </div>
          <div class="p-6 bg-neutral-bg rounded-[20px] border border-neutral-border hover:border-primary/20 transition-all hover:shadow-md">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">5</div>
              <div class="flex-1">
                <h4 class="font-bold text-neutral-title mb-2">如何提高面试成功率？</h4>
                <p class="text-sm text-neutral-body">1. 充分准备常见面试问题<br>2. 练习回答技巧，注意逻辑和结构<br>3. 查看示例回答，学习优秀的回答方式<br>4. 多次练习，积累经验<br>5. 分析面试反馈，不断改进</p>
              </div>
            </div>
          </div>
          <div class="p-6 bg-neutral-bg rounded-[20px] border border-neutral-border hover:border-primary/20 transition-all hover:shadow-md">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">6</div>
              <div class="flex-1">
                <h4 class="font-bold text-neutral-title mb-2">游戏积分规则</h4>
                <p class="text-sm text-neutral-body">1. 完成面试关卡：+100积分<br>2. 答对问题：+10-30积分/题<br>3. 获得成就：+50-200积分/个<br>4. 排行榜排名奖励：+50-500积分/周<br>5. 连续登录：+10积分/天</p>
              </div>
            </div>
          </div>
          <div class="p-6 bg-neutral-bg rounded-[20px] border border-neutral-border hover:border-primary/20 transition-all hover:shadow-md">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">7</div>
              <div class="flex-1">
                <h4 class="font-bold text-neutral-title mb-2">游戏难度设置</h4>
                <p class="text-sm text-neutral-body">在设置页面可以调整游戏难度，包括简单、中等和困难三个级别。不同难度级别对应不同的问题数量、时间限制和评分标准。</p>
              </div>
            </div>
          </div>
          <div class="p-6 bg-neutral-bg rounded-[20px] border border-neutral-border hover:border-primary/20 transition-all hover:shadow-md">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">8</div>
              <div class="flex-1">
                <h4 class="font-bold text-neutral-title mb-2">游戏数据保存</h4>
                <p class="text-sm text-neutral-body">游戏进度会自动保存，包括已完成的关卡、获得的成就和技能认证等。你可以在设置页面查看和管理游戏数据。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Achievement Detail Modal -->
    <div v-if="isAchievementDetailOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-[32px] w-full max-w-md animate-in zoom-in-95 duration-300">
        <div class="p-8 border-b border-neutral-border flex justify-between items-center">
          <h3 class="text-2xl font-black text-neutral-title flex items-center gap-3">
            <Trophy :size="28" class="text-primary" />
            成就详情
          </h3>
          <button @click="closeAchievementDetail" class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all">
            <X :size="20" />
          </button>
        </div>
        <div class="p-8 space-y-6">
          <div class="flex flex-col items-center">
            <div class="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg" :class="selectedAchievement?.unlocked ? 'bg-white text-primary' : 'bg-neutral-border text-neutral-helper'">
              <component :is="selectedAchievement?.icon" :size="48" />
            </div>
            <h4 class="text-xl font-bold text-neutral-title mb-2">{{ selectedAchievement?.name }}</h4>
            <p class="text-sm text-neutral-helper mb-4 text-center">{{ selectedAchievement?.description }}</p>
            <div class="flex items-center gap-2">
              <span class="px-4 py-2 rounded-full text-sm font-bold" :class="selectedAchievement?.unlocked ? 'bg-auxiliary-green/10 text-auxiliary-green' : 'bg-neutral-border/50 text-neutral-helper'">
                {{ selectedAchievement?.unlocked ? '已获得' : '未获得' }}
              </span>
              <span class="px-4 py-2 rounded-full text-sm font-bold" :class="
                selectedAchievement?.rarity === 'common' ? 'bg-neutral-border/50 text-neutral-helper' :
                selectedAchievement?.rarity === 'uncommon' ? 'bg-primary/10 text-primary' :
                selectedAchievement?.rarity === 'rare' ? 'bg-auxiliary-orange/10 text-auxiliary-orange' :
                selectedAchievement?.rarity === 'epic' ? 'bg-auxiliary-purple/10 text-auxiliary-purple' :
                'bg-auxiliary-red/10 text-auxiliary-red'
              ">
                {{ 
                  selectedAchievement?.rarity === 'common' ? '普通' :
                  selectedAchievement?.rarity === 'uncommon' ? '优秀' :
                  selectedAchievement?.rarity === 'rare' ? '稀有' :
                  selectedAchievement?.rarity === 'epic' ? '史诗' :
                  '传说'
                }}
              </span>
            </div>
          </div>
          <div v-if="selectedAchievement?.unlocked" class="p-4 bg-neutral-bg rounded-[20px]">
            <h5 class="font-bold text-neutral-title mb-2">获得时间</h5>
            <p class="text-sm text-neutral-body">{{ selectedAchievement?.date }} 14:30</p>
          </div>
          <div class="p-4 bg-neutral-bg rounded-[20px]">
            <h5 class="font-bold text-neutral-title mb-2">成就价值</h5>
            <p class="text-sm text-neutral-body">+{{ selectedAchievement?.points }} 积分</p>
          </div>
          <div class="p-4 bg-neutral-bg rounded-[20px]">
            <h5 class="font-bold text-neutral-title mb-2">获取条件</h5>
            <p class="text-sm text-neutral-body">{{ selectedAchievement?.condition }}</p>
          </div>
          <div class="p-4 bg-neutral-bg rounded-[20px]">
            <h5 class="font-bold text-neutral-title mb-2">进度</h5>
            <div class="w-full h-2 bg-neutral-border rounded-full overflow-hidden">
              <div class="h-full bg-primary transition-all duration-1000" :style="{ width: selectedAchievement?.unlocked ? '100%' : '0%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Certification Detail Modal -->
    <div v-if="isCertificationDetailOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-[32px] w-full max-w-md animate-in zoom-in-95 duration-300">
        <div class="p-8 border-b border-neutral-border flex justify-between items-center">
          <h3 class="text-2xl font-black text-neutral-title flex items-center gap-3">
            <AwardIcon :size="28" class="text-primary" />
            技能认证详情
          </h3>
          <button @click="closeCertificationDetail" class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all">
            <X :size="20" />
          </button>
        </div>
        <div class="p-8 space-y-6">
          <div class="flex flex-col items-center">
            <div class="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg" :class="selectedCertification?.status === '已认证' ? 'bg-white text-primary' : 'bg-neutral-border text-neutral-helper'">
              <component :is="selectedCertification?.icon" :size="48" />
            </div>
            <h4 class="text-xl font-bold text-neutral-title mb-2">{{ selectedCertification?.name }}</h4>
            <p class="text-sm text-neutral-helper mb-4 text-center">{{ selectedCertification?.description }}</p>
            <span class="px-4 py-2 rounded-full text-sm font-bold" :class="selectedCertification?.status === '已认证' ? 'bg-auxiliary-green/10 text-auxiliary-green' : selectedCertification?.status === '进行中' ? 'bg-primary/10 text-primary' : 'bg-neutral-border/50 text-neutral-helper'">
              {{ selectedCertification?.status }}
            </span>
          </div>
          <div v-if="selectedCertification?.status === '已认证'" class="p-4 bg-neutral-bg rounded-[20px]">
            <h5 class="font-bold text-neutral-title mb-2">认证时间</h5>
            <p class="text-sm text-neutral-body">{{ selectedCertification?.date }} 14:30</p>
          </div>
          <div class="p-4 bg-neutral-bg rounded-[20px]">
            <h5 class="font-bold text-neutral-title mb-2">认证等级</h5>
            <p class="text-sm text-neutral-body">等级 {{ selectedCertification?.level }}</p>
          </div>
          <div class="p-4 bg-neutral-bg rounded-[20px]">
            <h5 class="font-bold text-neutral-title mb-2">认证技能</h5>
            <div class="flex flex-wrap gap-2">
              <span v-for="(skill, index) in selectedCertification?.skills" :key="index" class="px-3 py-1 bg-primary/10 rounded-full text-xs font-bold text-primary">
                {{ skill }}
              </span>
            </div>
          </div>
          <div class="p-4 bg-neutral-bg rounded-[20px]">
            <h5 class="font-bold text-neutral-title mb-2">获取条件</h5>
            <p class="text-sm text-neutral-body">{{ selectedCertification?.condition }}</p>
          </div>
          <div class="p-4 bg-neutral-bg rounded-[20px]">
            <h5 class="font-bold text-neutral-title mb-2">进度</h5>
            <div class="w-full h-2 bg-neutral-border rounded-full overflow-hidden">
              <div class="h-full bg-primary transition-all duration-1000" :style="{ width: selectedCertification?.progress + '%' }"></div>
            </div>
            <div class="flex justify-between mt-1">
              <span class="text-xs text-neutral-helper">0%</span>
              <span class="text-xs text-neutral-helper">{{ selectedCertification?.progress }}%</span>
              <span class="text-xs text-neutral-helper">100%</span>
            </div>
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