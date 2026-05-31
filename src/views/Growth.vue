<script setup lang="ts">
import { 
  TrendingUp, 
  BookOpen, 
  RotateCcw, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown, 
  PieChart, 
  Zap,
  PlayCircle,
  Target,
  Clock,
  CheckCircle2,
  FileText,
  Bookmark,
  Calendar,
  Download,
  Plus
} from 'lucide-vue-next'

import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import echarts from '@/utils/echarts'

// 模态框状态
const showResourceDetailModal = ref(false)
const showContinueLearningModal = ref(false)
const showWrongQuestionModal = ref(false)
const showLearningPlanDetailModal = ref(false)
const showQuestionBankDetailModal = ref(false)
const showQuestionPracticeModal = ref(false)
const selectedResource = ref<any>(null)
const selectedWrongQuestion = ref<any>(null)
const selectedLearningPlan = ref<any>(null)
const selectedQuestionBank = ref<any>(null)
const currentVideoTime = ref(0)
const courseModules = ref<any[]>([])

// 收藏状态
const favoriteBanks = ref<number[]>(localStorage.getItem('favoriteBanks') ? JSON.parse(localStorage.getItem('favoriteBanks')!) : [])

// 题库练习状态
const currentQuestionIndex = ref(0)
const selectedAnswer = ref<string>('')
const isAnswerCorrect = ref<boolean | null>(null)
const practiceQuestions = ref<any[]>([])
const answeredQuestions = ref<(boolean | null)[]>([])
const practiceCompleted = ref(false)
const totalQuestions = ref(0)
const correctAnswers = ref(0)
const finalAccuracy = ref(0)

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
  {
    id: 1, 
    title: 'Vue3 从入门到精通', 
    type: '视频课程', 
    duration: '20小时', 
    progress: 85, 
    icon: PlayCircle, 
    level: '中级', 
    category: '前端框架', 
    rating: 4.8, 
    reviews: 1250,
    instructor: '张老师',
    instructorTitle: '前端架构师',
    description: '本课程从Vue3的基础概念开始，逐步深入到高级特性，包括Composition API、响应式原理、组件通信等核心内容。通过实战项目，让你掌握Vue3的开发技巧和最佳实践。',
    modules: [
      { id: 1, title: 'Vue3 基础入门', duration: '3小时', completed: true },
      { id: 2, title: 'Composition API 详解', duration: '4小时', completed: true },
      { id: 3, title: '响应式原理与实现', duration: '3小时', completed: true },
      { id: 4, title: '组件通信与生命周期', duration: '3小时', completed: true },
      { id: 5, title: 'Vue Router 实战', duration: '2小时', completed: true },
      { id: 6, title: 'Pinia 状态管理', duration: '2小时', completed: true },
      { id: 7, title: '实战项目开发', duration: '3小时', completed: false }
    ],
    tags: ['Vue3', 'Composition API', '前端框架', '响应式']
  },
  {
    id: 2, 
    title: 'TypeScript 实战指南', 
    type: '电子书', 
    duration: '300页', 
    progress: 20, 
    icon: FileText, 
    level: '高级', 
    category: '编程语言', 
    rating: 4.6, 
    reviews: 890,
    author: '李老师',
    publisher: '技术出版社',
    publishDate: '2023-06-15',
    description: '本书从TypeScript的基础语法开始，逐步深入到高级特性，包括类型系统、泛型、装饰器、高级类型等内容。通过实战案例，让你掌握TypeScript的开发技巧和最佳实践。',
    chapters: [
      { id: 1, title: 'TypeScript 基础', pages: '1-50', completed: true },
      { id: 2, title: '类型系统详解', pages: '51-100', completed: false },
      { id: 3, title: '泛型与高级类型', pages: '101-150', completed: false },
      { id: 4, title: '装饰器与元编程', pages: '151-200', completed: false },
      { id: 5, title: '实战案例分析', pages: '201-300', completed: false }
    ],
    tags: ['TypeScript', '类型系统', '泛型', '装饰器']
  },
  {
    id: 3, 
    title: '前端工程化最佳实践', 
    type: '在线教程', 
    duration: '15小时', 
    progress: 45, 
    icon: Bookmark, 
    level: '中级', 
    category: '工程化', 
    rating: 4.7, 
    reviews: 650,
    instructor: '王老师',
    instructorTitle: '前端工程化专家',
    description: '本教程涵盖了前端工程化的各个方面，包括构建工具、代码规范、CI/CD、性能优化等内容。通过实际项目案例，让你掌握前端工程化的最佳实践。',
    modules: [
      { id: 1, title: '前端工程化概述', duration: '1小时', completed: true },
      { id: 2, title: 'Webpack 配置与优化', duration: '3小时', completed: true },
      { id: 3, title: 'Vite 原理与实践', duration: '2小时', completed: true },
      { id: 4, title: '代码规范与质量保障', duration: '2小时', completed: false },
      { id: 5, title: 'CI/CD 流程搭建', duration: '3小时', completed: false },
      { id: 6, title: '性能优化策略', duration: '2小时', completed: false },
      { id: 7, title: '工程化最佳实践', duration: '2小时', completed: false }
    ],
    tags: ['前端工程化', 'Webpack', 'Vite', 'CI/CD']
  },
  {
    id: 4, 
    title: 'React Hooks 深度解析', 
    type: '视频课程', 
    duration: '18小时', 
    progress: 60, 
    icon: PlayCircle, 
    level: '高级', 
    category: '前端框架', 
    rating: 4.9, 
    reviews: 980,
    instructor: '刘老师',
    instructorTitle: 'React 专家',
    description: '本课程深入解析React Hooks的原理和使用方法，包括useState、useEffect、useContext、useReducer等常用Hooks，以及自定义Hooks的开发技巧。通过实战项目，让你掌握React Hooks的最佳实践。',
    modules: [
      { id: 1, title: 'React Hooks 概述', duration: '1小时', completed: true },
      { id: 2, title: 'useState 与 useEffect', duration: '3小时', completed: true },
      { id: 3, title: 'useContext 与 useReducer', duration: '3小时', completed: true },
      { id: 4, title: 'useCallback 与 useMemo', duration: '2小时', completed: true },
      { id: 5, title: '自定义 Hooks 开发', duration: '3小时', completed: true },
      { id: 6, title: 'Hooks 最佳实践', duration: '2小时', completed: false },
      { id: 7, title: '实战项目开发', duration: '4小时', completed: false }
    ],
    tags: ['React', 'Hooks', '前端框架', '状态管理']
  },
  {
    id: 5, 
    title: 'Node.js 后端开发实战', 
    type: '在线教程', 
    duration: '25小时', 
    progress: 30, 
    icon: Bookmark, 
    level: '中级', 
    category: '后端开发', 
    rating: 4.5, 
    reviews: 720,
    instructor: '陈老师',
    instructorTitle: 'Node.js 专家',
    description: '本教程从Node.js的基础概念开始，逐步深入到后端开发的各个方面，包括Express框架、数据库操作、API设计、认证授权等内容。通过实战项目，让你掌握Node.js后端开发的技巧和最佳实践。',
    modules: [
      { id: 1, title: 'Node.js 基础', duration: '3小时', completed: true },
      { id: 2, title: 'Express 框架', duration: '4小时', completed: true },
      { id: 3, title: '数据库操作', duration: '4小时', completed: false },
      { id: 4, title: 'API 设计与实现', duration: '4小时', completed: false },
      { id: 5, title: '认证与授权', duration: '3小时', completed: false },
      { id: 6, title: '性能优化', duration: '3小时', completed: false },
      { id: 7, title: '实战项目开发', duration: '4小时', completed: false }
    ],
    tags: ['Node.js', 'Express', '后端开发', 'API设计']
  },
  {
    id: 6, 
    title: '算法与数据结构', 
    type: '电子书', 
    duration: '400页', 
    progress: 10, 
    icon: FileText, 
    level: '高级', 
    category: '计算机基础', 
    rating: 4.8, 
    reviews: 1100,
    author: '赵老师',
    publisher: '计算机出版社',
    publishDate: '2023-08-20',
    description: '本书系统介绍了常见的算法和数据结构，包括数组、链表、栈、队列、树、图、排序算法、查找算法等内容。通过大量的实例和练习，让你掌握算法和数据结构的核心概念和应用技巧。',
    chapters: [
      { id: 1, title: '算法基础', pages: '1-50', completed: true },
      { id: 2, title: '数据结构基础', pages: '51-100', completed: false },
      { id: 3, title: '排序与查找算法', pages: '101-150', completed: false },
      { id: 4, title: '树与图算法', pages: '151-200', completed: false },
      { id: 5, title: '动态规划', pages: '201-250', completed: false },
      { id: 6, title: '贪心与回溯算法', pages: '251-300', completed: false },
      { id: 7, title: '算法实战', pages: '301-400', completed: false }
    ],
    tags: ['算法', '数据结构', '计算机基础', '编程']
  },
  {
    id: 7, 
    title: '前端性能优化实战', 
    type: '视频课程', 
    duration: '16小时', 
    progress: 25, 
    icon: PlayCircle, 
    level: '中级', 
    category: '前端框架', 
    rating: 4.7, 
    reviews: 850,
    instructor: '孙老师',
    instructorTitle: '前端性能优化专家',
    description: '本课程从前端性能优化的基础概念开始，逐步深入到各种优化策略，包括资源加载、渲染性能、网络优化、缓存策略等内容。通过实际项目案例，让你掌握前端性能优化的核心技巧。',
    modules: [
      { id: 1, title: '性能优化概述', duration: '1小时', completed: true },
      { id: 2, title: '资源加载优化', duration: '3小时', completed: true },
      { id: 3, title: '渲染性能优化', duration: '3小时', completed: false },
      { id: 4, title: '网络优化策略', duration: '2小时', completed: false },
      { id: 5, title: '缓存策略', duration: '2小时', completed: false },
      { id: 6, title: '性能监控与分析', duration: '2小时', completed: false },
      { id: 7, title: '实战优化案例', duration: '3小时', completed: false }
    ],
    tags: ['前端性能', '优化', '资源加载', '渲染性能']
  },
  {
    id: 8, 
    title: 'GraphQL 实战指南', 
    type: '在线教程', 
    duration: '14小时', 
    progress: 15, 
    icon: Bookmark, 
    level: '高级', 
    category: '后端开发', 
    rating: 4.6, 
    reviews: 620,
    instructor: '吴老师',
    instructorTitle: 'API 设计专家',
    description: '本教程从GraphQL的基础概念开始，逐步深入到GraphQL的各种特性和最佳实践，包括查询、变更、订阅、模式设计等内容。通过实际项目案例，让你掌握GraphQL的开发技巧。',
    modules: [
      { id: 1, title: 'GraphQL 基础', duration: '2小时', completed: true },
      { id: 2, title: '查询与变更', duration: '3小时', completed: false },
      { id: 3, title: '模式设计', duration: '2小时', completed: false },
      { id: 4, title: '解析器实现', duration: '2小时', completed: false },
      { id: 5, title: '订阅与实时数据', duration: '2小时', completed: false },
      { id: 6, title: 'GraphQL 与前端集成', duration: '2小时', completed: false },
      { id: 7, title: '实战项目开发', duration: '1小时', completed: false }
    ],
    tags: ['GraphQL', 'API', '后端开发', '数据查询']
  }
]

