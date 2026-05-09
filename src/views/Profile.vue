<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import {
  User,
  FileText,
  CheckCircle,
  TrendingUp,
  Calendar,
  Briefcase,
  Target,
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
  Activity,
  Trophy,
  RefreshCw,
  Download,
  Share2,
  Play,
  X
} from 'lucide-vue-next'

const router = useRouter()

const chartRef = ref<HTMLElement | null>(null)
let myChart: echarts.ECharts | null = null
const isChartLoading = ref(true)

// 能力数据
const targetPosition = ref('前端开发工程师')
const positions = [
  '前端开发工程师',
  'Java 开发工程师',
  '产品经理',
  'UI 设计师'
]

// 能力雷达图数据
const abilityData = {
  '前端开发工程师': {
    current: [85, 78, 92, 70, 88, 75, 82],
    required: [90, 85, 80, 90, 85, 95, 90],
    indicators: [
      { name: '技术深度', max: 100 },
      { name: '逻辑思维', max: 100 },
      { name: '表达能力', max: 100 },
      { name: '项目经验', max: 100 },
      { name: '学习潜力', max: 100 },
      { name: '工程化能力', max: 100 },
      { name: '团队协作', max: 100 }
    ],
    gapSkills: [
      { name: 'Vue3 源码深度', gap: 15, level: 'high' },
      { name: '工程化架构能力', gap: 20, level: 'high' },
      { name: '项目经验', gap: 20, level: 'high' },
      { name: '团队协作', gap: 8, level: 'medium' }
    ],
    strengths: [
      { name: '表达能力', score: 92 },
      { name: '学习潜力', score: 88 },
      { name: '技术深度', score: 85 }
    ]
  },
  'Java 开发工程师': {
    current: [70, 85, 75, 65, 80, 60, 75],
    required: [90, 85, 80, 90, 85, 85, 85],
    indicators: [
      { name: '技术深度', max: 100 },
      { name: '逻辑思维', max: 100 },
      { name: '表达能力', max: 100 },
      { name: '项目经验', max: 100 },
      { name: '学习潜力', max: 100 },
      { name: '系统设计', max: 100 },
      { name: '团队协作', max: 100 }
    ],
    gapSkills: [
      { name: '系统设计', gap: 25, level: 'high' },
      { name: '技术深度', gap: 20, level: 'high' },
      { name: '项目经验', gap: 25, level: 'high' },
      { name: '工程化能力', gap: 15, level: 'medium' }
    ],
    strengths: [
      { name: '逻辑思维', score: 85 },
      { name: '学习潜力', score: 80 },
      { name: '团队协作', score: 75 }
    ]
  },
  '产品经理': {
    current: [65, 80, 90, 75, 85, 82, 95],
    required: [70, 85, 90, 85, 85, 90, 90],
    indicators: [
      { name: '业务理解', max: 100 },
      { name: '逻辑思维', max: 100 },
      { name: '表达能力', max: 100 },
      { name: '项目经验', max: 100 },
      { name: '学习潜力', max: 100 },
      { name: '用户研究', max: 100 },
      { name: '团队协作', max: 100 }
    ],
    gapSkills: [
      { name: '用户研究', gap: 8, level: 'medium' },
      { name: '项目经验', gap: 10, level: 'medium' },
      { name: '业务理解', gap: 5, level: 'low' }
    ],
    strengths: [
      { name: '团队协作', score: 95 },
      { name: '表达能力', score: 90 },
      { name: '学习潜力', score: 85 }
    ]
  },
  'UI 设计师': {
    current: [80, 75, 85, 70, 90, 88, 82],
    required: [90, 85, 85, 85, 85, 95, 85],
    indicators: [
      { name: '设计能力', max: 100 },
      { name: '创意思维', max: 100 },
      { name: '表达能力', max: 100 },
      { name: '项目经验', max: 100 },
      { name: '学习潜力', max: 100 },
      { name: '工具熟练度', max: 100 },
      { name: '团队协作', max: 100 }
    ],
    gapSkills: [
      { name: '工具熟练度', gap: 7, level: 'medium' },
      { name: '项目经验', gap: 15, level: 'high' },
      { name: '创意思维', gap: 10, level: 'medium' }
    ],
    strengths: [
      { name: '学习潜力', score: 90 },
      { name: '工具熟练度', score: 88 },
      { name: '表达能力', score: 85 }
    ]
  }
}

// 当前选中的能力数据
const currentAbilityData = computed(() => {
  return abilityData[targetPosition.value as keyof typeof abilityData]
})

// 计算能力差距
const abilityGap = computed(() => {
  const data = currentAbilityData.value
  const currentSum = data.current.reduce((sum, val) => sum + val, 0)
  const requiredSum = data.required.reduce((sum, val) => sum + val, 0)
  return Math.round(((requiredSum - currentSum) / (data.indicators.length * 100)) * 100)
})

// 计算匹配度
const matchRate = computed(() => {
  return 100 - abilityGap.value
})

// 重新分析状态
const isReanalyzing = ref(false)

// 切换目标岗位
const changePosition = (position: string) => {
  targetPosition.value = position
  initChart()
}

// 重新分析
const reanalyze = () => {
  isReanalyzing.value = true
  // 模拟分析过程
  setTimeout(() => {
    isReanalyzing.value = false
    initChart()
  }, 1500)
}

// 计算技能项的颜色
const getSkillColor = (level: string) => {
  switch (level) {
    case 'high':
      return 'bg-auxiliary-red/10 border-auxiliary-red/30 text-auxiliary-red'
    case 'medium':
      return 'bg-auxiliary-yellow/10 border-auxiliary-yellow/30 text-auxiliary-orange'
    case 'low':
      return 'bg-auxiliary-green/10 border-auxiliary-green/30 text-auxiliary-green'
    default:
      return 'bg-neutral-bg border-neutral-border text-neutral-body'
  }
}

// 面试实战记录数据
const interviewHistory = [
  { 
    id: 1, 
    date: '2026-03-15', 
    company: '字节跳动', 
    position: '前端开发工程师', 
    round: '二面', 
    type: '技术面', 
    score: 88, 
    status: '已通过',
    tags: ['Vue3', 'TypeScript', '算法'],
    feedback: '技术基础扎实，算法能力突出，表达清晰',
    details: {
      technical: 90,
      communication: 85,
      logic: 92,
      problemSolving: 88
    }
  },
  { 
    id: 2, 
    date: '2026-02-28', 
    company: '阿里巴巴', 
    position: 'Java 开发工程师', 
    round: '一面', 
    type: '技术面', 
    score: 82, 
    status: '已通过',
    tags: ['Java', 'Spring Boot', '数据库'],
    feedback: '后端知识体系完整，项目经验丰富',
    details: {
      technical: 85,
      communication: 78,
      logic: 88,
      problemSolving: 82
    }
  },
  { 
    id: 3, 
    date: '2025-11-15', 
    company: '腾讯', 
    position: 'UI 设计师', 
    round: '三面', 
    type: '设计面', 
    score: 91, 
    status: '已通过',
    tags: ['UI/UX', 'Figma', '交互设计'],
    feedback: '设计理念新颖，作品集质量高',
    details: {
      technical: 92,
      communication: 90,
      logic: 85,
      problemSolving: 88
    }
  },
  { 
    id: 4, 
    date: '2025-10-20', 
    company: '美团', 
    position: '产品经理', 
    round: '一面', 
    type: '产品面', 
    score: 78, 
    status: '未通过',
    tags: ['产品设计', '用户研究', '数据分析'],
    feedback: '产品思维清晰，但行业理解深度不足',
    details: {
      technical: 75,
      communication: 82,
      logic: 78,
      problemSolving: 75
    }
  },
  { 
    id: 5, 
    date: '2025-09-10', 
    company: '百度', 
    position: '数据分析师', 
    round: '二面', 
    type: '技术面', 
    score: 85, 
    status: '已通过',
    tags: ['数据分析', 'SQL', 'Python'],
    feedback: '数据处理能力强，分析思路清晰',
    details: {
      technical: 88,
      communication: 82,
      logic: 90,
      problemSolving: 85
    }
  },
  { 
    id: 6, 
    date: '2025-08-05', 
    company: '京东', 
    position: '后端开发工程师', 
    round: '一面', 
    type: '技术面', 
    score: 80, 
    status: '已通过',
    tags: ['Java', '微服务', '分布式'],
    feedback: '后端技术掌握全面，编码能力强',
    details: {
      technical: 82,
      communication: 78,
      logic: 85,
      problemSolving: 80
    }
  },
  { 
    id: 7, 
    date: '2025-06-20', 
    company: '拼多多', 
    position: '前端开发工程师', 
    round: '三面', 
    type: '技术面', 
    score: 92, 
    status: '已通过',
    tags: ['React', 'Node.js', '性能优化'],
    feedback: '前端技术栈全面，性能优化经验丰富',
    details: {
      technical: 95,
      communication: 90,
      logic: 92,
      problemSolving: 90
    }
  },
  { 
    id: 8, 
    date: '2025-05-15', 
    company: '小米', 
    position: '测试工程师', 
    round: '一面', 
    type: '技术面', 
    score: 76, 
    status: '未通过',
    tags: ['测试', '自动化', '质量保证'],
    feedback: '测试基础扎实，但自动化测试经验不足',
    details: {
      technical: 78,
      communication: 75,
      logic: 72,
      problemSolving: 76
    }
  },
  { 
    id: 9, 
    date: '2025-04-10', 
    company: '网易', 
    position: '前端开发工程师', 
    round: '二面', 
    type: '技术面', 
    score: 86, 
    status: '已通过',
    tags: ['Vue3', 'Webpack', '响应式设计'],
    feedback: '前端技术能力强，项目经验丰富',
    details: {
      technical: 88,
      communication: 85,
      logic: 86,
      problemSolving: 84
    }
  },
  { 
    id: 10, 
    date: '2025-03-05', 
    company: '新浪', 
    position: '后端开发工程师', 
    round: '一面', 
    type: '技术面', 
    score: 79, 
    status: '已通过',
    tags: ['Java', 'Spring Cloud', '缓存'],
    feedback: '后端技术掌握良好，有一定项目经验',
    details: {
      technical: 82,
      communication: 75,
      logic: 80,
      problemSolving: 78
    }
  },
  { 
    id: 11, 
    date: '2024-12-20', 
    company: '搜狐', 
    position: '前端开发工程师', 
    round: '一面', 
    type: '技术面', 
    score: 83, 
    status: '已通过',
    tags: ['JavaScript', 'HTML/CSS', '浏览器原理'],
    feedback: '前端基础扎实，学习能力强',
    details: {
      technical: 85,
      communication: 80,
      logic: 82,
      problemSolving: 83
    }
  },
  { 
    id: 12, 
    date: '2024-11-10', 
    company: '优酷', 
    position: '产品经理', 
    round: '二面', 
    type: '产品面', 
    score: 81, 
    status: '未通过',
    tags: ['产品规划', '用户体验', '市场分析'],
    feedback: '产品思路清晰，但缺乏创新点',
    details: {
      technical: 78,
      communication: 85,
      logic: 80,
      problemSolving: 79
    }
  }
]

// 筛选和排序状态
const filterStatus = ref('all')
const sortBy = ref('date')
const isExpanded = ref<number | null>(null)
const isLoading = ref(false)
const isAllInterviewsPageOpen = ref(false)
const isPracticeModalOpen = ref(false)
const isReviewModalOpen = ref(false)
const isLevelDetailModalOpen = ref(false)
const currentBank = ref<any>(null)
const currentMistake = ref<any>(null)
const currentLevel = ref<any>(null)

// 筛选后的面试记录
const filteredInterviews = computed(() => {
  let result = [...interviewHistory]
  
  // 按状态筛选
  if (filterStatus.value !== 'all') {
    result = result.filter(item => item.status === filterStatus.value)
  }
  
  // 排序
  result.sort((a, b) => {
    if (sortBy.value === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortBy.value === 'score') {
      return b.score - a.score
    }
    return 0
  })
  
  return result
})

// 切换展开/收起状态
const toggleExpand = (id: number) => {
  isExpanded.value = isExpanded.value === id ? null : id
}

// 重新练习相似面试
const practiceAgain = (interview: any) => {
  isLoading.value = true
  // 模拟加载
  setTimeout(() => {
    isLoading.value = false
    alert(`正在为您生成 ${interview.position} 的相似面试练习...`)
  }, 1000)
}

