<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  Search,
  Filter,
  ChevronDown,
  Briefcase,
  BookOpen,
  Clock,
  Heart,
  ChevronRight
} from 'lucide-vue-next'

// 类型定义
interface JobCategory {
  id: string
  name: string
  icon: string
  description: string
  questionCount: number
}

interface Question {
  id: string
  question: string
  jobCategory: string
  difficulty: 'easy' | 'medium' | 'hard'
  type: 'technical' | 'behavioral' | 'pressure'
  tags: string[]
  answer: string
  likes: number
  views: number
}

const router = useRouter()

// 状态管理
const searchQuery = ref('')
const selectedJobCategory = ref('all')
const selectedDifficulty = ref('all')
const selectedQuestionType = ref('all')
const showFilters = ref(false)
const currentPage = ref(1)
const questionsPerPage = ref(10)

// 岗位分类数据
const jobCategories: JobCategory[] = [
  { id: 'frontend', name: '前端开发', icon: 'Languages', description: '专注于Web前端技术，包括HTML、CSS、JavaScript等', questionCount: 120 },
  { id: 'backend', name: '后端开发', icon: 'Server', description: '专注于服务器端技术，包括数据库、API设计等', questionCount: 150 },
  { id: 'product', name: '产品经理', icon: 'Briefcase', description: '专注于产品规划、用户研究和需求分析', questionCount: 80 },
  { id: 'ai', name: '人工智能', icon: 'Brain', description: '专注于机器学习、深度学习等AI技术', questionCount: 100 },
  { id: 'uiux', name: 'UI/UX设计', icon: 'Palette', description: '专注于用户界面和用户体验设计', questionCount: 70 },
  { id: 'marketing', name: '市场营销', icon: 'TrendingUp', description: '专注于市场策略、品牌推广等', questionCount: 60 }
]

// 模拟题库数据
const mockQuestions: Question[] = [
  // 前端开发问题
  {
    id: '1',
    question: '请解释一下Vue3的响应式原理，以及它与Vue2的区别',
    jobCategory: 'frontend',
    difficulty: 'hard',
    type: 'technical',
    tags: ['Vue', '响应式', '前端'],
    answer: 'Vue3使用Proxy实现响应式，相比Vue2的Object.defineProperty，它可以监听对象的添加和删除操作，并且可以监听数组的变化。此外，Vue3的响应式系统更加高效，因为它使用了WeakMap来存储依赖关系，避免了内存泄漏。',
    likes: 120,
    views: 500
  },
  {
    id: '2',
    question: '如何优化前端页面的加载性能？',
    jobCategory: 'frontend',
    difficulty: 'medium',
    type: 'technical',
    tags: ['性能优化', '前端'],
    answer: '优化前端页面加载性能的方法包括：1. 减少HTTP请求，2. 压缩资源，3. 使用CDN，4. 启用浏览器缓存，5. 优化图片，6. 减少DOM元素数量，7. 使用异步加载，8. 优化CSS和JavaScript，9. 使用预加载，10. 监控性能。',
    likes: 95,
    views: 420
  },
  // 后端开发问题
  {
    id: '3',
    question: '请解释一下RESTful API的设计原则',
    jobCategory: 'backend',
    difficulty: 'medium',
    type: 'technical',
    tags: ['API', 'REST', '后端'],
    answer: 'RESTful API的设计原则包括：1. 资源导向，2. HTTP方法，3. 无状态，4. 统一接口，5. 缓存，6. 分层系统，7. 代码按需。',
    likes: 105,
    views: 380
  },
  {
    id: '4',
    question: '如何处理高并发请求？',
    jobCategory: 'backend',
    difficulty: 'hard',
    type: 'technical',
    tags: ['高并发', '后端', '性能'],
    answer: '处理高并发请求的方法包括：1. 垂直扩展，2. 水平扩展，3. 缓存，4. 数据库优化，5. 异步处理，6. 代码优化，7. 负载均衡，8. 限流，9. 降级，10. 熔断。',
    likes: 110,
    views: 450
  },
  // 产品经理问题
  {
    id: '5',
    question: '如何进行用户调研？',
    jobCategory: 'product',
    difficulty: 'easy',
    type: 'behavioral',
    tags: ['用户调研', '产品'],
    answer: '用户调研的方法包括：1. 问卷调查，2. 访谈，3. 焦点小组，4. 可用性测试，5. 数据分析，6. 竞品分析。',
    likes: 85,
    views: 320
  },
  {
    id: '6',
    question: '如何制定产品 roadmap？',
    jobCategory: 'product',
    difficulty: 'medium',
    type: 'behavioral',
    tags: ['产品规划', 'roadmap'],
    answer: '制定产品 roadmap的步骤包括：1. 确定产品愿景和目标，2. 收集和分析需求，3. 优先级排序，4. 制定时间线，5. 与 stakeholders 沟通，6. 定期更新和调整。',
    likes: 90,
    views: 350
  },
  // 人工智能问题
  {
    id: '7',
    question: '请解释一下机器学习中的过拟合问题',
    jobCategory: 'ai',
    difficulty: 'medium',
    type: 'technical',
    tags: ['机器学习', '过拟合', 'AI'],
    answer: '过拟合是指模型在训练数据上表现很好，但在新数据上表现很差的现象。解决过拟合的方法包括：1. 增加训练数据，2. 正则化，3. 特征选择，4. 交叉验证，5. 早停法。',
    likes: 98,
    views: 390
  },
  {
    id: '8',
    question: '什么是深度学习？它与传统机器学习有什么区别？',
    jobCategory: 'ai',
    difficulty: 'hard',
    type: 'technical',
    tags: ['深度学习', '机器学习', 'AI'],
    answer: '深度学习是机器学习的一个分支，它使用多层神经网络来学习数据的表示。与传统机器学习相比，深度学习可以自动学习特征，不需要手动特征工程，并且在处理大规模数据时表现更好。',
    likes: 115,
    views: 480
  },
  // UI/UX设计问题
  {
    id: '9',
    question: '什么是用户体验设计？',
    jobCategory: 'uiux',
    difficulty: 'easy',
    type: 'behavioral',
    tags: ['UX设计', '用户体验'],
    answer: '用户体验设计是指设计产品时，以用户为中心，关注用户的需求、感受和行为，确保产品易于使用、高效和愉悦。',
    likes: 80,
    views: 300
  },
  {
    id: '10',
    question: '如何进行用户旅程映射？',
    jobCategory: 'uiux',
    difficulty: 'medium',
    type: 'behavioral',
    tags: ['用户旅程', 'UX设计'],
    answer: '用户旅程映射的步骤包括：1. 确定用户角色，2. 确定用户目标，3. 识别用户接触点，4. 分析用户情感，5. 识别痛点和机会，6. 提出改进方案。',
    likes: 88,
    views: 330
  },
  // 市场营销问题
  {
    id: '11',
    question: '什么是内容营销？',
    jobCategory: 'marketing',
    difficulty: 'easy',
    type: 'behavioral',
    tags: ['内容营销', '市场营销'],
    answer: '内容营销是指通过创建和分发有价值、相关和一致的内容，来吸引和留住目标受众，并最终推动有利可图的客户行动。',
    likes: 75,
    views: 280
  },
  {
    id: '12',
    question: '如何制定社交媒体营销策略？',
    jobCategory: 'marketing',
    difficulty: 'medium',
    type: 'behavioral',
    tags: ['社交媒体', '营销策略'],
    answer: '制定社交媒体营销策略的步骤包括：1. 确定目标，2. 了解目标受众，3. 选择合适的平台，4. 制定内容策略，5. 设定KPI，6. 执行和监控，7. 分析和优化。',
    likes: 82,
    views: 310
  }
]

