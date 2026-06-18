<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ChevronLeft,
  Clock,
  Trophy,
  Zap,
  Target,
  Building,
  Briefcase,
  User,
  CheckCircle,
  Brain,
} from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const levelId = computed(() => parseInt(route.params.id as string) || 1);

// 关卡数据
const gameLevels = [
  {
    id: 1,
    name: "关卡 01",
    title: "初级：校招面试",
    status: "已解锁",
    progress: 100,
    description:
      "模拟校招面试场景，面试官会问一些基础的技术问题和行为问题，适合刚毕业的学生或实习生",
    interviews: 5,
    completed: 5,
    timeSpent: "45分钟",
    successRate: "80%",
    面试官: "初级面试官",
    公司: "互联网公司",
    面试类型: "校招",
    问题数量: 8,
    时间限制: 30,
    难度: "简单",
    奖励: "校招面试认证",
    skills: ["基础知识", "自我介绍", "项目经验", "行为问题"],
    unlockRequirements: null,
    icon: "🎓",
    background: "bg-blue-50",
    objectives: ["完成8个面试问题", "掌握基础面试技巧", "获得校招面试认证"],
  },
  {
    id: 2,
    name: "关卡 02",
    title: "中级：社招面试",
    status: "已解锁",
    progress: 30,
    description:
      "模拟社招面试场景，面试官会问一些项目经验和技术深度的问题，适合有1-3年工作经验的开发者",
    interviews: 8,
    completed: 2,
    timeSpent: "30分钟",
    successRate: "65%",
    面试官: "中级面试官",
    公司: "科技公司",
    面试类型: "社招",
    问题数量: 10,
    时间限制: 45,
    难度: "中等",
    奖励: "社招面试认证",
    skills: ["项目经验", "技术深度", "问题解决", "团队协作"],
    unlockRequirements: { level: 1, progress: 100 },
    icon: "💼",
    background: "bg-green-50",
    objectives: ["完成10个面试问题", "展示项目经验", "获得社招面试认证"],
  },
  {
    id: 3,
    name: "关卡 03",
    title: "高级：资深工程师面试",
    status: "待解锁",
    progress: 0,
    description:
      "模拟资深工程师面试场景，面试官会问一些复杂的技术问题和系统设计问题，适合有3-5年工作经验的开发者",
    interviews: 10,
    completed: 0,
    timeSpent: "0分钟",
    successRate: "0%",
    面试官: "高级面试官",
    公司: "大型科技公司",
    面试类型: "社招",
    问题数量: 12,
    时间限制: 60,
    难度: "困难",
    奖励: "资深工程师面试认证",
    skills: ["系统设计", "技术架构", "性能优化", "技术选型"],
    unlockRequirements: { level: 2, progress: 100 },
    icon: "🏆",
    background: "bg-purple-50",
    objectives: [
      "完成12个面试问题",
      "展示系统设计能力",
      "获得资深工程师面试认证",
    ],
  },
  {
    id: 4,
    name: "关卡 04",
    title: "专家：技术总监面试",
    status: "待解锁",
    progress: 0,
    description:
      "模拟技术总监面试场景，面试官会问一些战略和管理相关的问题，适合有5-8年工作经验的技术领导者",
    interviews: 6,
    completed: 0,
    timeSpent: "0分钟",
    successRate: "0%",
    面试官: "技术总监",
    公司: "知名企业",
    面试类型: "高管",
    问题数量: 8,
    时间限制: 90,
    难度: "专家",
    奖励: "技术总监面试认证",
    skills: ["团队管理", "技术战略", "项目规划", "沟通协调"],
    unlockRequirements: { level: 3, progress: 100 },
    icon: "📈",
    background: "bg-orange-50",
    objectives: ["完成8个面试问题", "展示管理能力", "获得技术总监面试认证"],
  },
  {
    id: 5,
    name: "关卡 05",
    title: "大师：CTO 面试",
    status: "待解锁",
    progress: 0,
    description:
      "模拟 CTO 面试场景，面试官会问一些公司战略和技术愿景的问题，适合有8年以上工作经验的高级技术领导者",
    interviews: 4,
    completed: 0,
    timeSpent: "0分钟",
    successRate: "0%",
    面试官: "CTO",
    公司: "行业巨头",
    面试类型: "高管",
    问题数量: 6,
    时间限制: 120,
    难度: "大师",
    奖励: "CTO 面试认证",
    skills: ["公司战略", "技术愿景", "人才培养", "业务理解"],
    unlockRequirements: { level: 4, progress: 100 },
    icon: "👑",
    background: "bg-red-50",
    objectives: ["完成6个面试问题", "展示战略思维", "获得CTO面试认证"],
  },
  {
    id: 6,
    name: "关卡 06",
    title: "挑战：跨领域面试",
    status: "待解锁",
    progress: 0,
    description:
      "模拟跨领域面试场景，面试官会问一些跨领域的技术问题，适合希望转型或扩展技能的开发者",
    interviews: 12,
    completed: 0,
    timeSpent: "0分钟",
    successRate: "0%",
    面试官: "多领域专家",
    公司: "创新企业",
    面试类型: "跨领域",
    问题数量: 15,
    时间限制: 75,
    难度: "困难",
    奖励: "跨领域专家认证",
    skills: ["跨领域知识", "快速学习", "适应性", "创新思维"],
    unlockRequirements: { level: 3, progress: 100 },
    icon: "🔄",
    background: "bg-teal-50",
    objectives: ["完成15个面试问题", "展示跨领域能力", "获得跨领域专家认证"],
  },
  {
    id: 7,
    name: "关卡 07",
    title: "终极：FAANG 面试",
    status: "待解锁",
    progress: 0,
    description:
      "模拟 FAANG 公司的面试场景，面试官会问一些极具挑战性的技术问题和系统设计问题，适合追求顶尖科技公司的开发者",
    interviews: 8,
    completed: 0,
    timeSpent: "0分钟",
    successRate: "0%",
    面试官: "FAANG 面试官",
    公司: "FAANG 公司",
    面试类型: "高级",
    问题数量: 12,
    时间限制: 90,
    难度: "专家",
    奖励: "FAANG 面试认证",
    skills: ["算法优化", "系统设计", "编码能力", "问题分析"],
    unlockRequirements: { level: 5, progress: 100 },
    icon: "🚀",
    background: "bg-indigo-50",
    objectives: ["完成12个面试问题", "展示顶尖技术能力", "获得FAANG面试认证"],
  },
];