// 导出面试记录
const exportRecord = (_id: number) => {
  isLoading.value = true
  // 模拟导出
  setTimeout(() => {
    isLoading.value = false
    alert('面试记录已导出到本地')
  }, 1000)
}

// 查看全部面试记录
const openAllInterviewsPage = () => {
  isAllInterviewsPageOpen.value = true
}

const closeAllInterviewsPage = () => {
  isAllInterviewsPageOpen.value = false
}

// 分享面试经验
const shareExperience = (_id: number) => {
  isLoading.value = true
  // 模拟分享
  setTimeout(() => {
    isLoading.value = false
    alert('面试经验分享链接已复制到剪贴板')
  }, 1000)
}

const stats = [
  { label: '累计面试', value: '15', icon: History, color: 'text-primary' },
  { label: '平均匹配度', value: '86.5%', icon: Target, color: 'text-auxiliary-orange' },
  { label: 'AI 能力认证', value: '8', icon: ShieldCheck, color: 'text-auxiliary-green' },
]

// 收藏题库数据
const savedQuestionBanks = [
  {
    id: 1,
    title: '高频算法 50 题',
    description: '涵盖面试中常见的算法题，包括排序、查找、动态规划等',
    questionCount: 24,
    category: '算法',
    difficulty: 'medium',
    savedAt: '2026-03-20',
    lastPracticed: '2026-03-25',
    questions: [
      { id: 101, title: '两数之和', difficulty: 'easy', status: 'completed' },
      { id: 102, title: '三数之和', difficulty: 'medium', status: 'completed' },
      { id: 103, title: '最长回文子串', difficulty: 'medium', status: 'in_progress' },
      { id: 104, title: '二叉树的最大深度', difficulty: 'easy', status: 'completed' },
      { id: 105, title: '有效的括号', difficulty: 'easy', status: 'completed' }
    ]
  },
  {
    id: 2,
    title: '前端框架高频题',
    description: 'Vue、React、Angular 等前端框架的常见面试题',
    questionCount: 32,
    category: '前端',
    difficulty: 'medium',
    savedAt: '2026-03-15',
    lastPracticed: '2026-03-22',
    questions: [
      { id: 201, title: 'Vue3 的响应式原理', difficulty: 'medium', status: 'completed' },
      { id: 202, title: 'React 的生命周期', difficulty: 'easy', status: 'completed' },
      { id: 203, title: '虚拟 DOM 的工作原理', difficulty: 'hard', status: 'in_progress' }
    ]
  },
  {
    id: 3,
    title: '系统设计基础',
    description: '分布式系统、微服务、缓存等系统设计相关问题',
    questionCount: 18,
    category: '后端',
    difficulty: 'hard',
    savedAt: '2026-03-10',
    lastPracticed: '2026-03-18',
    questions: [
      { id: 301, title: '如何设计一个高可用的系统', difficulty: 'hard', status: 'in_progress' },
      { id: 302, title: '缓存的设计与使用', difficulty: 'medium', status: 'completed' }
    ]
  }
]

// 错题本数据
const mistakeBook = [
  {
    id: 1,
    question: '在 Vue3 中，如何实现组件间的通信？',
    userAnswer: '使用 props 和 events',
    correctAnswer: '使用 props、events、provide/inject、pinia 等多种方式',
    explanation: 'Vue3 提供了多种组件间通信方式，包括传统的 props 和 events，以及 provide/inject API，还有状态管理库如 pinia',
    category: '前端',
    difficulty: 'medium',
    mistakeCount: 2,
    lastMistakeAt: '2026-03-24',
    status: 'unreviewed'
  },
  {
    id: 2,
    question: '什么是闭包？',
    userAnswer: '闭包是一个函数',
    correctAnswer: '闭包是指有权访问另一个函数作用域中变量的函数',
    explanation: '闭包的核心特点是能够访问其词法作用域之外的变量，即使创建它的函数已经执行完毕',
    category: 'JavaScript',
    difficulty: 'medium',
    mistakeCount: 1,
    lastMistakeAt: '2026-03-20',
    status: 'reviewed'
  },
  {
    id: 3,
    question: '如何优化 React 应用的性能？',
    userAnswer: '使用 memo 和 useCallback',
    correctAnswer: '使用 memo、useCallback、useMemo、虚拟列表、代码分割等多种方式',
    explanation: 'React 性能优化是一个综合工程，需要从多个方面入手，包括组件渲染优化、状态管理优化、资源加载优化等',
    category: '前端',
    difficulty: 'hard',
    mistakeCount: 3,
    lastMistakeAt: '2026-03-18',
    status: 'unreviewed'
  },
  {
    id: 4,
    question: '什么是事件冒泡和事件捕获？',
    userAnswer: '事件冒泡是从子元素向父元素传播，事件捕获是从父元素向子元素传播',
    correctAnswer: '事件冒泡是从触发事件的元素开始，向上传播到根元素；事件捕获是从根元素开始，向下传播到触发事件的元素',
    explanation: 'DOM 事件流包括三个阶段：事件捕获阶段、目标阶段和事件冒泡阶段',
    category: 'JavaScript',
    difficulty: 'easy',
    mistakeCount: 1,
    lastMistakeAt: '2026-03-15',
    status: 'reviewed'
  },
  {
    id: 5,
    question: '如何实现一个深度克隆函数？',
    userAnswer: '使用 JSON.parse(JSON.stringify(obj))',
    correctAnswer: 'JSON 方法有局限性，对于函数、Symbol、循环引用等无法正确处理，需要使用递归实现',
    explanation: 'JSON 序列化方法无法处理函数、Symbol、undefined、循环引用等情况，需要使用递归并处理这些特殊情况',
    category: 'JavaScript',
    difficulty: 'medium',
    mistakeCount: 2,
    lastMistakeAt: '2026-03-12',
    status: 'unreviewed'
  }
]

// 收藏题库和错题本的状态管理
const activeTab = ref('saved') // 'saved' 或 'mistakes'
const expandedBankId = ref<number | null>(null)
const expandedMistakeId = ref<number | null>(null)

// 切换展开/收起状态
const toggleBankExpand = (id: number) => {
  expandedBankId.value = expandedBankId.value === id ? null : id
}

const toggleMistakeExpand = (id: number) => {
  expandedMistakeId.value = expandedMistakeId.value === id ? null : id
}

// 练习题库
const practiceBank = (bank: any) => {
  currentBank.value = bank
  isPracticeModalOpen.value = true
}

// 复习错题
const reviewMistake = (mistake: any) => {
  currentMistake.value = mistake
  isReviewModalOpen.value = true
}

// 关闭练习模态框
const closePracticeModal = () => {
  isPracticeModalOpen.value = false
  currentBank.value = null
}

// 关闭复习模态框
const closeReviewModal = () => {
  isReviewModalOpen.value = false
  currentMistake.value = null
}

// 开始练习
const startPractice = () => {
  if (!currentBank.value) return
  
  const bankId = currentBank.value.id
  isLoading.value = true
  // 模拟加载
  setTimeout(() => {
    isLoading.value = false
    closePracticeModal()
    // 跳转到练习页面
    router.push(`/practice/${bankId}`)
  }, 1000)
}

// 标记错题为已复习
const markAsReviewed = (id: number) => {
  const mistake = mistakeBook.find(m => m.id === id)
  if (mistake) {
    mistake.status = 'reviewed'
    // 显示成功提示
    alert('已标记为已复习')
  }
}

// 移除收藏
const removeSavedBank = (id: number) => {
  if (confirm('确定要移除这个收藏的题库吗？')) {
    const index = savedQuestionBanks.findIndex(bank => bank.id === id)
    if (index !== -1) {
      savedQuestionBanks.splice(index, 1)
      // 显示成功提示
      alert('已移除收藏的题库')
    }
  }
}

// 移除错题
const removeMistake = (id: number) => {
  if (confirm('确定要从错题本中移除这道题吗？')) {
    const index = mistakeBook.findIndex(mistake => mistake.id === id)
    if (index !== -1) {
      mistakeBook.splice(index, 1)
      // 显示成功提示
      alert('已从错题本中移除')
    }
  }
}

// 计算未复习的错题数量
const unreviewedMistakesCount = computed(() => {
  return mistakeBook.filter(mistake => mistake.status === 'unreviewed').length
})

// 获取难度对应的颜色
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-auxiliary-green/10 text-auxiliary-green'
    case 'medium':
      return 'bg-auxiliary-orange/10 text-auxiliary-orange'
    case 'hard':
      return 'bg-auxiliary-red/10 text-auxiliary-red'
    case 'expert':
      return 'bg-auxiliary-purple/10 text-auxiliary-purple'
    default:
      return 'bg-neutral-bg text-neutral-body'
  }
}

// 获取状态对应的颜色
const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-auxiliary-green/10 text-auxiliary-green'
    case 'in_progress':
      return 'bg-auxiliary-orange/10 text-auxiliary-orange'
    case 'unreviewed':
      return 'bg-auxiliary-red/10 text-auxiliary-red'
    case 'reviewed':
      return 'bg-primary/10 text-primary'
    default:
      return 'bg-neutral-bg text-neutral-body'
  }
}

// 游戏式面试数据
const gameInterviewData = {
  stats: [
    { label: '已完成关卡', value: '5', icon: Gamepad2, color: 'text-primary' },
    { label: '总答题数', value: '128', icon: Zap, color: 'text-auxiliary-orange' },
    { label: '正确率', value: '85%', icon: CheckCircle, color: 'text-auxiliary-green' },
    { label: '技能认证', value: '8', icon: Trophy, color: 'text-auxiliary-purple' },
    { label: '连续打卡', value: '12天', icon: Calendar, color: 'text-auxiliary-blue' },
    { label: '总得分', value: '2,850', icon: PieChart, color: 'text-auxiliary-red' }
  ],
  levels: [
    {
      id: 1,
      name: '基础入门',
      difficulty: 'easy',
      progress: 100,
      completed: true,
      questions: 20,
      correct: 18,
      timeSpent: '2h 30m',
      badge: 'bronze',
      skills: ['HTML/CSS', 'JavaScript基础', '网络基础']
    },
    {
      id: 2,
      name: '前端进阶',
      difficulty: 'medium',
      progress: 100,
      completed: true,
      questions: 30,
      correct: 25,
      timeSpent: '4h 15m',
      badge: 'silver',
      skills: ['Vue3', 'React', 'TypeScript']
    },
    {
      id: 3,
      name: '后端基础',
      difficulty: 'medium',
      progress: 100,
      completed: true,
      questions: 25,
      correct: 22,
      timeSpent: '3h 45m',
      badge: 'silver',
      skills: ['Java基础', 'Spring Boot', 'SQL']
    },
    {
      id: 4,
      name: '系统设计',
      difficulty: 'hard',
      progress: 100,
      completed: true,
      questions: 20,
      correct: 16,
      timeSpent: '5h 20m',
      badge: 'gold',
      skills: ['分布式系统', '微服务', '缓存设计']
    },
    {
      id: 5,
      name: '高级算法',
      difficulty: 'hard',
      progress: 60,
      completed: false,
      questions: 33,
      correct: 20,
      timeSpent: '3h 10m',
      badge: null,
      skills: ['动态规划', '图算法', '贪心算法']
    },
    {
      id: 6,
      name: '架构实战',
      difficulty: 'expert',
      progress: 0,
      completed: false,
      questions: 0,
      correct: 0,
      timeSpent: '0h 0m',
      badge: null,
      skills: ['高可用架构', '性能优化', 'DevOps']
    }
  ],
  achievements: [
    {
      id: 1,
      name: '初次尝试',
      description: '完成第一次游戏式面试',
      icon: Sparkles,
      unlocked: true,
      unlockedAt: '2026-03-01'
    },
    {
      id: 2,
      name: '连续打卡',
      description: '连续10天进行面试练习',
      icon: Calendar,
      unlocked: true,
      unlockedAt: '2026-03-12'
    },
    {
      id: 3,
      name: '正确率达人',
      description: '单次关卡正确率达到90%以上',
      icon: CheckCircle,
      unlocked: true,
      unlockedAt: '2026-03-18'
    },
    {
      id: 4,
      name: '挑战大师',
      description: '完成所有困难级别关卡',
      icon: Trophy,
      unlocked: false,
      progress: 75
    },
    {
      id: 5,
      name: '知识渊博',
      description: '完成所有技能类别的题目',
      icon: BookOpen,
      unlocked: false,
      progress: 60
    }
  ],
  leaderboard: [
    { rank: 1, name: '张三', score: 3250, avatar: '👨‍💻' },
    { rank: 2, name: '李四', score: 3120, avatar: '👩‍💻' },
    { rank: 3, name: '王五', score: 2980, avatar: '👨‍💻' },
    { rank: 4, name: '赵六', score: 2950, avatar: '👩‍💻' },
    { rank: 5, name: '王同学', score: 2850, avatar: '🧑‍💻', isCurrentUser: true }
  ]
}

