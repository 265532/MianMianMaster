<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useKnowledgeStore } from "@/stores/knowledge";
import { useInterviewStore } from "@/stores/interview";
import {
  Search,
  Filter,
  ChevronDown,
  Briefcase,
  BookOpen,
  Clock,
  Heart,
  ChevronRight,
} from "lucide-vue-next";

// 类型定义
interface JobCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  questionCount: number;
}

interface Question {
  id: string;
  question: string;
  jobCategory: string;
  difficulty: "easy" | "medium" | "hard";
  type: "technical" | "behavioral" | "pressure";
  tags: string[];
  answer: string;
  likes: number;
  views: number;
}

const router = useRouter();

// Store 初始化
const knowledgeStore = useKnowledgeStore();
const { jobPositions } = storeToRefs(knowledgeStore);

const interviewStore = useInterviewStore();
const { questions } = storeToRefs(interviewStore);

// 状态管理
const searchQuery = ref("");
const selectedJobCategory = ref("all");
const selectedDifficulty = ref("all");
const selectedQuestionType = ref("all");
const showFilters = ref(false);
const currentPage = ref(1);
const questionsPerPage = ref(10);

// 岗位分类数据（从 Store 映射）
const jobCategories = computed(() =>
  jobPositions.value.map((job) => ({
    id: String(job.id),
    name: job.title,
    icon: "Briefcase",
    description: job.description ?? "暂无描述",
    questionCount: 0, // 后端暂无此数据
  }))
);

// 题库数据（从 Store 映射）
const mockQuestions = computed(() =>
  questions.value.map((q) => ({
    id: String(q.id),
    question: q.content,
    jobCategory: "all", // 后端暂无岗位分类字段
    difficulty: (q.difficulty as "easy" | "medium" | "hard") ?? "medium",
    type: (q.question_type as "technical" | "behavioral" | "pressure") ?? "technical",
    tags: [], // 后端暂无标签字段
    answer: "暂无参考答案", // 后端暂无答案字段
    likes: 0, // 后端暂无点赞字段
    views: 0, // 后端暂无浏览字段
  }))
);

// 计算属性：过滤后的问题
const filteredQuestions = computed(() => {
  let result = [...mockQuestions.value];

  // 按搜索词过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (q) =>
        q.question.toLowerCase().includes(query) ||
        q.tags.some((tag) => tag.toLowerCase().includes(query)),
    );
  }

  // 按岗位分类过滤
  if (selectedJobCategory.value !== "all") {
    result = result.filter((q) => q.jobCategory === selectedJobCategory.value);
  }

  // 按难度过滤
  if (selectedDifficulty.value !== "all") {
    result = result.filter((q) => q.difficulty === selectedDifficulty.value);
  }

  // 按问题类型过滤
  if (selectedQuestionType.value !== "all") {
    result = result.filter((q) => q.type === selectedQuestionType.value);
  }

  return result;
});

// 计算属性：分页后的问题
const paginatedQuestions = computed(() => {
  const start = (currentPage.value - 1) * questionsPerPage.value;
  const end = start + questionsPerPage.value;
  return filteredQuestions.value.slice(start, end);
});

// 计算属性：总页数
const totalPages = computed(() => {
  return Math.ceil(filteredQuestions.value.length / questionsPerPage.value);
});

