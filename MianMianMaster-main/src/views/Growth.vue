<script setup lang="ts">
import { 
  TrendingUp, 
  BookOpen, 
  RotateCcw, 
  ChevronRight, 
  PieChart, 
  Zap,
  PlayCircle,
  Target,
  Clock,
  CheckCircle2,
  FileText,
  Bookmark
} from 'lucide-vue-next'

import { ref, computed, onMounted } from 'vue'

const stats = [
  { label: '已掌握能力', value: '72%', icon: PieChart, color: 'text-primary' },
  { label: '技能缺口', value: '28%', icon: TrendingUp, color: 'text-auxiliary-orange' },
  { label: '专属题库', value: '12 组', icon: BookOpen, color: 'text-auxiliary-green' }
]

// 技能成长数据
const skills = [
  {
    name: 'Vue3 核心原理', 
    progress: 85, 
    status: '已掌握', 
    icon: Zap, 
    description: '掌握了 Vue3 的响应式原理、Composition API 等核心概念',
    subSkills: [
      { name: '响应式原理', progress: 90 },
      { name: 'Composition API', progress: 85 },
      { name: '生命周期', progress: 80 },
      { name: '组件通信', progress: 90 }
    ]
  },
  {
    name: '前端工程化架构', 
    progress: 45, 
    status: '强化中', 
    icon: TrendingUp, 
    description: '正在学习 webpack、Vite 等前端构建工具和工程化最佳实践',
    subSkills: [
      { name: 'Webpack', progress: 50 },
      { name: 'Vite', progress: 40 },
      { name: 'CI/CD', progress: 30 },
      { name: '代码规范', progress: 60 }
    ]
  },
  {
    name: 'TypeScript 深度实践', 
    progress: 15, 
    status: '待进行', 
    icon: BookOpen, 
    description: '计划学习 TypeScript 的高级特性和类型系统',
    subSkills: [
      { name: '类型系统', progress: 20 },
      { name: '泛型', progress: 10 },
      { name: '装饰器', progress: 5 },
      { name: '高级类型', progress: 15 }
    ]
  },
  {
    name: 'React 生态系统', 
    progress: 60, 
    status: '强化中', 
    icon: Target, 
    description: '正在学习 React Hooks、Redux 等 React 生态系统',
    subSkills: [
      { name: 'React Hooks', progress: 65 },
      { name: 'Redux', progress: 55 },
      { name: 'React Router', progress: 70 },
      { name: '状态管理', progress: 50 }
    ]
  },
  {
    name: 'Node.js 后端开发', 
    progress: 30, 
    status: '待进行', 
    icon: Clock, 
    description: '计划学习 Node.js、Express 等后端技术',
    subSkills: [
      { name: 'Node.js 基础', progress: 35 },
      { name: 'Express', progress: 25 },
      { name: '数据库', progress: 30 },
      { name: 'API 设计', progress: 20 }
    ]
  }
]



// 学习资源数据
const learningResources = [
  { id: 1, title: 'Vue3 从入门到精通', type: '视频课程', duration: '20小时', progress: 85, icon: PlayCircle, level: '中级', category: '前端框架', rating: 4.8, reviews: 1250 },
  { id: 2, title: 'TypeScript 实战指南', type: '电子书', duration: '300页', progress: 20, icon: FileText, level: '高级', category: '编程语言', rating: 4.6, reviews: 890 },
  { id: 3, title: '前端工程化最佳实践', type: '在线教程', duration: '15小时', progress: 45, icon: Bookmark, level: '中级', category: '工程化', rating: 4.7, reviews: 650 },
  { id: 4, title: 'React Hooks 深度解析', type: '视频课程', duration: '18小时', progress: 60, icon: PlayCircle, level: '高级', category: '前端框架', rating: 4.9, reviews: 980 },
  { id: 5, title: 'Node.js 后端开发实战', type: '在线教程', duration: '25小时', progress: 30, icon: Bookmark, level: '中级', category: '后端开发', rating: 4.5, reviews: 720 },
  { id: 6, title: '算法与数据结构', type: '电子书', duration: '400页', progress: 10, icon: FileText, level: '高级', category: '计算机基础', rating: 4.8, reviews: 1100 }
]

// 资源筛选状态
const selectedCategory = ref('all')
const selectedLevel = ref('all')
const selectedType = ref('all')
const searchQuery = ref('')
const isResourceLoading = ref(false)

// 计算属性：筛选后的资源
const filteredResources = computed(() => {
  let result = [...learningResources]
  
  // 按分类筛选
  if (selectedCategory.value !== 'all') {
    result = result.filter(resource => resource.category === selectedCategory.value)
  }
  
  // 按难度筛选
  if (selectedLevel.value !== 'all') {
    result = result.filter(resource => resource.level === selectedLevel.value)
  }
  
  // 按类型筛选
  if (selectedType.value !== 'all') {
    result = result.filter(resource => resource.type === selectedType.value)
  }
  
  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(resource => 
      resource.title.toLowerCase().includes(query) ||
      resource.category.toLowerCase().includes(query)
    )
  }
  
  return result
})

// 方法
const loadMoreResources = () => {
  isResourceLoading.value = true
  // 模拟加载更多数据
  setTimeout(() => {
    isResourceLoading.value = false
    // 这里可以添加更多资源
  }, 1000)
}

const toggleFavorite = (resourceId: number) => {
  // 模拟收藏功能
  alert(`已${Math.random() > 0.5 ? '收藏' : '取消收藏'}资源 ID: ${resourceId}`)
}

const viewResourceDetails = (resourceId: number) => {
  // 模拟查看资源详情
  alert(`查看资源详情 ID: ${resourceId}`)
}