// 资源筛选状态
const selectedCategory = ref('all')
const selectedLevel = ref('all')
const selectedType = ref('all')
const searchQuery = ref('')
const isResourceLoading = ref(false)
const showAllResources = ref(false)

// 题库筛选状态
const showAllBanks = ref(false)

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
  showAllResources.value = !showAllResources.value
}

const toggleFavorite = (resourceId: number) => {
  // 模拟收藏功能
  alert(`已${Math.random() > 0.5 ? '收藏' : '取消收藏'}资源 ID: ${resourceId}`)
}

const viewResourceDetails = (resourceId: number) => {
  // 查找选中的资源
  const resource = learningResources.find(r => r.id === resourceId)
  if (resource) {
    selectedResource.value = resource
    showResourceDetailModal.value = true
  }
}

const continueLearning = (resourceId: number) => {
  // 查找选中的资源
  const resource = learningResources.find(r => r.id === resourceId)
  if (resource) {
    selectedResource.value = resource
    // 初始化课程模块
    if (resource.modules) {
      courseModules.value = [...resource.modules]
    } else if (resource.chapters) {
      courseModules.value = [...resource.chapters]
    }
    showContinueLearningModal.value = true
  }
}

const closeResourceModal = () => {
  showResourceDetailModal.value = false
  showContinueLearningModal.value = false
  selectedResource.value = null
  courseModules.value = []
  currentVideoTime.value = 0
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const completeModule = (moduleId: number) => {
  const module = courseModules.value.find(m => m.id === moduleId)
  if (module) {
    module.completed = !module.completed
    // 更新资源的整体进度
    if (selectedResource.value) {
      const totalModules = courseModules.value.length
      const completedModules = courseModules.value.filter(m => m.completed).length
      selectedResource.value.progress = Math.round((completedModules / totalModules) * 100)
      // 同时更新原始资源数据
      const originalResource = learningResources.find(r => r.id === selectedResource.value.id)
      if (originalResource) {
        originalResource.progress = selectedResource.value.progress
      }
    }
  }
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
const isReviewing = ref(false)
const reviewProgress = ref(0)

// 状态管理
const showSubSkills = ref<Record<string, boolean>>({})
const activeTab = ref('growth')

// 成长轨迹数据
const growthData = ref({
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  data: [20, 35, 45, 60, 70, 72]
})

// 能力雷达图数据
const radarData = ref({
  indicator: [
    { name: 'Vue3 核心原理', max: 100 },
    { name: '前端工程化架构', max: 100 },
    { name: 'TypeScript 深度实践', max: 100 },
    { name: 'React 生态系统', max: 100 },
    { name: 'Node.js 后端开发', max: 100 },
    { name: '算法与数据结构', max: 100 }
  ],
  data: [
    {
      value: [85, 45, 15, 60, 30, 10],
      name: '当前能力'
    }
  ]
})

// 数据分析和建议
const analysisData = ref({
  strengths: [
    'Vue3 核心原理掌握程度高，已达到 85%',
    'React 生态系统学习进展良好，达到 60%',
    '学习态度积极，持续保持进步'
  ],
  weaknesses: [
    'TypeScript 深度实践掌握度较低，仅 15%',
    '前端工程化架构需要加强，仅 45%',
    '算法与数据结构基础薄弱，仅 10%'
  ],
  suggestions: [
    '建议重点加强 TypeScript 高级特性学习，特别是类型系统和泛型',
    '深入学习前端工程化工具，如 Webpack、Vite 和 CI/CD',
    '系统学习算法与数据结构，提升编程基础',
    '建议每周至少投入 5 小时学习薄弱环节'
  ]
})

// 图表实例
const growthChartRef = ref<HTMLElement | null>(null)
const radarChartRef = ref<HTMLElement | null>(null)
const growthChart = ref<echarts.ECharts | null>(null)
const radarChart = ref<echarts.ECharts | null>(null)

// 初始化图表
const initCharts = () => {
  // 成长轨迹图表
  if (growthChartRef.value) {
    if (growthChart.value) {
      growthChart.value.dispose()
    }
    growthChart.value = echarts.init(growthChartRef.value)
    growthChart.value.setOption({
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c}%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: growthData.value.labels
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [{
        data: growthData.value.data,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          color: '#3b82f6',
          width: 3
        },
        itemStyle: {
          color: '#3b82f6'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.1)' }
          ])
        }
      }]
    })
  }
  
  // 能力雷达图
  if (radarChartRef.value) {
    if (radarChart.value) {
      radarChart.value.dispose()
    }
    radarChart.value = echarts.init(radarChartRef.value)
    radarChart.value.setOption({
      tooltip: {},
      radar: {
        indicator: radarData.value.indicator,
        radius: '70%'
      },
      series: [{
        type: 'radar',
        data: [{
          value: radarData.value.data[0]?.value || [],
          name: radarData.value.data[0]?.name || '当前能力',
          areaStyle: {
            color: 'rgba(59, 130, 246, 0.3)'
          },
          lineStyle: {
            color: '#3b82f6'
          },
          itemStyle: {
            color: '#3b82f6'
          }
        }]
      }]
    })
  }
}

// 监听窗口大小变化
const handleResize = () => {
  growthChart.value?.resize()
  radarChart.value?.resize()
}

// 生命周期
onMounted(() => {
  nextTick(() => {
    initCharts()
  })
  window.addEventListener('resize', handleResize)
})

