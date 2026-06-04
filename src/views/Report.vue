<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import {
  Download,
  Share2,
  ChevronLeft,
  Target,
  AlertCircle,
  CheckCircle2,
} from "lucide-vue-next";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import Chart from "chart.js/auto";
import { useInterviewStore } from "@/stores/interview";
import type { InterviewReport } from "@/api/types/interview.types";

const router = useRouter();
const route = useRoute();
const interviewStore = useInterviewStore();
const { currentReport, loading } = storeToRefs(interviewStore);

const reportData = ref<InterviewReport | null>(null);

// 加载报告数据
onMounted(async () => {
  const sessionId = Number(route.params.sessionId || route.query.session_id);
  if (sessionId) {
    await interviewStore.fetchReport(sessionId);
    reportData.value = currentReport.value;
  }
  initCharts();
});

watch(currentReport, (newReport) => {
  if (newReport) {
    reportData.value = newReport;
    initCharts();
  }
});

// 评分维度标签映射
const scoreLabels: Record<string, string> = {
  content_score: "内容质量",
  depth_score: "深度分析",
  logic_score: "逻辑思维",
  match_score: "岗位匹配",
  clarity_score: "表达清晰",
  confidence_score: "自信度",
  overall_score: "综合评分",
};

// 计算属性：评分维度列表（排除非评分字段）
const scoreDimensions = computed(() => {
  if (!reportData.value) return [];
  const dims: { key: string; label: string; value: number }[] = [];
  for (const [key, label] of Object.entries(scoreLabels)) {
    const val = reportData.value[key as keyof InterviewReport];
    if (typeof val === "number") {
      dims.push({ key, label, value: val });
    }
  }
  return dims;
});

// 综合评分颜色
const overallScoreColor = computed(() => {
  const score = reportData.value?.overall_score;
  if (score == null) return "text-neutral-helper";
  if (score >= 90) return "text-auxiliary-green";
  if (score >= 80) return "text-primary";
  if (score >= 70) return "text-auxiliary-orange";
  return "text-auxiliary-red";
});

// 方法
const downloadReport = () => {
  console.log("Downloading report...");
  alert("报告已开始下载");
};

const shareReport = () => {
  console.log("Sharing report...");
  alert("分享链接已复制到剪贴板");
};

const backToInterview = () => {
  router.push("/interview");
};

const backToHome = () => {
  router.push("/");
};

// 初始化图表
let chartInstance: Chart | null = null;