const continueLearning = (resourceId: number) => {
  // 模拟继续学习
  alert(`继续学习资源 ID: ${resourceId}`)
}

// 错题本数据
const wrongQuestions = [
  {
    id: 1, 
    question: '什么是闭包？闭包的应用场景有哪些？', 
    category: 'JavaScript', 
    times: 3, 
    lastAttempt: '2024-01-15', 
    difficulty: '中等', 
    status: '未掌握',
    options: [
      'A. 闭包是函数内部的函数，它可以访问外部函数的变量',
      'B. 闭包是一种设计模式，用于创建私有变量',
      'C. 闭包会导致内存泄漏，应该避免使用',
      'D. 以上都正确'
    ],
    userAnswer: 'C',
    correctAnswer: 'A',
    explanation: '闭包是指有权访问另一个函数作用域中变量的函数。闭包的应用场景包括：1. 实现私有变量和方法 2. 延长变量的生命周期 3. 实现柯里化 4. 模块化开发。虽然闭包可能导致内存泄漏，但合理使用是安全的。'
  },
  {
    id: 2, 
    question: 'Vue3 的响应式原理与 Vue2 有什么区别？', 
    category: 'Vue', 
    times: 2, 
    lastAttempt: '2024-01-18', 
    difficulty: '困难', 
    status: '复习中',
    options: [
      'A. Vue3 使用 Object.defineProperty，Vue2 使用 Proxy',
      'B. Vue3 使用 Proxy，Vue2 使用 Object.defineProperty',
      'C. Vue3 和 Vue2 都使用 Object.defineProperty',
      'D. Vue3 和 Vue2 都使用 Proxy'
    ],
    userAnswer: 'A',
    correctAnswer: 'B',
    explanation: 'Vue2 使用 Object.defineProperty 实现响应式，只能监听对象的属性变化，无法监听新增属性和删除属性。Vue3 使用 Proxy 实现响应式，可以监听对象的所有操作，包括新增属性、删除属性等，同时性能更好。'
  },
  {
    id: 3, 
    question: '如何优化 React 应用的性能？', 
    category: 'React', 
    times: 1, 
    lastAttempt: '2024-01-20', 
    difficulty: '中等', 
    status: '未掌握',
    options: [
      'A. 使用 shouldComponentUpdate 生命周期方法',
      'B. 使用 React.memo 高阶组件',
      'C. 使用 useMemo 和 useCallback 钩子',
      'D. 以上都是'
    ],
    userAnswer: 'B',
    correctAnswer: 'D',
    explanation: '优化 React 应用性能的方法包括：1. 使用 shouldComponentUpdate 生命周期方法避免不必要的渲染 2. 使用 React.memo 高阶组件缓存组件 3. 使用 useMemo 和 useCallback 钩子缓存计算结果和函数 4. 合理使用 key 属性 5. 避免在渲染过程中创建新函数 6. 使用虚拟列表处理长列表。'
  },
  {
    id: 4, 
    question: '简述 TCP 三次握手和四次挥手的过程', 
    category: '网络', 
    times: 2, 
    lastAttempt: '2024-01-22', 
    difficulty: '困难', 
    status: '复习中',
    options: [
      'A. 三次握手：SYN -> SYN+ACK -> ACK；四次挥手：FIN -> ACK -> FIN -> ACK',
      'B. 三次握手：SYN -> ACK -> SYN+ACK；四次挥手：FIN -> FIN -> ACK -> ACK',
      'C. 三次握手：SYN+ACK -> SYN -> ACK；四次挥手：FIN -> ACK -> ACK -> FIN',
      'D. 三次握手：ACK -> SYN -> SYN+ACK；四次挥手：FIN -> ACK -> FIN -> ACK'
    ],
    userAnswer: 'B',
    correctAnswer: 'A',
    explanation: 'TCP 三次握手过程：1. 客户端发送 SYN 包请求建立连接 2. 服务器发送 SYN+ACK 包确认接收并请求建立连接 3. 客户端发送 ACK 包确认接收，连接建立。四次挥手过程：1. 客户端发送 FIN 包请求关闭连接 2. 服务器发送 ACK 包确认接收 3. 服务器发送 FIN 包请求关闭连接 4. 客户端发送 ACK 包确认接收，连接关闭。'
  },
  {
    id: 5, 
    question: '什么是事件循环？宏任务和微任务的区别', 
    category: 'JavaScript', 
    times: 1, 
    lastAttempt: '2024-01-25', 
    difficulty: '中等', 
    status: '未掌握',
    options: [
      'A. 事件循环是 JavaScript 处理异步操作的机制，宏任务包括 setTimeout、setInterval，微任务包括 Promise.then',
      'B. 事件循环是 JavaScript 处理同步操作的机制，宏任务包括 Promise.then，微任务包括 setTimeout、setInterval',
      'C. 事件循环是 JavaScript 处理异步操作的机制，宏任务和微任务没有区别',
      'D. 事件循环是 JavaScript 处理同步操作的机制，宏任务和微任务没有区别'
    ],
    userAnswer: 'C',
    correctAnswer: 'A',
    explanation: '事件循环是 JavaScript 处理异步操作的机制，它会不断循环执行任务队列中的任务。宏任务包括 setTimeout、setInterval、I/O 操作等，微任务包括 Promise.then、process.nextTick 等。微任务的优先级高于宏任务，在每次宏任务执行完成后，会先执行所有微任务，然后再执行下一个宏任务。'
  },
  {
    id: 6, 
    question: '如何实现深拷贝？', 
    category: 'JavaScript', 
    times: 2, 
    lastAttempt: '2024-01-28', 
    difficulty: '中等', 
    status: '复习中',
    options: [
      'A. 使用 JSON.parse(JSON.stringify(obj))',
      'B. 使用 Object.assign()',
      'C. 使用扩展运算符 {...obj}',
      'D. 以上都是'
    ],
    userAnswer: 'D',
    correctAnswer: 'A',
    explanation: 'JSON.parse(JSON.stringify(obj)) 是一种实现深拷贝的方法，但它有一些限制，比如不能处理函数、正则表达式、循环引用等。Object.assign() 和扩展运算符 {...obj} 只能实现浅拷贝，不能处理嵌套对象。对于复杂对象，需要使用递归或第三方库（如 lodash.cloneDeep）来实现深拷贝。'
  },
  {
    id: 7, 
    question: '什么是防抖和节流？', 
    category: 'JavaScript', 
    times: 1, 
    lastAttempt: '2024-01-30', 
    difficulty: '中等', 
    status: '未掌握',
    options: [
      'A. 防抖是指在一定时间内多次触发同一事件，只执行最后一次；节流是指在一定时间内多次触发同一事件，只执行一次',
      'B. 防抖是指在一定时间内多次触发同一事件，只执行一次；节流是指在一定时间内多次触发同一事件，只执行最后一次',
      'C. 防抖和节流都是指在一定时间内多次触发同一事件，只执行一次',
      'D. 防抖和节流都是指在一定时间内多次触发同一事件，只执行最后一次'
    ],
    userAnswer: 'B',
    correctAnswer: 'A',
    explanation: '防抖（debounce）是指在一定时间内多次触发同一事件，只执行最后一次，常用于搜索输入、窗口 resize 等场景。节流（throttle）是指在一定时间内多次触发同一事件，只执行一次，常用于滚动、鼠标移动等场景。'
  }
]