// 游戏式面试模块状态
const activeGameTab = ref('overview') // 'overview', 'levels', 'achievements', 'leaderboard'
const expandedLevelId = ref<number | null>(null)

// AI简历诊断相关状态
const isResumeDiagnosisModalOpen = ref(false)
const isDiagnosing = ref(false)
const resumeDiagnosisResult = ref<any>(null)

// 个人档案相关状态
const isProfileUpdateModalOpen = ref(false)
const isSavingProfile = ref(false)
const profileForm = ref({
  name: '王同学',
  major: '计算机专业',
  grade: '大三',
  school: '北京大学',
  email: 'wang@example.com',
  phone: '13800138000',
  skills: 'Vue3, React, TypeScript, Java, Python',
  experience: '2年前端开发经验，参与过多个企业级项目',
  education: '北京大学计算机科学与技术专业，2022年入学',
  certifications: '英语四级，计算机二级，AI能力认证'
})

// 简历诊断数据
const resumeData = {
  basicInfo: {
    name: '王同学',
    major: '计算机专业',
    grade: '大三',
    school: '北京大学'
  },
  education: [
    {
      school: '北京大学',
      major: '计算机科学与技术',
      startDate: '2022-09',
      endDate: '2026-06',
      degree: '本科'
    }
  ],
  experience: [
    {
      company: '字节跳动',
      position: '前端开发实习生',
      startDate: '2025-07',
      endDate: '2025-09',
      description: '参与公司内部管理系统的前端开发，使用Vue3 + TypeScript技术栈，负责页面组件的开发和优化。'
    },
    {
      company: '阿里巴巴',
      position: '前端开发实习生',
      startDate: '2024-07',
      endDate: '2024-09',
      description: '参与电商平台的前端开发，使用React + TypeScript技术栈，负责商品详情页的开发和性能优化。'
    }
  ],
  skills: [
    { name: 'Vue3', level: 'expert' },
    { name: 'React', level: 'advanced' },
    { name: 'TypeScript', level: 'advanced' },
    { name: 'Java', level: 'intermediate' },
    { name: 'Python', level: 'intermediate' },
    { name: 'SQL', level: 'intermediate' }
  ],
  projects: [
    {
      name: 'AI面试模拟平台',
      role: '前端开发',
      description: '使用Vue3 + TypeScript + Tailwind CSS开发的AI面试模拟平台，包含面试练习、能力评估、简历诊断等功能。',
      technologies: 'Vue3, TypeScript, Tailwind CSS, ECharts'
    },
    {
      name: '在线学习平台',
      role: '全栈开发',
      description: '使用React + Node.js + MongoDB开发的在线学习平台，包含课程管理、用户管理、学习进度跟踪等功能。',
      technologies: 'React, Node.js, MongoDB, Express'
    }
  ]
}


// 切换游戏式面试标签页
const switchGameTab = (tab: string) => {
  activeGameTab.value = tab
}

// 切换关卡展开/收起状态
const toggleLevelExpand = (id: number) => {
  expandedLevelId.value = expandedLevelId.value === id ? null : id
}

// 显示关卡详情
const showLevelDetail = (id: number) => {
  const level = gameInterviewData.levels.find((level: any) => level.id === id)
  if (level) {
    currentLevel.value = level
    isLevelDetailModalOpen.value = true
  }
}

// 开始关卡
const startLevel = (id: number) => {
  isLoading.value = true
  // 模拟加载
  setTimeout(() => {
    isLoading.value = false
    // 跳转到关卡挑战页面
    router.push(`/game-interview/level/${id}`)
  }, 1000)
}

// 继续关卡
const continueLevel = (id: number) => {
  isLoading.value = true
  // 模拟加载
  setTimeout(() => {
    isLoading.value = false
    // 跳转到关卡挑战页面，带上continue参数
    router.push(`/game-interview/level/${id}?continue=true`)
  }, 1000)
}

// 关闭关卡详情模态框
const closeLevelDetailModal = () => {
  isLevelDetailModalOpen.value = false
  currentLevel.value = null
}

// AI简历诊断相关方法
const openResumeDiagnosisModal = () => {
  isResumeDiagnosisModalOpen.value = true
}

const closeResumeDiagnosisModal = () => {
  isResumeDiagnosisModalOpen.value = false
  resumeDiagnosisResult.value = null
}

const startResumeDiagnosis = () => {
  isDiagnosing.value = true
  // 模拟诊断过程
  setTimeout(() => {
    isDiagnosing.value = false
    resumeDiagnosisResult.value = {
      overallScore: 85,
      strengths: [
        { name: '技术栈全面', score: 90 },
        { name: '项目经验丰富', score: 85 },
        { name: '实习经历优质', score: 95 }
      ],
      weaknesses: [
        { name: '技能描述不够具体', score: 65 },
        { name: '项目成果量化不足', score: 70 },
        { name: '教育背景描述简单', score: 75 }
      ],
      suggestions: [
        '将技能水平具体化，例如：Vue3 (精通)、React (熟练)',
        '量化项目成果，例如：优化页面加载速度提升30%',
        '添加教育背景中的相关课程和成绩',
        '突出个人优势和独特性，避免模板化',
        '根据目标岗位调整简历内容，突出相关技能和经验'
      ],
      matchRate: {
        '前端开发工程师': 90,
        'Java开发工程师': 75,
        '全栈开发工程师': 85,
        '产品经理': 60
      }
    }
  }, 2000)
}

// 个人档案相关方法
const openProfileUpdateModal = () => {
  isProfileUpdateModalOpen.value = true
}

const closeProfileUpdateModal = () => {
  isProfileUpdateModalOpen.value = false
}

const saveProfile = () => {
  isSavingProfile.value = true
  // 模拟保存过程
  setTimeout(() => {
    isSavingProfile.value = false
    closeProfileUpdateModal()
    alert('个人档案更新成功！')
  }, 1500)
}

// 获取技能水平对应的文本
const getSkillLevelText = (level: string) => {
  switch (level) {
    case 'beginner':
      return '入门'
    case 'intermediate':
      return '中级'
    case 'advanced':
      return '高级'
    case 'expert':
      return '专家'
    default:
      return '未知'
  }
}

// 获取技能水平对应的颜色
const getSkillLevelColor = (level: string) => {
  switch (level) {
    case 'beginner':
      return 'bg-auxiliary-green/10 text-auxiliary-green'
    case 'intermediate':
      return 'bg-auxiliary-orange/10 text-auxiliary-orange'
    case 'advanced':
      return 'bg-primary/10 text-primary'
    case 'expert':
      return 'bg-auxiliary-purple/10 text-auxiliary-purple'
    default:
      return 'bg-neutral-bg text-neutral-body'
  }
}

// 获取徽章图标
const getBadgeIcon = (badge: string | null) => {
  switch (badge) {
    case 'bronze':
      return '🥉'
    case 'silver':
      return '🥈'
    case 'gold':
      return '🥇'
    default:
      return null
  }
}

// 获取难度文本
const getDifficultyText = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return '简单'
    case 'medium':
      return '中等'
    case 'hard':
      return '困难'
    case 'expert':
      return '专家'
    default:
      return '未知'
  }
}