watch(activeTab, (newTab) => {
  if (newTab === 'growth') {
    nextTick(() => {
      initCharts()
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  growthChart.value?.dispose()
  radarChart.value?.dispose()
  growthChart.value = null
  radarChart.value = null
})
// 岗位专属题库数据
const jobQuestionBanks = [
  {
    id: 1,
    title: 'Java 核心面试题',
    questionCount: 1200,
    category: '后端开发',
    difficulty: '高级',
    description: '覆盖Java核心概念、多线程、JVM等高频面试题，包含大量实战案例和详细解析',
    progress: 30,
    lastUpdated: '2024-03-15',
    tags: ['Java', '后端', '面试', '多线程', 'JVM'],
    questions: [
      {
        id: 1,
        question: 'Java中线程安全的集合有哪些？',
        options: ['A. ArrayList', 'B. HashMap', 'C. ConcurrentHashMap', 'D. HashSet'],
        correctAnswer: 'C',
        explanation: 'ConcurrentHashMap是线程安全的，而ArrayList、HashMap和HashSet都不是线程安全的。ConcurrentHashMap通过分段锁机制提高了并发性能。',
        difficulty: '中级',
        tags: ['多线程', '集合']
      },
      {
        id: 2,
        question: 'JVM内存结构包括哪些部分？',
        options: ['A. 堆、栈、方法区', 'B. 堆、栈、程序计数器', 'C. 堆、栈、方法区、程序计数器', 'D. 堆、栈、方法区、程序计数器、本地方法栈'],
        correctAnswer: 'D',
        explanation: 'JVM内存结构包括堆、栈、方法区、程序计数器和本地方法栈。其中堆是最大的内存区域，用于存储对象实例。',
        difficulty: '高级',
        tags: ['JVM', '内存管理']
      },
      {
        id: 3,
        question: 'Java中的垃圾回收机制是什么？',
        options: ['A. 手动回收', 'B. 自动回收', 'C. 混合回收', 'D. 不需要回收'],
        correctAnswer: 'B',
        explanation: 'Java使用自动垃圾回收机制，通过垃圾回收器自动回收不再使用的对象内存，减少内存泄漏的可能性。',
        difficulty: '高级',
        tags: ['JVM', '垃圾回收']
      }
    ]
  },
  {
    id: 2,
    title: 'Go 并发编程专场',
    questionCount: 800,
    category: '后端开发',
    difficulty: '中级',
    description: '专注于Go语言并发特性和最佳实践，包含大量实战案例和性能优化技巧',
    progress: 15,
    lastUpdated: '2024-03-10',
    tags: ['Go', '并发', '后端', 'goroutine', 'channel'],
    questions: [
      {
        id: 1,
        question: 'Go语言中goroutine的特点是什么？',
        options: ['A. 轻量级线程', 'B. 重量级线程', 'C. 只能在主线程中创建', 'D. 不能与其他goroutine通信'],
        correctAnswer: 'A',
        explanation: 'Goroutine是Go语言中的轻量级线程，由Go运行时管理，比系统线程更轻量，启动速度更快，内存占用更小。',
        difficulty: '中级',
        tags: ['goroutine', '并发']
      },
      {
        id: 2,
        question: 'Go语言中channel的作用是什么？',
        options: ['A. 存储数据', 'B. 实现goroutine之间的通信', 'C. 同步goroutine的执行', 'D. B和C'],
        correctAnswer: 'D',
        explanation: 'Channel在Go语言中用于goroutine之间的通信和同步，是Go语言实现并发的核心机制。',
        difficulty: '中级',
        tags: ['channel', '并发']
      },
      {
        id: 3,
        question: 'Go语言中的互斥锁和读写锁有什么区别？',
        options: ['A. 互斥锁只允许一个goroutine访问，读写锁允许多个读操作同时进行', 'B. 互斥锁允许多个goroutine访问，读写锁只允许一个goroutine访问', 'C. 互斥锁用于读操作，读写锁用于写操作', 'D. 没有区别'],
        correctAnswer: 'A',
        explanation: '互斥锁（Mutex）只允许一个goroutine访问共享资源，而读写锁（RWMutex）允许多个读操作同时进行，但写操作需要独占访问。',
        difficulty: '高级',
        tags: ['并发', '锁']
      }
    ]
  },
  {
    id: 3,
    title: 'Vue3 源码深度解析',
    questionCount: 450,
    category: '前端开发',
    difficulty: '高级',
    description: '深入Vue3内部实现原理和核心概念，包含响应式系统、编译原理等核心技术',
    progress: 45,
    lastUpdated: '2024-03-20',
    tags: ['Vue3', '前端', '源码', '响应式', 'Composition API'],
    questions: [
      {
        id: 1,
        question: 'Vue3的响应式系统基于什么实现？',
        options: ['A. Object.defineProperty', 'B. Proxy', 'C. Reflect', 'D. Symbol'],
        correctAnswer: 'B',
        explanation: 'Vue3的响应式系统基于ES6的Proxy实现，相比Vue2的Object.defineProperty，Proxy可以监听更多的操作，如属性的添加和删除。',
        difficulty: '高级',
        tags: ['响应式', 'Proxy']
      },
      {
        id: 2,
        question: 'Composition API的优势是什么？',
        options: ['A. 更好的代码组织', 'B. 更好的类型推断', 'C. 更好的逻辑复用', 'D. 以上都是'],
        correctAnswer: 'D',
        explanation: 'Composition API提供了更好的代码组织、更好的类型推断和更好的逻辑复用，使代码更加模块化和可维护。',
        difficulty: '中级',
        tags: ['Composition API']
      },
      {
        id: 3,
        question: 'Vue3的虚拟DOM与Vue2有什么区别？',
        options: ['A. 没有区别', 'B. Vue3的虚拟DOM使用了Fragment和Teleport', 'C. Vue3的虚拟DOM性能更差', 'D. Vue3的虚拟DOM不支持diff算法'],
        correctAnswer: 'B',
        explanation: 'Vue3的虚拟DOM引入了Fragment（片段）和Teleport（ teleport）等新特性，同时对diff算法进行了优化，提高了渲染性能。',
        difficulty: '高级',
        tags: ['虚拟DOM', '渲染']
      }
    ]
  },
  {
    id: 4,
    title: 'MySQL 性能优化',
    questionCount: 600,
    category: '数据库',
    difficulty: '中级',
    description: 'MySQL查询优化、索引设计和性能调优，包含大量实战案例和最佳实践',
    progress: 25,
    lastUpdated: '2024-03-05',
    tags: ['MySQL', '数据库', '性能优化', '索引', 'SQL'],
    questions: [
      {
        id: 1,
        question: 'MySQL中索引的作用是什么？',
        options: ['A. 提高查询速度', 'B. 提高插入速度', 'C. 降低存储开销', 'D. 以上都是'],
        correctAnswer: 'A',
        explanation: '索引的主要作用是提高查询速度，但会增加存储开销和降低插入、更新、删除操作的速度。',
        difficulty: '中级',
        tags: ['索引', '性能优化']
      },
      {
        id: 2,
        question: '以下哪种SQL语句会导致全表扫描？',
        options: ['A. SELECT * FROM users WHERE id = 1', 'B. SELECT * FROM users WHERE name LIKE %test%', 'C. SELECT * FROM users WHERE age > 18', 'D. SELECT * FROM users ORDER BY id'],
        correctAnswer: 'B',
        explanation: 'LIKE %test%会导致全表扫描，因为索引无法被有效利用。而其他选项在有适当索引的情况下可以使用索引。',
        difficulty: '中级',
        tags: ['SQL', '性能优化']
      },
      {
        id: 3,
        question: 'MySQL的事务隔离级别有哪些？',
        options: ['A. 读未提交', 'B. 读已提交', 'C. 可重复读', 'D. 以上都是'],
        correctAnswer: 'D',
        explanation: 'MySQL的事务隔离级别包括读未提交（READ UNCOMMITTED）、读已提交（READ COMMITTED）、可重复读（REPEATABLE READ）和串行化（SERIALIZABLE）。',
        difficulty: '高级',
        tags: ['事务', '隔离级别']
      }
    ]
  },
  {
    id: 5,
    title: 'React Hooks 实战',
    questionCount: 550,
    category: '前端开发',
    difficulty: '中级',
    description: 'React Hooks的使用技巧和最佳实践，包含大量实战案例和性能优化方法',
    progress: 20,
    lastUpdated: '2024-03-18',
    tags: ['React', '前端', 'Hooks', 'useState', 'useEffect'],
    questions: [
      {
        id: 1,
        question: 'useState Hook的作用是什么？',
        options: ['A. 管理组件状态', 'B. 执行副作用操作', 'C. 缓存计算结果', 'D. 引用DOM元素'],
        correctAnswer: 'A',
        explanation: 'useState Hook用于在函数组件中管理状态，返回一个状态变量和一个更新状态的函数。',
        difficulty: '初级',
        tags: ['useState', 'Hooks']
      },
      {
        id: 2,
        question: 'useEffect Hook的依赖数组有什么作用？',
        options: ['A. 控制副作用的执行时机', 'B. 提高组件性能', 'C. 避免无限循环', 'D. 以上都是'],
        correctAnswer: 'D',
        explanation: '依赖数组控制副作用的执行时机，只有当依赖项发生变化时才会重新执行副作用，这样可以提高性能并避免无限循环。',
        difficulty: '中级',
        tags: ['useEffect', 'Hooks']
      },
      {
        id: 3,
        question: 'useMemo和useCallback的区别是什么？',
        options: ['A. useMemo用于缓存计算结果，useCallback用于缓存函数', 'B. useMemo用于缓存函数，useCallback用于缓存计算结果', 'C. 没有区别', 'D. useMemo用于类组件，useCallback用于函数组件'],
        correctAnswer: 'A',
        explanation: 'useMemo用于缓存计算结果，useCallback用于缓存函数，两者都是为了优化性能，避免不必要的重新计算和函数创建。',
        difficulty: '高级',
        tags: ['useMemo', 'useCallback', 'Hooks']
      }
    ]
  },
  {
    id: 6,
    title: '算法与数据结构',
    questionCount: 1000,
    category: '基础',
    difficulty: '高级',
    description: '常见算法题和数据结构实现，包含大量经典问题和解题思路',
    progress: 10,
    lastUpdated: '2024-03-12',
    tags: ['算法', '数据结构', '基础', '排序', '搜索'],
    questions: [
      {
        id: 1,
        question: '二叉树的前序遍历顺序是什么？',
        options: ['A. 左-根-右', 'B. 根-左-右', 'C. 左-右-根', 'D. 根-右-左'],
        correctAnswer: 'B',
        explanation: '二叉树的前序遍历顺序是根-左-右，中序遍历是左-根-右，后序遍历是左-右-根。',
        difficulty: '中级',
        tags: ['二叉树', '遍历']
      },
      {
        id: 2,
        question: '快速排序的时间复杂度是多少？',
        options: ['A. O(n)', 'B. O(n log n)', 'C. O(n^2)', 'D. O(log n)'],
        correctAnswer: 'B',
        explanation: '快速排序的平均时间复杂度是O(n log n)，最坏情况是O(n^2)，但通过随机选择 pivot 可以减少最坏情况的发生。',
        difficulty: '高级',
        tags: ['排序', '时间复杂度']
      },
      {
        id: 3,
        question: '什么是二分查找？',
        options: ['A. 一种线性查找算法', 'B. 一种对数时间复杂度的查找算法', 'C. 一种只能用于无序数组的查找算法', 'D. 一种空间复杂度为O(n)的查找算法'],
        correctAnswer: 'B',
        explanation: '二分查找是一种对数时间复杂度（O(log n)）的查找算法，只能用于有序数组，通过每次将查找范围减半来快速定位目标元素。',
        difficulty: '中级',
        tags: ['搜索', '二分查找']
      }
    ]
  },
  {
    id: 7,
    title: '前端工程化实践',
    questionCount: 400,
    category: '前端开发',
    difficulty: '中级',
    description: '前端工程化工具和最佳实践，包含Webpack、Vite、CI/CD等核心技术',
    progress: 35,
    lastUpdated: '2024-03-16',
    tags: ['前端', '工程化', 'Webpack', 'Vite', 'CI/CD'],
    questions: [
      {
        id: 1,
        question: 'Webpack的作用是什么？',
        options: ['A. 代码打包工具', 'B. 代码压缩工具', 'C. 代码转译工具', 'D. 以上都是'],
        correctAnswer: 'D',
        explanation: 'Webpack是一个模块打包器，可以将多个模块打包成一个或多个bundle，同时支持代码压缩、转译等功能。',
        difficulty: '中级',
        tags: ['Webpack', '工程化']
      },
      {
        id: 2,
        question: 'Vite与Webpack的区别是什么？',
        options: ['A. Vite使用ES模块，Webpack使用CommonJS', 'B. Vite开发环境更快，Webpack生产环境更稳定', 'C. Vite只支持Vue，Webpack支持多种框架', 'D. 没有区别'],
        correctAnswer: 'B',
        explanation: 'Vite在开发环境中使用原生ES模块，启动速度更快；Webpack在生产环境中经过长期优化，更加稳定可靠。',
        difficulty: '中级',
        tags: ['Vite', 'Webpack', '工程化']
      }
    ]
  },
  {
    id: 8,
    title: 'Node.js 后端开发',
    questionCount: 700,
    category: '后端开发',
    difficulty: '中级',
    description: 'Node.js后端开发技术和最佳实践，包含Express、MongoDB等核心技术',
    progress: 20,
    lastUpdated: '2024-03-14',
    tags: ['Node.js', '后端', 'Express', 'MongoDB', 'API'],
    questions: [
      {
        id: 1,
        question: 'Node.js的特点是什么？',
        options: ['A. 单线程', 'B. 非阻塞I/O', 'C. 事件驱动', 'D. 以上都是'],
        correctAnswer: 'D',
        explanation: 'Node.js具有单线程、非阻塞I/O和事件驱动的特点，使其适合处理高并发请求。',
        difficulty: '中级',
        tags: ['Node.js', '后端']
      },
      {
        id: 2,
        question: 'Express框架的作用是什么？',
        options: ['A. 构建Web应用', 'B. 构建API', 'C. 中间件处理', 'D. 以上都是'],
        correctAnswer: 'D',
        explanation: 'Express是一个基于Node.js的Web应用框架，可以用于构建Web应用、API，以及处理中间件等。',
        difficulty: '中级',
        tags: ['Express', 'Node.js', '后端']
      }
    ]
  }
]

// 题库筛选状态
const selectedBankCategory = ref('all')
const selectedBankDifficulty = ref('all')
const bankSearchQuery = ref('')

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
  
  // 按搜索关键词筛选
  if (bankSearchQuery.value) {
    const query = bankSearchQuery.value.toLowerCase()
    result = result.filter(bank => 
      bank.title.toLowerCase().includes(query) ||
      bank.description.toLowerCase().includes(query) ||
      bank.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  return result
})

// 方法
const viewQuestionBank = (bank: any) => {
  selectedQuestionBank.value = bank
  showQuestionBankDetailModal.value = true
}

const startPractice = (bank: any) => {
  selectedQuestionBank.value = bank
  practiceQuestions.value = bank.questions
  currentQuestionIndex.value = 0
  selectedAnswer.value = ''
  isAnswerCorrect.value = null
  answeredQuestions.value = new Array(bank.questions.length).fill(null)
  practiceCompleted.value = false
  totalQuestions.value = bank.questions.length
  correctAnswers.value = 0
  finalAccuracy.value = 0
  showQuestionPracticeModal.value = true
}

const addToFavorites = (bankId: number) => {
  const index = favoriteBanks.value.indexOf(bankId)
  if (index === -1) {
    favoriteBanks.value.push(bankId)
    // 保存到localStorage
    localStorage.setItem('favoriteBanks', JSON.stringify(favoriteBanks.value))
    // 视觉反馈
    showToast('已添加到收藏')
  } else {
    favoriteBanks.value.splice(index, 1)
    // 保存到localStorage
    localStorage.setItem('favoriteBanks', JSON.stringify(favoriteBanks.value))
    // 视觉反馈
    showToast('已取消收藏')
  }
}

// 关闭模态框
const closeQuestionBankDetailModal = () => {
  showQuestionBankDetailModal.value = false
  selectedQuestionBank.value = null
}

const closeQuestionPracticeModal = () => {
  showQuestionPracticeModal.value = false
  // 不要将selectedQuestionBank设为null，保留它以便返回详情页面时使用
  practiceQuestions.value = []
  currentQuestionIndex.value = 0
  selectedAnswer.value = ''
  isAnswerCorrect.value = null
  answeredQuestions.value = []
  practiceCompleted.value = false
  totalQuestions.value = 0
  correctAnswers.value = 0
  finalAccuracy.value = 0
}

// 练习相关方法
const submitAnswer = () => {
  const currentQuestion = practiceQuestions.value[currentQuestionIndex.value]
  if (selectedAnswer.value) {
    isAnswerCorrect.value = selectedAnswer.value === currentQuestion.correctAnswer
    answeredQuestions.value[currentQuestionIndex.value] = isAnswerCorrect.value
  }
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < practiceQuestions.value.length - 1) {
    currentQuestionIndex.value++
    selectedAnswer.value = ''
    isAnswerCorrect.value = null
  } else if (isAnswerCorrect.value !== null) {
    // 完成练习
    completePractice()
  }
}

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    selectedAnswer.value = ''
    isAnswerCorrect.value = null
  }
}