// 学习计划数据
const learningPlans = [
  {
    id: 1,
    title: 'JavaScript 核心概念强化',
    description: '重点复习闭包、原型链、异步编程等核心概念',
    totalDays: 7,
    currentDay: 3,
    progress: 43,
    status: '进行中',
    tasks: [
      { id: 1, title: '闭包概念与应用', completed: true, day: 1 },
      { id: 2, title: '原型链与继承', completed: true, day: 2 },
      { id: 3, title: '异步编程与事件循环', completed: true, day: 3 },
      { id: 4, title: 'Promise 与 async/await', completed: false, day: 4 },
      { id: 5, title: 'ES6+ 新特性', completed: false, day: 5 },
      { id: 6, title: '性能优化技巧', completed: false, day: 6 },
      { id: 7, title: '综合练习与测试', completed: false, day: 7 }
    ]
  },
  {
    id: 2,
    title: 'Vue3 源码深度解析',
    description: '深入理解 Vue3 的响应式原理、Composition API 等核心实现',
    totalDays: 10,
    currentDay: 0,
    progress: 0,
    status: '未开始',
    tasks: [
      { id: 1, title: 'Vue3 架构概览', completed: false, day: 1 },
      { id: 2, title: '响应式系统原理', completed: false, day: 2 },
      { id: 3, title: 'Composition API 实现', completed: false, day: 3 },
      { id: 4, title: '虚拟 DOM 与 diff 算法', completed: false, day: 4 },
      { id: 5, title: '编译器原理', completed: false, day: 5 },
      { id: 6, title: '组件生命周期', completed: false, day: 6 },
      { id: 7, title: '依赖收集与更新', completed: false, day: 7 },
      { id: 8, title: '性能优化策略', completed: false, day: 8 },
      { id: 9, title: '与 Vue2 的对比', completed: false, day: 9 },
      { id: 10, title: '实战应用与最佳实践', completed: false, day: 10 }
    ]
  },
  {
    id: 3,
    title: '算法与数据结构',
    description: '系统学习常见算法和数据结构，提高编码能力',
    totalDays: 14,
    currentDay: 0,
    progress: 0,
    status: '未开始',
    tasks: [
      { id: 1, title: '数组与链表', completed: false, day: 1 },
      { id: 2, title: '栈与队列', completed: false, day: 2 },
      { id: 3, title: '树与二叉树', completed: false, day: 3 },
      { id: 4, title: '图论基础', completed: false, day: 4 },
      { id: 5, title: '排序算法', completed: false, day: 5 },
      { id: 6, title: '查找算法', completed: false, day: 6 },
      { id: 7, title: '动态规划基础', completed: false, day: 7 },
      { id: 8, title: '贪心算法', completed: false, day: 8 },
      { id: 9, title: '回溯算法', completed: false, day: 9 },
      { id: 10, title: '分治算法', completed: false, day: 10 },
      { id: 11, title: '位运算', completed: false, day: 11 },
      { id: 12, title: '数学问题', completed: false, day: 12 },
      { id: 13, title: '字符串处理', completed: false, day: 13 },
      { id: 14, title: '综合练习', completed: false, day: 14 }
    ]
  }
]

// 强化学习引擎状态
const showWrongQuestions = ref(false)
const showLearningPlans = ref(false)
const selectedWrongQuestion = ref<WrongQuestion | null>(null)
const selectedLearningPlan = ref<LearningPlan | null>(null)
const isReviewing = ref(false)
const reviewProgress = ref(0)

// 状态管理
const showSubSkills = ref<Record<string, boolean>>({})

