<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import echarts from "@/utils/echarts";
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
  X,
} from "lucide-vue-next";
import { useUserStore } from "@/stores/user";
import { useLearningStore } from "@/stores/learning";
import type { GameLevel } from "@/api/types/interview.types";
import type { WrongQuestion } from "@/api/types/learning.types";

const router = useRouter();
const userStore = useUserStore();
const learningStore = useLearningStore();
const {
  interviewHistory,
  abilityData,
  gameInterviewData,
  resumeData,
  resumeDiagnosisResult,
} = storeToRefs(userStore);
const { collections, wrongQuestions } = storeToRefs(learningStore);

const chartRef = ref<HTMLElement | null>(null);
let myChart: echarts.ECharts | null = null;
const isChartLoading = ref(true);

const targetPosition = ref("前端开发工程师");
const positions = [
  "前端开发工程师",
  "Java 开发工程师",
  "产品经理",
  "UI 设计师",
];

const defaultAbilityItem = {
  current: [0, 0, 0, 0, 0, 0, 0],
  required: [0, 0, 0, 0, 0, 0, 0],
  indicators: [
    { name: "技术深度", max: 100 },
    { name: "逻辑思维", max: 100 },
    { name: "表达能力", max: 100 },
    { name: "项目经验", max: 100 },
    { name: "学习潜力", max: 100 },
    { name: "工程化能力", max: 100 },
    { name: "团队协作", max: 100 },
  ],
  gap_skills: [],
  strengths: [],
};

const currentAbilityData = computed(() => {
  const item = abilityData.value?.abilities?.[0];
  if (!item) return defaultAbilityItem;
  return {
    current: item.current ?? defaultAbilityItem.current,
    required: item.required ?? defaultAbilityItem.required,
    indicators: item.indicators ?? defaultAbilityItem.indicators,
    gap_skills: item.gap_skills ?? defaultAbilityItem.gap_skills,
    strengths: item.strengths ?? defaultAbilityItem.strengths,
  };
});

const abilityGap = computed(() => {
  const data = currentAbilityData.value;
  const currentSum = data.current.reduce(
    (sum: number, val: number) => sum + val,
    0,
  );
  const requiredSum = data.required.reduce(
    (sum: number, val: number) => sum + val,
    0,
  );
  return Math.round(
    ((requiredSum - currentSum) / (data.indicators.length * 100)) * 100,
  );
});

const matchRate = computed(() => {
  return 100 - abilityGap.value;
});

const isReanalyzing = ref(false);

const changePosition = (position: string) => {
  targetPosition.value = position;
  initChart();
};

const reanalyze = async () => {
  isReanalyzing.value = true;
  try {
    await userStore.fetchAbilityData();
    initChart();
  } finally {
    isReanalyzing.value = false;
  }
};

const getSkillColor = (level: string) => {
  switch (level) {
    case "high":
      return "bg-auxiliary-red/10 border-auxiliary-red/30 text-auxiliary-red";
    case "medium":
      return "bg-auxiliary-yellow/10 border-auxiliary-yellow/30 text-auxiliary-orange";
    case "low":
      return "bg-auxiliary-green/10 border-auxiliary-green/30 text-auxiliary-green";
    default:
      return "bg-neutral-bg border-neutral-border text-neutral-body";
  }
};

const filterStatus = ref("all");
const sortBy = ref("date");
const isExpanded = ref<number | null>(null);
const isLoading = ref(false);
const isAllInterviewsPageOpen = ref(false);
const isPracticeModalOpen = ref(false);
const isReviewModalOpen = ref(false);
const isLevelDetailModalOpen = ref(false);
interface QuestionBank {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  questionCount: number;
  progress: number;
}

const currentBank = ref<QuestionBank | null>(null);
const currentMistake = ref<WrongQuestion | null>(null);
const currentLevel = ref<GameLevel | null>(null);

const filteredInterviews = computed(() => {
  let result = [...interviewHistory.value];

  if (filterStatus.value !== "all") {
    result = result.filter((item) => item.status === filterStatus.value);
  }

  result.sort((a, b) => {
    if (sortBy.value === "date") {
      return new Date(b.start_time || b.created_at).getTime() - new Date(a.start_time || a.created_at).getTime();
    } else if (sortBy.value === "score") {
      return (b.score ?? 0) - (a.score ?? 0);
    }
    return 0;
  });

  return result;
});

const toggleExpand = (id: number) => {
  isExpanded.value = isExpanded.value === id ? null : id;
};

const practiceAgain = (interview: any) => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    alert(`正在为您生成 ${interview.job_position_title} 的相似面试练习...`);
  }, 1000);
};

const exportRecord = (_id: number) => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    alert("面试记录已导出到本地");
  }, 1000);
};

const openAllInterviewsPage = () => {
  isAllInterviewsPageOpen.value = true;
};

const closeAllInterviewsPage = () => {
  isAllInterviewsPageOpen.value = false;
};

const shareExperience = (_id: number) => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    alert("面试经验分享链接已复制到剪贴板");
  }, 1000);
};

const stats = computed(() => [
  {
    label: "累计面试",
    value: String(interviewHistory.value.length),
    icon: History,
    color: "text-primary",
  },
  {
    label: "平均匹配度",
    value: `${matchRate.value}%`,
    icon: Target,
    color: "text-auxiliary-orange",
  },
  {
    label: "完成场次",
    value: String(gameInterviewData.value?.completed_sessions ?? 0),
    icon: ShieldCheck,
    color: "text-auxiliary-green",
  },
]);

const activeTab = ref("saved");
const expandedBankId = ref<number | null>(null);
const expandedMistakeId = ref<number | null>(null);

const toggleBankExpand = (id: number) => {
  expandedBankId.value = expandedBankId.value === id ? null : id;
};

const toggleMistakeExpand = (id: number) => {
  expandedMistakeId.value = expandedMistakeId.value === id ? null : id;
};

const practiceBank = (bank: QuestionBank) => {
  currentBank.value = bank;
  isPracticeModalOpen.value = true;
};

const reviewMistake = (mistake: WrongQuestion) => {
  currentMistake.value = mistake;
  isReviewModalOpen.value = true;
};

const closePracticeModal = () => {
  isPracticeModalOpen.value = false;
  currentBank.value = null;
};

const closeReviewModal = () => {
  isReviewModalOpen.value = false;
  currentMistake.value = null;
};

const startPractice = () => {
  if (!currentBank.value) return;

  const bankId = currentBank.value.id;
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    closePracticeModal();
    router.push(`/practice/${bankId}`);
  }, 1000);
};

const markAsReviewed = async (id: number) => {
  try {
    await learningStore.markWrongQuestionMastered(id);
    alert("已标记为已复习");
  } catch {
    alert("标记失败");
  }
};

const removeSavedBank = (id: number) => {
  if (confirm("确定要移除这个收藏的题库吗？")) {
    const index = collections.value.findIndex((bank) => bank.id === id);
    if (index !== -1) {
      collections.value.splice(index, 1);
      alert("已移除收藏的题库");
    }
  }
};

const removeMistake = (id: number) => {
  if (confirm("确定要从错题本中移除这道题吗？")) {
    const index = wrongQuestions.value.findIndex(
      (mistake) => mistake.id === id,
    );
    if (index !== -1) {
      wrongQuestions.value.splice(index, 1);
      alert("已从错题本中移除");
    }
  }
};

const unreviewedMistakesCount = computed(() => {
  return wrongQuestions.value.filter(
    (mistake) => mistake.status === "unreviewed",
  ).length;
});

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "bg-auxiliary-green/10 text-auxiliary-green";
    case "medium":
      return "bg-auxiliary-orange/10 text-auxiliary-orange";
    case "hard":
      return "bg-auxiliary-red/10 text-auxiliary-red";
    case "expert":
      return "bg-auxiliary-purple/10 text-auxiliary-purple";
    default:
      return "bg-neutral-bg text-neutral-body";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-auxiliary-green/10 text-auxiliary-green";
    case "in_progress":
      return "bg-auxiliary-orange/10 text-auxiliary-orange";
    case "unreviewed":
      return "bg-auxiliary-red/10 text-auxiliary-red";
    case "reviewed":
      return "bg-primary/10 text-primary";
    default:
      return "bg-neutral-bg text-neutral-body";
  }
};