const jumpToQuestion = (index: number) => {
  if (index < practiceQuestions.value.length) {
    currentQuestionIndex.value = index
    selectedAnswer.value = ''
    isAnswerCorrect.value = null
  }
}

const calculateAccuracy = (): number => {
  const answered = answeredQuestions.value.filter(val => val !== null).length
  if (answered === 0) return 0
  const correct = answeredQuestions.value.filter(val => val === true).length
  return Math.round((correct / answered) * 100)
}

const completePractice = () => {
  practiceQuestions.value = []
  practiceCompleted.value = true
  correctAnswers.value = answeredQuestions.value.filter(val => val === true).length
  finalAccuracy.value = Math.round((correctAnswers.value / totalQuestions.value) * 100)
  // 更新题库进度
  if (selectedQuestionBank.value) {
    selectedQuestionBank.value.progress = Math.min(100, Math.round((correctAnswers.value / totalQuestions.value) * 100))
  }
}

const restartPractice = () => {
  if (selectedQuestionBank.value) {
    startPractice(selectedQuestionBank.value)
  }
}

const isBankFavorite = (bankId: number) => {
  return favoriteBanks.value.includes(bankId)
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
  showWrongQuestionModal.value = true
}

const practiceWrongQuestion = (question: WrongQuestion) => {
  // 模拟重新练习功能
  alert(`开始重新练习题目: ${question.question.substring(0, 20)}...`)
  // 这里可以跳转到练习页面或打开练习模态框
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
  showLearningPlanDetailModal.value = true
}