// 岗位专属题库数据
const jobQuestionBanks = [
  {
    id: 1,
    title: 'Java 核心面试题',
    questionCount: 1200,
    category: '后端开发',
    difficulty: '高级',
    description: '覆盖Java核心概念、多线程、JVM等高频面试题',
    progress: 30,
    lastUpdated: '2024-03-15',
    tags: ['Java', '后端', '面试']
  },
  {
    id: 2,
    title: 'Go 并发编程专场',
    questionCount: 800,
    category: '后端开发',
    difficulty: '中级',
    description: '专注于Go语言并发特性和最佳实践',
    progress: 15,
    lastUpdated: '2024-03-10',
    tags: ['Go', '并发', '后端']
  },
  {
    id: 3,
    title: 'Vue3 源码深度解析',
    questionCount: 450,
    category: '前端开发',
    difficulty: '高级',
    description: '深入Vue3内部实现原理和核心概念',
    progress: 45,
    lastUpdated: '2024-03-20',
    tags: ['Vue3', '前端', '源码']
  },
  {
    id: 4,
    title: 'MySQL 性能优化',
    questionCount: 600,
    category: '数据库',
    difficulty: '中级',
    description: 'MySQL查询优化、索引设计和性能调优',
    progress: 25,
    lastUpdated: '2024-03-05',
    tags: ['MySQL', '数据库', '性能优化']
  },
  {
    id: 5,
    title: 'React Hooks 实战',
    questionCount: 550,
    category: '前端开发',
    difficulty: '中级',
    description: 'React Hooks的使用技巧和最佳实践',
    progress: 20,
    lastUpdated: '2024-03-18',
    tags: ['React', '前端', 'Hooks']
  },
  {
    id: 6,
    title: '算法与数据结构',
    questionCount: 1000,
    category: '基础',
    difficulty: '高级',
    description: '常见算法题和数据结构实现',
    progress: 10,
    lastUpdated: '2024-03-12',
    tags: ['算法', '数据结构', '基础']
  }
]

// 题库筛选状态
const selectedBankCategory = ref('all')
const selectedBankDifficulty = ref('all')

// 计算属性：筛选后的题库
const filteredQuestionBanks = computed(() => {
  let result = [...jobQuestionBanks]
  
  // 按分类筛选
  if (selectedBankCategory.value !== 'all') {
    result = result.filter(bank => bank.category === selectedBankCategory.value)
  }
  
  // 按难度筛选
  if (selectedBankDifficulty.value !== 'all') {
    result = result.filter(bank => bank.difficulty === selectedBankDifficulty.value)
  }
  
  return result
})

// 方法
const viewQuestionBank = (bankId: number) => {
  // 模拟查看题库详情
  alert(`查看题库 ID: ${bankId}`)
}

const startPractice = (bankId: number) => {
  // 模拟开始练习
  alert(`开始练习题库 ID: ${bankId}`)
}

const addToFavorites = (bankId: number) => {
  // 模拟添加到收藏
  alert(`已收藏题库 ID: ${bankId}`)
}

// 方法
const toggleSubSkills = (skillName: string) => {
  showSubSkills.value[skillName] = !showSubSkills.value[skillName]
}

// 类型定义
interface WrongQuestion {
  id: number;
  question: string;
  category: string;
  times: number;
  lastAttempt: string;
  difficulty: string;
  status: string;
  options: string[];
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
}

interface LearningPlanTask {
  id: number;
  title: string;
  completed: boolean;
  day: number;
}

interface LearningPlan {
  id: number;
  title: string;
  description: string;
  totalDays: number;
  currentDay: number;
  progress: number;
  status: string;
  tasks: LearningPlanTask[];
}

// 强化学习引擎方法
const viewWrongQuestion = (question: WrongQuestion) => {
  selectedWrongQuestion.value = question
  isReviewing.value = true
  reviewProgress.value = 0
  // 模拟开始复习
  setTimeout(() => {
    reviewProgress.value = 100
  }, 3000)
}

const startReview = () => {
  isReviewing.value = true
  reviewProgress.value = 0
  // 模拟复习过程
  const interval = setInterval(() => {
    reviewProgress.value += 10
    if (reviewProgress.value >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        isReviewing.value = false
        alert('复习完成！')
      }, 500)
    }
  }, 300)
}

const viewLearningPlan = (plan: LearningPlan) => {
  selectedLearningPlan.value = plan
  showLearningPlans.value = true
}

const startLearningPlan = (planId: number) => {
  const plan = learningPlans.find(p => p.id === planId)
  if (plan) {
    plan.status = '进行中'
    plan.currentDay = 1
    plan.progress = Math.round((1 / plan.totalDays) * 100)
    alert(`已开始学习计划：${plan.title}`)
  }
}

const completeTask = (planId: number, taskId: number) => {
  const plan = learningPlans.find(p => p.id === planId)
  if (plan) {
    const task = plan.tasks.find(t => t.id === taskId)
    if (task) {
      task.completed = true
      // 更新进度
      const completedTasks = plan.tasks.filter(t => t.completed).length
      plan.progress = Math.round((completedTasks / plan.tasks.length) * 100)
      if (completedTasks === plan.tasks.length) {
        plan.status = '已完成'
        plan.currentDay = plan.totalDays
        alert(`学习计划 ${plan.title} 已完成！`)
      } else if (completedTasks > plan.currentDay) {
        plan.currentDay = completedTasks
      }
    }
  }
}

const exportWrongQuestions = () => {
  // 模拟导出错题本
  alert('错题本已导出！')
}

const clearWrongQuestions = () => {
  // 模拟清空错题本
  if (confirm('确定要清空错题本吗？')) {
    wrongQuestions.length = 0
    alert('错题本已清空！')
  }
}