const activeGameTab = ref("overview");
const expandedLevelId = ref<number | null>(null);

const isResumeDiagnosisModalOpen = ref(false);
const isDiagnosing = ref(false);

const isProfileUpdateModalOpen = ref(false);
const isSavingProfile = ref(false);
const profileForm = ref({
  education: "",
  target_position: "",
  work_years: 0,
});

const switchGameTab = (tab: string) => {
  activeGameTab.value = tab;
};

const toggleLevelExpand = (id: number) => {
  expandedLevelId.value = expandedLevelId.value === id ? null : id;
};

const showLevelDetail = (_id: number) => {
  // 游戏化面试关卡详情暂不可用，后端仅返回统计数据
};

const startLevel = (id: number) => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    router.push(`/game-interview/level/${id}`);
  }, 1000);
};

const continueLevel = (id: number) => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    router.push(`/game-interview/level/${id}?continue=true`);
  }, 1000);
};

const closeLevelDetailModal = () => {
  isLevelDetailModalOpen.value = false;
  currentLevel.value = null;
};

const openResumeDiagnosisModal = () => {
  isResumeDiagnosisModalOpen.value = true;
};

const closeResumeDiagnosisModal = () => {
  isResumeDiagnosisModalOpen.value = false;
  resumeDiagnosisResult.value = null;
};

const startResumeDiagnosis = async () => {
  if (!resumeData.value?.id) return;
  isDiagnosing.value = true;
  try {
    await userStore.diagnoseResume(resumeData.value.id, targetPosition.value);
  } catch {
    alert("诊断失败，请稍后重试");
  } finally {
    isDiagnosing.value = false;
  }
};

const openProfileUpdateModal = () => {
  isProfileUpdateModalOpen.value = true;
};

const closeProfileUpdateModal = () => {
  isProfileUpdateModalOpen.value = false;
};

const saveProfile = async () => {
  isSavingProfile.value = true;
  try {
    await userStore.updateProfile({
      education: profileForm.value.education,
      target_position: profileForm.value.target_position,
      work_years: profileForm.value.work_years,
    });
    closeProfileUpdateModal();
    alert("个人档案更新成功！");
  } catch {
    alert("保存失败，请稍后重试");
  } finally {
    isSavingProfile.value = false;
  }
};

const getBadgeIcon = (badge: string | null) => {
  switch (badge) {
    case "bronze":
      return "🥉";
    case "silver":
      return "🥈";
    case "gold":
      return "🥇";
    default:
      return null;
  }
};

const getDifficultyText = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "简单";
    case "medium":
      return "中等";
    case "hard":
      return "困难";
    case "expert":
      return "专家";
    default:
      return "未知";
  }
};

const initChart = () => {
  if (chartRef.value) {
    isChartLoading.value = false;
    if (myChart) {
      myChart.dispose();
    }
    myChart = echarts.init(chartRef.value);
    const data = currentAbilityData.value;
    const option = {
      tooltip: {
        trigger: "axis",
        backgroundColor: "#fff",
        borderColor: "#18C5C7",
        borderWidth: 1,
        textStyle: { color: "#1E293B" },
        formatter: function (params: any) {
          let result = params[0].name + "<br/>";
          params.forEach((item: any) => {
            result +=
              item.marker + item.seriesName + ": " + item.value + "<br/>";
          });
          return result;
        },
      },
      legend: {
        data: ["当前能力", "岗位要求"],
        bottom: 0,
        icon: "circle",
        textStyle: {
          fontSize: 12,
          color: "#64748B",
        },
      },
      radar: {
        indicator: data.indicators,
        splitArea: {
          show: true,
          areaStyle: {
            color: ["rgba(24, 197, 199, 0.05)", "rgba(24, 197, 199, 0.1)"],
          },
        },
        axisLine: {
          lineStyle: {
            color: "#F1F5F9",
          },
        },
        splitLine: {
          lineStyle: {
            color: "#E2E8F0",
          },
        },
      },
      series: [
        {
          name: "能力对比",
          type: "radar",
          data: [
            {
              value: data.current,
              name: "当前能力",
              itemStyle: { color: "#18C5C7" },
              areaStyle: {
                color: "rgba(24, 197, 199, 0.2)",
                opacity: 0.8,
              },
              lineStyle: {
                width: 2,
              },
              emphasis: {
                lineStyle: {
                  width: 4,
                },
              },
            },
            {
              value: data.required,
              name: "岗位要求",
              itemStyle: { color: "#FFC585" },
              lineStyle: {
                type: "dashed",
                width: 2,
              },
              areaStyle: {
                color: "rgba(255, 197, 133, 0.1)",
                opacity: 0.6,
              },
              emphasis: {
                lineStyle: {
                  width: 3,
                },
              },
            },
          ],
        },
      ],
    };
    myChart.setOption(option);
  }
};

onMounted(async () => {
  await Promise.all([
    userStore.fetchAllUserData(),
    learningStore.fetchCollections(),
    learningStore.fetchWrongQuestions(),
  ]);
  initChart();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  myChart?.dispose();
});

const handleResize = () => {
  myChart?.resize();
};
</script>