const continueLearningPlan = (plan: LearningPlan) => {
  // 模拟继续学习功能
  alert(`继续学习计划: ${plan.title}`)
  // 这里可以跳转到学习页面或打开学习模态框
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

// 提示消息
const showToast = (message: string) => {
  const toast = document.createElement('div')
  toast.className = 'fixed top-4 right-4 bg-neutral-title text-white px-4 py-2 rounded-xl shadow-lg z-50 animate-fadeIn'
  toast.textContent = message
  document.body.appendChild(toast)
  setTimeout(() => {
    toast.classList.add('animate-fadeOut')
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, 2000)
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
            <component :is="stat.icon" :size="24" :class="stat.color" />
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

    <!-- Main Content Tabs -->
    <div class="bg-white rounded-[32px] shadow-sm border border-neutral-border overflow-hidden">
      <!-- Tab Navigation -->
      <div class="flex border-b border-neutral-border">
        <button 
          @click="activeTab = 'growth'" 
          class="flex-1 py-4 px-6 font-bold transition-all" 
          :class="activeTab === 'growth' ? 'text-primary border-b-2 border-primary' : 'text-neutral-helper hover:text-neutral-title'"
        >
          成长轨迹
        </button>
        <button 
          @click="activeTab = 'resources'" 
          class="flex-1 py-4 px-6 font-bold transition-all" 
          :class="activeTab === 'resources' ? 'text-primary border-b-2 border-primary' : 'text-neutral-helper hover:text-neutral-title'"
        >
          学习资源
        </button>
        <button 
          @click="activeTab = 'engine'" 
          class="flex-1 py-4 px-6 font-bold transition-all" 
          :class="activeTab === 'engine' ? 'text-primary border-b-2 border-primary' : 'text-neutral-helper hover:text-neutral-title'"
        >
          强化引擎
        </button>
      </div>

      <!-- Tab Content -->
      <div class="p-8">
        <!-- Growth Tab -->
        <div v-if="activeTab === 'growth'" class="space-y-8">
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
          
          <!-- 成长轨迹图表 -->
          <div class="mb-8">
            <h3 class="text-sm font-bold text-neutral-title mb-4">能力成长趋势</h3>
            <div ref="growthChartRef" class="w-full h-64"></div>
          </div>
          
          <!-- 能力雷达图 -->
          <div class="mb-8">
            <h3 class="text-sm font-bold text-neutral-title mb-4">能力分布雷达图</h3>
            <div ref="radarChartRef" class="w-full h-64"></div>
          </div>
          
          <!-- 数据分析和建议 -->
          <div class="mb-8">
            <h3 class="text-sm font-bold text-neutral-title mb-4">数据分析与建议</h3>
            
            <!-- 优势分析 -->
            <div class="mb-4">
              <h4 class="text-xs font-bold text-auxiliary-green mb-2 flex items-center gap-2">
                <CheckCircle2 :size="14" />
                优势分析
              </h4>
              <ul class="space-y-2 pl-6">
                <li v-for="(strength, index) in analysisData.strengths" :key="index" class="text-xs text-neutral-body list-disc">
                  {{ strength }}
                </li>
              </ul>
            </div>
            
            <!-- 薄弱环节 -->
            <div class="mb-4">
              <h4 class="text-xs font-bold text-auxiliary-orange mb-2 flex items-center gap-2">
                <Target :size="14" />
                薄弱环节
              </h4>
              <ul class="space-y-2 pl-6">
                <li v-for="(weakness, index) in analysisData.weaknesses" :key="index" class="text-xs text-neutral-body list-disc">
                  {{ weakness }}
                </li>
              </ul>
            </div>
            
            <!-- 学习建议 -->
            <div class="mb-4">
              <h4 class="text-xs font-bold text-primary mb-2 flex items-center gap-2">
                <Zap :size="14" />
                学习建议
              </h4>
              <ul class="space-y-2 pl-6">
                <li v-for="(suggestion, index) in analysisData.suggestions" :key="index" class="text-xs text-neutral-body list-disc">
                  {{ suggestion }}
                </li>
              </ul>
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
        </div>

        <!-- Resources Tab -->
        <div v-if="activeTab === 'resources'" class="space-y-8">
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
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="resource in (showAllResources ? filteredResources : filteredResources.slice(0, 4))" :key="resource.id" class="p-6 bg-neutral-bg rounded-[24px] hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-neutral-border group cursor-pointer">
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
                  <span class="text-[10px] px-2 py-1 bg-primary/10 text-primary rounded-full">{{ resource.type }}</span>
                  <span class="text-[10px] px-2 py-1 bg-neutral-border rounded-full">{{ resource.level }}</span>
                  <span class="text-[10px] px-2 py-1 bg-neutral-border rounded-full">{{ resource.category }}</span>
                </div>
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-[10px] text-neutral-helper">{{ resource.duration }}</span>
                  <div class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star text-auxiliary-orange"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <span class="text-[10px] font-bold text-neutral-title">{{ resource.rating }}</span>
                    <span class="text-[10px] text-neutral-helper">({{ resource.reviews }})</span>
                  </div>
                </div>
              </div>
              
              <!-- 学习进度 -->
              <div class="mb-4">
                <div class="flex justify-between text-[10px] text-neutral-helper mb-1">
                  <span>学习进度</span>
                  <span>{{ resource.progress }}%</span>
                </div>
                <div class="h-2 bg-neutral-border rounded-full overflow-hidden">
                  <div class="h-full bg-primary transition-all duration-1000 ease-out" :style="{width: resource.progress + '%'}"></div>
                </div>
              </div>
              
              <!-- 操作按钮 -->
              <div class="flex gap-3">
                <button @click="viewResourceDetails(resource.id)" class="flex-1 px-4 py-2 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all text-[10px]">查看详情</button>
                <button @click="continueLearning(resource.id)" class="flex-1 px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-[10px]">继续学习</button>
              </div>
            </div>
          </div>
          
          <!-- 加载更多 -->
          <div class="mt-8 flex justify-center">
            <button 
              @click="loadMoreResources" 
              :disabled="isResourceLoading"
              class="px-6 py-3 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all text-[10px] flex items-center gap-2"
            >
              <Plus :size="16" />
              {{ showAllResources ? '收起' : '加载更多资源' }}
            </button>
          </div>
        </div>

        <!-- 学习目标 -->
        <div class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border">
          <h2 class="text-xl font-bold text-neutral-title mb-6 flex items-center gap-3">
            <Target :size="24" class="text-primary" />
            学习目标
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div class="p-4 bg-neutral-bg rounded-[20px]">
              <div class="flex items-center gap-2 mb-2">
                <Clock :size="16" class="text-auxiliary-orange" />
                <h3 class="text-sm font-bold text-neutral-title">学习 Node.js 后端开发</h3>
              </div>
              <p class="text-xs text-neutral-body">已完成 5%，预计 15 天内完成</p>
            </div>
          </div>
        </div>

        <!-- 岗位专属题库 -->
        <div class="bg-white rounded-[32px] p-6 shadow-sm border border-neutral-border flex flex-col">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-2xl gradient-cyan-yellow flex items-center justify-center text-primary shadow-md">
              <BookOpen :size="20" />
            </div>
            <h2 class="text-lg font-bold text-neutral-title">岗位专属题库</h2>
          </div>
          
          <!-- 搜索和筛选 -->
          <div class="space-y-4 mb-6">
            <!-- 搜索框 -->
            <div class="relative">
              <input 
                v-model="bankSearchQuery"
                type="text" 
                placeholder="搜索题库..." 
                class="w-full px-4 py-2 pl-10 bg-neutral-bg rounded-2xl border border-neutral-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm font-bold"
              >
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-helper">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
              </div>
            </div>
            
            <!-- 筛选选项 -->
            <div class="flex flex-wrap items-center gap-3">
              <div class="flex items-center gap-2 flex-1 min-w-[140px]">
                <span class="text-xs font-bold text-neutral-title">分类:</span>
                <select v-model="selectedBankCategory" class="bg-neutral-bg border border-neutral-border rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 flex-1">
                  <option value="all">全部分类</option>
                  <option value="前端开发">前端开发</option>
                  <option value="后端开发">后端开发</option>
                  <option value="数据库">数据库</option>
                  <option value="基础">基础</option>
                </select>
              </div>
              <div class="flex items-center gap-2 flex-1 min-w-[140px]">
                <span class="text-xs font-bold text-neutral-title">难度:</span>
                <select v-model="selectedBankDifficulty" class="bg-neutral-bg border border-neutral-border rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 flex-1">
                  <option value="all">全部难度</option>
                  <option value="初级">初级</option>
                  <option value="中级">中级</option>
                  <option value="高级">高级</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            <div v-for="bank in (showAllBanks ? filteredQuestionBanks : filteredQuestionBanks.slice(0, 4))" :key="bank.id" @click="viewQuestionBank(bank)" class="p-5 bg-neutral-bg rounded-[24px] group hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-neutral-border cursor-pointer">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <h4 class="text-sm font-bold text-neutral-title group-hover:text-primary transition-colors">{{ bank.title }}</h4>
                  <button @click.stop="addToFavorites(bank.id)" class="p-1.5 rounded-full hover:bg-white/50 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="isBankFavorite(bank.id) ? 'lucide lucide-heart-fill text-auxiliary-orange' : 'lucide lucide-heart text-auxiliary-orange'"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  </button>
                </div>
                <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{{ bank.questionCount }}+ 题</span>
              </div>
              <p class="text-[10px] text-neutral-helper mb-3 line-clamp-2">{{ bank.description }}</p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{{ bank.category }}</span>
                <span class="text-xs px-2 py-1 bg-neutral-border rounded-full">{{ bank.difficulty }}</span>
                <span v-for="tag in bank.tags.slice(0, 2)" :key="tag" class="text-xs px-2 py-1 bg-neutral-border rounded-full">{{ tag }}</span>
              </div>
              <div class="flex flex-col gap-3">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] text-neutral-helper w-20">学习进度</span>
                  <div class="h-1.5 flex-1 bg-white rounded-full overflow-hidden">
                    <div class="h-full bg-primary transition-all duration-1000 ease-out" :style="{width: bank.progress + '%'}"></div>
                  </div>
                  <span class="text-[10px] font-bold text-primary ml-2"> {{ bank.progress }}%</span>
                </div>
                <div class="flex gap-3 w-full">
                  <button @click.stop="startPractice(bank)" class="flex-1 px-4 py-1.5 text-[10px] font-bold bg-primary text-white rounded-lg hover:bg-primary-dark transition-all shadow-sm">
                    开始练习
                  </button>
                  <button @click="viewQuestionBank(bank)" class="flex-1 px-4 py-1.5 text-[10px] font-bold bg-white text-primary rounded-lg hover:bg-primary/10 transition-all shadow-sm border border-primary/20">
                    查看详情
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 p-5 bg-primary/5 rounded-[24px] border border-primary/20 flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center text-white shadow-md">
              <PlayCircle :size="24" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-bold text-primary">个性化推荐</p>
              <p class="text-[10px] text-neutral-body leading-tight">基于您的匹配度推荐专属题库</p>
            </div>
          </div>

          <button @click="showAllBanks = !showAllBanks" class="mt-4 w-full py-3 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all text-[10px] flex items-center justify-center gap-2">
            <Plus :size="14" />
            {{ showAllBanks ? '收起' : '查看更多题库' }}
          </button>
        </div>
        </div>

        <!-- Engine Tab -->
        <div v-if="activeTab === 'engine'" class="space-y-8">
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
                  <button @click="practiceWrongQuestion(question)" class="px-4 py-3 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all text-sm">
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
                  <button v-else @click="continueLearningPlan(plan)" class="px-4 py-3 bg-auxiliary-green text-white font-bold rounded-xl hover:bg-auxiliary-green/80 transition-all text-sm">
                    继续学习
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
    
    <!-- 资源详情模态框 -->
    <div v-if="showResourceDetailModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        <div class="p-8 border-b border-neutral-border">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-black text-neutral-title flex items-center gap-3">
              <component :is="selectedResource?.icon" :size="28" class="text-primary" />
              {{ selectedResource?.title }}
            </h2>
            <button @click="closeResourceModal" class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>
        <div class="p-8">
          <div class="space-y-6">
            <!-- 资源基本信息 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="p-6 bg-primary/10 rounded-2xl border border-primary/20">
                <h3 class="text-sm font-bold text-primary mb-3">资源信息</h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-neutral-helper">类型</span>
                    <span class="text-xs font-bold text-neutral-title">{{ selectedResource?.type }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-neutral-helper">难度</span>
                    <span class="text-xs font-bold text-neutral-title">{{ selectedResource?.level }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-neutral-helper">分类</span>
                    <span class="text-xs font-bold text-neutral-title">{{ selectedResource?.category }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-neutral-helper">时长</span>
                    <span class="text-xs font-bold text-neutral-title">{{ selectedResource?.duration }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-neutral-helper">评分</span>
                    <div class="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star text-auxiliary-orange"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      <span class="text-xs font-bold text-neutral-title">{{ selectedResource?.rating }}</span>
                      <span class="text-xs text-neutral-helper">({{ selectedResource?.reviews }})</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border">
                <h3 class="text-sm font-bold text-neutral-title mb-3">学习进度</h3>
                <div class="space-y-4">
                  <div class="flex justify-between text-sm mb-1">
                    <span class="font-bold text-neutral-title">总体进度</span>
                    <span class="text-primary font-bold">{{ selectedResource?.progress }}%</span>
                  </div>
                  <div class="h-2 bg-neutral-border rounded-full overflow-hidden">
                    <div class="h-full bg-primary transition-all" :style="{ width: selectedResource?.progress + '%' }"></div>
                  </div>
                  <div class="flex justify-between text-xs text-neutral-helper">
                    <span>开始学习</span>
                    <span>{{ selectedResource?.type === '视频课程' ? '预计剩余 3 小时' : '预计剩余 60 页' }}</span>
                  </div>
                </div>
              </div>
              
              <div class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border">
                <h3 class="text-sm font-bold text-neutral-title mb-3">讲师/作者</h3>
                <div class="space-y-3">
                  <div v-if="selectedResource?.instructor" class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {{ selectedResource.instructor.charAt(0) }}
                    </div>
                    <div>
                      <div class="text-sm font-bold text-neutral-title">{{ selectedResource.instructor }}</div>
                      <div class="text-xs text-neutral-helper">{{ selectedResource.instructorTitle }}</div>
                    </div>
                  </div>
                  <div v-else-if="selectedResource?.author" class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {{ selectedResource.author.charAt(0) }}
                    </div>
                    <div>
                      <div class="text-sm font-bold text-neutral-title">{{ selectedResource.author }}</div>
                      <div class="text-xs text-neutral-helper">{{ selectedResource.publisher }}</div>
                    </div>
                  </div>
                  <div v-if="selectedResource?.publishDate" class="text-xs text-neutral-helper">
                    出版日期: {{ selectedResource.publishDate }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 资源描述 -->
            <div class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border">
              <h3 class="font-bold text-neutral-title mb-4">课程简介</h3>
              <p class="text-sm text-neutral-body">{{ selectedResource?.description }}</p>
            </div>
            
            <!-- 课程模块/章节 -->
            <div class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border">
              <h3 class="font-bold text-neutral-title mb-4">{{ selectedResource?.type === '电子书' ? '章节列表' : '课程模块' }}</h3>
              <div class="space-y-3">
                <div 
                  v-for="(item, index) in selectedResource?.modules || selectedResource?.chapters" 
                  :key="item.id"
                  class="p-4 bg-white rounded-xl border border-neutral-border hover:border-primary/50 transition-all"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {{ Number(index) + 1 }}
                      </div>
                      <div>
                        <h4 class="text-sm font-bold text-neutral-title">{{ item.title }}</h4>
                        <p class="text-xs text-neutral-helper">
                          {{ selectedResource?.type === '电子书' ? item.pages : item.duration }}
                          {{ item.completed ? ' - 已完成' : ' - 未完成' }}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <div v-if="item.completed" class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <CheckCircle2 :size="14" />
                      </div>
                      <button class="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition-all">
                        查看
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 标签 -->
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tag in selectedResource?.tags" 
                :key="tag"
                class="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full"
              >
                {{ tag }}
              </span>
            </div>
            
            <!-- 操作按钮 -->
            <div class="mt-8 flex flex-col sm:flex-row gap-4">
              <button @click="continueLearning(selectedResource?.id)" class="flex-1 py-4 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2">
                继续学习
                <ChevronRight :size="20" />
              </button>
              <button @click="closeResourceModal" class="flex-1 py-4 bg-white text-primary font-bold rounded-2xl shadow-sm hover:bg-primary/10 transition-all text-[10px] border border-primary/20">
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 继续学习模态框 -->
    <div v-if="showContinueLearningModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        <div class="p-8 border-b border-neutral-border">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-black text-neutral-title flex items-center gap-3">
              <PlayCircle :size="28" class="text-primary" />
              继续学习: {{ selectedResource?.title }}
            </h2>
            <button @click="closeResourceModal" class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>
        <div class="p-8">
          <div class="space-y-6">
            <!-- 视频播放器/阅读界面 -->
            <div class="p-6 bg-neutral-title rounded-2xl text-white relative overflow-hidden">
              <div class="aspect-video bg-black/30 rounded-xl flex items-center justify-center">
                <div class="text-center">
                  <PlayCircle :size="64" class="mx-auto mb-4 text-primary" />
                  <p class="text-lg font-bold">开始学习</p>
                  <p class="text-sm text-white/80">点击播放按钮开始学习课程内容</p>
                </div>
              </div>
              <!-- 视频控制条 -->
              <div class="mt-4 space-y-2">
                <div class="flex justify-between text-xs">
                  <span>{{ formatTime(currentVideoTime) }}</span>
                  <span>03:45:00</span>
                </div>
                <div class="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div class="h-full bg-primary transition-all" style="width: 30%;"></div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <button class="text-white hover:text-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                    </button>
                    <button class="text-white hover:text-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                  </div>
                  <div class="flex items-center gap-4">
                    <button class="text-white hover:text-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list"><line x1="8" x2="21" y1="6" y2="6"></line><line x1="8" x2="21" y1="12" y2="12"></line><line x1="8" x2="21" y1="18" y2="18"></line><line x1="3" x2="3.01" y1="6" y2="6"></line><line x1="3" x2="3.01" y1="12" y2="12"></line><line x1="3" x2="3.01" y1="18" y2="18"></line></svg>
                    </button>
                    <button class="text-white hover:text-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-expand"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" x2="12" y1="22.08" y2="12"></line></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 课程模块/章节列表 -->
            <div class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border">
              <h3 class="font-bold text-neutral-title mb-4">课程目录</h3>
              <div class="space-y-3">
                <div 
                  v-for="item in courseModules" 
                  :key="item.id"
                  class="p-4 bg-white rounded-xl border border-neutral-border hover:border-primary/50 transition-all cursor-pointer"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {{ item.id }}
                      </div>
                      <div>
                        <h4 class="text-sm font-bold text-neutral-title">{{ item.title }}</h4>
                        <p class="text-xs text-neutral-helper">
                          {{ selectedResource?.type === '电子书' ? item.pages : item.duration }}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <button 
                        @click="completeModule(item.id)"
                        class="w-5 h-5 rounded-full flex items-center justify-center border border-neutral-border hover:border-primary transition-all"
                        :class="item.completed ? 'bg-primary border-primary text-white' : 'bg-white text-neutral-helper'"
                      >
                        <CheckCircle2 v-if="item.completed" :size="14" />
                      </button>
                      <button class="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition-all">
                        学习
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 学习笔记 -->
            <div class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border">
              <h3 class="font-bold text-neutral-title mb-4">学习笔记</h3>
              <textarea 
                class="w-full px-4 py-3 border border-neutral-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" 
                rows="4" 
                placeholder="在这里记录你的学习笔记..."
              ></textarea>
              <div class="mt-3 flex justify-end">
                <button class="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-all">
                  保存笔记
                </button>
              </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="mt-8 flex flex-col sm:flex-row gap-4">
              <button class="flex-1 py-4 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2">
                继续学习
                <ChevronRight :size="20" />
              </button>
              <button @click="closeResourceModal" class="flex-1 py-4 bg-white text-primary font-bold rounded-2xl shadow-sm hover:bg-primary/10 transition-all text-[10px] border border-primary/20">
                暂停学习
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 错题解析模态框 -->
    <div v-if="showWrongQuestionModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        <div class="p-8 border-b border-neutral-border">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-black text-neutral-title flex items-center gap-3">
              <RotateCcw :size="28" class="text-auxiliary-orange" />
              错题解析
            </h2>
            <button @click="showWrongQuestionModal = false" class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>
        <div class="p-8">
          <div class="space-y-6">
            <!-- 题目信息 -->
            <div class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border">
              <h3 class="text-lg font-bold text-neutral-title mb-4">{{ selectedWrongQuestion?.question }}</h3>
              <div class="flex flex-wrap items-center gap-2 mb-4">
                <span class="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full">{{ selectedWrongQuestion?.category }}</span>
                <span class="text-xs px-3 py-1 bg-neutral-border rounded-full">{{ selectedWrongQuestion?.difficulty }}</span>
                <span class="text-xs px-3 py-1 rounded-full" :class="selectedWrongQuestion?.status === '未掌握' ? 'bg-auxiliary-orange/10 text-auxiliary-orange' : 'bg-auxiliary-green/10 text-auxiliary-green'">
                  {{ selectedWrongQuestion?.status }}
                </span>
                <span class="text-xs px-3 py-1 bg-auxiliary-orange/10 text-auxiliary-orange rounded-full">
                  错误 {{ selectedWrongQuestion?.times }} 次
                </span>
              </div>
            </div>
            
            <!-- 选项展示 -->
            <div class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border">
              <h4 class="text-sm font-bold text-neutral-title mb-4">选项</h4>
              <div class="space-y-3">
                <div 
                  v-for="(option, index) in selectedWrongQuestion?.options" 
                  :key="index" 
                  class="flex items-center gap-3 p-3 rounded-xl border"
                  :class="{
                    'bg-auxiliary-orange/10 border-auxiliary-orange/30': option.includes(selectedWrongQuestion?.userAnswer) && selectedWrongQuestion?.userAnswer !== selectedWrongQuestion?.correctAnswer,
                    'bg-auxiliary-green/10 border-auxiliary-green/30': option.includes(selectedWrongQuestion?.correctAnswer),
                    'bg-white border-neutral-border': !option.includes(selectedWrongQuestion?.userAnswer) && !option.includes(selectedWrongQuestion?.correctAnswer)
                  }"
                >
                  <div class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" :class="{
                    'bg-auxiliary-orange text-white': option.includes(selectedWrongQuestion?.userAnswer) && selectedWrongQuestion?.userAnswer !== selectedWrongQuestion?.correctAnswer,
                    'bg-auxiliary-green text-white': option.includes(selectedWrongQuestion?.correctAnswer),
                    'bg-white border border-neutral-border text-neutral-body': !option.includes(selectedWrongQuestion?.userAnswer) && !option.includes(selectedWrongQuestion?.correctAnswer)
                  }">
                    {{ option.charAt(0) }}
                  </div>
                  <span class="text-sm text-neutral-body">{{ option.substring(3) }}</span>
                </div>
              </div>
            </div>
            
            <!-- 答案和解析 -->
            <div class="p-6 bg-primary/5 rounded-2xl border border-primary/20">
              <div class="flex items-center gap-2 mb-4">
                <span class="text-sm font-bold text-neutral-title">你的答案:</span>
                <span class="text-sm font-bold text-auxiliary-orange">{{ selectedWrongQuestion?.userAnswer }}</span>
              </div>
              <div class="flex items-center gap-2 mb-4">
                <span class="text-sm font-bold text-neutral-title">正确答案:</span>
                <span class="text-sm font-bold text-auxiliary-green">{{ selectedWrongQuestion?.correctAnswer }}</span>
              </div>
              <div class="mt-4">
                <h4 class="text-sm font-bold text-primary mb-3">解析:</h4>
                <p class="text-sm text-neutral-body leading-relaxed">{{ selectedWrongQuestion?.explanation }}</p>
              </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="mt-8 flex flex-col sm:flex-row gap-4">
              <button 
                @click="practiceWrongQuestion(selectedWrongQuestion)" 
                class="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
              >
                重新练习
                <RotateCcw :size="20" />
              </button>
              <button 
                @click="showWrongQuestionModal = false" 
                class="flex-1 py-4 bg-white text-primary font-bold rounded-2xl shadow-sm hover:bg-primary/10 transition-all text-sm border border-primary/20"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 学习计划详情模态框 -->
    <div v-if="showLearningPlanDetailModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        <div class="p-8 border-b border-neutral-border">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-black text-neutral-title flex items-center gap-3">
              <Calendar :size="28" class="text-primary" />
              学习计划详情
            </h2>
            <button @click="showLearningPlanDetailModal = false" class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>
        <div class="p-8">
          <div class="space-y-6">
            <!-- 计划基本信息 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="p-6 bg-primary/10 rounded-2xl border border-primary/20">
                <h3 class="text-sm font-bold text-primary mb-3">计划信息</h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-neutral-helper">状态</span>
                    <span class="text-xs font-bold text-neutral-title">{{ selectedLearningPlan?.status }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-neutral-helper">总天数</span>
                    <span class="text-xs font-bold text-neutral-title">{{ selectedLearningPlan?.totalDays }} 天</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-neutral-helper">当前进度</span>
                    <span class="text-xs font-bold text-neutral-title">{{ selectedLearningPlan?.currentDay }} 天</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-neutral-helper">完成度</span>
                    <span class="text-xs font-bold text-primary">{{ selectedLearningPlan?.progress }}%</span>
                  </div>
                </div>
              </div>
              
              <div class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border md:col-span-2">
                <h3 class="text-sm font-bold text-neutral-title mb-3">计划描述</h3>
                <p class="text-sm text-neutral-body">{{ selectedLearningPlan?.description }}</p>
                <div class="mt-4">
                  <div class="h-2 bg-neutral-border rounded-full overflow-hidden mb-2">
                    <div class="h-full bg-primary transition-all" :style="{ width: selectedLearningPlan?.progress + '%' }"></div>
                  </div>
                  <div class="flex justify-between text-xs text-neutral-helper">
                    <span>开始</span>
                    <span>进度: {{ selectedLearningPlan?.progress }}%</span>
                    <span>完成</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 任务列表 -->
            <div class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border">
              <h3 class="font-bold text-neutral-title mb-4">任务列表</h3>
              <div class="space-y-3">
                <div 
                  v-for="task in selectedLearningPlan?.tasks" 
                  :key="task.id"
                  class="p-4 bg-white rounded-xl border border-neutral-border hover:border-primary/50 transition-all"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {{ task.day }}
                      </div>
                      <div>
                        <h4 class="text-sm font-bold text-neutral-title">{{ task.title }}</h4>
                        <p class="text-xs text-neutral-helper">第 {{ task.day }} 天</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        :checked="task.completed" 
                        @change="completeTask(selectedLearningPlan?.id, task.id)" 
                        class="w-4 h-4 rounded border-neutral-border text-primary focus:ring-primary/30"
                      >
                      <button class="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition-all">
                        开始
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="mt-8 flex flex-col sm:flex-row gap-4">
              <button 
                v-if="selectedLearningPlan?.status === '未开始'" 
                @click="startLearningPlan(selectedLearningPlan?.id)" 
                class="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
              >
                开始学习
                <PlayCircle :size="20" />
              </button>
              <button 
                v-else 
                @click="continueLearningPlan(selectedLearningPlan)" 
                class="flex-1 py-4 bg-auxiliary-green text-white font-bold rounded-2xl shadow-lg hover:shadow-auxiliary-green/30 transition-all flex items-center justify-center gap-2"
              >
                继续学习
                <ChevronRight :size="20" />
              </button>
              <button 
                @click="showLearningPlanDetailModal = false" 
                class="flex-1 py-4 bg-white text-primary font-bold rounded-2xl shadow-sm hover:bg-primary/10 transition-all text-sm border border-primary/20"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 题库详情模态框 -->
    <div v-if="showQuestionBankDetailModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        <div class="p-8 border-b border-neutral-border">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-black text-neutral-title flex items-center gap-3">
              <BookOpen :size="28" class="text-primary" />
              {{ selectedQuestionBank?.title }}
            </h2>
            <button @click="closeQuestionBankDetailModal" class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>
        <div class="p-8">
          <div class="space-y-6">
            <!-- 题库基本信息 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="p-6 bg-primary/10 rounded-2xl border border-primary/20">
                <h3 class="text-sm font-bold text-primary mb-3">题库信息</h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-neutral-helper">分类</span>
                    <span class="text-xs font-bold text-neutral-title">{{ selectedQuestionBank?.category }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-neutral-helper">难度</span>
                    <span class="text-xs font-bold text-neutral-title">{{ selectedQuestionBank?.difficulty }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-neutral-helper">题目数量</span>
                    <span class="text-xs font-bold text-primary">{{ selectedQuestionBank?.questionCount }}+ 题</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-neutral-helper">学习进度</span>
                    <span class="text-xs font-bold text-primary">{{ selectedQuestionBank?.progress }}%</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-neutral-helper">最后更新</span>
                    <span class="text-xs font-bold text-neutral-title">{{ selectedQuestionBank?.lastUpdated }}</span>
                  </div>
                </div>
              </div>
              <div class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border">
                <h3 class="text-sm font-bold text-neutral-title mb-3">标签</h3>
                <div class="flex flex-wrap gap-2">
                  <span v-for="tag in selectedQuestionBank?.tags" :key="tag" class="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full">{{ tag }}</span>
                </div>
              </div>
              <div class="p-6 bg-auxiliary-orange/10 rounded-2xl border border-auxiliary-orange/20">
                <h3 class="text-sm font-bold text-auxiliary-orange mb-3">操作</h3>
                <button @click="startPractice(selectedQuestionBank)" class="w-full px-4 py-3 bg-auxiliary-orange text-white font-bold rounded-xl hover:bg-auxiliary-orange/80 transition-all text-sm mb-3 shadow-sm">
                  开始练习
                </button>
                <button @click="addToFavorites(selectedQuestionBank?.id)" class="w-full px-4 py-3 bg-white text-auxiliary-orange font-bold rounded-xl hover:bg-auxiliary-orange/10 transition-all text-sm border border-auxiliary-orange/20 shadow-sm">
                  {{ isBankFavorite(selectedQuestionBank?.id) ? '取消收藏' : '添加收藏' }}
                </button>
              </div>
            </div>
            
            <!-- 学习进度条 -->
            <div class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border">
              <h3 class="text-sm font-bold text-neutral-title mb-3">学习进度</h3>
              <div class="space-y-2">
                <div class="flex justify-between text-sm mb-1">
                  <span class="font-bold text-neutral-title">总体进度</span>
                  <span class="text-primary font-bold">{{ selectedQuestionBank?.progress }}%</span>
                </div>
                <div class="h-2 bg-neutral-border rounded-full overflow-hidden">
                  <div class="h-full bg-primary transition-all duration-1000 ease-out" :style="{ width: selectedQuestionBank?.progress + '%' }"></div>
                </div>
                <div class="flex justify-between text-xs text-neutral-helper">
                  <span>开始</span>
                  <span>目标: 100%</span>
                  <span>完成</span>
                </div>
              </div>
            </div>
            
            <!-- 题库描述 -->
            <div class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border">
              <h3 class="text-lg font-bold text-neutral-title mb-3">题库描述</h3>
              <p class="text-sm text-neutral-body leading-relaxed">{{ selectedQuestionBank?.description }}</p>
            </div>
            
            <!-- 题目预览 -->
            <div>
              <h3 class="text-lg font-bold text-neutral-title mb-4">题目预览</h3>
              <div class="space-y-4">
                <div v-for="(question, index) in selectedQuestionBank?.questions.slice(0, 3)" :key="question.id" class="p-5 bg-neutral-bg rounded-2xl border border-neutral-border hover:shadow-md transition-all">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {{ Number(index) + 1 }}
                    </div>
                    <h4 class="text-sm font-bold text-neutral-title">{{ question.question }}</h4>
                  </div>
                  <div class="space-y-2 mb-4 pl-10">
                    <div v-for="(option, optIndex) in question.options" :key="optIndex" class="flex items-center gap-3 p-2 rounded-xl bg-white border border-neutral-border hover:border-primary/30 transition-all">
                      <div class="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold bg-white border border-neutral-border text-neutral-body">{{ option.charAt(0) }}</div>
                      <span class="text-xs text-neutral-body">{{ option.substring(3) }}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 pl-10">
                    <span class="text-xs font-bold text-neutral-title">难度:</span>
                    <span class="text-xs px-2 py-1 bg-neutral-border rounded-full">{{ question.difficulty }}</span>
                    <div class="flex items-center gap-1">
                      <span class="text-xs font-bold text-neutral-title">标签:</span>
                      <span v-for="(tag, tagIndex) in question.tags" :key="tagIndex" class="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full ml-1">{{ tag }}</span>
                    </div>
                  </div>
                </div>
                <div v-if="selectedQuestionBank?.questions.length > 3" class="text-center">
                  <button class="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-sm shadow-sm">
                    查看全部题目
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 推荐理由 -->
            <div class="p-6 bg-primary/5 rounded-2xl border border-primary/20">
              <h3 class="text-sm font-bold text-primary mb-3">推荐理由</h3>
              <ul class="space-y-2 pl-6">
                <li class="text-xs text-neutral-body list-disc">覆盖{{ selectedQuestionBank?.category }}领域核心知识点</li>
                <li class="text-xs text-neutral-body list-disc">包含{{ selectedQuestionBank?.questionCount }}+道精选题目</li>
                <li class="text-xs text-neutral-body list-disc">适合{{ selectedQuestionBank?.difficulty }}难度级别的学习者</li>
                <li class="text-xs text-neutral-body list-disc">提供详细的题目解析和答案</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 题库练习模态框 -->
    <div v-if="showQuestionPracticeModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        <div class="p-8 border-b border-neutral-border">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-black text-neutral-title flex items-center gap-3">
              <BookOpen :size="28" class="text-primary" />
              {{ selectedQuestionBank?.title }} - 练习
            </h2>
            <button @click="closeQuestionPracticeModal" class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div class="mt-4">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-neutral-title">进度:</span>
                <span class="text-sm font-bold text-primary">{{ currentQuestionIndex + 1 }} / {{ practiceQuestions.length }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-neutral-title">正确率:</span>
                <span class="text-sm font-bold text-primary">{{ calculateAccuracy() }}%</span>
              </div>
            </div>
            <div class="h-2 bg-neutral-bg rounded-full overflow-hidden">
              <div class="h-full bg-primary transition-all duration-500" :style="{width: ((currentQuestionIndex + 1) / practiceQuestions.length) * 100 + '%'}"></div>
            </div>
          </div>
          
          <!-- 题目导航 -->
          <div class="mt-6 flex flex-wrap gap-2">
            <button 
              v-for="(question, index) in practiceQuestions" 
              :key="question.id"
              @click="jumpToQuestion(index)"
              class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
              :class="{
                'bg-primary text-white': index === currentQuestionIndex,
                'bg-auxiliary-green text-white': index < currentQuestionIndex && answeredQuestions[index] === true,
                'bg-auxiliary-orange text-white': index < currentQuestionIndex && answeredQuestions[index] === false,
                'bg-neutral-bg text-neutral-title hover:bg-primary/10': index > currentQuestionIndex
              }"
            >
              {{ index + 1 }}
            </button>
          </div>
        </div>
        <div class="p-8">
          <div v-if="practiceQuestions.length > 0">
            <div class="space-y-6">
              <!-- 题目 -->
              <div class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {{ currentQuestionIndex + 1 }}
                  </div>
                  <h3 class="text-lg font-bold text-neutral-title">{{ practiceQuestions[currentQuestionIndex].question }}</h3>
                </div>
                <div class="space-y-3 mb-6 pl-12">
                  <div v-for="(option, index) in practiceQuestions[currentQuestionIndex].options" :key="index" class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all transform hover:scale-102" :class="{
                    'bg-auxiliary-orange/10 border border-auxiliary-orange/30 animate-shake': selectedAnswer === option.charAt(0) && isAnswerCorrect === false,
                    'bg-auxiliary-green/10 border border-auxiliary-green/30 animate-pulse': selectedAnswer === option.charAt(0) && isAnswerCorrect === true,
                    'bg-auxiliary-green/10 border border-auxiliary-green/30': selectedAnswer !== option.charAt(0) && option.charAt(0) === practiceQuestions[currentQuestionIndex].correctAnswer && isAnswerCorrect !== null,
                    'bg-white border border-neutral-border hover:border-primary/30': selectedAnswer !== option.charAt(0) && isAnswerCorrect === null
                  }" @click="!isAnswerCorrect && (selectedAnswer = option.charAt(0))">
                    <div class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" :class="{
                      'bg-auxiliary-orange text-white': selectedAnswer === option.charAt(0) && isAnswerCorrect === false,
                      'bg-auxiliary-green text-white': (selectedAnswer === option.charAt(0) && isAnswerCorrect === true) || (selectedAnswer !== option.charAt(0) && option.charAt(0) === practiceQuestions[currentQuestionIndex].correctAnswer && isAnswerCorrect !== null),
                      'bg-white border border-neutral-border text-neutral-body': selectedAnswer !== option.charAt(0) && isAnswerCorrect === null
                    }">
                      {{ option.charAt(0) }}
                    </div>
                    <span class="text-sm text-neutral-body">{{ option.substring(3) }}</span>
                  </div>
                </div>
                
                <!-- 解析 -->
                <div v-if="isAnswerCorrect !== null" class="p-5 bg-primary/5 rounded-xl border border-primary/20 animate-fadeIn">
                  <div class="flex items-center gap-2 mb-3">
                    <CheckCircle2 v-if="isAnswerCorrect" :size="18" class="text-auxiliary-green" />
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-circle text-auxiliary-orange"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>
                    <h4 class="text-sm font-bold text-primary">{{ isAnswerCorrect ? '回答正确！' : '回答错误' }}</h4>
                  </div>
                  <p class="text-sm text-neutral-body leading-relaxed">{{ practiceQuestions[currentQuestionIndex].explanation }}</p>
                </div>
              </div>
              
              <!-- 操作按钮 -->
              <div class="flex items-center justify-between">
                <button @click="prevQuestion" :disabled="currentQuestionIndex === 0" class="px-6 py-3 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all text-sm shadow-sm" :class="currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''">
                  上一题
                </button>
                <div v-if="!isAnswerCorrect" class="flex-1 max-w-md mx-4">
                  <button @click="submitAnswer" :disabled="!selectedAnswer" class="w-full px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-sm shadow-sm" :class="!selectedAnswer ? 'opacity-50 cursor-not-allowed' : ''">
                    提交答案
                  </button>
                </div>
                <button @click="nextQuestion" :disabled="currentQuestionIndex === practiceQuestions.length - 1 && !isAnswerCorrect" class="px-6 py-3 bg-auxiliary-green text-white font-bold rounded-xl hover:bg-auxiliary-green/80 transition-all text-sm shadow-sm" :class="(currentQuestionIndex === practiceQuestions.length - 1 && !isAnswerCorrect) ? 'opacity-50 cursor-not-allowed' : ''">
                  {{ currentQuestionIndex === practiceQuestions.length - 1 ? '完成练习' : '下一题' }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- 练习完成总结 -->
          <div v-else-if="practiceCompleted" class="text-center py-12">
            <div class="w-24 h-24 rounded-full bg-auxiliary-green/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 :size="48" class="text-auxiliary-green" />
            </div>
            <h3 class="text-2xl font-black text-neutral-title mb-4">练习完成！</h3>
            <p class="text-sm text-neutral-body mb-8">恭喜你完成了{{ selectedQuestionBank?.title }}的练习</p>
            <div class="grid grid-cols-3 gap-6 mb-8">
              <div class="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                <p class="text-xs text-neutral-helper mb-1">总题数</p>
                <p class="text-2xl font-black text-primary">{{ Number(totalQuestions) }}</p>
              </div>
              <div class="p-4 bg-auxiliary-green/10 rounded-2xl border border-auxiliary-green/20">
                <p class="text-xs text-neutral-helper mb-1">正确题数</p>
                <p class="text-2xl font-black text-auxiliary-green">{{ correctAnswers }}</p>
              </div>
              <div class="p-4 bg-auxiliary-orange/10 rounded-2xl border border-auxiliary-orange/20">
                <p class="text-xs text-neutral-helper mb-1">正确率</p>
                <p class="text-2xl font-black text-auxiliary-orange">{{ finalAccuracy }}%</p>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-4">
              <button @click="closeQuestionPracticeModal" class="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all">
                关闭
              </button>
              <button @click="restartPractice" class="flex-1 py-4 bg-white text-primary font-bold rounded-2xl shadow-sm hover:bg-primary/10 transition-all border border-primary/20">
                重新练习
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