const initCharts = () => {
  // 销毁旧图表
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  if (!reportData.value || scoreDimensions.value.length === 0) return;

  const skillsCanvas = document.getElementById(
    "skillsRadarChart",
  ) as HTMLCanvasElement;
  if (!skillsCanvas) return;

  chartInstance = new Chart(skillsCanvas, {
    type: "radar",
    data: {
      labels: scoreDimensions.value.map((d) => d.label),
      datasets: [
        {
          label: "评分",
          data: scoreDimensions.value.map((d) => d.value),
          backgroundColor: "rgba(24, 197, 199, 0.2)",
          borderColor: "rgba(24, 197, 199, 1)",
          pointBackgroundColor: "rgba(24, 197, 199, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(24, 197, 199, 1)",
        },
      ],
    },
    options: {
      scales: {
        r: {
          angleLines: {
            display: true,
          },
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
    },
  });
};
</script>

<template>
  <div class="flex flex-col gap-6 max-w-7xl mx-auto min-h-[80vh]">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
      ></div>
    </div>

    <!-- 无数据状态 -->
    <div v-else-if="!reportData" class="flex flex-col items-center justify-center h-64 text-neutral-helper">
      <AlertCircle :size="48" class="mb-4 opacity-30" />
      <p class="text-lg font-bold mb-2">暂无报告数据</p>
      <p class="text-sm">请先完成面试后再查看报告</p>
      <button
        class="mt-4 px-6 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all"
        @click="backToInterview"
      >
        返回面试
      </button>
    </div>

    <!-- 报告内容 -->
    <template v-else>
      <!-- Header -->
      <div class="flex items-center justify-between">
        <button
          class="flex items-center gap-2 text-neutral-title font-bold hover:text-primary transition-colors"
          @click="backToInterview"
        >
          <ChevronLeft :size="24" />
          返回面试实战
        </button>
        <h1 class="text-3xl font-black text-neutral-title">面试报告</h1>
        <div class="w-40"></div>
      </div>

      <!-- Report Header -->
      <div
        class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
      >
        <div class="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 class="text-2xl font-bold text-neutral-title mb-2">
              面试报告 #{{ reportData.session_id }}
            </h2>
            <p class="text-neutral-helper">
              {{ reportData.created_at ? new Date(reportData.created_at).toLocaleString('zh-CN') : '未知时间' }}
              <span v-if="reportData.status" class="ml-2">
                · 状态: {{ reportData.status }}
              </span>
            </p>
          </div>
          <div class="flex gap-4">
            <button
              class="flex items-center gap-2 px-6 py-3 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all"
              @click="downloadReport"
            >
              <Download :size="18" />
              下载报告
            </button>
            <button
              class="flex items-center gap-2 px-6 py-3 gradient-primary text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all"
              @click="shareReport"
            >
              <Share2 :size="18" />
              分享报告
            </button>
          </div>
        </div>
      </div>

      <!-- Overall Score -->
      <div
        class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
      >
        <h3 class="text-xl font-bold text-neutral-title mb-6">综合评估</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div
            v-for="dim in scoreDimensions.slice(0, 4)"
            :key="dim.key"
            class="text-center p-6 bg-neutral-bg rounded-2xl"
          >
            <p class="text-sm text-neutral-helper mb-2">{{ dim.label }}</p>
            <p
              :class="[
                'text-4xl font-black',
                dim.key === 'overall_score' ? overallScoreColor : 'text-primary',
              ]"
            >
              {{ dim.value }}
            </p>
          </div>
        </div>
      </div>

      <!-- Skills Radar Chart -->
      <div
        v-if="scoreDimensions.length > 0"
        class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
      >
        <h3 class="text-xl font-bold text-neutral-title mb-6">评分雷达图</h3>
        <div class="h-80">
          <canvas id="skillsRadarChart"></canvas>
        </div>
      </div>

      <!-- Analysis -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Strengths -->
        <div
          class="bg-white rounded-[32px] p-6 shadow-sm border border-neutral-border"
        >
          <div class="flex items-center gap-2 mb-4">
            <div
              class="w-8 h-8 rounded-full bg-auxiliary-green/10 flex items-center justify-center text-auxiliary-green"
            >
              <CheckCircle2 :size="18" />
            </div>
            <h3 class="font-bold text-neutral-title">优势</h3>
          </div>
          <ul v-if="reportData.strength_areas?.length" class="space-y-3">
            <li
              v-for="(strength, index) in reportData.strength_areas"
              :key="index"
              class="flex items-start gap-2"
            >
              <div
                class="mt-1 w-1.5 h-1.5 rounded-full bg-auxiliary-green flex-shrink-0"
              ></div>
              <p class="text-sm text-neutral-body">{{ strength }}</p>
            </li>
          </ul>
          <p v-else class="text-sm text-neutral-helper">暂无数据</p>
        </div>

        <!-- Weaknesses -->
        <div
          class="bg-white rounded-[32px] p-6 shadow-sm border border-neutral-border"
        >
          <div class="flex items-center gap-2 mb-4">
            <div
              class="w-8 h-8 rounded-full bg-auxiliary-red/10 flex items-center justify-center text-auxiliary-red"
            >
              <AlertCircle :size="18" />
            </div>
            <h3 class="font-bold text-neutral-title">不足</h3>
          </div>
          <ul v-if="reportData.weakness_areas?.length" class="space-y-3">
            <li
              v-for="(weakness, index) in reportData.weakness_areas"
              :key="index"
              class="flex items-start gap-2"
            >
              <div
                class="mt-1 w-1.5 h-1.5 rounded-full bg-auxiliary-red flex-shrink-0"
              ></div>
              <p class="text-sm text-neutral-body">{{ weakness }}</p>
            </li>
          </ul>
          <p v-else class="text-sm text-neutral-helper">暂无数据</p>
        </div>

        <!-- Improvement Plan -->
        <div
          class="bg-white rounded-[32px] p-6 shadow-sm border border-neutral-border"
        >
          <div class="flex items-center gap-2 mb-4">
            <div
              class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"
            >
              <Target :size="18" />
            </div>
            <h3 class="font-bold text-neutral-title">改进建议</h3>
          </div>
          <p v-if="reportData.improvement_plan" class="text-sm text-neutral-body">
            {{ reportData.improvement_plan }}
          </p>
          <p v-else class="text-sm text-neutral-helper">暂无数据</p>
        </div>
      </div>

      <!-- Offer Recommendation -->
      <div
        v-if="reportData.offer_recommendation"
        class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
      >
        <h3 class="text-xl font-bold text-neutral-title mb-4">录用建议</h3>
        <p class="text-neutral-body">{{ reportData.offer_recommendation }}</p>
      </div>

      <!-- Full Report Text -->
      <div
        v-if="reportData.full_report_text"
        class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
      >
        <h3 class="text-xl font-bold text-neutral-title mb-4">完整报告</h3>
        <div class="text-sm text-neutral-body whitespace-pre-wrap">
          {{ reportData.full_report_text }}
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-center gap-4">
        <button
          class="px-8 py-4 bg-neutral-bg text-neutral-title font-bold rounded-2xl hover:bg-neutral-border/50 transition-all flex items-center gap-2"
          @click="backToInterview"
        >
          <ChevronLeft :size="20" />
          返回面试实战
        </button>
        <button
          class="px-8 py-4 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all"
          @click="backToHome"
        >
          返回主页
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.gradient-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, #6366f1 100%);
}
</style>