// 计算属性：难度标签颜色
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "hard":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// 计算属性：问题类型标签颜色
const getTypeColor = (type: string) => {
  switch (type) {
    case "technical":
      return "bg-blue-100 text-blue-800";
    case "behavioral":
      return "bg-purple-100 text-purple-800";
    case "pressure":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// 方法：切换到指定页面
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// 方法：重置筛选条件
const resetFilters = () => {
  selectedJobCategory.value = "all";
  selectedDifficulty.value = "all";
  selectedQuestionType.value = "all";
  searchQuery.value = "";
  currentPage.value = 1;
};

// 监听筛选条件变化，重置页码
watch(
  [selectedJobCategory, selectedDifficulty, selectedQuestionType, searchQuery],
  () => {
    currentPage.value = 1;
  },
);

// 加载 Store 数据
onMounted(async () => {
  await Promise.all([
    knowledgeStore.fetchAllData(),
    interviewStore.fetchQuestions(),
  ]);
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <div class="bg-white shadow-sm">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between"
      >
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
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <!-- 搜索框 -->
          <div class="relative flex-1">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Search class="h-5 w-5 text-gray-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索问题或标签..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <!-- 筛选按钮 -->
          <button
            class="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            @click="showFilters = !showFilters"
          >
            <Filter class="h-4 w-4" />
            <span>筛选</span>
            <ChevronDown
              class="h-4 w-4"
              :class="{ 'transform rotate-180': showFilters }"
            />
          </button>
        </div>

        <!-- 筛选选项 -->
        <div v-if="showFilters" class="mt-4 pt-4 border-t border-gray-200">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- 岗位分类 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >岗位分类</label
              >
              <select
                v-model="selectedJobCategory"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">全部</option>
                <option
                  v-for="category in jobCategories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>

            <!-- 难度 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >难度</label
              >
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
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >问题类型</label
              >
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
              class="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              @click="resetFilters"
            >
              重置
            </button>
            <button
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              @click="showFilters = false"
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
          @click="
            selectedJobCategory = category.id;
            showFilters = false;
          "
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"
              >
                <Briefcase class="h-5 w-5 text-blue-600" />
              </div>
              <h3 class="text-lg font-medium text-gray-900">
                {{ category.name }}
              </h3>
            </div>
            <span class="text-sm font-medium text-gray-500"
              >{{ category.questionCount }} 题</span
            >
          </div>
          <p class="text-sm text-gray-600 mb-4">{{ category.description }}</p>
          <button
            class="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
          >
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
            <div
              class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
            >
              <div class="flex-1">
                <h3 class="text-lg font-medium text-gray-900 mb-2">
                  {{ question.question }}
                </h3>

                <div class="flex flex-wrap gap-2 mb-3">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getDifficultyColor(question.difficulty)"
                  >
                    {{
                      question.difficulty === "easy"
                        ? "简单"
                        : question.difficulty === "medium"
                          ? "中等"
                          : "困难"
                    }}
                  </span>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getTypeColor(question.type)"
                  >
                    {{
                      question.type === "technical"
                        ? "技术题"
                        : question.type === "behavioral"
                          ? "行为题"
                          : "压力题"
                    }}
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
                <button
                  class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  查看详情
                </button>
                <button
                  class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
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
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                @click="goToPage(currentPage - 1)"
              >
                上一页
              </button>
              <button
                :disabled="currentPage === totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                @click="goToPage(currentPage + 1)"
              >
                下一页
              </button>
            </div>
            <div
              class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
            >
              <div>
                <p class="text-sm text-gray-700">
                  显示第 {{ (currentPage - 1) * questionsPerPage + 1 }} 到
                  {{
                    Math.min(
                      currentPage * questionsPerPage,
                      filteredQuestions.length,
                    )
                  }}
                  条，共 {{ filteredQuestions.length }} 条
                </p>
              </div>
              <div>
                <nav
                  class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    @click="goToPage(1)"
                  >
                    首页
                  </button>
                  <button
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    @click="goToPage(currentPage - 1)"
                  >
                    上一页
                  </button>

                  <!-- 页码 -->
                  <button
                    v-for="page in Math.min(5, totalPages)"
                    :key="page"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium"
                    :class="
                      currentPage === page
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:bg-gray-50'
                    "
                    @click="goToPage(page)"
                  >
                    {{ page }}
                  </button>

                  <button
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    @click="goToPage(currentPage + 1)"
                  >
                    下一页
                  </button>
                  <button
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    @click="goToPage(totalPages)"
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