// 生命周期
onMounted(() => {
  // 初始化数据
  console.log('Growth component mounted')
})
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
      <!-- Left: Main Content -->
      <div class="lg:col-span-8 space-y-8">
        <!-- 成长轨迹可视化 -->
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
          </div>
          
          <!-- 技能详情 -->
          <div class="mt-8 space-y-4">
            <div v-for="skill in skills" :key="skill.name" class="p-4 bg-neutral-bg rounded-2xl border border-neutral-border/50 hover:bg-white hover:shadow-md transition-all">
              <div class="flex items-center justify-between cursor-pointer" @click="toggleSubSkills(skill.name)">
                <div class="flex items-center gap-4">
                  <div class="p-2 bg-white rounded-xl text-primary shadow-sm"><component :is="skill.icon" :size="20" /></div>
                  <div>
                    <h4 class="text-sm font-bold text-neutral-title">{{ skill.name }}</h4>
                    <p class="text-[10px] text-neutral-helper">{{ skill.description }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="h-2 w-32 bg-white rounded-full overflow-hidden">
                    <div class="h-full bg-primary transition-all duration-1000 ease-out" :style="{width: skill.progress + '%'}"></div>
                  </div>
                  <span class="text-[10px] font-bold uppercase" :class="skill.status === '已掌握' ? 'text-auxiliary-green' : 'text-primary'">{{ skill.status }}</span>
                  <component :is="showSubSkills[skill.name] ? ChevronUp : ChevronDown" :size="16" class="text-neutral-body" />
                </div>
              </div>
              <!-- 子技能详情 -->
              <div v-if="showSubSkills[skill.name]" class="mt-4 pl-12 space-y-3 animate-fadeIn">
                <div v-for="subSkill in skill.subSkills" :key="subSkill.name" class="flex items-center justify-between">
                  <span class="text-xs text-neutral-body">{{ subSkill.name }}</span>
                  <div class="flex items-center gap-2">
                    <div class="h-1.5 w-24 bg-white rounded-full overflow-hidden">
                      <div class="h-full bg-primary transition-all duration-1000 ease-out" :style="{width: subSkill.progress + '%'}"></div>
                    </div>
                    <span class="text-[10px] font-bold text-primary">{{ subSkill.progress }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 学习资源 -->
        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border">
          <h2 class="text-xl font-bold text-neutral-title mb-8 flex items-center gap-3">
            <BookOpen :size="24" class="text-primary" />
            学习资源库
          </h2>
          
          <!-- 搜索和筛选 -->
          <div class="mb-8 space-y-4">
            <!-- 搜索框 -->
            <div class="relative">
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="搜索课程、书籍或教程..." 
                class="w-full px-4 py-3 pl-12 bg-neutral-bg rounded-2xl border border-neutral-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm font-bold"
              >
              <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-helper">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
              </div>
            </div>
            
            <!-- 筛选选项 -->
            <div class="flex flex-wrap items-center gap-4">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-neutral-title">分类:</span>
                <select v-model="selectedCategory" class="bg-neutral-bg border border-neutral-border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="all">全部分类</option>
                  <option value="前端框架">前端框架</option>
                  <option value="编程语言">编程语言</option>
                  <option value="工程化">工程化</option>
                  <option value="后端开发">后端开发</option>
                  <option value="计算机基础">计算机基础</option>
                </select>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-neutral-title">难度:</span>
                <select v-model="selectedLevel" class="bg-neutral-bg border border-neutral-border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="all">全部难度</option>
                  <option value="初级">初级</option>
                  <option value="中级">中级</option>
                  <option value="高级">高级</option>
                </select>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-neutral-title">类型:</span>
                <select v-model="selectedType" class="bg-neutral-bg border border-neutral-border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="all">全部类型</option>
                  <option value="视频课程">视频课程</option>
                  <option value="电子书">电子书</option>
                  <option value="在线教程">在线教程</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- 资源列表 -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="resource in filteredResources" :key="resource.id" class="p-6 bg-neutral-bg rounded-[24px] hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-neutral-border group cursor-pointer">
              <!-- 资源头部 -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:gradient-primary group-hover:text-white transition-all">
                    <component :is="resource.icon" :size="24" />
                  </div>
                  <button @click="toggleFavorite(resource.id)" class="p-2 rounded-full hover:bg-white/50 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-auxiliary-orange"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  </button>
                </div>
              </div>
              
              <!-- 资源信息 -->
              <div class="mb-4">
                <h3 class="font-bold text-neutral-title mb-2 group-hover:text-primary transition-colors">{{ resource.title }}</h3>
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{{ resource.type }}</span>
                  <span class="text-xs px-2 py-1 bg-neutral-border rounded-full">{{ resource.level }}</span>
                  <span class="text-xs px-2 py-1 bg-neutral-border rounded-full">{{ resource.category }}</span>
                </div>
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-xs text-neutral-helper">{{ resource.duration }}</span>
                  <div class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star text-auxiliary-orange"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <span class="text-xs font-bold text-neutral-title">{{ resource.rating }}</span>
                    <span class="text-xs text-neutral-helper">({{ resource.reviews }})</span>
                  </div>
                </div>
              </div>
              
              <!-- 学习进度 -->
              <div class="mb-4">
                <div class="flex justify-between text-xs text-neutral-helper mb-1">
                  <span>学习进度</span>
                  <span>{{ resource.progress }}%</span>
                </div>
                <div class="h-2 bg-neutral-border rounded-full overflow-hidden">
                  <div class="h-full bg-primary transition-all duration-1000 ease-out" :style="{width: resource.progress + '%'}"></div>
                </div>
              </div>
              
              <!-- 操作按钮 -->
              <div class="flex gap-3">
                <button @click="viewResourceDetails(resource.id)" class="flex-1 px-4 py-2 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all text-sm">查看详情</button>
                <button @click="continueLearning(resource.id)" class="flex-1 px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-sm">继续学习</button>
              </div>
            </div>
          </div>
          
          <!-- 加载更多 -->
          <div class="mt-8 flex justify-center">
            <button 
              @click="loadMoreResources" 
              :disabled="isResourceLoading"
              class="px-6 py-3 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all text-sm flex items-center gap-2"
            >
              <RefreshCw :size="16" :class="isResourceLoading ? 'animate-spin' : ''" />
              {{ isResourceLoading ? '加载中...' : '加载更多资源' }}
            </button>
          </div>
        </div>

        <!-- 强化学习引擎 -->
        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border">
          <h2 class="text-xl font-bold text-neutral-title mb-8 flex items-center gap-3">
            <RotateCcw :size="24" class="text-primary" />
            强化学习引擎
          </h2>
          
          <!-- 引擎功能导航 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="p-8 gradient-yellow-orange rounded-[32px] text-white shadow-lg relative overflow-hidden group cursor-pointer active:scale-95 transition-all" @click="showWrongQuestions = !showWrongQuestions">
              <div class="relative z-10">
                <h3 class="text-2xl font-black mb-2">错题本复盘</h3>
                <p class="text-white/80 text-sm mb-6 leading-relaxed">系统自动存档所有历史面试中的薄弱知识点，助您精准突击。</p>
                <div class="flex items-center justify-between">
                  <button class="px-6 py-3 bg-white text-auxiliary-orange font-bold rounded-xl shadow-md">
                    {{ showWrongQuestions ? '收起' : '进入复盘' }}
                  </button>
                  <span class="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                    {{ wrongQuestions.length }} 道错题
                  </span>
                </div>
              </div>
              <div class="absolute -right-6 -bottom-6 opacity-20 group-hover:scale-110 transition-transform">
                <RotateCcw :size="140" />
              </div>
            </div>
            <div class="p-8 bg-neutral-title rounded-[32px] text-white shadow-lg relative overflow-hidden group cursor-pointer active:scale-95 transition-all" @click="showLearningPlans = !showLearningPlans">
              <div class="relative z-10">
                <h3 class="text-2xl font-black mb-2 text-white">学习计划管理</h3>
                <p class="text-white/80 text-sm mb-6 leading-relaxed">基于您的薄弱环节，智能生成个性化学习计划，助您系统提升。</p>
                <div class="flex items-center justify-between">
                  <button class="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-md">
                    {{ showLearningPlans ? '收起' : '查看计划' }}
                  </button>
                  <span class="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                    {{ learningPlans.length }} 个计划
                  </span>
                </div>
              </div>
              <div class="absolute -right-6 -bottom-6 opacity-20 group-hover:scale-110 transition-transform">
                <Calendar :size="140" />
              </div>
            </div>
          </div>
          
          <!-- 错题本详情 -->
          <div v-if="showWrongQuestions" class="mt-8 space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold text-neutral-title flex items-center gap-2">
                <RotateCcw :size="20" class="text-auxiliary-orange" />
                错题本详情
              </h3>
              <div class="flex items-center gap-3">
                <button @click="exportWrongQuestions" class="px-4 py-2 bg-neutral-bg text-neutral-title text-xs font-bold rounded-xl hover:bg-neutral-border/50 transition-all flex items-center gap-2">
                  <Download :size="14" />
                  导出错题
                </button>
                <button @click="clearWrongQuestions" class="px-4 py-2 bg-auxiliary-orange/10 text-auxiliary-orange text-xs font-bold rounded-xl hover:bg-auxiliary-orange/20 transition-all flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  清空错题
                </button>
              </div>
            </div>
            
            <div class="space-y-4">
              <div v-for="question in wrongQuestions" :key="question.id" class="p-6 bg-neutral-bg rounded-[24px] hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border cursor-pointer group">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h4 class="text-sm font-bold text-neutral-title mb-3 group-hover:text-primary transition-colors">{{ question.question }}</h4>
                    <div class="flex flex-wrap items-center gap-2 mb-3">
                      <span class="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full">{{ question.category }}</span>
                      <span class="text-xs px-3 py-1 bg-neutral-border rounded-full">{{ question.difficulty }}</span>
                      <span class="text-xs px-3 py-1 rounded-full" :class="question.status === '未掌握' ? 'bg-auxiliary-orange/10 text-auxiliary-orange' : 'bg-auxiliary-green/10 text-auxiliary-green'">{{ question.status }}</span>
                    </div>
                    <!-- 选项展示 -->
                    <div class="space-y-2 mb-4">
                      <div v-for="(option, index) in question.options" :key="index" class="flex items-center gap-2 p-2 rounded-xl" :class="{
                        'bg-auxiliary-orange/10 border border-auxiliary-orange/30': option.includes(question.userAnswer) && question.userAnswer !== question.correctAnswer,
                        'bg-auxiliary-green/10 border border-auxiliary-green/30': option.includes(question.correctAnswer),
                        'bg-white border border-neutral-border': !option.includes(question.userAnswer) && !option.includes(question.correctAnswer)
                      }">
                        <div class="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold" :class="{
                          'bg-auxiliary-orange text-white': option.includes(question.userAnswer) && question.userAnswer !== question.correctAnswer,
                          'bg-auxiliary-green text-white': option.includes(question.correctAnswer),
                          'bg-white border border-neutral-border text-neutral-body': !option.includes(question.userAnswer) && !option.includes(question.correctAnswer)
                        }">
                          {{ option.charAt(0) }}
                        </div>
                        <span class="text-xs text-neutral-body">{{ option.substring(3) }}</span>
                      </div>
                    </div>
                    <!-- 答案和解析 -->
                    <div class="mb-4">
                      <div class="flex items-center gap-2 mb-2">
                        <span class="text-xs font-bold text-neutral-title">你的答案:</span>
                        <span class="text-xs font-bold text-auxiliary-orange">{{ question.userAnswer }}</span>
                      </div>
                      <div class="flex items-center gap-2 mb-2">
                        <span class="text-xs font-bold text-neutral-title">正确答案:</span>
                        <span class="text-xs font-bold text-auxiliary-green">{{ question.correctAnswer }}</span>
                      </div>
                      <div class="mt-3 p-3 bg-primary/5 rounded-xl border border-primary/20">
                        <h5 class="text-xs font-bold text-primary mb-2">解析:</h5>
                        <p class="text-xs text-neutral-body">{{ question.explanation }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col items-end gap-2">
                    <span class="text-xs font-bold text-auxiliary-orange">错误 {{ question.times }} 次</span>
                    <span class="text-xs text-neutral-helper">最后尝试: {{ question.lastAttempt }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <button @click="viewWrongQuestion(question)" class="flex-1 px-4 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-sm">
                    查看解析
                  </button>
                  <button class="px-4 py-3 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all text-sm">
                    重新练习
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 复习进度 -->
            <div v-if="isReviewing" class="p-6 bg-primary/5 rounded-[24px] border border-primary/20">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-sm font-bold text-primary">复习进度</h4>
                <span class="text-xs font-bold text-primary">{{ reviewProgress }}%</span>
              </div>
              <div class="h-2 bg-primary/20 rounded-full overflow-hidden mb-4">
                <div class="h-full bg-primary transition-all duration-300 ease-out" :style="{width: reviewProgress + '%'}"></div>
              </div>
              <div class="flex justify-center">
                <button @click="startReview" class="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-sm">
                  {{ reviewProgress === 100 ? '完成复习' : '开始复习' }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- 学习计划详情 -->
          <div v-if="showLearningPlans" class="mt-8 space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold text-neutral-title flex items-center gap-2">
                <Calendar :size="20" class="text-primary" />
                学习计划管理
              </h3>
              <button class="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-all flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                新建计划
              </button>
            </div>
            
            <div class="space-y-6">
              <div v-for="plan in learningPlans" :key="plan.id" class="p-6 bg-neutral-bg rounded-[24px] hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border cursor-pointer group">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h4 class="text-sm font-bold text-neutral-title mb-2 group-hover:text-primary transition-colors">{{ plan.title }}</h4>
                    <p class="text-xs text-neutral-helper mb-3">{{ plan.description }}</p>
                    <div class="flex flex-wrap items-center gap-2 mb-3">
                      <span class="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full">{{ plan.status }}</span>
                      <span class="text-xs px-3 py-1 bg-neutral-border rounded-full">{{ plan.currentDay }}/{{ plan.totalDays }} 天</span>
                    </div>
                  </div>
                  <div class="flex flex-col items-end gap-2">
                    <div class="h-2 w-32 bg-white rounded-full overflow-hidden">
                      <div class="h-full bg-primary transition-all duration-1000 ease-out" :style="{width: plan.progress + '%'}"></div>
                    </div>
                    <span class="text-xs font-bold text-primary">{{ plan.progress }}%</span>
                  </div>
                </div>
                
                <!-- 任务进度 -->
                <div class="mb-4">
                  <h5 class="text-xs font-bold text-neutral-title mb-2">任务进度</h5>
                  <div class="space-y-2">
                    <div v-for="task in plan.tasks.slice(0, 3)" :key="task.id" class="flex items-center gap-3">
                      <input type="checkbox" :checked="task.completed" @change="completeTask(plan.id, task.id)" class="w-4 h-4 rounded border-neutral-border text-primary focus:ring-primary/30">
                      <span class="text-xs text-neutral-body flex-1">{{ task.title }}</span>
                      <span class="text-xs text-neutral-helper">第 {{ task.day }} 天</span>
                    </div>
                    <div v-if="plan.tasks.length > 3" class="text-xs text-primary font-bold hover:underline cursor-pointer">
                      查看全部 {{ plan.tasks.length }} 个任务
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center gap-3">
                  <button @click="viewLearningPlan(plan)" class="flex-1 px-4 py-3 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all text-sm">
                    查看详情
                  </button>
                  <button v-if="plan.status === '未开始'" @click="startLearningPlan(plan.id)" class="px-4 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-sm">
                    开始学习
                  </button>
                  <button v-else class="px-4 py-3 bg-auxiliary-green text-white font-bold rounded-xl hover:bg-auxiliary-green/80 transition-all text-sm">
                    继续学习
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Sidebar -->
      <div class="lg:col-span-4 space-y-8">
        <!-- 岗位专属题库 -->
        <div class="bg-white rounded-[32px] p-6 shadow-sm border border-neutral-border flex flex-col">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-2xl gradient-cyan-yellow flex items-center justify-center text-primary shadow-md">
              <BookOpen :size="20" />
            </div>
            <h2 class="text-lg font-bold text-neutral-title">岗位专属题库</h2>
          </div>
          
          <!-- 筛选选项 -->
          <div class="flex flex-wrap items-center gap-3 mb-6">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-neutral-title">分类:</span>
              <select v-model="selectedBankCategory" class="bg-neutral-bg border border-neutral-border rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="all">全部分类</option>
                <option value="前端开发">前端开发</option>
                <option value="后端开发">后端开发</option>
                <option value="数据库">数据库</option>
                <option value="基础">基础</option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-neutral-title">难度:</span>
              <select v-model="selectedBankDifficulty" class="bg-neutral-bg border border-neutral-border rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="all">全部难度</option>
                <option value="初级">初级</option>
                <option value="中级">中级</option>
                <option value="高级">高级</option>
              </select>
            </div>
          </div>
          
          <div class="space-y-3 flex-1">
            <div v-for="bank in filteredQuestionBanks" :key="bank.id" class="p-4 bg-neutral-bg rounded-[20px] group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border cursor-pointer">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <h4 class="text-sm font-bold text-neutral-title group-hover:text-primary transition-colors">{{ bank.title }}</h4>
                  <button @click.stop="addToFavorites(bank.id)" class="p-1 rounded-full hover:bg-white/50 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-auxiliary-orange"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  </button>
                </div>
                <span class="text-xs font-bold text-primary">{{ bank.questionCount }}+ 题</span>
              </div>
              <p class="text-[10px] text-neutral-helper mb-3">{{ bank.description }}</p>
              <div class="flex flex-wrap gap-2 mb-3">
                <span class="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{{ bank.category }}</span>
                <span class="text-xs px-2 py-1 bg-neutral-border rounded-full">{{ bank.difficulty }}</span>
                <span v-for="tag in bank.tags.slice(0, 2)" :key="tag" class="text-xs px-2 py-1 bg-neutral-border rounded-full">{{ tag }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] text-neutral-helper">学习进度</span>
                  <div class="h-1.5 w-24 bg-white rounded-full overflow-hidden">
                    <div class="h-full bg-primary transition-all duration-1000 ease-out" :style="{width: bank.progress + '%'}"></div>
                  </div>
                  <span class="text-[10px] font-bold text-primary">{{ bank.progress }}%</span>
                </div>
                <div class="flex gap-2">
                  <button @click="startPractice(bank.id)" class="px-3 py-1 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary-dark transition-all">
                    开始练习
                  </button>
                  <button @click="viewQuestionBank(bank.id)" class="p-1.5 bg-white rounded-lg text-primary group-hover:gradient-primary group-hover:text-white transition-all shadow-sm">
                    <ChevronRight :size="14" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 p-4 bg-primary/5 rounded-[24px] border border-primary/20 flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center text-white">
              <PlayCircle :size="20" />
            </div>
            <div>
              <p class="text-xs font-bold text-primary">个性化推荐</p>
              <p class="text-[10px] text-neutral-body leading-tight">基于您的匹配度推荐专属题库</p>
            </div>
          </div>
        </div>

        <!-- 错题本 -->
        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border">
          <h2 class="text-xl font-bold text-neutral-title mb-6 flex items-center gap-3">
            <RotateCcw :size="24" class="text-auxiliary-orange" />
            错题本
          </h2>
          <div class="space-y-4">
            <div v-for="question in wrongQuestions.slice(0, 3)" :key="question.id" class="p-4 bg-neutral-bg rounded-[20px] hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border cursor-pointer group">
              <h3 class="text-sm font-bold text-neutral-title mb-2 group-hover:text-primary transition-colors">{{ question.question }}</h3>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs text-primary font-bold">{{ question.category }}</span>
                <span class="text-xs text-auxiliary-orange font-bold">错误 {{ question.times }} 次</span>
              </div>
              <div class="flex justify-between mb-3">
                <span class="text-xs text-neutral-helper">最后尝试: {{ question.lastAttempt }}</span>
                <span class="text-xs px-2 py-1 rounded-full" :class="question.status === '未掌握' ? 'bg-auxiliary-orange/10 text-auxiliary-orange' : 'bg-auxiliary-green/10 text-auxiliary-green'">{{ question.status }}</span>
              </div>
              <div class="flex items-center gap-2">
                <button @click="viewWrongQuestion(question)" class="flex-1 px-3 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-xs">
                  查看解析
                </button>
                <button class="px-3 py-2 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all text-xs">
                  练习
                </button>
              </div>
            </div>
          </div>
          <div class="mt-6 flex justify-center">
            <button @click="showWrongQuestions = true" class="px-6 py-2 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all text-sm flex items-center gap-2">
              查看全部错题
              <ChevronRight :size="14" />
            </button>
          </div>
        </div>

        <!-- 学习目标 -->
        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border">
          <h2 class="text-xl font-bold text-neutral-title mb-6 flex items-center gap-3">
            <Target :size="24" class="text-primary" />
            学习目标
          </h2>
          <div class="space-y-4">
            <div class="p-4 bg-primary/10 rounded-[20px] border border-primary/20">
              <div class="flex items-center gap-2 mb-2">
                <CheckCircle2 :size="16" class="text-primary" />
                <h3 class="text-sm font-bold text-neutral-title">掌握 Vue3 核心原理</h3>
              </div>
              <p class="text-xs text-neutral-body">已完成 85%，预计 2 天内完成</p>
            </div>
            <div class="p-4 bg-neutral-bg rounded-[20px]">
              <div class="flex items-center gap-2 mb-2">
                <Clock :size="16" class="text-auxiliary-orange" />
                <h3 class="text-sm font-bold text-neutral-title">学习前端工程化架构</h3>
              </div>
              <p class="text-xs text-neutral-body">已完成 45%，预计 5 天内完成</p>
            </div>
            <div class="p-4 bg-neutral-bg rounded-[20px]">
              <div class="flex items-center gap-2 mb-2">
                <Clock :size="16" class="text-auxiliary-orange" />
                <h3 class="text-sm font-bold text-neutral-title">学习 TypeScript 深度实践</h3>
              </div>
              <p class="text-xs text-neutral-body">已完成 15%，预计 10 天内完成</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