<template>
  <div>
    <div class="flex flex-col gap-8 max-w-7xl mx-auto">
      <!-- User Profile Hero -->
      <div
        class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border relative overflow-hidden"
      >
        <div
          class="flex flex-col lg:flex-row items-center lg:items-start gap-8 relative z-10"
        >
          <div class="relative">
            <div
              class="w-32 h-32 rounded-[40px] gradient-cyan-yellow p-1 shadow-lg"
            >
              <div
                class="w-full h-full bg-white rounded-[38px] p-1 flex items-center justify-center"
              >
                <div
                  class="w-full h-full bg-neutral-bg rounded-[36px] flex items-center justify-center text-neutral-helper"
                >
                  <User :size="64" stroke-width="1.5" />
                </div>
              </div>
            </div>
            <div
              class="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-2xl border-4 border-white shadow-md"
            >
              <ShieldCheck :size="16" />
            </div>
          </div>

          <div class="flex-1 text-center lg:text-left">
            <div class="flex flex-col md:flex-row items-center gap-4 mb-4">
              <h1 class="text-3xl font-black text-neutral-title tracking-tight">
                王同学
              </h1>
              <div class="flex gap-2">
                <span
                  class="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider"
                  >AI 简历已认证</span
                >
                <span
                  class="px-3 py-1 bg-auxiliary-orange/10 text-auxiliary-orange text-[10px] font-bold rounded-full uppercase tracking-wider"
                  >求职 Rank: Top 5%</span
                >
              </div>
            </div>

            <div
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-8"
            >
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
              <div
                v-for="stat in stats"
                :key="stat.label"
                class="bg-neutral-bg min-w-[120px] px-6 py-4 rounded-3xl flex flex-col items-center justify-center gap-2 group hover:bg-white hover:shadow-md transition-all cursor-default border border-transparent hover:border-neutral-border"
              >
                <component
                  :is="stat.icon"
                  :size="20"
                  :class="stat.color"
                  class="opacity-80 group-hover:scale-110 transition-transform"
                />
                <div class="text-center">
                  <p
                    class="text-xl font-black text-neutral-title leading-tight"
                  >
                    {{ stat.value }}
                  </p>
                  <p
                    class="text-[10px] text-neutral-helper uppercase font-bold mt-1 tracking-tighter"
                  >
                    {{ stat.label }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <button
              class="px-6 py-3 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2"
              @click="openResumeDiagnosisModal"
            >
              <Sparkles :size="18" />
              AI 简历诊断
            </button>
            <button
              class="px-6 py-3 bg-neutral-bg text-neutral-title font-bold rounded-2xl hover:bg-neutral-border/50 transition-all flex items-center gap-2"
              @click="openProfileUpdateModal"
            >
              <FileText :size="18" />
              更新个人档案
            </button>
          </div>
        </div>
        <div
          class="absolute top-0 right-0 w-64 h-64 gradient-primary opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2"
        ></div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <!-- Left Column -->
        <div class="lg:col-span-8 flex flex-col gap-8">
          <!-- Ability Gap Visualization -->
          <div
            class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
          >
            <div class="flex items-center justify-between mb-8">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center text-white shadow-md"
                >
                  <Target :size="20" />
                </div>
                <div>
                  <h2
                    class="text-lg font-bold text-neutral-title tracking-tight"
                  >
                    能力差距可视化图谱
                  </h2>
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
                            : 'bg-neutral-bg text-neutral-body hover:bg-neutral-border/50',
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
                  isReanalyzing
                    ? 'bg-neutral-bg text-neutral-helper cursor-not-allowed'
                    : 'bg-neutral-bg text-neutral-body hover:bg-neutral-border/50',
                ]"
                :disabled="isReanalyzing"
                @click="reanalyze"
              >
                <span v-if="isReanalyzing" class="animate-spin">🔄</span>
                {{ isReanalyzing ? "分析中..." : "重新分析" }}
              </button>
            </div>

            <!-- Ability Match Rate -->
            <div class="mb-8">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-bold text-neutral-title"
                  >岗位匹配度</span
                >
                <span class="text-lg font-black text-primary"
                  >{{ matchRate }}%</span
                >
              </div>
              <div class="h-2 bg-neutral-bg rounded-full overflow-hidden">
                <div
                  class="h-full gradient-primary transition-all duration-1000 ease-out"
                  :style="{ width: matchRate + '%' }"
                ></div>
              </div>
            </div>

            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8"
            >
              <div class="relative h-80">
                <div
                  v-if="isChartLoading"
                  class="absolute inset-0 bg-neutral-bg animate-pulse rounded-2xl"
                ></div>
                <div ref="chartRef" class="w-full h-full"></div>
              </div>
              <div class="space-y-6">
                <!-- Gap Skills -->
                <div>
                  <p
                    class="text-sm font-bold text-neutral-title mb-3 flex items-center gap-2"
                  >
                    <span class="w-2 h-2 rounded-full bg-auxiliary-red"></span>
                    待提升技能项
                  </p>
                  <div class="space-y-3">
                    <div
                      v-for="skill in currentAbilityData.gap_skills"
                      :key="skill.name"
                      :class="[
                        'p-3 rounded-2xl border flex items-center justify-between transition-all hover:shadow-sm',
                        getSkillColor(skill.level),
                      ]"
                    >
                      <span class="text-xs font-medium">{{ skill.name }}</span>
                      <span class="text-xs font-bold"
                        >{{
                          skill.level === "high"
                            ? "⚠️"
                            : skill.level === "medium"
                              ? "⚡"
                              : "✅"
                        }}
                        差距 -{{ skill.gap }}%</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Strengths -->
                <div>
                  <p
                    class="text-sm font-bold text-neutral-title mb-3 flex items-center gap-2"
                  >
                    <span class="w-2 h-2 rounded-full bg-primary"></span>
                    优势技能项
                  </p>
                  <div class="space-y-3">
                    <div
                      v-for="skill in currentAbilityData.strengths"
                      :key="skill.name"
                      class="p-3 bg-primary/10 rounded-2xl border border-primary/30 flex items-center justify-between transition-all hover:shadow-sm"
                    >
                      <span class="text-xs font-medium text-neutral-body">{{
                        skill.name
                      }}</span>
                      <span class="text-xs font-bold text-primary"
                        >{{ skill.score }}%</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Improvement Suggestions -->
            <div class="p-6 bg-neutral-bg rounded-2xl">
              <h3
                class="text-sm font-bold text-neutral-title mb-4 flex items-center gap-2"
              >
                <Sparkles :size="16" class="text-primary" />
                提升建议
              </h3>
              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <div
                    class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5"
                  >
                    1
                  </div>
                  <p class="text-xs text-neutral-body leading-relaxed">
                    针对<span class="font-bold text-neutral-title">{{
                      currentAbilityData.gap_skills[0]?.name
                    }}</span
                    >，建议通过实际项目实践和源码学习来提升，可参考官方文档和优质教程。
                  </p>
                </div>
                <div class="flex items-start gap-3">
                  <div
                    class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5"
                  >
                    2
                  </div>
                  <p class="text-xs text-neutral-body leading-relaxed">
                    增强<span class="font-bold text-neutral-title">{{
                      currentAbilityData.gap_skills[1]?.name
                    }}</span
                    >，可参与开源项目或搭建完整的工程化架构，积累实战经验。
                  </p>
                </div>
                <div class="flex items-start gap-3">
                  <div
                    class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5"
                  >
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
          <div
            class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border flex-1 flex flex-col"
          >
            <div
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-2xl gradient-cyan-yellow flex items-center justify-center text-primary shadow-md"
                >
                  <History :size="20" />
                </div>
                <h2 class="text-lg font-bold text-neutral-title tracking-tight">
                  面试实战记录 (近2年)
                </h2>
              </div>

              <div
                class="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto"
              >
                <div
                  class="flex items-center gap-2 px-3 py-1.5 bg-neutral-bg rounded-xl border border-neutral-border flex-1 sm:flex-none"
                >
                  <Search :size="14" class="text-neutral-helper" />
                  <input
                    type="text"
                    placeholder="搜索历史..."
                    class="bg-transparent border-none text-xs focus:ring-0 w-full sm:w-24"
                  />
                </div>

                <div class="flex items-center gap-2">
                  <div
                    class="flex items-center gap-1 bg-neutral-bg rounded-xl border border-neutral-border p-1"
                  >
                    <button
                      :class="[
                        'px-3 py-1 text-xs font-bold transition-all',
                        filterStatus === 'all'
                          ? 'bg-primary text-white rounded-lg'
                          : 'text-neutral-body hover:bg-neutral-border/50 rounded-lg',
                      ]"
                      @click="filterStatus = 'all'"
                    >
                      全部
                    </button>
                    <button
                      :class="[
                        'px-3 py-1 text-xs font-bold transition-all',
                        filterStatus === 'completed'
                          ? 'bg-auxiliary-green text-white rounded-lg'
                          : 'text-neutral-body hover:bg-neutral-border/50 rounded-lg',
                      ]"
                      @click="filterStatus = 'completed'"
                    >
                      已完成
                    </button>
                    <button
                      :class="[
                        'px-3 py-1 text-xs font-bold transition-all',
                        filterStatus === 'failed'
                          ? 'bg-auxiliary-red text-white rounded-lg'
                          : 'text-neutral-body hover:bg-neutral-border/50 rounded-lg',
                      ]"
                      @click="filterStatus = 'failed'"
                    >
                      未通过
                    </button>
                  </div>

                  <div
                    class="flex items-center gap-1 bg-neutral-bg rounded-xl border border-neutral-border p-1"
                  >
                    <button
                      :class="[
                        'px-3 py-1 text-xs font-bold transition-all',
                        sortBy === 'date'
                          ? 'bg-primary text-white rounded-lg'
                          : 'text-neutral-body hover:bg-neutral-border/50 rounded-lg',
                      ]"
                      @click="sortBy = 'date'"
                    >
                      时间
                    </button>
                    <button
                      :class="[
                        'px-3 py-1 text-xs font-bold transition-all',
                        sortBy === 'score'
                          ? 'bg-primary text-white rounded-lg'
                          : 'text-neutral-body hover:bg-neutral-border/50 rounded-lg',
                      ]"
                      @click="sortBy = 'score'"
                    >
                      分数
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-4 flex-1">
              <div
                v-for="item in filteredInterviews.slice(0, 5)"
                :key="item.id"
                class="group"
              >
                <!-- 面试记录卡片 -->
                <div
                  class="flex items-center justify-between p-4 bg-neutral-bg rounded-[20px] hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border cursor-pointer"
                  @click="toggleExpand(item.id)"
                >
                  <div class="flex items-center gap-4">
                    <div
                      class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:gradient-primary group-hover:text-white transition-all"
                    >
                      <Activity :size="20" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <h4
                          class="text-sm font-bold text-neutral-title group-hover:text-primary transition-colors truncate"
                        >
                          {{ item.job_position_title || '面试记录' }}
                        </h4>
                        <span
                          class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          :class="
                            item.status === 'completed'
                              ? 'bg-auxiliary-green/10 text-auxiliary-green'
                              : 'bg-auxiliary-red/10 text-auxiliary-red'
                          "
                          >{{ item.status === 'completed' ? '已完成' : '未通过' }}</span
                        >
                      </div>
                      <div
                        class="flex flex-wrap items-center gap-2 text-[11px] text-neutral-helper"
                      >
                        <span>{{ item.start_time ? new Date(item.start_time).toLocaleDateString() : new Date(item.created_at).toLocaleDateString() }}</span>
                        <span v-if="item.current_round">·</span>
                        <span v-if="item.current_round">第 {{ item.current_round }} 轮</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="text-right">
                      <p class="text-lg font-black text-neutral-title">
                        {{ item.score ?? '-'
                        }}<span
                          class="text-[10px] font-normal opacity-40 ml-0.5"
                          >分</span
                        >
                      </p>
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
                  <div class="space-y-3 mb-4">
                    <div class="flex items-center gap-2 text-xs text-neutral-body">
                      <Calendar :size="14" class="text-primary" />
                      <span>开始: {{ item.start_time ? new Date(item.start_time).toLocaleString() : '-' }}</span>
                      <span class="text-neutral-helper">→</span>
                      <span>结束: {{ item.end_time ? new Date(item.end_time).toLocaleString() : '-' }}</span>
                    </div>
                    <div v-if="item.current_round" class="flex items-center gap-2 text-xs text-neutral-body">
                      <Target :size="14" class="text-auxiliary-orange" />
                      <span>当前轮次: 第 {{ item.current_round }} 轮</span>
                    </div>
                  </div>

                  <!-- 操作按钮 -->
                  <div
                    class="flex flex-wrap gap-3 pt-4 border-t border-neutral-border"
                  >
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
              <div
                v-if="filteredInterviews.length > 5"
                class="mt-6 text-center"
              >
                <button
                  class="px-8 py-3 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 mx-auto"
                  @click="openAllInterviewsPage"
                >
                  查看更多 <ChevronRight :size="16" />
                </button>
              </div>
            </div>

            <!-- 空状态 -->
            <div
              v-if="filteredInterviews.length === 0"
              class="flex-1 flex flex-col items-center justify-center py-12 text-center"
            >
              <div
                class="w-20 h-20 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper mb-4"
              >
                <History :size="40" />
              </div>
              <h3 class="text-sm font-bold text-neutral-title mb-2">
                暂无面试记录
              </h3>
              <p class="text-xs text-neutral-helper mb-6">
                开始你的第一次模拟面试吧
              </p>
              <button
                class="px-6 py-3 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2"
              >
                <Sparkles :size="16" />
                开始模拟面试
              </button>
            </div>

            <!-- 加载状态 -->
            <div
              v-if="isLoading"
              class="absolute inset-0 bg-white/80 flex items-center justify-center z-10"
            >
              <div
                class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"
              ></div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="lg:col-span-4 flex flex-col gap-8">
          <!-- Saved Questions / Mistake Book -->
          <div
            class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
          >
            <h3
              class="font-bold text-neutral-title mb-6 flex items-center gap-2"
            >
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
                    : 'bg-neutral-bg text-neutral-body hover:bg-neutral-border/50',
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
                    : 'bg-neutral-bg text-neutral-body hover:bg-neutral-border/50',
                ]"
                @click="activeTab = 'mistakes'"
              >
                错题本
                <span
                  v-if="unreviewedMistakesCount > 0"
                  class="ml-2 px-2 py-0.5 bg-auxiliary-red text-white text-[10px] rounded-full"
                >
                  {{ unreviewedMistakesCount }}
                </span>
              </button>
            </div>

            <!-- 收藏题库内容 -->
            <div v-if="activeTab === 'saved'" class="space-y-4">
              <div v-for="bank in collections" :key="bank.id" class="group">
                <!-- 题库卡片 -->
                <div
                  class="p-4 bg-neutral-bg rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border"
                  @click="toggleBankExpand(bank.id)"
                >
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-white rounded-xl text-primary shadow-sm">
                      <Code2 :size="16" />
                    </div>
                    <div>
                      <span class="text-sm font-bold text-neutral-title">{{
                        bank.title
                      }}</span>
                      <p class="text-[10px] text-neutral-helper mt-1">
                        {{ bank.description }}
                      </p>
                      <div class="flex items-center gap-2 mt-2">
                        <span
                          class="text-[9px] px-2 py-0.5"
                          :class="getDifficultyColor(bank.difficulty)"
                          >{{
                            bank.difficulty === "easy"
                              ? "简单"
                              : bank.difficulty === "medium"
                                ? "中等"
                                : "困难"
                          }}</span
                        >
                        <span
                          class="text-[9px] px-2 py-0.5 bg-primary/10 text-primary"
                          >{{ bank.category }}</span
                        >
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="text-right">
                      <p class="text-lg font-black text-neutral-title">
                        {{ bank.questionCount
                        }}<span
                          class="text-[10px] font-normal opacity-40 ml-0.5"
                          >题</span
                        >
                      </p>
                      <p class="text-[10px] text-neutral-helper">
                        {{ bank.lastPracticed }}
                      </p>
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
                      <h5 class="text-xs font-bold text-neutral-title mb-3">
                        题目列表
                      </h5>
                      <div class="space-y-2">
                        <div
                          v-for="question in bank.questions"
                          :key="question.id"
                          class="flex items-center justify-between p-3 bg-white rounded-xl border border-neutral-border"
                        >
                          <div class="flex items-center gap-2">
                            <span
                              class="text-xs font-medium text-neutral-title"
                              >{{ question.title }}</span
                            >
                            <span
                              class="text-[9px] px-2 py-0.5"
                              :class="getDifficultyColor(question.difficulty)"
                              >{{
                                question.difficulty === "easy"
                                  ? "简单"
                                  : question.difficulty === "medium"
                                    ? "中等"
                                    : "困难"
                              }}</span
                            >
                          </div>
                          <span
                            class="text-[9px] px-2 py-0.5"
                            :class="getStatusColor(question.status)"
                            >{{
                              question.status === "completed"
                                ? "已完成"
                                : "进行中"
                            }}</span
                          >
                        </div>
                      </div>
                    </div>

                    <div class="flex gap-3">
                      <button
                        class="flex-1 py-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                        @click.stop="practiceBank(bank)"
                      >
                        <Zap
                          :size="14"
                          class="group-hover:scale-110 transition-transform"
                        />
                        开始练习
                      </button>
                      <button
                        class="px-4 py-3 bg-neutral-bg text-neutral-title text-xs font-bold rounded-xl hover:bg-neutral-border/50 hover:shadow-sm transition-all flex items-center justify-center gap-2 group"
                        @click.stop="removeSavedBank(bank.id)"
                      >
                        <FileWarning
                          :size="14"
                          class="group-hover:scale-110 transition-transform"
                        />
                        移除
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 空状态 -->
              <div
                v-if="collections.length === 0"
                class="flex flex-col items-center justify-center py-12 text-center"
              >
                <div
                  class="w-20 h-20 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper mb-4"
                >
                  <BookOpen :size="40" />
                </div>
                <h3 class="text-sm font-bold text-neutral-title mb-2">
                  暂无收藏题库
                </h3>
                <p class="text-xs text-neutral-helper mb-6">
                  浏览题库并收藏你感兴趣的内容
                </p>
                <button
                  class="px-6 py-3 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2"
                >
                  <Search :size="16" />
                  浏览题库
                </button>
              </div>
            </div>

            <!-- 错题本内容 -->
            <div v-if="activeTab === 'mistakes'" class="space-y-4">
              <div
                v-for="mistake in wrongQuestions"
                :key="mistake.id"
                class="group"
              >
                <!-- 错题卡片 -->
                <div
                  class="p-4 bg-neutral-bg rounded-2xl flex items-start justify-between group cursor-pointer hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border"
                  @click="toggleMistakeExpand(mistake.id)"
                >
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-2">
                      <h4
                        class="text-sm font-bold text-neutral-title group-hover:text-primary transition-colors truncate"
                      >
                        {{ mistake.question }}
                      </h4>
                      <span
                        class="text-[10px] font-bold px-2 py-0.5"
                        :class="getStatusColor(mistake.status)"
                        >{{
                          mistake.status === "reviewed" ? "已复习" : "未复习"
                        }}</span
                      >
                    </div>
                    <div
                      class="flex flex-wrap items-center gap-2 text-[11px] text-neutral-helper mb-2"
                    >
                      <span>{{ mistake.category }}</span>
                      <span>·</span>
                      <span>{{
                        mistake.difficulty === "easy"
                          ? "简单"
                          : mistake.difficulty === "medium"
                            ? "中等"
                            : "困难"
                      }}</span>
                      <span>·</span>
                      <span>错误 {{ mistake.mistakeCount }} 次</span>
                      <span>·</span>
                      <span>{{ mistake.lastMistakeAt }}</span>
                    </div>
                    <p class="text-xs text-neutral-body line-clamp-2">
                      {{ mistake.explanation }}
                    </p>
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
                        <h5 class="text-xs font-bold text-neutral-title mb-2">
                          你的答案
                        </h5>
                        <div
                          class="p-3 bg-auxiliary-red/10 rounded-xl border border-auxiliary-red/30"
                        >
                          <p class="text-xs text-auxiliary-red">
                            {{ mistake.userAnswer }}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h5 class="text-xs font-bold text-neutral-title mb-2">
                          正确答案
                        </h5>
                        <div
                          class="p-3 bg-auxiliary-green/10 rounded-xl border border-auxiliary-green/30"
                        >
                          <p class="text-xs text-auxiliary-green">
                            {{ mistake.correctAnswer }}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h5 class="text-xs font-bold text-neutral-title mb-2">
                          解析
                        </h5>
                        <div
                          class="p-3 bg-primary/10 rounded-xl border border-primary/30"
                        >
                          <p class="text-xs text-primary">
                            {{ mistake.explanation }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div class="flex gap-3">
                      <button
                        class="flex-1 py-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                        @click.stop="reviewMistake(mistake)"
                      >
                        <Zap
                          :size="14"
                          class="group-hover:scale-110 transition-transform"
                        />
                        复习此题
                      </button>
                      <button
                        v-if="mistake.status === 'unreviewed'"
                        class="px-4 py-3 bg-auxiliary-green text-white text-xs font-bold rounded-xl hover:bg-auxiliary-green/80 hover:shadow-sm transition-all flex items-center justify-center gap-2 group"
                        @click.stop="markAsReviewed(mistake.id)"
                      >
                        <CheckCircle
                          :size="14"
                          class="group-hover:scale-110 transition-transform"
                        />
                        标记已复习
                      </button>
                      <button
                        class="px-4 py-3 bg-neutral-bg text-neutral-title text-xs font-bold rounded-xl hover:bg-neutral-border/50 hover:shadow-sm transition-all flex items-center justify-center gap-2 group"
                        @click.stop="removeMistake(mistake.id)"
                      >
                        <FileWarning
                          :size="14"
                          class="group-hover:scale-110 transition-transform"
                        />
                        移除
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 空状态 -->
              <div
                v-if="wrongQuestions.length === 0"
                class="flex flex-col items-center justify-center py-12 text-center"
              >
                <div
                  class="w-20 h-20 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper mb-4"
                >
                  <FileWarning :size="40" />
                </div>
                <h3 class="text-sm font-bold text-neutral-title mb-2">
                  暂无错题记录
                </h3>
                <p class="text-xs text-neutral-helper mb-6">
                  开始练习，系统会自动记录你的错题
                </p>
                <button
                  class="px-6 py-3 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2"
                >
                  <Zap :size="16" />
                  开始练习
                </button>
              </div>
            </div>
          </div>

          <!-- Game-based Interview Data -->
          <div
            class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
          >
            <h3
              class="font-bold text-neutral-title mb-6 flex items-center gap-2"
            >
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
                    : 'bg-neutral-bg text-neutral-body hover:bg-neutral-border/50',
                ]"
                @click="switchGameTab('overview')"
              >
                概览
              </button>
            </div>

            <!-- 概览标签页 -->
            <div v-if="activeGameTab === 'overview'">
              <div class="grid grid-cols-2 gap-4">
                <div
                  class="p-4 bg-neutral-bg rounded-2xl flex flex-col items-center justify-center gap-2 group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border"
                >
                  <div
                    class="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:gradient-primary group-hover:text-white transition-all"
                  >
                    <Gamepad2 :size="20" class="text-primary" />
                  </div>
                  <p class="text-lg font-black text-neutral-title">
                    {{ gameInterviewData?.total_sessions ?? 0 }}
                  </p>
                  <p class="text-xs text-neutral-helper">累计场次</p>
                </div>
                <div
                  class="p-4 bg-neutral-bg rounded-2xl flex flex-col items-center justify-center gap-2 group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border"
                >
                  <div
                    class="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-auxiliary-green shadow-sm group-hover:gradient-primary group-hover:text-white transition-all"
                  >
                    <CheckCircle :size="20" class="text-auxiliary-green" />
                  </div>
                  <p class="text-lg font-black text-neutral-title">
                    {{ gameInterviewData?.completed_sessions ?? 0 }}
                  </p>
                  <p class="text-xs text-neutral-helper">已完成</p>
                </div>
                <div
                  class="p-4 bg-neutral-bg rounded-2xl flex flex-col items-center justify-center gap-2 group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border"
                >
                  <div
                    class="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-auxiliary-orange shadow-sm group-hover:gradient-primary group-hover:text-white transition-all"
                  >
                    <Target :size="20" class="text-auxiliary-orange" />
                  </div>
                  <p class="text-lg font-black text-neutral-title">
                    {{ gameInterviewData?.average_score?.toFixed(1) ?? '-' }}
                  </p>
                  <p class="text-xs text-neutral-helper">平均分数</p>
                </div>
                <div
                  class="p-4 bg-neutral-bg rounded-2xl flex flex-col items-center justify-center gap-2 group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border"
                >
                  <div
                    class="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-auxiliary-yellow shadow-sm group-hover:gradient-primary group-hover:text-white transition-all"
                  >
                    <Trophy :size="20" class="text-auxiliary-yellow" />
                  </div>
                  <p class="text-lg font-black text-neutral-title">
                    {{ gameInterviewData?.best_streak ?? 0 }}
                  </p>
                  <p class="text-xs text-neutral-helper">最佳连胜</p>
                </div>
              </div>
              <div
                class="mt-6 p-6 bg-primary/5 rounded-2xl border border-primary/20"
              >
                <div class="flex items-center gap-3 mb-4">
                  <div
                    class="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center text-white shadow-md"
                  >
                    <Activity :size="20" />
                  </div>
                  <h4 class="text-sm font-bold text-neutral-title">
                    当前连续练习
                  </h4>
                </div>
                <div class="space-y-4">
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs font-bold">
                      <span>当前连胜</span>
                      <span>{{ gameInterviewData?.current_streak ?? 0 }} 天</span>
                    </div>
                    <div class="h-2 bg-white rounded-full overflow-hidden">
                      <div
                        class="h-full gradient-primary transition-all duration-1000 ease-out"
                        :style="{ width: Math.min(((gameInterviewData?.current_streak ?? 0) / 30) * 100, 100) + '%' }"
                      ></div>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs font-bold">
                      <span>完成率</span>
                      <span>{{ gameInterviewData?.total_sessions ? Math.round(((gameInterviewData?.completed_sessions ?? 0) / gameInterviewData.total_sessions) * 100) : 0 }}%</span>
                    </div>
                    <div class="h-2 bg-white rounded-full overflow-hidden">
                      <div
                        class="h-full gradient-cyan-yellow transition-all duration-1000 ease-out"
                        :style="{ width: (gameInterviewData?.total_sessions ? Math.round(((gameInterviewData?.completed_sessions ?? 0) / gameInterviewData.total_sessions) * 100) : 0) + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 全局操作按钮 -->
            <div v-if="activeGameTab === 'overview'" class="mt-6"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 全部面试记录页面 -->
    <div
      v-if="isAllInterviewsPageOpen"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div
          class="p-8 border-b border-neutral-border flex justify-between items-center sticky top-0 bg-white"
        >
          <h3
            class="text-xl font-bold text-neutral-title flex items-center gap-2"
          >
            <History :size="24" class="text-primary" />
            全部面试实战记录
          </h3>
          <button
            class="p-2 text-neutral-helper hover:text-neutral-title"
            @click="closeAllInterviewsPage"
          >
            <X :size="24" />
          </button>
        </div>
        <div class="p-8">
          <div class="space-y-4">
            <div
              v-for="item in filteredInterviews"
              :key="item.id"
              class="group"
            >
              <!-- 面试记录卡片 -->
              <div
                class="flex items-center justify-between p-4 bg-neutral-bg rounded-[20px] hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border cursor-pointer"
                @click="toggleExpand(item.id)"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:gradient-primary group-hover:text-white transition-all"
                  >
                    <Activity :size="20" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <h4
                        class="text-sm font-bold text-neutral-title group-hover:text-primary transition-colors truncate"
                      >
                        {{ item.job_position_title || '面试记录' }}
                      </h4>
                      <span
                        class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        :class="
                          item.status === 'completed'
                            ? 'bg-auxiliary-green/10 text-auxiliary-green'
                            : 'bg-auxiliary-red/10 text-auxiliary-red'
                        "
                        >{{ item.status === 'completed' ? '已完成' : '未通过' }}</span
                      >
                    </div>
                    <div
                      class="flex flex-wrap items-center gap-2 text-[11px] text-neutral-helper"
                    >
                      <span>{{ item.start_time ? new Date(item.start_time).toLocaleDateString() : new Date(item.created_at).toLocaleDateString() }}</span>
                      <span v-if="item.current_round">·</span>
                      <span v-if="item.current_round">第 {{ item.current_round }} 轮</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="text-right">
                    <p class="text-lg font-black text-neutral-title">
                      {{ item.score ?? '-'
                      }}<span class="text-[10px] font-normal opacity-40 ml-0.5"
                        >分</span
                      >
                    </p>
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
                <div class="space-y-3 mb-4">
                  <div class="flex items-center gap-2 text-xs text-neutral-body">
                    <Calendar :size="14" class="text-primary" />
                    <span>开始: {{ item.start_time ? new Date(item.start_time).toLocaleString() : '-' }}</span>
                    <span class="text-neutral-helper">→</span>
                    <span>结束: {{ item.end_time ? new Date(item.end_time).toLocaleString() : '-' }}</span>
                  </div>
                  <div v-if="item.current_round" class="flex items-center gap-2 text-xs text-neutral-body">
                    <Target :size="14" class="text-auxiliary-orange" />
                    <span>当前轮次: 第 {{ item.current_round }} 轮</span>
                  </div>
                </div>

                <!-- 操作按钮 -->
                <div
                  class="flex items-center gap-3 pt-4 border-t border-neutral-border"
                >
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
    <div
      v-if="isPracticeModalOpen"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-[32px] w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div
          class="p-8 border-b border-neutral-border flex justify-between items-center"
        >
          <h3
            class="text-xl font-bold text-neutral-title flex items-center gap-2"
          >
            <Zap :size="24" class="text-primary" />
            {{ currentBank?.title }} - 练习
          </h3>
          <button
            class="p-2 text-neutral-helper hover:text-neutral-title"
            @click="closePracticeModal"
          >
            <X :size="24" />
          </button>
        </div>
        <div v-if="currentBank" class="p-8 space-y-6">
          <div class="p-6 bg-neutral-bg rounded-[24px]">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h4 class="text-lg font-bold text-neutral-title mb-2">
                  {{ currentBank.title }}
                </h4>
                <p class="text-sm text-neutral-helper">
                  {{ currentBank.description }}
                </p>
              </div>
              <div class="text-right">
                <span
                  class="text-xs font-bold text-primary uppercase bg-primary/10 px-3 py-1 rounded-full"
                  >{{ currentBank.category }}</span
                >
              </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div class="p-4 bg-white rounded-xl text-center">
                <p class="text-lg font-black text-primary">
                  {{ currentBank.questionCount }}
                </p>
                <p class="text-xs text-neutral-helper">题目数量</p>
              </div>
              <div class="p-4 bg-white rounded-xl text-center">
                <p class="text-lg font-black text-primary">
                  {{
                    currentBank.difficulty === "easy"
                      ? "简单"
                      : currentBank.difficulty === "medium"
                        ? "中等"
                        : "困难"
                  }}
                </p>
                <p class="text-xs text-neutral-helper">难度</p>
              </div>
              <div class="p-4 bg-white rounded-xl text-center">
                <p class="text-lg font-black text-primary">
                  {{ currentBank.estimatedTime }}
                </p>
                <p class="text-xs text-neutral-helper">预计时间</p>
              </div>
              <div class="p-4 bg-white rounded-xl text-center">
                <p class="text-lg font-black text-primary">
                  {{ currentBank.passRate }}%
                </p>
                <p class="text-xs text-neutral-helper">通过率</p>
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-sm font-bold text-neutral-title mb-4">题目列表</h4>
            <div class="space-y-3">
              <div
                v-for="(question, index) in currentBank.questions"
                :key="question.id"
                class="p-4 bg-neutral-bg rounded-xl border border-neutral-border hover:bg-white hover:shadow-sm transition-all"
              >
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <span
                      class="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full"
                      >{{ Number(index) + 1 }}</span
                    >
                    <span class="text-sm font-bold text-neutral-title">{{
                      question.title
                    }}</span>
                  </div>
                  <span
                    class="text-xs font-bold px-2 py-1 rounded-full"
                    :class="getDifficultyColor(question.difficulty)"
                    >{{
                      question.difficulty === "easy"
                        ? "简单"
                        : question.difficulty === "medium"
                          ? "中等"
                          : "困难"
                    }}</span
                  >
                </div>
                <p class="text-xs text-neutral-helper">
                  {{ question.description }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="flex gap-4 justify-end pt-6 border-t border-neutral-border"
          >
            <button
              class="px-6 py-3 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all"
              @click="closePracticeModal"
            >
              取消
            </button>
            <button
              class="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark hover:shadow-lg transition-all flex items-center gap-2 group"
              @click="startPractice"
            >
              <Play
                :size="16"
                class="group-hover:scale-110 transition-transform"
              />
              开始练习
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 复习错题模态框 -->
    <div
      v-if="isReviewModalOpen"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-[32px] w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div
          class="p-8 border-b border-neutral-border flex justify-between items-center"
        >
          <h3
            class="text-xl font-bold text-neutral-title flex items-center gap-2"
          >
            <BookOpen :size="24" class="text-primary" />
            错题复习
          </h3>
          <button
            class="p-2 text-neutral-helper hover:text-neutral-title"
            @click="closeReviewModal"
          >
            <X :size="24" />
          </button>
        </div>
        <div v-if="currentMistake" class="p-8 space-y-6">
          <div class="p-6 bg-neutral-bg rounded-[24px]">
            <div class="flex items-center gap-2 mb-4">
              <span
                class="text-xs font-bold text-auxiliary-red bg-auxiliary-red/10 px-3 py-1 rounded-full"
                >错题</span
              >
              <span
                class="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full"
                >{{ currentMistake.category }}</span
              >
              <span
                class="text-xs font-bold px-3 py-1 rounded-full"
                :class="getDifficultyColor(currentMistake.difficulty)"
                >{{
                  currentMistake.difficulty === "easy"
                    ? "简单"
                    : currentMistake.difficulty === "medium"
                      ? "中等"
                      : "困难"
                }}</span
              >
            </div>
            <h4 class="text-lg font-bold text-neutral-title mb-4">
              {{ currentMistake.question }}
            </h4>
            <p class="text-sm text-neutral-body mb-6">
              {{ currentMistake.explanation }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 class="text-sm font-bold text-neutral-title mb-3">
                你的答案
              </h5>
              <div
                class="p-4 bg-auxiliary-red/10 rounded-xl border border-auxiliary-red/30"
              >
                <p class="text-sm text-auxiliary-red">
                  {{ currentMistake.userAnswer }}
                </p>
              </div>
            </div>
            <div>
              <h5 class="text-sm font-bold text-neutral-title mb-3">
                正确答案
              </h5>
              <div
                class="p-4 bg-auxiliary-green/10 rounded-xl border border-auxiliary-green/30"
              >
                <p class="text-sm text-auxiliary-green">
                  {{ currentMistake.correctAnswer }}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h5 class="text-sm font-bold text-neutral-title mb-3">解析</h5>
            <div class="p-4 bg-primary/10 rounded-xl border border-primary/30">
              <p class="text-sm text-primary">
                {{ currentMistake.explanation }}
              </p>
            </div>
          </div>

          <div
            class="flex gap-4 justify-end pt-6 border-t border-neutral-border"
          >
            <button
              class="px-6 py-3 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all"
              @click="closeReviewModal"
            >
              关闭
            </button>
            <button
              class="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Play :size="16" />
              开始复习
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 关卡详情模态框 -->
    <div
      v-if="isLevelDetailModalOpen"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-[32px] w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div
          class="p-8 border-b border-neutral-border flex justify-between items-center"
        >
          <h3
            class="text-xl font-bold text-neutral-title flex items-center gap-2"
          >
            <Gamepad2 :size="24" class="text-primary" />
            关卡详情 - {{ currentLevel?.name }}
          </h3>
          <button
            class="p-2 text-neutral-helper hover:text-neutral-title"
            @click="closeLevelDetailModal"
          >
            <X :size="24" />
          </button>
        </div>
        <div v-if="currentLevel" class="p-8 space-y-6">
          <div class="p-6 bg-neutral-bg rounded-[24px]">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-4">
                <div
                  class="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl gradient-primary"
                >
                  <span class="font-black text-2xl">{{ currentLevel.id }}</span>
                </div>
                <div>
                  <h4 class="text-lg font-bold text-neutral-title mb-2">
                    {{ currentLevel.name }}
                  </h4>
                  <div class="flex items-center gap-2">
                    <span
                      class="text-xs font-bold px-3 py-1 rounded-full"
                      :class="getDifficultyColor(currentLevel.difficulty)"
                      >{{ getDifficultyText(currentLevel.difficulty) }}</span
                    >
                    <span
                      v-if="currentLevel.completed"
                      class="text-xs font-bold px-3 py-1 rounded-full bg-auxiliary-green/10 text-auxiliary-green"
                      >已完成</span
                    >
                    <span
                      v-else-if="currentLevel.progress > 0"
                      class="text-xs font-bold px-3 py-1 rounded-full bg-auxiliary-orange/10 text-auxiliary-orange"
                      >进行中</span
                    >
                    <span
                      v-else
                      class="text-xs font-bold px-3 py-1 rounded-full bg-neutral-border/30 text-neutral-helper"
                      >未开始</span
                    >
                  </div>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-black text-primary">
                  {{ currentLevel.progress }}%
                </p>
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
                  <div
                    class="h-full gradient-primary transition-all duration-1000 ease-out"
                    :style="{ width: currentLevel.progress + '%' }"
                  ></div>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-4 mt-4">
                <div class="p-4 bg-white rounded-xl text-center">
                  <p class="text-lg font-black text-primary">
                    {{ currentLevel.questions }}
                  </p>
                  <p class="text-xs text-neutral-helper">题目数量</p>
                </div>
                <div class="p-4 bg-white rounded-xl text-center">
                  <p class="text-lg font-black text-primary">
                    {{
                      Math.round(
                        (Number(currentLevel.correct) /
                          Number(currentLevel.questions)) *
                          100,
                      )
                    }}%
                  </p>
                  <p class="text-xs text-neutral-helper">正确率</p>
                </div>
                <div class="p-4 bg-white rounded-xl text-center">
                  <p class="text-lg font-black text-primary">
                    {{ currentLevel.timeSpent }}
                  </p>
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
            <div
              class="p-4 bg-neutral-bg rounded-xl border border-neutral-border"
            >
              <div class="flex items-center gap-2 mb-3">
                <div class="flex gap-1">
                  <span v-for="i in 5" :key="i" class="text-auxiliary-orange"
                    >★</span
                  >
                </div>
                <span class="text-xs font-bold text-neutral-title"
                  >{{ currentLevel.rating }}/5</span
                >
              </div>
              <p class="text-sm text-neutral-body">
                {{
                  currentLevel.feedback ||
                  "你在这个关卡表现出色！继续保持这样的状态，你会在面试中取得成功。"
                }}
              </p>
            </div>
          </div>

          <div
            class="flex gap-4 justify-end pt-6 border-t border-neutral-border"
          >
            <button
              class="px-6 py-3 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all"
              @click="closeLevelDetailModal"
            >
              关闭
            </button>
            <button
              v-if="currentLevel.completed"
              class="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark hover:shadow-lg transition-all flex items-center gap-2 group"
              @click="startLevel(currentLevel.id)"
            >
              <Zap
                :size="16"
                class="group-hover:scale-110 transition-transform"
              />
              重新练习
            </button>
            <button
              v-else-if="currentLevel.progress > 0"
              class="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark hover:shadow-lg transition-all flex items-center gap-2 group"
              @click="continueLevel(currentLevel.id)"
            >
              <Zap
                :size="16"
                class="group-hover:scale-110 transition-transform"
              />
              继续练习
            </button>
            <button
              v-else
              class="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark hover:shadow-lg transition-all flex items-center gap-2 group"
              @click="startLevel(currentLevel.id)"
            >
              <Zap
                :size="16"
                class="group-hover:scale-110 transition-transform"
              />
              开始练习
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- AI简历诊断模态框 -->
    <Transition name="fade">
      <div
        v-if="isResumeDiagnosisModalOpen"
        class="fixed inset-0 z-[200] flex items-center justify-center p-6"
      >
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="closeResumeDiagnosisModal"
        ></div>
        <div
          class="relative bg-white rounded-[32px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300"
        >
          <div class="p-8 border-b border-neutral-border">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center text-white"
                >
                  <Sparkles :size="20" />
                </div>
                <h3 class="text-xl font-bold text-neutral-title">
                  AI 简历诊断
                </h3>
              </div>
              <button
                class="p-2 hover:bg-neutral-bg rounded-full transition-colors text-neutral-helper"
                @click="closeResumeDiagnosisModal"
              >
                <X :size="20" />
              </button>
            </div>
          </div>

          <div class="p-8">
            <!-- 简历预览 -->
            <div v-if="!resumeDiagnosisResult" class="mb-8">
              <h4 class="text-lg font-bold text-neutral-title mb-4">
                简历预览
              </h4>
              <div class="bg-neutral-bg rounded-2xl p-6 space-y-6">
                <!-- 基本信息 -->
                <div>
                  <h5 class="text-sm font-bold text-neutral-title mb-3">
                    基本信息
                  </h5>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-xs text-neutral-helper mb-1">姓名</p>
                      <p class="text-sm font-medium text-neutral-body">
                        {{ resumeData?.name }}
                      </p>
                    </div>
                    <div>
                      <p class="text-xs text-neutral-helper mb-1">邮箱</p>
                      <p class="text-sm font-medium text-neutral-body">
                        {{ resumeData?.email || '-' }}
                      </p>
                    </div>
                    <div>
                      <p class="text-xs text-neutral-helper mb-1">电话</p>
                      <p class="text-sm font-medium text-neutral-body">
                        {{ resumeData?.phone || '-' }}
                      </p>
                    </div>
                    <div>
                      <p class="text-xs text-neutral-helper mb-1">个人简介</p>
                      <p class="text-sm font-medium text-neutral-body">
                        {{ resumeData?.summary || '-' }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- 教育经历 -->
                <div>
                  <h5 class="text-sm font-bold text-neutral-title mb-3">
                    教育经历
                  </h5>
                  <div class="space-y-3">
                    <div
                      v-for="(edu, index) in resumeData?.education || []"
                      :key="index"
                      class="bg-white rounded-xl p-4 border border-neutral-border"
                    >
                      <div class="flex items-center justify-between mb-2">
                        <h6 class="text-sm font-bold text-neutral-title">
                          {{ edu.school }}
                        </h6>
                        <span class="text-xs text-neutral-helper"
                          >{{ edu.period }}</span
                        >
                      </div>
                      <p class="text-xs text-neutral-body">
                        {{ edu.major }} | {{ edu.degree }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- 实习经历 -->
                <div>
                  <h5 class="text-sm font-bold text-neutral-title mb-3">
                    实习经历
                  </h5>
                  <div class="space-y-3">
                    <div
                      v-for="(exp, index) in resumeData?.experience || []"
                      :key="index"
                      class="bg-white rounded-xl p-4 border border-neutral-border"
                    >
                      <div class="flex items-center justify-between mb-2">
                        <h6 class="text-sm font-bold text-neutral-title">
                          {{ exp.company }}
                        </h6>
                        <span class="text-xs text-neutral-helper"
                          >{{ exp.period }}</span
                        >
                      </div>
                      <p class="text-xs font-medium text-neutral-body mb-2">
                        {{ exp.position }}
                      </p>
                      <p class="text-xs text-neutral-body">
                        {{ exp.description }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- 技能 -->
                <div>
                  <h5 class="text-sm font-bold text-neutral-title mb-3">
                    技能
                  </h5>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(skill, index) in resumeData?.skills || []"
                      :key="index"
                      class="px-3 py-1.5 text-xs font-bold rounded-xl bg-primary/10 text-primary"
                    >
                      {{ skill }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 诊断结果 -->
            <div v-else class="space-y-8">
              <!-- 总体评分 -->
              <div class="bg-neutral-bg rounded-2xl p-6">
                <h4 class="text-lg font-bold text-neutral-title mb-4">
                  总体评分
                </h4>
                <div class="flex items-center gap-4">
                  <div
                    class="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-white shadow-lg"
                  >
                    <span class="text-3xl font-black">{{
                      resumeDiagnosisResult.overall_score
                    }}</span>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-bold text-neutral-title"
                        >简历综合评分</span
                      >
                      <span class="text-lg font-black text-primary"
                        >{{ resumeDiagnosisResult.overall_score }}/100</span
                      >
                    </div>
                    <div class="h-2 bg-white rounded-full overflow-hidden">
                      <div
                        class="h-full gradient-primary transition-all duration-1000 ease-out"
                        :style="{
                          width: resumeDiagnosisResult.overall_score + '%',
                        }"
                      ></div>
                    </div>
                    <p class="text-xs text-neutral-helper mt-2">
                      {{ resumeDiagnosisResult.summary }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- 分项评分 -->
              <div v-if="resumeDiagnosisResult.scores?.length" class="bg-neutral-bg rounded-2xl p-6">
                <h4 class="text-sm font-bold text-neutral-title mb-4">
                  分项评分
                </h4>
                <div class="space-y-3">
                  <div
                    v-for="(scoreItem, index) in resumeDiagnosisResult.scores"
                    :key="index"
                    class="space-y-1"
                  >
                    <div class="flex justify-between text-xs font-medium">
                      <span>{{ scoreItem.category }}</span>
                      <span>{{ scoreItem.score }}/100</span>
                    </div>
                    <div class="h-2 bg-white rounded-full overflow-hidden">
                      <div
                        class="h-full gradient-primary transition-all duration-1000 ease-out"
                        :style="{ width: scoreItem.score + '%' }"
                      ></div>
                    </div>
                    <p v-if="scoreItem.suggestion" class="text-[10px] text-neutral-helper mt-1">
                      {{ scoreItem.suggestion }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="mt-8 flex gap-4">
              <button
                v-if="!resumeDiagnosisResult"
                :class="[
                  'px-8 py-3 font-bold rounded-2xl transition-all flex items-center gap-2 flex-1',
                  isDiagnosing
                    ? 'bg-neutral-bg text-neutral-helper cursor-not-allowed'
                    : 'gradient-primary text-white shadow-lg hover:shadow-primary/30',
                ]"
                :disabled="isDiagnosing"
                @click="startResumeDiagnosis"
              >
                <span v-if="isDiagnosing" class="animate-spin">🔄</span>
                {{ isDiagnosing ? "诊断中..." : "开始诊断" }}
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
      <div
        v-if="isProfileUpdateModalOpen"
        class="fixed inset-0 z-[200] flex items-center justify-center p-6"
      >
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="closeProfileUpdateModal"
        ></div>
        <div
          class="relative bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300"
        >
          <div class="p-8 border-b border-neutral-border">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-2xl gradient-cyan-yellow flex items-center justify-center text-primary"
                >
                  <User :size="20" />
                </div>
                <h3 class="text-xl font-bold text-neutral-title">
                  更新个人档案
                </h3>
              </div>
              <button
                class="p-2 hover:bg-neutral-bg rounded-full transition-colors text-neutral-helper"
                @click="closeProfileUpdateModal"
              >
                <X :size="20" />
              </button>
            </div>
          </div>

          <div class="p-8">
            <form class="space-y-6" @submit.prevent="saveProfile">
              <!-- 画像信息 -->
              <div class="space-y-4">
                <h4 class="text-lg font-bold text-neutral-title">画像信息</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-xs font-bold text-neutral-helper uppercase tracking-wider mb-2"
                      >教育背景</label
                    >
                    <input
                      v-model="profileForm.education"
                      type="text"
                      class="w-full px-4 py-3 bg-neutral-bg rounded-xl border-2 border-transparent focus:border-primary/20 outline-none transition-all font-medium"
                      placeholder="例如：北京大学计算机科学与技术专业"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-xs font-bold text-neutral-helper uppercase tracking-wider mb-2"
                      >目标岗位</label
                    >
                    <input
                      v-model="profileForm.target_position"
                      type="text"
                      class="w-full px-4 py-3 bg-neutral-bg rounded-xl border-2 border-transparent focus:border-primary/20 outline-none transition-all font-medium"
                      placeholder="例如：前端开发工程师"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-xs font-bold text-neutral-helper uppercase tracking-wider mb-2"
                      >工作年限</label
                    >
                    <input
                      v-model.number="profileForm.work_years"
                      type="number"
                      min="0"
                      class="w-full px-4 py-3 bg-neutral-bg rounded-xl border-2 border-transparent focus:border-primary/20 outline-none transition-all font-medium"
                      placeholder="例如：2"
                    />
                  </div>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex gap-4 mt-8">
                <button
                  type="submit"
                  :class="[
                    'px-8 py-3 font-bold rounded-2xl transition-all flex items-center gap-2 flex-1',
                    isSavingProfile
                      ? 'bg-neutral-bg text-neutral-helper cursor-not-allowed'
                      : 'gradient-primary text-white shadow-lg hover:shadow-primary/30',
                  ]"
                  :disabled="isSavingProfile"
                >
                  <span v-if="isSavingProfile" class="animate-spin">🔄</span>
                  {{ isSavingProfile ? "保存中..." : "保存" }}
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