// 计算属性：过滤后的问题
const filteredQuestions = computed(() => {
  let result = [...mockQuestions]
  
  // 按搜索词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(q => 
      q.question.toLowerCase().includes(query) ||
      q.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // 按岗位分类过滤
  if (selectedJobCategory.value !== 'all') {
    result = result.filter(q => q.jobCategory === selectedJobCategory.value)
  }
  
  // 按难度过滤
  if (selectedDifficulty.value !== 'all') {
    result = result.filter(q => q.difficulty === selectedDifficulty.value)
  }
  
  // 按问题类型过滤
  if (selectedQuestionType.value !== 'all') {
    result = result.filter(q => q.type === selectedQuestionType.value)
  }
  
  return result
})

// 计算属性：分页后的问题
const paginatedQuestions = computed(() => {
  const start = (currentPage.value - 1) * questionsPerPage.value
  const end = start + questionsPerPage.value
  return filteredQuestions.value.slice(start, end)
})

// 计算属性：总页数
const totalPages = computed(() => {
  return Math.ceil(filteredQuestions.value.length / questionsPerPage.value)
})

// 计算属性：难度标签颜色
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'hard': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// 计算属性：问题类型标签颜色
const getTypeColor = (type: string) => {
  switch (type) {
    case 'technical': return 'bg-blue-100 text-blue-800'
    case 'behavioral': return 'bg-purple-100 text-purple-800'
    case 'pressure': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// 方法：切换到指定页面
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// 方法：重置筛选条件
const resetFilters = () => {
  selectedJobCategory.value = 'all'
  selectedDifficulty.value = 'all'
  selectedQuestionType.value = 'all'
  searchQuery.value = ''
  currentPage.value = 1
}

// 监听筛选条件变化，重置页码
watch([selectedJobCategory, selectedDifficulty, selectedQuestionType, searchQuery], () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">岗位专属题库</h1>
        <div class="flex items-center space-x-4">
          <button 
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            @click="router.push('/interview')"
          >
            回到面试实战
          </button>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 搜索和筛选 -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <!-- 搜索框 -->
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search class="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="搜索问题或标签..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <!-- 筛选按钮 -->
          <button
            @click="showFilters = !showFilters"
            class="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter class="h-4 w-4" />
            <span>筛选</span>
            <ChevronDown class="h-4 w-4" :class="{ 'transform rotate-180': showFilters }" />
          </button>
        </div>

        <!-- 筛选选项 -->
        <div v-if="showFilters" class="mt-4 pt-4 border-t border-gray-200">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- 岗位分类 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">岗位分类</label>
              <select
                v-model="selectedJobCategory"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">全部</option>
                <option v-for="category in jobCategories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            
            <!-- 难度 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">难度</label>
              <select
                v-model="selectedDifficulty"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">全部</option>
                <option value="easy">简单</option>
                <option value="medium">中等</option>
                <option value="hard">困难</option>
              </select>
            </div>
            
            <!-- 问题类型 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">问题类型</label>
              <select
                v-model="selectedQuestionType"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">全部</option>
                <option value="technical">技术题</option>
                <option value="behavioral">行为题</option>
                <option value="pressure">压力题</option>
              </select>
            </div>
          </div>
          
          <div class="mt-4 flex justify-end">
            <button
              @click="resetFilters"
              class="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              重置
            </button>
            <button
              @click="showFilters = false"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              应用筛选
            </button>
          </div>
        </div>
      </div>

      <!-- 岗位分类卡片 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div
          v-for="category in jobCategories"
          :key="category.id"
          class="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
          @click="selectedJobCategory = category.id; showFilters = false"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Briefcase class="h-5 w-5 text-blue-600" />
              </div>
              <h3 class="text-lg font-medium text-gray-900">{{ category.name }}</h3>
            </div>
            <span class="text-sm font-medium text-gray-500">{{ category.questionCount }} 题</span>
          </div>
          <p class="text-sm text-gray-600 mb-4">{{ category.description }}</p>
          <button class="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
            查看题库
            <ChevronRight class="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>

      <!-- 问题列表 -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">
            问题列表 ({{ filteredQuestions.length }})
          </h2>
        </div>
        
        <div v-if="paginatedQuestions.length === 0" class="p-8 text-center">
          <BookOpen class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500">没有找到匹配的问题</p>
        </div>
        
        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="question in paginatedQuestions"
            :key="question.id"
            class="p-6 hover:bg-gray-50"
          >
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div class="flex-1">
                <h3 class="text-lg font-medium text-gray-900 mb-2">{{ question.question }}</h3>
                
                <div class="flex flex-wrap gap-2 mb-3">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getDifficultyColor(question.difficulty)"
                  >
                    {{ question.difficulty === 'easy' ? '简单' : question.difficulty === 'medium' ? '中等' : '困难' }}
                  </span>
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getTypeColor(question.type)"
                  >
                    {{ question.type === 'technical' ? '技术题' : question.type === 'behavioral' ? '行为题' : '压力题' }}
                  </span>
                  <span 
                    v-for="tag in question.tags"
                    :key="tag"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {{ tag }}
                  </span>
                </div>
                
                <div class="text-sm text-gray-600 mb-4 line-clamp-2">
                  {{ question.answer }}
                </div>
                
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <div class="flex items-center">
                    <Clock class="h-4 w-4 mr-1" />
                    <span>{{ question.views }} 次查看</span>
                  </div>
                  <div class="flex items-center">
                    <Heart class="h-4 w-4 mr-1" />
                    <span>{{ question.likes }} 人点赞</span>
                  </div>
                </div>
              </div>
              
              <div class="flex flex-col space-y-2">
                <button class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  查看详情
                </button>
                <button class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  练习回答
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分页 -->
        <div v-if="totalPages > 1" class="p-6 border-t border-gray-200">
          <nav class="flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                上一页
              </button>
              <button
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                下一页
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  显示第 {{ (currentPage - 1) * questionsPerPage + 1 }} 到 {{ Math.min(currentPage * questionsPerPage, filteredQuestions.length) }} 条，共 {{ filteredQuestions.length }} 条
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    @click="goToPage(1)"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    首页
                  </button>
                  <button
                    @click="goToPage(currentPage - 1)"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    上一页
                  </button>
                  
                  <!-- 页码 -->
                  <button
                    v-for="page in Math.min(5, totalPages)"
                    :key="page"
                    @click="goToPage(page)"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium"
                    :class="currentPage === page ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'"
                  >
                    {{ page }}
                  </button>
                  
                  <button
                    @click="goToPage(currentPage + 1)"
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    下一页
                  </button>
                  <button
                    @click="goToPage(totalPages)"
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    末页
                  </button>
                </nav>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>