// 当前关卡数据
const currentLevel = ref(
  gameLevels.find((level) => level.id === levelId.value) || gameLevels[0],
);

// 方法
const backToLevels = () => {
  router.push("/game-interview");
};

const startInterview = () => {
  router.push(`/game-interview/level/${levelId.value}`);
};

// 计算属性
const difficultyColor = computed(() => {
  switch (currentLevel.value?.难度) {
    case "简单":
      return "bg-auxiliary-green/10 text-auxiliary-green";
    case "中等":
      return "bg-primary/10 text-primary";
    case "困难":
      return "bg-auxiliary-orange/10 text-auxiliary-orange";
    case "专家":
      return "bg-auxiliary-purple/10 text-auxiliary-purple";
    case "大师":
      return "bg-auxiliary-red/10 text-auxiliary-red";
    default:
      return "bg-neutral-border/50 text-neutral-helper";
  }
});

const difficultyIcon = computed(() => {
  switch (currentLevel.value?.难度) {
    case "简单":
      return "🌱";
    case "中等":
      return "📈";
    case "困难":
      return "🔥";
    case "专家":
      return "💎";
    case "大师":
      return "👑";
    default:
      return "📌";
  }
});

onMounted(() => {
  // 检查关卡是否存在
  if (!currentLevel.value) {
    router.push("/game-interview");
  }
});
</script>