const initChart = () => {
  if (chartRef.value) {
    isChartLoading.value = false
    myChart = echarts.init(chartRef.value)
    const data = currentAbilityData.value
    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        borderColor: '#18C5C7',
        borderWidth: 1,
        textStyle: { color: '#1E293B' },
        formatter: function(params: any) {
          let result = params[0].name + '<br/>'
          params.forEach((item: any) => {
            result += item.marker + item.seriesName + ': ' + item.value + '<br/>'
          })
          return result
        }
      },
      legend: {
        data: ['当前能力', '岗位要求'],
        bottom: 0,
        icon: 'circle',
        textStyle: {
          fontSize: 12,
          color: '#64748B'
        }
      },
      radar: {
        indicator: data.indicators,
        splitArea: { 
          show: true,
          areaStyle: {
            color: ['rgba(24, 197, 199, 0.05)', 'rgba(24, 197, 199, 0.1)']
          }
        },
        axisLine: { 
          lineStyle: { 
            color: '#F1F5F9'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#E2E8F0'
          }
        }
      },
      series: [
        {
          name: '能力对比',
          type: 'radar',
          data: [
            {
              value: data.current,
              name: '当前能力',
              itemStyle: { color: '#18C5C7' },
              areaStyle: { 
                color: 'rgba(24, 197, 199, 0.2)',
                opacity: 0.8
              },
              lineStyle: {
                width: 2
              },
              emphasis: {
                lineStyle: {
                  width: 4
                }
              }
            },
            {
              value: data.required,
              name: '岗位要求',
              itemStyle: { color: '#FFC585' },
              lineStyle: { 
                type: 'dashed',
                width: 2
              },
              areaStyle: { 
                color: 'rgba(255, 197, 133, 0.1)',
                opacity: 0.6
              },
              emphasis: {
                lineStyle: {
                  width: 3
                }
              }
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
  <div>
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
              <component :is="stat.icon" :size="20" :class="stat.color" class="opacity-80 group-hover:scale-110 transition-transform" />
              <div class="text-center">
                <p class="text-xl font-black text-neutral-title leading-tight">{{ stat.value }}</p>
                <p class="text-[10px] text-neutral-helper uppercase font-bold mt-1 tracking-tighter">{{ stat.label }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <button @click="openResumeDiagnosisModal" class="px-6 py-3 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2">
            <Sparkles :size="18" />
            AI 简历诊断
          </button>
          <button @click="openProfileUpdateModal" class="px-6 py-3 bg-neutral-bg text-neutral-title font-bold rounded-2xl hover:bg-neutral-border/50 transition-all flex items-center gap-2">
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
                <div class="flex items-center gap-4 mt-2">
                  <p class="text-xs text-neutral-helper">目标岗位：</p>
                  <div class="flex gap-2">
                    <button 
                      v-for="position in positions" 
                      :key="position"
                      :class="[
                        'px-3 py-1.5 text-xs font-bold rounded-xl transition-all',
                        targetPosition === position 
                          ? 'bg-primary text-white' 
                          : 'bg-neutral-bg text-neutral-body hover:bg-neutral-border/50'
                      ]"
                      @click="changePosition(position)"
                    >
                      {{ position }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <button 
              :class="[
                'px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2',
                isReanalyzing ? 'bg-neutral-bg text-neutral-helper cursor-not-allowed' : 'bg-neutral-bg text-neutral-body hover:bg-neutral-border/50'
              ]"
              @click="reanalyze"
              :disabled="isReanalyzing"
            >
              <span v-if="isReanalyzing" class="animate-spin">🔄</span>
              {{ isReanalyzing ? '分析中...' : '重新分析' }}
            </button>
          </div>
          
          <!-- Ability Match Rate -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-bold text-neutral-title">岗位匹配度</span>
              <span class="text-lg font-black text-primary">{{ matchRate }}%</span>
            </div>
            <div class="h-2 bg-neutral-bg rounded-full overflow-hidden">
              <div 
                class="h-full gradient-primary transition-all duration-1000 ease-out" 
                :style="{ width: matchRate + '%' }"
              ></div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
            <div class="relative h-80">
              <div v-if="isChartLoading" class="absolute inset-0 bg-neutral-bg animate-pulse rounded-2xl"></div>
              <div ref="chartRef" class="w-full h-full"></div>
            </div>
            <div class="space-y-6">
              <!-- Gap Skills -->
              <div>
                <p class="text-sm font-bold text-neutral-title mb-3 flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-auxiliary-red"></span>
                  待提升技能项
                </p>
                <div class="space-y-3">
                  <div 
                    v-for="skill in currentAbilityData.gapSkills" 
                    :key="skill.name" 
                    :class="[
                      'p-3 rounded-2xl border flex items-center justify-between transition-all hover:shadow-sm',
                      getSkillColor(skill.level)
                    ]"
                  >
                    <span class="text-xs font-medium">{{ skill.name }}</span>
                    <span class="text-xs font-bold">{{ skill.level === 'high' ? '⚠️' : skill.level === 'medium' ? '⚡' : '✅' }} 差距 -{{ skill.gap }}%</span>
                  </div>
                </div>
              </div>
              
              <!-- Strengths -->
              <div>
                <p class="text-sm font-bold text-neutral-title mb-3 flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-primary"></span>
                  优势技能项
                </p>
                <div class="space-y-3">
                  <div 
                    v-for="skill in currentAbilityData.strengths" 
                    :key="skill.name" 
                    class="p-3 bg-primary/10 rounded-2xl border border-primary/30 flex items-center justify-between transition-all hover:shadow-sm"
                  >
                    <span class="text-xs font-medium text-neutral-body">{{ skill.name }}</span>
                    <span class="text-xs font-bold text-primary">{{ skill.score }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Improvement Suggestions -->
          <div class="p-6 bg-neutral-bg rounded-2xl">
            <h3 class="text-sm font-bold text-neutral-title mb-4 flex items-center gap-2">
              <Sparkles :size="16" class="text-primary" />
              提升建议
            </h3>
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                  1
                </div>
                <p class="text-xs text-neutral-body leading-relaxed">
                  针对<span class="font-bold text-neutral-title">{{ currentAbilityData.gapSkills[0]?.name }}</span>，建议通过实际项目实践和源码学习来提升，可参考官方文档和优质教程。
                </p>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                  2
                </div>
                <p class="text-xs text-neutral-body leading-relaxed">
                  增强<span class="font-bold text-neutral-title">{{ currentAbilityData.gapSkills[1]?.name }}</span>，可参与开源项目或搭建完整的工程化架构，积累实战经验。
                </p>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                  3
                </div>
                <p class="text-xs text-neutral-body leading-relaxed">
                  利用平台提供的模拟面试功能，针对薄弱环节进行专项练习，提升整体表现。
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Interview Records (Last 2 Years) -->
        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border flex-1 flex flex-col">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl gradient-cyan-yellow flex items-center justify-center text-primary shadow-md">
                <History :size="20" />
              </div>
              <h2 class="text-lg font-bold text-neutral-title tracking-tight">面试实战记录 (近2年)</h2>
            </div>
            
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <div class="flex items-center gap-2 px-3 py-1.5 bg-neutral-bg rounded-xl border border-neutral-border flex-1 sm:flex-none">
                <Search :size="14" class="text-neutral-helper" />
                <input type="text" placeholder="搜索历史..." class="bg-transparent border-none text-xs focus:ring-0 w-full sm:w-24" />
              </div>
              
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-1 bg-neutral-bg rounded-xl border border-neutral-border p-1">
                  <button 
                    :class="['px-3 py-1 text-xs font-bold transition-all', filterStatus === 'all' ? 'bg-primary text-white rounded-lg' : 'text-neutral-body hover:bg-neutral-border/50 rounded-lg']"
                    @click="filterStatus = 'all'"
                  >
                    全部
                  </button>
                  <button 
                    :class="['px-3 py-1 text-xs font-bold transition-all', filterStatus === '已通过' ? 'bg-auxiliary-green text-white rounded-lg' : 'text-neutral-body hover:bg-neutral-border/50 rounded-lg']"
                    @click="filterStatus = '已通过'"
                  >
                    已通过
                  </button>
                  <button 
                    :class="['px-3 py-1 text-xs font-bold transition-all', filterStatus === '未通过' ? 'bg-auxiliary-red text-white rounded-lg' : 'text-neutral-body hover:bg-neutral-border/50 rounded-lg']"
                    @click="filterStatus = '未通过'"
                  >
                    未通过
                  </button>
                </div>
                
                <div class="flex items-center gap-1 bg-neutral-bg rounded-xl border border-neutral-border p-1">
                  <button 
                    :class="['px-3 py-1 text-xs font-bold transition-all', sortBy === 'date' ? 'bg-primary text-white rounded-lg' : 'text-neutral-body hover:bg-neutral-border/50 rounded-lg']"
                    @click="sortBy = 'date'"
                  >
                    时间
                  </button>
                  <button 
                    :class="['px-3 py-1 text-xs font-bold transition-all', sortBy === 'score' ? 'bg-primary text-white rounded-lg' : 'text-neutral-body hover:bg-neutral-border/50 rounded-lg']"
                    @click="sortBy = 'score'"
                  >
                    分数
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-4 flex-1">
            <div v-for="item in filteredInterviews.slice(0, 5)" :key="item.id" class="group">
              <!-- 面试记录卡片 -->
              <div 
                class="flex items-center justify-between p-4 bg-neutral-bg rounded-[20px] hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border cursor-pointer"
                @click="toggleExpand(item.id)"
              >
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:gradient-primary group-hover:text-white transition-all">
                    <Activity :size="20" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <h4 class="text-sm font-bold text-neutral-title group-hover:text-primary transition-colors truncate">{{ item.position }}</h4>
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded-full" :class="item.status === '已通过' ? 'bg-auxiliary-green/10 text-auxiliary-green' : 'bg-auxiliary-red/10 text-auxiliary-red'">{{ item.status }}</span>
                    </div>
                    <div class="flex flex-wrap items-center gap-2 text-[11px] text-neutral-helper">
                      <span>{{ item.company }}</span>
                      <span>·</span>
                      <span>{{ item.date }}</span>
                      <span>·</span>
                      <span>{{ item.round }}</span>
                      <span>·</span>
                      <span>{{ item.type }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="text-right">
                    <p class="text-lg font-black text-neutral-title">{{ item.score }}<span class="text-[10px] font-normal opacity-40 ml-0.5">分</span></p>
                    <div class="flex items-center justify-end gap-1">
                      <span 
                        v-for="tag in item.tags.slice(0, 2)" 
                        :key="tag"
                        class="text-[9px] px-2 py-0.5 bg-primary/10 text-primary rounded-full"
                      >
                        {{ tag }}
                      </span>
                      <span v-if="item.tags.length > 2" class="text-[9px] text-neutral-helper">+{{ item.tags.length - 2 }}</span>
                    </div>
                  </div>
                  <ChevronRight 
                    :size="16" 
                    class="text-neutral-helper group-hover:text-primary transition-colors transform transition-transform"
                    :class="isExpanded === item.id ? 'rotate-90' : ''"
                  />
                </div>
              </div>
              
              <!-- 展开的详细信息 -->
              <div 
                v-if="isExpanded === item.id"
                class="mt-2 p-4 bg-neutral-bg rounded-[20px] border border-neutral-border animate-fadeIn"
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <!-- 能力评分 -->
                  <div>
                    <h5 class="text-xs font-bold text-neutral-title mb-3">能力评分</h5>
                    <div class="space-y-2">
                      <div class="space-y-1">
                        <div class="flex justify-between text-[10px] font-medium">
                          <span>技术能力</span>
                          <span>{{ item.details.technical }}%</span>
                        </div>
                        <div class="h-1.5 bg-white rounded-full overflow-hidden">
                          <div class="h-full bg-primary" :style="{ width: item.details.technical + '%' }"></div>
                        </div>
                      </div>
                      <div class="space-y-1">
                        <div class="flex justify-between text-[10px] font-medium">
                          <span>沟通表达</span>
                          <span>{{ item.details.communication }}%</span>
                        </div>
                        <div class="h-1.5 bg-white rounded-full overflow-hidden">
                          <div class="h-full bg-primary" :style="{ width: item.details.communication + '%' }"></div>
                        </div>
                      </div>
                      <div class="space-y-1">
                        <div class="flex justify-between text-[10px] font-medium">
                          <span>逻辑思维</span>
                          <span>{{ item.details.logic }}%</span>
                        </div>
                        <div class="h-1.5 bg-white rounded-full overflow-hidden">
                          <div class="h-full bg-primary" :style="{ width: item.details.logic + '%' }"></div>
                        </div>
                      </div>
                      <div class="space-y-1">
                        <div class="flex justify-between text-[10px] font-medium">
                          <span>问题解决</span>
                          <span>{{ item.details.problemSolving }}%</span>
                        </div>
                        <div class="h-1.5 bg-white rounded-full overflow-hidden">
                          <div class="h-full bg-primary" :style="{ width: item.details.problemSolving + '%' }"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 面试反馈 -->
                  <div>
                    <h5 class="text-xs font-bold text-neutral-title mb-3">面试反馈</h5>
                    <div class="p-3 bg-white rounded-xl border border-neutral-border">
                      <p class="text-xs text-neutral-body leading-relaxed">{{ item.feedback }}</p>
                    </div>
                    
                    <!-- 标签 -->
                    <div class="mt-4">
                      <h5 class="text-xs font-bold text-neutral-title mb-2">相关技能标签</h5>
                      <div class="flex flex-wrap gap-2">
                        <span 
                          v-for="tag in item.tags" 
                          :key="tag"
                          class="text-[9px] px-2 py-0.5 bg-primary/10 text-primary rounded-full"
                        >
                          {{ tag }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 操作按钮 -->
                <div class="flex flex-wrap gap-3 pt-4 border-t border-neutral-border">
                  <button 
                    class="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-all flex items-center gap-2"
                    @click.stop="practiceAgain(item)"
                  >
                    <Zap :size="14" />
                    重新练习
                  </button>
                  <button 
                    class="px-4 py-2 bg-neutral-bg text-neutral-title text-xs font-bold rounded-xl hover:bg-neutral-border/50 transition-all flex items-center gap-2"
                    @click.stop="exportRecord(item.id)"
                  >
                    <FileText :size="14" />
                    导出记录
                  </button>
                  <button 
                    class="px-4 py-2 bg-neutral-bg text-neutral-title text-xs font-bold rounded-xl hover:bg-neutral-border/50 transition-all flex items-center gap-2"
                    @click.stop="shareExperience(item.id)"
                  >
                    <TrendingUp :size="14" />
                    分享经验
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 查看更多按钮 -->
            <div v-if="filteredInterviews.length > 5" class="mt-6 text-center">
              <button 
                @click="openAllInterviewsPage"
                class="px-8 py-3 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 mx-auto"
              >
                查看更多 <ChevronRight :size="16" />
              </button>
            </div>
          </div>
          
          <!-- 空状态 -->
          <div v-if="filteredInterviews.length === 0" class="flex-1 flex flex-col items-center justify-center py-12 text-center">
            <div class="w-20 h-20 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper mb-4">
              <History :size="40" />
            </div>
            <h3 class="text-sm font-bold text-neutral-title mb-2">暂无面试记录</h3>
            <p class="text-xs text-neutral-helper mb-6">开始你的第一次模拟面试吧</p>
            <button class="px-6 py-3 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2">
              <Sparkles :size="16" />
              开始模拟面试
            </button>
          </div>
          
          <!-- 加载状态 -->
          <div v-if="isLoading" class="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="lg:col-span-4 flex flex-col gap-8">


        <!-- Saved Questions / Mistake Book -->
        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border">
          <h3 class="font-bold text-neutral-title mb-6 flex items-center gap-2">
            <div class="w-2 h-6 gradient-primary rounded-full"></div>
            收藏题库与错题本
          </h3>
          
          <!-- 标签页切换 -->
          <div class="flex items-center gap-2 mb-6">
            <button 
              :class="[
                'flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all',
                activeTab === 'saved' 
                  ? 'bg-primary text-white' 
                  : 'bg-neutral-bg text-neutral-body hover:bg-neutral-border/50'
              ]"
              @click="activeTab = 'saved'"
            >
              收藏题库
            </button>
            <button 
              :class="[
                'flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all',
                activeTab === 'mistakes' 
                  ? 'bg-primary text-white' 
                  : 'bg-neutral-bg text-neutral-body hover:bg-neutral-border/50'
              ]"
              @click="activeTab = 'mistakes'"
            >
              错题本
              <span v-if="unreviewedMistakesCount > 0" class="ml-2 px-2 py-0.5 bg-auxiliary-red text-white text-[10px] rounded-full">
                {{ unreviewedMistakesCount }}
              </span>
            </button>
          </div>
          
          <!-- 收藏题库内容 -->
          <div v-if="activeTab === 'saved'" class="space-y-4">
            <div v-for="bank in savedQuestionBanks" :key="bank.id" class="group">
              <!-- 题库卡片 -->
              <div 
                class="p-4 bg-neutral-bg rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border"
                @click="toggleBankExpand(bank.id)"
              >
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-white rounded-xl text-primary shadow-sm"><Code2 :size="16" /></div>
                  <div>
                    <span class="text-sm font-bold text-neutral-title">{{ bank.title }}</span>
                    <p class="text-[10px] text-neutral-helper mt-1">{{ bank.description }}</p>
                    <div class="flex items-center gap-2 mt-2">
                      <span class="text-[9px] px-2 py-0.5" :class="getDifficultyColor(bank.difficulty)">{{ bank.difficulty === 'easy' ? '简单' : bank.difficulty === 'medium' ? '中等' : '困难' }}</span>
                      <span class="text-[9px] px-2 py-0.5 bg-primary/10 text-primary">{{ bank.category }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="text-right">
                    <p class="text-lg font-black text-neutral-title">{{ bank.questionCount }}<span class="text-[10px] font-normal opacity-40 ml-0.5">题</span></p>
                    <p class="text-[10px] text-neutral-helper">{{ bank.lastPracticed }}</p>
                  </div>
                  <ChevronRight 
                    :size="16" 
                    class="text-neutral-helper group-hover:text-primary transition-colors transform transition-transform"
                    :class="expandedBankId === bank.id ? 'rotate-90' : ''"
                  />
                </div>
              </div>
              
              <!-- 展开的详细信息 -->
              <div 
                v-if="expandedBankId === bank.id"
                class="mt-2 p-4 bg-neutral-bg rounded-[20px] border border-neutral-border animate-fadeIn"
              >
                <div class="space-y-4">
                  <div>
                    <h5 class="text-xs font-bold text-neutral-title mb-3">题目列表</h5>
                    <div class="space-y-2">
                      <div 
                        v-for="question in bank.questions" 
                        :key="question.id"
                        class="flex items-center justify-between p-3 bg-white rounded-xl border border-neutral-border"
                      >
                        <div class="flex items-center gap-2">
                          <span class="text-xs font-medium text-neutral-title">{{ question.title }}</span>
                          <span class="text-[9px] px-2 py-0.5" :class="getDifficultyColor(question.difficulty)">{{ question.difficulty === 'easy' ? '简单' : question.difficulty === 'medium' ? '中等' : '困难' }}</span>
                        </div>
                        <span class="text-[9px] px-2 py-0.5" :class="getStatusColor(question.status)">{{ question.status === 'completed' ? '已完成' : '进行中' }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex gap-3">
                    <button 
                      class="flex-1 py-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                      @click.stop="practiceBank(bank)"
                    >
                      <Zap :size="14" class="group-hover:scale-110 transition-transform" />
                      开始练习
                    </button>
                    <button 
                      class="px-4 py-3 bg-neutral-bg text-neutral-title text-xs font-bold rounded-xl hover:bg-neutral-border/50 hover:shadow-sm transition-all flex items-center justify-center gap-2 group"
                      @click.stop="removeSavedBank(bank.id)"
                    >
                      <FileWarning :size="14" class="group-hover:scale-110 transition-transform" />
                      移除
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 空状态 -->
            <div v-if="savedQuestionBanks.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
              <div class="w-20 h-20 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper mb-4">
                <BookOpen :size="40" />
              </div>
              <h3 class="text-sm font-bold text-neutral-title mb-2">暂无收藏题库</h3>
              <p class="text-xs text-neutral-helper mb-6">浏览题库并收藏你感兴趣的内容</p>
              <button class="px-6 py-3 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2">
                <Search :size="16" />
                浏览题库
              </button>
            </div>
          </div>
          
          <!-- 错题本内容 -->
          <div v-if="activeTab === 'mistakes'" class="space-y-4">
            <div v-for="mistake in mistakeBook" :key="mistake.id" class="group">
              <!-- 错题卡片 -->
              <div 
                class="p-4 bg-neutral-bg rounded-2xl flex items-start justify-between group cursor-pointer hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border"
                @click="toggleMistakeExpand(mistake.id)"
              >
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-2">
                    <h4 class="text-sm font-bold text-neutral-title group-hover:text-primary transition-colors truncate">{{ mistake.question }}</h4>
                    <span class="text-[10px] font-bold px-2 py-0.5" :class="getStatusColor(mistake.status)">{{ mistake.status === 'reviewed' ? '已复习' : '未复习' }}</span>
                  </div>
                  <div class="flex flex-wrap items-center gap-2 text-[11px] text-neutral-helper mb-2">
                    <span>{{ mistake.category }}</span>
                    <span>·</span>
                    <span>{{ mistake.difficulty === 'easy' ? '简单' : mistake.difficulty === 'medium' ? '中等' : '困难' }}</span>
                    <span>·</span>
                    <span>错误 {{ mistake.mistakeCount }} 次</span>
                    <span>·</span>
                    <span>{{ mistake.lastMistakeAt }}</span>
                  </div>
                  <p class="text-xs text-neutral-body line-clamp-2">{{ mistake.explanation }}</p>
                </div>
                <ChevronRight 
                  :size="16" 
                  class="text-neutral-helper group-hover:text-primary transition-colors transform transition-transform mt-1"
                  :class="expandedMistakeId === mistake.id ? 'rotate-90' : ''"
                />
              </div>
              
              <!-- 展开的详细信息 -->
              <div 
                v-if="expandedMistakeId === mistake.id"
                class="mt-2 p-4 bg-neutral-bg rounded-[20px] border border-neutral-border animate-fadeIn"
              >
                <div class="space-y-4">
                  <div class="space-y-3">
                    <div>
                      <h5 class="text-xs font-bold text-neutral-title mb-2">你的答案</h5>
                      <div class="p-3 bg-auxiliary-red/10 rounded-xl border border-auxiliary-red/30">
                        <p class="text-xs text-auxiliary-red">{{ mistake.userAnswer }}</p>
                      </div>
                    </div>
                    <div>
                      <h5 class="text-xs font-bold text-neutral-title mb-2">正确答案</h5>
                      <div class="p-3 bg-auxiliary-green/10 rounded-xl border border-auxiliary-green/30">
                        <p class="text-xs text-auxiliary-green">{{ mistake.correctAnswer }}</p>
                      </div>
                    </div>
                    <div>
                      <h5 class="text-xs font-bold text-neutral-title mb-2">解析</h5>
                      <div class="p-3 bg-primary/10 rounded-xl border border-primary/30">
                        <p class="text-xs text-primary">{{ mistake.explanation }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex gap-3">
                    <button 
                      class="flex-1 py-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                      @click.stop="reviewMistake(mistake)"
                    >
                      <Zap :size="14" class="group-hover:scale-110 transition-transform" />
                      复习此题
                    </button>
                    <button 
                      v-if="mistake.status === 'unreviewed'"
                      class="px-4 py-3 bg-auxiliary-green text-white text-xs font-bold rounded-xl hover:bg-auxiliary-green/80 hover:shadow-sm transition-all flex items-center justify-center gap-2 group"
                      @click.stop="markAsReviewed(mistake.id)"
                    >
                      <CheckCircle :size="14" class="group-hover:scale-110 transition-transform" />
                      标记已复习
                    </button>
                    <button 
                      class="px-4 py-3 bg-neutral-bg text-neutral-title text-xs font-bold rounded-xl hover:bg-neutral-border/50 hover:shadow-sm transition-all flex items-center justify-center gap-2 group"
                      @click.stop="removeMistake(mistake.id)"
                    >
                      <FileWarning :size="14" class="group-hover:scale-110 transition-transform" />
                      移除
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 空状态 -->
            <div v-if="mistakeBook.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
              <div class="w-20 h-20 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper mb-4">
                <FileWarning :size="40" />
              </div>
              <h3 class="text-sm font-bold text-neutral-title mb-2">暂无错题记录</h3>
              <p class="text-xs text-neutral-helper mb-6">开始练习，系统会自动记录你的错题</p>
              <button class="px-6 py-3 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2">
                <Zap :size="16" />
                开始练习
              </button>
            </div>
          </div>
        </div>

        <!-- Game-based Interview Data -->
        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border">
          <h3 class="font-bold text-neutral-title mb-6 flex items-center gap-2">
            <div class="w-2 h-6 gradient-primary rounded-full"></div>
            游戏式面试数据
          </h3>
          
          <!-- 标签页切换 -->
          <div class="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            <button 
              :class="[
                'flex-shrink-0 px-4 py-2 rounded-xl font-bold text-sm transition-all',
                activeGameTab === 'overview' 
                  ? 'bg-primary text-white' 
                  : 'bg-neutral-bg text-neutral-body hover:bg-neutral-border/50'
              ]"
              @click="switchGameTab('overview')"
            >
              概览
            </button>
            <button 
              :class="[
                'flex-shrink-0 px-4 py-2 rounded-xl font-bold text-sm transition-all',
                activeGameTab === 'levels' 
                  ? 'bg-primary text-white' 
                  : 'bg-neutral-bg text-neutral-body hover:bg-neutral-border/50'
              ]"
              @click="switchGameTab('levels')"
            >
              关卡
            </button>
            <button 
              :class="[
                'flex-shrink-0 px-4 py-2 rounded-xl font-bold text-sm transition-all',
                activeGameTab === 'achievements' 
                  ? 'bg-primary text-white' 
                  : 'bg-neutral-bg text-neutral-body hover:bg-neutral-border/50'
              ]"
              @click="switchGameTab('achievements')"
            >
              成就
            </button>
            <button 
              :class="[
                'flex-shrink-0 px-4 py-2 rounded-xl font-bold text-sm transition-all',
                activeGameTab === 'leaderboard' 
                  ? 'bg-primary text-white' 
                  : 'bg-neutral-bg text-neutral-body hover:bg-neutral-border/50'
              ]"
              @click="switchGameTab('leaderboard')"
            >
              排行榜
            </button>
          </div>
          
          <!-- 概览标签页 -->
          <div v-if="activeGameTab === 'overview'">
            <div class="grid grid-cols-2 gap-4">
              <div v-for="stat in gameInterviewData.stats" :key="stat.label" class="p-4 bg-neutral-bg rounded-2xl flex flex-col items-center justify-center gap-2 group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border">
                <div class="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:gradient-primary group-hover:text-white transition-all">
                  <component :is="stat.icon" :size="20" :class="stat.color" />
                </div>
                <p class="text-lg font-black text-neutral-title">{{ stat.value }}</p>
                <p class="text-xs text-neutral-helper">{{ stat.label }}</p>
              </div>
            </div>
            <div class="mt-6 p-6 bg-primary/5 rounded-2xl border border-primary/20">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center text-white shadow-md">
                  <Gamepad2 :size="20" />
                </div>
                <h4 class="text-sm font-bold text-neutral-title">游戏式面试进度</h4>
              </div>
              <div class="space-y-4">
                <div class="space-y-2">
                  <div class="flex justify-between text-xs font-bold">
                    <span>总体进度</span>
                    <span>83%</span>
                  </div>
                  <div class="h-2 bg-white rounded-full overflow-hidden">
                    <div class="h-full gradient-primary transition-all duration-1000 ease-out" style="width: 83%;"></div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between text-xs font-bold">
                    <span>技能覆盖度</span>
                    <span>75%</span>
                  </div>
                  <div class="h-2 bg-white rounded-full overflow-hidden">
                    <div class="h-full gradient-cyan-yellow transition-all duration-1000 ease-out" style="width: 75%;"></div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between text-xs font-bold">
                    <span>连续打卡</span>
                    <span>12/30天</span>
                  </div>
                  <div class="h-2 bg-white rounded-full overflow-hidden">
                    <div class="h-full gradient-yellow-orange transition-all duration-1000 ease-out" style="width: 40%;"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 关卡标签页 -->
          <div v-if="activeGameTab === 'levels'" class="space-y-4">
            <div v-for="level in gameInterviewData.levels" :key="level.id" class="group">
              <!-- 关卡卡片 -->
              <div 
                class="p-4 bg-neutral-bg rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border"
                @click="toggleLevelExpand(level.id)"
              >
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md" :class="level.completed ? 'gradient-primary' : 'bg-neutral-border'">
                    <span class="font-black text-lg">{{ level.id }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-3 mb-1">
                      <h4 class="text-sm font-bold text-neutral-title group-hover:text-primary transition-colors truncate">{{ level.name }}</h4>
                      <span class="text-[10px] font-bold px-2 py-0.5" :class="getDifficultyColor(level.difficulty)">{{ getDifficultyText(level.difficulty) }}</span>
                      <span v-if="level.completed" class="text-[10px] font-bold px-2 py-0.5 bg-auxiliary-green/10 text-auxiliary-green">已完成</span>
                      <span v-else-if="level.progress > 0" class="text-[10px] font-bold px-2 py-0.5 bg-auxiliary-orange/10 text-auxiliary-orange">进行中</span>
                      <span v-else class="text-[10px] font-bold px-2 py-0.5 bg-neutral-border/30 text-neutral-helper">未开始</span>
                    </div>
                    <div class="space-y-1 mb-2">
                      <div class="flex justify-between text-[10px] font-medium">
                        <span>进度</span>
                        <span>{{ level.progress }}%</span>
                      </div>
                      <div class="h-1.5 bg-white rounded-full overflow-hidden">
                        <div class="h-full gradient-primary transition-all duration-1000 ease-out" :style="{ width: level.progress + '%' }"></div>
                      </div>
                    </div>
                    <div class="flex flex-wrap items-center gap-2 text-[11px] text-neutral-helper">
                      <span>{{ level.questions }} 题</span>
                      <span>·</span>
                      <span>{{ Math.round((level.correct / level.questions) * 100) }}% 正确率</span>
                      <span>·</span>
                      <span>{{ level.timeSpent }}</span>
                      <span v-if="level.badge" class="text-[12px]">{{ getBadgeIcon(level.badge) }}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight 
                  :size="16" 
                  class="text-neutral-helper group-hover:text-primary transition-colors transform transition-transform"
                  :class="expandedLevelId === level.id ? 'rotate-90' : ''"
                />
              </div>
              
              <!-- 展开的关卡详情 -->
              <div 
                v-if="expandedLevelId === level.id"
                class="mt-2 p-4 bg-neutral-bg rounded-[20px] border border-neutral-border animate-fadeIn"
              >
                <div class="space-y-4">
                  <div>
                    <h5 class="text-xs font-bold text-neutral-title mb-3">相关技能</h5>
                    <div class="flex flex-wrap gap-2">
                      <span 
                        v-for="skill in level.skills" 
                        :key="skill"
                        class="text-[9px] px-2 py-1 bg-primary/10 text-primary rounded-full"
                      >
                        {{ skill }}
                      </span>
                    </div>
                  </div>
                  <div class="flex gap-3">
                    <button 
                      v-if="level.completed"
                      class="flex-1 py-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
                      @click.stop="startLevel(level.id)"
                    >
                      <Zap :size="14" />
                      重新练习
                    </button>
                    <button 
                      v-else-if="level.progress > 0"
                      class="flex-1 py-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
                      @click.stop="continueLevel(level.id)"
                    >
                      <Zap :size="14" />
                      继续练习
                    </button>
                    <button 
                      v-else
                      class="flex-1 py-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
                      @click.stop="startLevel(level.id)"
                    >
                      <Zap :size="14" />
                      开始练习
                    </button>
                    <button 
                      class="px-4 py-3 bg-neutral-bg text-neutral-title text-xs font-bold rounded-xl hover:bg-neutral-border/50 transition-all flex items-center justify-center gap-2"
                      @click.stop="showLevelDetail(level.id)"
                    >
                      <FileText :size="14" />
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 成就标签页 -->
          <div v-if="activeGameTab === 'achievements'" class="space-y-4">
            <div v-for="achievement in gameInterviewData.achievements" :key="achievement.id" class="p-4 bg-neutral-bg rounded-2xl flex items-center gap-4 group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md" :class="achievement.unlocked ? 'gradient-primary text-white' : 'bg-neutral-border text-neutral-helper'">
                <component :is="achievement.icon" :size="24" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="text-sm font-bold text-neutral-title group-hover:text-primary transition-colors truncate">{{ achievement.name }}</h4>
                  <span v-if="achievement.unlocked" class="text-[10px] font-bold px-2 py-0.5 bg-auxiliary-green/10 text-auxiliary-green">已解锁</span>
                  <span v-else class="text-[10px] font-bold px-2 py-0.5 bg-auxiliary-orange/10 text-auxiliary-orange">进行中</span>
                </div>
                <p class="text-xs text-neutral-body mb-2">{{ achievement.description }}</p>
                <div v-if="achievement.unlocked" class="text-[10px] text-neutral-helper">
                  解锁于：{{ achievement.unlockedAt }}
                </div>
                <div v-else class="space-y-1">
                  <div class="flex justify-between text-[10px] font-medium">
                    <span>进度</span>
                    <span>{{ achievement.progress }}%</span>
                  </div>
                  <div class="h-1.5 bg-white rounded-full overflow-hidden">
                    <div class="h-full gradient-primary transition-all duration-1000 ease-out" :style="{ width: achievement.progress + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 排行榜标签页 -->
          <div v-if="activeGameTab === 'leaderboard'" class="space-y-4">
            <div class="p-4 bg-primary/5 rounded-2xl border border-primary/20 mb-4">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                  <Trophy :size="16" />
                </div>
                <h4 class="text-sm font-bold text-neutral-title">当前排名：第 5 名</h4>
              </div>
              <p class="text-xs text-neutral-helper mt-2">继续努力，提升排名！</p>
            </div>
            <div class="space-y-3">
              <div 
                v-for="item in gameInterviewData.leaderboard" 
                :key="item.rank"
                class="p-4 rounded-2xl flex items-center gap-4 transition-all" 
                :class="item.isCurrentUser ? 'bg-primary/10 border border-primary/30' : 'bg-neutral-bg border border-transparent hover:border-neutral-border hover:bg-white hover:shadow-sm'"
              >
                <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" :class="{
                  'bg-auxiliary-yellow text-white': item.rank === 1,
                  'bg-gray-300 text-white': item.rank === 2,
                  'bg-auxiliary-orange/30 text-auxiliary-orange': item.rank === 3,
                  'bg-neutral-border text-neutral-title': item.rank > 3
                }">
                  {{ item.rank }}
                </div>
                <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <span class="text-xl">{{ item.avatar }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-bold text-neutral-title truncate">{{ item.name }}</h4>
                  <p class="text-xs text-neutral-helper">{{ item.score }} 分</p>
                </div>
                <div v-if="item.isCurrentUser" class="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full">
                  你
                </div>
              </div>
            </div>
          </div>
          
          <!-- 全局操作按钮 -->
          <div v-if="activeGameTab === 'overview'" class="mt-6">
          </div>
        </div>


      </div>
    </div>
  </div>
  
  <!-- 全部面试记录页面 -->
  <div v-if="isAllInterviewsPageOpen" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <div class="p-8 border-b border-neutral-border flex justify-between items-center sticky top-0 bg-white">
        <h3 class="text-xl font-bold text-neutral-title flex items-center gap-2">
          <History :size="24" class="text-primary" />
          全部面试实战记录
        </h3>
        <button @click="closeAllInterviewsPage" class="p-2 text-neutral-helper hover:text-neutral-title">
          <X :size="24" />
        </button>
      </div>
      <div class="p-8">
        <div class="space-y-4">
          <div v-for="item in filteredInterviews" :key="item.id" class="group">
            <!-- 面试记录卡片 -->
            <div 
              class="flex items-center justify-between p-4 bg-neutral-bg rounded-[20px] hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border cursor-pointer"
              @click="toggleExpand(item.id)"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:gradient-primary group-hover:text-white transition-all">
                  <Activity :size="20" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <h4 class="text-sm font-bold text-neutral-title group-hover:text-primary transition-colors truncate">{{ item.position }}</h4>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full" :class="item.status === '已通过' ? 'bg-auxiliary-green/10 text-auxiliary-green' : 'bg-auxiliary-red/10 text-auxiliary-red'">{{ item.status }}</span>
                  </div>
                  <div class="flex flex-wrap items-center gap-2 text-[11px] text-neutral-helper">
                    <span>{{ item.company }}</span>
                    <span>·</span>
                    <span>{{ item.date }}</span>
                    <span>·</span>
                    <span>{{ item.round }}</span>
                    <span>·</span>
                    <span>{{ item.type }}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="text-right">
                  <p class="text-lg font-black text-neutral-title">{{ item.score }}<span class="text-[10px] font-normal opacity-40 ml-0.5">分</span></p>
                  <div class="flex items-center justify-end gap-1">
                    <span 
                      v-for="tag in item.tags.slice(0, 2)" 
                      :key="tag"
                      class="text-[9px] px-2 py-0.5 bg-primary/10 text-primary rounded-full"
                    >
                      {{ tag }}
                    </span>
                    <span v-if="item.tags.length > 2" class="text-[9px] text-neutral-helper">+{{ item.tags.length - 2 }}</span>
                  </div>
                </div>
                <ChevronRight 
                  :size="16" 
                  class="text-neutral-helper group-hover:text-primary transition-colors transform transition-transform"
                  :class="isExpanded === item.id ? 'rotate-90' : ''"
                />
              </div>
            </div>
            
            <!-- 展开的详细信息 -->
            <div 
              v-if="isExpanded === item.id"
              class="mt-2 p-4 bg-neutral-bg rounded-[20px] border border-neutral-border animate-fadeIn"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <!-- 能力评分 -->
                <div>
                  <h5 class="text-xs font-bold text-neutral-title mb-3">能力评分</h5>
                  <div class="space-y-2">
                    <div class="space-y-1">
                      <div class="flex justify-between text-[10px] font-medium">
                        <span>技术能力</span>
                        <span>{{ item.details.technical }}%</span>
                      </div>
                      <div class="h-1.5 bg-white rounded-full overflow-hidden">
                        <div class="h-full bg-primary" :style="{ width: item.details.technical + '%' }"></div>
                      </div>
                    </div>
                    <div class="space-y-1">
                      <div class="flex justify-between text-[10px] font-medium">
                        <span>沟通表达</span>
                        <span>{{ item.details.communication }}%</span>
                      </div>
                      <div class="h-1.5 bg-white rounded-full overflow-hidden">
                        <div class="h-full bg-primary" :style="{ width: item.details.communication + '%' }"></div>
                      </div>
                    </div>
                    <div class="space-y-1">
                      <div class="flex justify-between text-[10px] font-medium">
                        <span>逻辑思维</span>
                        <span>{{ item.details.logic }}%</span>
                      </div>
                      <div class="h-1.5 bg-white rounded-full overflow-hidden">
                        <div class="h-full bg-primary" :style="{ width: item.details.logic + '%' }"></div>
                      </div>
                    </div>
                    <div class="space-y-1">
                      <div class="flex justify-between text-[10px] font-medium">
                        <span>问题解决</span>
                        <span>{{ item.details.problemSolving }}%</span>
                      </div>
                      <div class="h-1.5 bg-white rounded-full overflow-hidden">
                        <div class="h-full bg-primary" :style="{ width: item.details.problemSolving + '%' }"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 面试反馈 -->
                <div>
                  <h5 class="text-xs font-bold text-neutral-title mb-3">面试反馈</h5>
                  <div class="p-3 bg-white rounded-xl border border-neutral-border">
                    <p class="text-xs text-neutral-body leading-relaxed">{{ item.feedback }}</p>
                  </div>
                  
                  <!-- 标签 -->
                  <div class="mt-4">
                    <h5 class="text-xs font-bold text-neutral-title mb-2">相关技能标签</h5>
                    <div class="flex flex-wrap gap-2">
                      <span 
                        v-for="tag in item.tags" 
                        :key="tag"
                        class="text-[9px] px-2 py-0.5 bg-primary/10 text-primary rounded-full"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 操作按钮 -->
              <div class="flex items-center gap-3 pt-4 border-t border-neutral-border">
                <button 
                  class="flex-1 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-xs flex items-center justify-center gap-1.5"
                  @click="practiceAgain(item)"
                >
                  <RefreshCw :size="14" />
                  重新练习
                </button>
                <button 
                  class="flex-1 py-2.5 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all text-xs flex items-center justify-center gap-1.5"
                  @click="exportRecord(item.id)"
                >
                  <Download :size="14" />
                  导出记录
                </button>
                <button 
                  class="flex-1 py-2.5 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all text-xs flex items-center justify-center gap-1.5"
                  @click="shareExperience(item.id)"
                >
                  <Share2 :size="14" />
                  分享经验
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 练习题库模态框 -->
  <div v-if="isPracticeModalOpen" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-[32px] w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <div class="p-8 border-b border-neutral-border flex justify-between items-center">
        <h3 class="text-xl font-bold text-neutral-title flex items-center gap-2">
          <Zap :size="24" class="text-primary" />
          {{ currentBank?.title }} - 练习
        </h3>
        <button @click="closePracticeModal" class="p-2 text-neutral-helper hover:text-neutral-title">
          <X :size="24" />
        </button>
      </div>
      <div class="p-8 space-y-6" v-if="currentBank">
        <div class="p-6 bg-neutral-bg rounded-[24px]">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h4 class="text-lg font-bold text-neutral-title mb-2">{{ currentBank.title }}</h4>
              <p class="text-sm text-neutral-helper">{{ currentBank.description }}</p>
            </div>
            <div class="text-right">
              <span class="text-xs font-bold text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">{{ currentBank.category }}</span>
            </div>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div class="p-4 bg-white rounded-xl text-center">
              <p class="text-lg font-black text-primary">{{ currentBank.questionCount }}</p>
              <p class="text-xs text-neutral-helper">题目数量</p>
            </div>
            <div class="p-4 bg-white rounded-xl text-center">
              <p class="text-lg font-black text-primary">{{ currentBank.difficulty === 'easy' ? '简单' : currentBank.difficulty === 'medium' ? '中等' : '困难' }}</p>
              <p class="text-xs text-neutral-helper">难度</p>
            </div>
            <div class="p-4 bg-white rounded-xl text-center">
              <p class="text-lg font-black text-primary">{{ currentBank.estimatedTime }}</p>
              <p class="text-xs text-neutral-helper">预计时间</p>
            </div>
            <div class="p-4 bg-white rounded-xl text-center">
              <p class="text-lg font-black text-primary">{{ currentBank.passRate }}%</p>
              <p class="text-xs text-neutral-helper">通过率</p>
            </div>
          </div>
        </div>
        
        <div>
          <h4 class="text-sm font-bold text-neutral-title mb-4">题目列表</h4>
          <div class="space-y-3">
            <div v-for="(question, index) in currentBank.questions" :key="question.id" class="p-4 bg-neutral-bg rounded-xl border border-neutral-border hover:bg-white hover:shadow-sm transition-all">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{{ Number(index) + 1 }}</span>
                  <span class="text-sm font-bold text-neutral-title">{{ question.title }}</span>
                </div>
                <span class="text-xs font-bold px-2 py-1 rounded-full" :class="getDifficultyColor(question.difficulty)">{{ question.difficulty === 'easy' ? '简单' : question.difficulty === 'medium' ? '中等' : '困难' }}</span>
              </div>
              <p class="text-xs text-neutral-helper">{{ question.description }}</p>
            </div>
          </div>
        </div>
        
        <div class="flex gap-4 justify-end pt-6 border-t border-neutral-border">
          <button @click="closePracticeModal" class="px-6 py-3 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all">
            取消
          </button>
          <button @click="startPractice" class="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark hover:shadow-lg transition-all flex items-center gap-2 group">
            <Play :size="16" class="group-hover:scale-110 transition-transform" />
            开始练习
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 复习错题模态框 -->
  <div v-if="isReviewModalOpen" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-[32px] w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <div class="p-8 border-b border-neutral-border flex justify-between items-center">
        <h3 class="text-xl font-bold text-neutral-title flex items-center gap-2">
          <BookOpen :size="24" class="text-primary" />
          错题复习
        </h3>
        <button @click="closeReviewModal" class="p-2 text-neutral-helper hover:text-neutral-title">
          <X :size="24" />
        </button>
      </div>
      <div class="p-8 space-y-6" v-if="currentMistake">
        <div class="p-6 bg-neutral-bg rounded-[24px]">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-xs font-bold text-auxiliary-red bg-auxiliary-red/10 px-3 py-1 rounded-full">错题</span>
            <span class="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{{ currentMistake.category }}</span>
            <span class="text-xs font-bold px-3 py-1 rounded-full" :class="getDifficultyColor(currentMistake.difficulty)">{{ currentMistake.difficulty === 'easy' ? '简单' : currentMistake.difficulty === 'medium' ? '中等' : '困难' }}</span>
          </div>
          <h4 class="text-lg font-bold text-neutral-title mb-4">{{ currentMistake.question }}</h4>
          <p class="text-sm text-neutral-body mb-6">{{ currentMistake.explanation }}</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 class="text-sm font-bold text-neutral-title mb-3">你的答案</h5>
            <div class="p-4 bg-auxiliary-red/10 rounded-xl border border-auxiliary-red/30">
              <p class="text-sm text-auxiliary-red">{{ currentMistake.userAnswer }}</p>
            </div>
          </div>
          <div>
            <h5 class="text-sm font-bold text-neutral-title mb-3">正确答案</h5>
            <div class="p-4 bg-auxiliary-green/10 rounded-xl border border-auxiliary-green/30">
              <p class="text-sm text-auxiliary-green">{{ currentMistake.correctAnswer }}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h5 class="text-sm font-bold text-neutral-title mb-3">解析</h5>
          <div class="p-4 bg-primary/10 rounded-xl border border-primary/30">
            <p class="text-sm text-primary">{{ currentMistake.explanation }}</p>
          </div>
        </div>
        
        <div class="flex gap-4 justify-end pt-6 border-t border-neutral-border">
          <button @click="closeReviewModal" class="px-6 py-3 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all">
            关闭
          </button>
          <button class="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark hover:shadow-lg transition-all flex items-center gap-2">
            <Play :size="16" />
            开始复习
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 关卡详情模态框 -->
  <div v-if="isLevelDetailModalOpen" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-[32px] w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <div class="p-8 border-b border-neutral-border flex justify-between items-center">
        <h3 class="text-xl font-bold text-neutral-title flex items-center gap-2">
          <Gamepad2 :size="24" class="text-primary" />
          关卡详情 - {{ currentLevel?.name }}
        </h3>
        <button @click="closeLevelDetailModal" class="p-2 text-neutral-helper hover:text-neutral-title">
          <X :size="24" />
        </button>
      </div>
      <div class="p-8 space-y-6" v-if="currentLevel">
        <div class="p-6 bg-neutral-bg rounded-[24px]">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl gradient-primary">
                <span class="font-black text-2xl">{{ currentLevel.id }}</span>
              </div>
              <div>
                <h4 class="text-lg font-bold text-neutral-title mb-2">{{ currentLevel.name }}</h4>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold px-3 py-1 rounded-full" :class="getDifficultyColor(currentLevel.difficulty)">{{ getDifficultyText(currentLevel.difficulty) }}</span>
                  <span v-if="currentLevel.completed" class="text-xs font-bold px-3 py-1 rounded-full bg-auxiliary-green/10 text-auxiliary-green">已完成</span>
                  <span v-else-if="currentLevel.progress > 0" class="text-xs font-bold px-3 py-1 rounded-full bg-auxiliary-orange/10 text-auxiliary-orange">进行中</span>
                  <span v-else class="text-xs font-bold px-3 py-1 rounded-full bg-neutral-border/30 text-neutral-helper">未开始</span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <p class="text-lg font-black text-primary">{{ currentLevel.progress }}%</p>
              <p class="text-xs text-neutral-helper">完成进度</p>
            </div>
          </div>
          
          <div class="space-y-4">
            <div class="space-y-1">
              <div class="flex justify-between text-sm font-medium">
                <span>进度</span>
                <span>{{ currentLevel.progress }}%</span>
              </div>
              <div class="h-2 bg-white rounded-full overflow-hidden">
                <div class="h-full gradient-primary transition-all duration-1000 ease-out" :style="{ width: currentLevel.progress + '%' }"></div>
              </div>
            </div>
            
            <div class="grid grid-cols-3 gap-4 mt-4">
              <div class="p-4 bg-white rounded-xl text-center">
                <p class="text-lg font-black text-primary">{{ currentLevel.questions }}</p>
                <p class="text-xs text-neutral-helper">题目数量</p>
              </div>
              <div class="p-4 bg-white rounded-xl text-center">
                <p class="text-lg font-black text-primary">{{ Math.round((Number(currentLevel.correct) / Number(currentLevel.questions)) * 100) }}%</p>
                <p class="text-xs text-neutral-helper">正确率</p>
              </div>
              <div class="p-4 bg-white rounded-xl text-center">
                <p class="text-lg font-black text-primary">{{ currentLevel.timeSpent }}</p>
                <p class="text-xs text-neutral-helper">用时</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 class="text-sm font-bold text-neutral-title mb-4">相关技能</h4>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="skill in currentLevel.skills" 
              :key="skill"
              class="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-all cursor-pointer"
            >
              {{ skill }}
            </span>
          </div>
        </div>
        
        <div v-if="currentLevel.completed">
          <h4 class="text-sm font-bold text-neutral-title mb-4">关卡评价</h4>
          <div class="p-4 bg-neutral-bg rounded-xl border border-neutral-border">
            <div class="flex items-center gap-2 mb-3">
              <div class="flex gap-1">
                <span v-for="i in 5" :key="i" class="text-auxiliary-orange">★</span>
              </div>
              <span class="text-xs font-bold text-neutral-title">{{ currentLevel.rating }}/5</span>
            </div>
            <p class="text-sm text-neutral-body">{{ currentLevel.feedback || '你在这个关卡表现出色！继续保持这样的状态，你会在面试中取得成功。' }}</p>
          </div>
        </div>
        
        <div class="flex gap-4 justify-end pt-6 border-t border-neutral-border">
          <button @click="closeLevelDetailModal" class="px-6 py-3 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all">
            关闭
          </button>
          <button v-if="currentLevel.completed" @click="startLevel(currentLevel.id)" class="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark hover:shadow-lg transition-all flex items-center gap-2 group">
            <Zap :size="16" class="group-hover:scale-110 transition-transform" />
            重新练习
          </button>
          <button v-else-if="currentLevel.progress > 0" @click="continueLevel(currentLevel.id)" class="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark hover:shadow-lg transition-all flex items-center gap-2 group">
            <Zap :size="16" class="group-hover:scale-110 transition-transform" />
            继续练习
          </button>
          <button v-else @click="startLevel(currentLevel.id)" class="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark hover:shadow-lg transition-all flex items-center gap-2 group">
            <Zap :size="16" class="group-hover:scale-110 transition-transform" />
            开始练习
          </button>
        </div>
      </div>
    </div>
  </div>

    <!-- AI简历诊断模态框 -->
    <Transition name="fade">
      <div v-if="isResumeDiagnosisModalOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeResumeDiagnosisModal"></div>
        <div class="relative bg-white rounded-[32px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
          <div class="p-8 border-b border-neutral-border">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center text-white">
                  <Sparkles :size="20" />
                </div>
                <h3 class="text-xl font-bold text-neutral-title">AI 简历诊断</h3>
              </div>
              <button @click="closeResumeDiagnosisModal" class="p-2 hover:bg-neutral-bg rounded-full transition-colors text-neutral-helper">
                <X :size="20" />
              </button>
            </div>
          </div>
          
          <div class="p-8">
            <!-- 简历预览 -->
            <div v-if="!resumeDiagnosisResult" class="mb-8">
              <h4 class="text-lg font-bold text-neutral-title mb-4">简历预览</h4>
              <div class="bg-neutral-bg rounded-2xl p-6 space-y-6">
                <!-- 基本信息 -->
                <div>
                  <h5 class="text-sm font-bold text-neutral-title mb-3">基本信息</h5>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-xs text-neutral-helper mb-1">姓名</p>
                      <p class="text-sm font-medium text-neutral-body">{{ resumeData.basicInfo.name }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-neutral-helper mb-1">专业</p>
                      <p class="text-sm font-medium text-neutral-body">{{ resumeData.basicInfo.major }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-neutral-helper mb-1">年级</p>
                      <p class="text-sm font-medium text-neutral-body">{{ resumeData.basicInfo.grade }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-neutral-helper mb-1">学校</p>
                      <p class="text-sm font-medium text-neutral-body">{{ resumeData.basicInfo.school }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- 教育经历 -->
                <div>
                  <h5 class="text-sm font-bold text-neutral-title mb-3">教育经历</h5>
                  <div class="space-y-3">
                    <div v-for="(edu, index) in resumeData.education" :key="index" class="bg-white rounded-xl p-4 border border-neutral-border">
                      <div class="flex items-center justify-between mb-2">
                        <h6 class="text-sm font-bold text-neutral-title">{{ edu.school }}</h6>
                        <span class="text-xs text-neutral-helper">{{ edu.startDate }} - {{ edu.endDate }}</span>
                      </div>
                      <p class="text-xs text-neutral-body">{{ edu.major }} | {{ edu.degree }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- 实习经历 -->
                <div>
                  <h5 class="text-sm font-bold text-neutral-title mb-3">实习经历</h5>
                  <div class="space-y-3">
                    <div v-for="(exp, index) in resumeData.experience" :key="index" class="bg-white rounded-xl p-4 border border-neutral-border">
                      <div class="flex items-center justify-between mb-2">
                        <h6 class="text-sm font-bold text-neutral-title">{{ exp.company }}</h6>
                        <span class="text-xs text-neutral-helper">{{ exp.startDate }} - {{ exp.endDate }}</span>
                      </div>
                      <p class="text-xs font-medium text-neutral-body mb-2">{{ exp.position }}</p>
                      <p class="text-xs text-neutral-body">{{ exp.description }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- 技能 -->
                <div>
                  <h5 class="text-sm font-bold text-neutral-title mb-3">技能</h5>
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="(skill, index) in resumeData.skills" 
                      :key="index"
                      :class="['px-3 py-1.5 text-xs font-bold rounded-xl', getSkillLevelColor(skill.level)]"
                    >
                      {{ skill.name }} ({{ getSkillLevelText(skill.level) }})
                    </span>
                  </div>
                </div>
                
                <!-- 项目经历 -->
                <div>
                  <h5 class="text-sm font-bold text-neutral-title mb-3">项目经历</h5>
                  <div class="space-y-3">
                    <div v-for="(proj, index) in resumeData.projects" :key="index" class="bg-white rounded-xl p-4 border border-neutral-border">
                      <div class="flex items-center justify-between mb-2">
                        <h6 class="text-sm font-bold text-neutral-title">{{ proj.name }}</h6>
                        <span class="text-xs text-primary">{{ proj.role }}</span>
                      </div>
                      <p class="text-xs text-neutral-body mb-2">{{ proj.description }}</p>
                      <p class="text-xs text-neutral-helper">技术栈：{{ proj.technologies }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 诊断结果 -->
            <div v-else class="space-y-8">
              <!-- 总体评分 -->
              <div class="bg-neutral-bg rounded-2xl p-6">
                <h4 class="text-lg font-bold text-neutral-title mb-4">总体评分</h4>
                <div class="flex items-center gap-4">
                  <div class="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-white shadow-lg">
                    <span class="text-3xl font-black">{{ resumeDiagnosisResult.overallScore }}</span>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-bold text-neutral-title">简历综合评分</span>
                      <span class="text-lg font-black text-primary">{{ resumeDiagnosisResult.overallScore }}/100</span>
                    </div>
                    <div class="h-2 bg-white rounded-full overflow-hidden">
                      <div class="h-full gradient-primary transition-all duration-1000 ease-out" :style="{ width: resumeDiagnosisResult.overallScore + '%' }"></div>
                    </div>
                    <p class="text-xs text-neutral-helper mt-2">您的简历在同年级学生中处于前 15% 水平</p>
                  </div>
                </div>
              </div>
              
              <!-- 优势与不足 -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- 优势 -->
                <div class="bg-primary/10 rounded-2xl p-6">
                  <h4 class="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                    <CheckCircle :size="16" />
                    优势
                  </h4>
                  <div class="space-y-3">
                    <div 
                      v-for="(strength, index) in resumeDiagnosisResult.strengths" 
                      :key="index"
                      class="flex items-center justify-between p-3 bg-white rounded-xl border border-primary/30"
                    >
                      <span class="text-xs font-medium">{{ strength.name }}</span>
                      <span class="text-xs font-bold text-primary">{{ strength.score }}%</span>
                    </div>
                  </div>
                </div>
                
                <!-- 不足 -->
                <div class="bg-auxiliary-red/10 rounded-2xl p-6">
                  <h4 class="text-sm font-bold text-auxiliary-red mb-4 flex items-center gap-2">
                    <FileWarning :size="16" />
                    不足
                  </h4>
                  <div class="space-y-3">
                    <div 
                      v-for="(weakness, index) in resumeDiagnosisResult.weaknesses" 
                      :key="index"
                      class="flex items-center justify-between p-3 bg-white rounded-xl border border-auxiliary-red/30"
                    >
                      <span class="text-xs font-medium">{{ weakness.name }}</span>
                      <span class="text-xs font-bold text-auxiliary-red">{{ weakness.score }}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 岗位匹配度 -->
              <div class="bg-neutral-bg rounded-2xl p-6">
                <h4 class="text-sm font-bold text-neutral-title mb-4">岗位匹配度</h4>
                <div class="space-y-3">
                  <div 
                    v-for="(rate, position) in resumeDiagnosisResult.matchRate" 
                    :key="position"
                    class="space-y-1"
                  >
                    <div class="flex justify-between text-xs font-medium">
                      <span>{{ position }}</span>
                      <span>{{ rate }}%</span>
                    </div>
                    <div class="h-2 bg-white rounded-full overflow-hidden">
                      <div class="h-full gradient-primary transition-all duration-1000 ease-out" :style="{ width: rate + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 改进建议 -->
              <div class="bg-neutral-bg rounded-2xl p-6">
                <h4 class="text-sm font-bold text-neutral-title mb-4 flex items-center gap-2">
                  <Sparkles :size="16" class="text-primary" />
                  改进建议
                </h4>
                <div class="space-y-3">
                  <div 
                    v-for="(suggestion, index) in resumeDiagnosisResult.suggestions" 
                    :key="index"
                    class="flex items-start gap-3 p-3 bg-white rounded-xl border border-neutral-border"
                  >
                    <div class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                      {{ index + 1 }}
                    </div>
                    <p class="text-xs text-neutral-body leading-relaxed">{{ suggestion }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="mt-8 flex gap-4">
              <button 
                v-if="!resumeDiagnosisResult"
                @click="startResumeDiagnosis"
                :class="[
                  'px-8 py-3 font-bold rounded-2xl transition-all flex items-center gap-2 flex-1',
                  isDiagnosing ? 'bg-neutral-bg text-neutral-helper cursor-not-allowed' : 'gradient-primary text-white shadow-lg hover:shadow-primary/30'
                ]"
                :disabled="isDiagnosing"
              >
                <span v-if="isDiagnosing" class="animate-spin">🔄</span>
                {{ isDiagnosing ? '诊断中...' : '开始诊断' }}
              </button>
              <div v-else class="flex gap-4 flex-1">
                <button 
                  class="px-8 py-3 bg-neutral-bg text-neutral-title font-bold rounded-2xl hover:bg-neutral-border/50 transition-all flex items-center gap-2 flex-1"
                >
                  <Download :size="18" />
                  下载诊断报告
                </button>
                <button 
                  class="px-8 py-3 bg-primary/10 text-primary font-bold rounded-2xl hover:bg-primary hover:text-white transition-all flex items-center gap-2 flex-1"
                >
                  <Share2 :size="18" />
                  分享诊断结果
                </button>
              </div>
              <button 
                class="px-6 py-3 bg-neutral-bg text-neutral-title font-bold rounded-2xl hover:bg-neutral-border/50 transition-all flex items-center gap-2"
                @click="closeResumeDiagnosisModal"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 更新个人档案模态框 -->
    <Transition name="fade">
      <div v-if="isProfileUpdateModalOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeProfileUpdateModal"></div>
        <div class="relative bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
          <div class="p-8 border-b border-neutral-border">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl gradient-cyan-yellow flex items-center justify-center text-primary">
                  <User :size="20" />
                </div>
                <h3 class="text-xl font-bold text-neutral-title">更新个人档案</h3>
              </div>
              <button @click="closeProfileUpdateModal" class="p-2 hover:bg-neutral-bg rounded-full transition-colors text-neutral-helper">
                <X :size="20" />
              </button>
            </div>
          </div>
          
          <div class="p-8">
            <form @submit.prevent="saveProfile" class="space-y-6">
              <!-- 基本信息 -->
              <div class="space-y-4">
                <h4 class="text-lg font-bold text-neutral-title">基本信息</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-neutral-helper uppercase tracking-wider mb-2">姓名</label>
                    <input 
                      type="text" 
                      v-model="profileForm.name" 
                      class="w-full px-4 py-3 bg-neutral-bg rounded-xl border-2 border-transparent focus:border-primary/20 outline-none transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-neutral-helper uppercase tracking-wider mb-2">专业</label>
                    <input 
                      type="text" 
                      v-model="profileForm.major" 
                      class="w-full px-4 py-3 bg-neutral-bg rounded-xl border-2 border-transparent focus:border-primary/20 outline-none transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-neutral-helper uppercase tracking-wider mb-2">年级</label>
                    <input 
                      type="text" 
                      v-model="profileForm.grade" 
                      class="w-full px-4 py-3 bg-neutral-bg rounded-xl border-2 border-transparent focus:border-primary/20 outline-none transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-neutral-helper uppercase tracking-wider mb-2">学校</label>
                    <input 
                      type="text" 
                      v-model="profileForm.school" 
                      class="w-full px-4 py-3 bg-neutral-bg rounded-xl border-2 border-transparent focus:border-primary/20 outline-none transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-neutral-helper uppercase tracking-wider mb-2">邮箱</label>
                    <input 
                      type="email" 
                      v-model="profileForm.email" 
                      class="w-full px-4 py-3 bg-neutral-bg rounded-xl border-2 border-transparent focus:border-primary/20 outline-none transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-neutral-helper uppercase tracking-wider mb-2">电话</label>
                    <input 
                      type="tel" 
                      v-model="profileForm.phone" 
                      class="w-full px-4 py-3 bg-neutral-bg rounded-xl border-2 border-transparent focus:border-primary/20 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
              
              <!-- 其他信息 -->
              <div class="space-y-4">
                <h4 class="text-lg font-bold text-neutral-title">其他信息</h4>
                <div>
                  <label class="block text-xs font-bold text-neutral-helper uppercase tracking-wider mb-2">技能</label>
                  <input 
                    type="text" 
                    v-model="profileForm.skills" 
                    class="w-full px-4 py-3 bg-neutral-bg rounded-xl border-2 border-transparent focus:border-primary/20 outline-none transition-all font-medium"
                    placeholder="例如：Vue3, React, TypeScript"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-neutral-helper uppercase tracking-wider mb-2">工作经验</label>
                  <textarea 
                    v-model="profileForm.experience" 
                    class="w-full px-4 py-3 bg-neutral-bg rounded-xl border-2 border-transparent focus:border-primary/20 outline-none transition-all font-medium min-h-[100px]"
                  ></textarea>
                </div>
                <div>
                  <label class="block text-xs font-bold text-neutral-helper uppercase tracking-wider mb-2">教育背景</label>
                  <textarea 
                    v-model="profileForm.education" 
                    class="w-full px-4 py-3 bg-neutral-bg rounded-xl border-2 border-transparent focus:border-primary/20 outline-none transition-all font-medium min-h-[100px]"
                  ></textarea>
                </div>
                <div>
                  <label class="block text-xs font-bold text-neutral-helper uppercase tracking-wider mb-2">证书</label>
                  <textarea 
                    v-model="profileForm.certifications" 
                    class="w-full px-4 py-3 bg-neutral-bg rounded-xl border-2 border-transparent focus:border-primary/20 outline-none transition-all font-medium min-h-[100px]"
                  ></textarea>
                </div>
              </div>
              
              <!-- 操作按钮 -->
              <div class="flex gap-4 mt-8">
                <button 
                  type="submit"
                  :class="[
                    'px-8 py-3 font-bold rounded-2xl transition-all flex items-center gap-2 flex-1',
                    isSavingProfile ? 'bg-neutral-bg text-neutral-helper cursor-not-allowed' : 'gradient-primary text-white shadow-lg hover:shadow-primary/30'
                  ]"
                  :disabled="isSavingProfile"
                >
                  <span v-if="isSavingProfile" class="animate-spin">🔄</span>
                  {{ isSavingProfile ? '保存中...' : '保存' }}
                </button>
                <button 
                  type="button"
                  class="px-6 py-3 bg-neutral-bg text-neutral-title font-bold rounded-2xl hover:bg-neutral-border/50 transition-all flex items-center gap-2"
                  @click="closeProfileUpdateModal"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
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

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
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

/* 确保卡片在展开时的层级关系 */
.group {
  position: relative;
  z-index: 1;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .grid-cols-1 md:grid-cols-2 {
    grid-template-columns: 1fr;
  }
  
  .flex-col sm:flex-row {
    flex-direction: column;
  }
  
  .items-start sm:items-center {
    align-items: flex-start;
  }
  
  .w-full sm:w-auto {
    width: 100%;
  }
  
  .flex-1 sm:flex-none {
    flex: 1;
  }
}
</style>