<template>
  <div class="flex flex-col gap-8 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <button
        class="flex items-center gap-2 text-neutral-title font-bold hover:text-primary transition-colors"
        @click="backToLevels"
      >
        <ChevronLeft :size="24" />
        返回关卡列表
      </button>
      <div class="text-center">
        <h1 class="text-3xl font-black text-neutral-title">
          {{ currentLevel?.name }}: {{ currentLevel?.title }}
        </h1>
        <p class="text-sm text-neutral-helper">
          {{ currentLevel?.description }}
        </p>
      </div>
      <div class="w-40"></div>
      <!-- 占位，保持标题居中 -->
    </div>

    <!-- Level Detail Card -->
    <div
      class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
    >
      <!-- Level Info -->
      <div
        class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm"
            :class="currentLevel?.background"
          >
            <span class="text-3xl">{{ currentLevel?.icon }}</span>
          </div>
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm font-bold text-primary">{{
                currentLevel?.name
              }}</span>
              <span
                v-if="currentLevel?.status === '已解锁'"
                class="px-3 py-1 bg-auxiliary-green/10 text-auxiliary-green text-xs font-bold rounded-full"
                >已解锁</span
              >
              <span
                v-else
                class="px-3 py-1 bg-neutral-border/50 text-neutral-helper text-xs font-bold rounded-full"
                >未解锁</span
              >
            </div>
            <h2 class="text-2xl font-bold text-neutral-title mb-1">
              {{ currentLevel?.title }}
            </h2>
            <p class="text-sm text-neutral-helper">
              {{ currentLevel?.description }}
            </p>
          </div>
        </div>
        <div
          class="flex items-center gap-3 px-4 py-2 rounded-xl"
          :class="difficultyColor"
        >
          <span class="text-xl">{{ difficultyIcon }}</span>
          <span class="font-bold text-sm">{{ currentLevel?.难度 }}</span>
        </div>
      </div>

      <!-- Key Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="p-4 bg-neutral-bg rounded-[20px]">
          <div class="flex items-center gap-2 mb-2">
            <Building :size="20" class="text-primary" />
            <h3 class="font-bold text-neutral-title">公司</h3>
          </div>
          <p class="text-sm text-neutral-body">{{ currentLevel?.公司 }}</p>
        </div>
        <div class="p-4 bg-neutral-bg rounded-[20px]">
          <div class="flex items-center gap-2 mb-2">
            <Briefcase :size="20" class="text-primary" />
            <h3 class="font-bold text-neutral-title">面试类型</h3>
          </div>
          <p class="text-sm text-neutral-body">{{ currentLevel?.面试类型 }}</p>
        </div>
        <div class="p-4 bg-neutral-bg rounded-[20px]">
          <div class="flex items-center gap-2 mb-2">
            <User :size="20" class="text-primary" />
            <h3 class="font-bold text-neutral-title">面试官</h3>
          </div>
          <p class="text-sm text-neutral-body">{{ currentLevel?.面试官 }}</p>
        </div>
        <div class="p-4 bg-neutral-bg rounded-[20px]">
          <div class="flex items-center gap-2 mb-2">
            <Trophy :size="20" class="text-primary" />
            <h3 class="font-bold text-neutral-title">奖励</h3>
          </div>
          <p class="text-sm text-neutral-body">{{ currentLevel?.奖励 }}</p>
        </div>
      </div>

      <!-- Time and Questions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="p-4 bg-neutral-bg rounded-[20px]">
          <div class="flex items-center gap-2 mb-2">
            <Clock :size="20" class="text-primary" />
            <h3 class="font-bold text-neutral-title">时间限制</h3>
          </div>
          <p class="text-lg font-bold text-neutral-title">
            {{ currentLevel?.时间限制 }} 分钟
          </p>
        </div>
        <div class="p-4 bg-neutral-bg rounded-[20px]">
          <div class="flex items-center gap-2 mb-2">
            <Zap :size="20" class="text-primary" />
            <h3 class="font-bold text-neutral-title">问题数量</h3>
          </div>
          <p class="text-lg font-bold text-neutral-title">
            {{ currentLevel?.问题数量 }} 题
          </p>
        </div>
        <div class="p-4 bg-neutral-bg rounded-[20px]">
          <div class="flex items-center gap-2 mb-2">
            <CheckCircle :size="20" class="text-primary" />
            <h3 class="font-bold text-neutral-title">成功率</h3>
          </div>
          <p class="text-lg font-bold text-neutral-title">
            {{ currentLevel?.successRate }}
          </p>
        </div>
      </div>

      <!-- Skills -->
      <div class="mb-8">
        <div class="flex items-center gap-2 mb-4">
          <Brain :size="20" class="text-primary" />
          <h3 class="font-bold text-neutral-title">关键技能</h3>
        </div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(skill, index) in currentLevel?.skills"
            :key="index"
            class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full"
          >
            {{ skill }}
          </span>
        </div>
      </div>

      <!-- Objectives -->
      <div class="mb-8">
        <div class="flex items-center gap-2 mb-4">
          <Target :size="20" class="text-primary" />
          <h3 class="font-bold text-neutral-title">关卡目标</h3>
        </div>
        <div class="space-y-2">
          <div
            v-for="(objective, index) in currentLevel?.objectives"
            :key="index"
            class="flex items-center gap-3 p-3 bg-neutral-bg rounded-[16px]"
          >
            <div
              class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs"
            >
              {{ index + 1 }}
            </div>
            <p class="text-sm text-neutral-body">{{ objective }}</p>
          </div>
        </div>
      </div>

      <!-- Progress -->
      <div class="mb-8">
        <div
          class="flex justify-between text-sm font-bold text-neutral-title mb-2"
        >
          <span>关卡进度</span>
          <span>{{ currentLevel?.progress }}%</span>
        </div>
        <div class="h-2 bg-neutral-border rounded-full overflow-hidden">
          <div
            class="h-full bg-primary transition-all duration-1000"
            :style="{ width: currentLevel?.progress + '%' }"
          ></div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-4">
        <button
          class="flex-1 py-4 bg-neutral-bg text-neutral-title font-bold rounded-2xl hover:bg-neutral-border/50 transition-all"
          @click="backToLevels"
        >
          返回
        </button>
        <button
          class="flex-1 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
          :disabled="currentLevel?.status !== '已解锁'"
          :class="
            currentLevel?.status !== '已解锁'
              ? 'bg-neutral-border text-neutral-helper cursor-not-allowed'
              : ''
          "
          @click="startInterview"
        >
          <Zap :size="20" />
          {{ currentLevel?.status === "已解锁" ? "开始面试" : "未解锁" }}
        </button>
      </div>
    </div>
  </div>
</template>
