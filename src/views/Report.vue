<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  Download,
  Share2,
  ChevronLeft,
  Target,
  AlertCircle,
  CheckCircle2,
} from "lucide-vue-next";
import { useRouter } from "vue-router";
import Chart from "chart.js/auto";

const router = useRouter();

// 模拟报告数据
const reportData = ref({
  candidate: {
    name: "王同学",
    position: "高级前端开发工程师",
    interviewTime: "2026-03-24 14:30",
    duration: "25分钟",
  },
  scores: {
    technical: 85,
    behavioral: 78,
    communication: 92,
    problemSolving: 88,
    overall: 86,
  },
  skills: [
    { name: "前端技术", score: 90 },
    { name: "算法能力", score: 75 },
    { name: "项目经验", score: 85 },
    { name: "沟通表达", score: 92 },
    { name: "问题解决", score: 88 },
    { name: "团队协作", score: 80 },
  ],
  analysis: {
    strengths: [
      "前端技术基础扎实，对 Vue3 响应式原理有深入理解",
      "沟通表达清晰，逻辑条理分明",
      "问题解决能力强，能够快速分析和解决技术问题",
      "项目经验丰富，有完整的项目开发经验",
    ],
    weaknesses: [
      "算法能力有待提升，尤其是复杂算法的应用",
      "团队协作能力需要加强，尤其是在跨部门协作方面",
      "对新技术的了解不够及时，需要加强学习",
    ],
    suggestions: [
      "加强算法学习，尤其是动态规划和贪心算法",
      "多参与团队项目，提升团队协作能力",
      "关注前端技术发展趋势，及时学习新技术",
      "在回答问题时，增加具体的项目案例，增强说服力",
    ],
  },
  questions: [
    {
      id: 1,
      question:
        "请结合你的项目经历，谈谈你对 Vue3 响应式原理的理解，以及它与 Vue2 相比有哪些优势？",
      score: 90,
      evaluation:
        "回答全面，对 Vue3 响应式原理有深入理解，能够清晰对比 Vue2 和 Vue3 的差异",
    },
    {
      id: 2,
      question: "你如何处理工作中的压力和挑战？",
      score: 80,
      evaluation: "回答合理，能够分享具体的应对策略和实际例子",
    },
    {
      id: 3,
      question: "请设计一个高并发的电商系统",
      score: 85,
      evaluation: "设计思路清晰，考虑了系统的可扩展性和性能优化",
    },
    {
      id: 4,
      question: "你为什么要离开之前的公司？",
      score: 75,
      evaluation: "回答客观，能够清晰表达职业发展需求",
    },
    {
      id: 5,
      question: "你期望的薪资是多少？",
      score: 95,
      evaluation: "薪资期望合理，能够根据市场行情和自身能力给出合理范围",
    },
  ],
  comparison: {
    percentile: 85,
    comparedTo: "高级前端开发工程师",
    ranking: "TOP 15%",
  },
});

// 计算属性
const overallScoreColor = computed(() => {
  const score = reportData.value.scores.overall;
  if (score >= 90) return "text-auxiliary-green";
  if (score >= 80) return "text-primary";
  if (score >= 70) return "text-auxiliary-orange";
  return "text-auxiliary-red";
});

// 方法
const downloadReport = () => {
  // 模拟下载功能
  console.log("Downloading report...");
  alert("报告已开始下载");
};

const shareReport = () => {
  // 模拟分享功能
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
const initCharts = () => {
  // 技能雷达图
  const skillsCanvas = document.getElementById(
    "skillsRadarChart",
  ) as HTMLCanvasElement;
  if (skillsCanvas) {
    new Chart(skillsCanvas, {
      type: "radar",
      data: {
        labels: reportData.value.skills.map((skill) => skill.name),
        datasets: [
          {
            label: "技能评分",
            data: reportData.value.skills.map((skill) => skill.score),
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
  }
};

// 生命周期钩子
onMounted(() => {
  initCharts();
});
</script>

<template>
  <div class="flex flex-col gap-6 max-w-7xl mx-auto min-h-[80vh]">
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
      <!-- 占位，保持标题居中 -->
    </div>

    <!-- Report Header -->
    <div
      class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
    >
      <div class="flex flex-wrap items-center justify-between gap-6">
        <div>
          <h2 class="text-2xl font-bold text-neutral-title mb-2">
            {{ reportData.candidate.name }}
          </h2>
          <p class="text-neutral-helper">
            {{ reportData.candidate.position }} |
            {{ reportData.candidate.interviewTime }} |
            {{ reportData.candidate.duration }}
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
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="text-center p-6 bg-neutral-bg rounded-2xl">
          <p class="text-sm text-neutral-helper mb-2">综合评分</p>
          <p :class="['text-4xl font-black', overallScoreColor]">
            {{ reportData.scores.overall }}
          </p>
          <p class="text-sm text-neutral-helper mt-2">
            {{ reportData.comparison.ranking }}
          </p>
        </div>
        <div class="text-center p-6 bg-neutral-bg rounded-2xl">
          <p class="text-sm text-neutral-helper mb-2">技术能力</p>
          <p class="text-4xl font-black text-primary">
            {{ reportData.scores.technical }}
          </p>
          <p class="text-sm text-neutral-helper mt-2">专业知识</p>
        </div>
        <div class="text-center p-6 bg-neutral-bg rounded-2xl">
          <p class="text-sm text-neutral-helper mb-2">行为能力</p>
          <p class="text-4xl font-black text-auxiliary-orange">
            {{ reportData.scores.behavioral }}
          </p>
          <p class="text-sm text-neutral-helper mt-2">软技能</p>
        </div>
        <div class="text-center p-6 bg-neutral-bg rounded-2xl">
          <p class="text-sm text-neutral-helper mb-2">沟通能力</p>
          <p class="text-4xl font-black text-auxiliary-green">
            {{ reportData.scores.communication }}
          </p>
          <p class="text-sm text-neutral-helper mt-2">表达能力</p>
        </div>
      </div>
    </div>

    <!-- Skills Radar Chart -->
    <div
      class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
    >
      <h3 class="text-xl font-bold text-neutral-title mb-6">技能雷达图</h3>
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
        <ul class="space-y-3">
          <li
            v-for="(strength, index) in reportData.analysis.strengths"
            :key="index"
            class="flex items-start gap-2"
          >
            <div
              class="mt-1 w-1.5 h-1.5 rounded-full bg-auxiliary-green flex-shrink-0"
            ></div>
            <p class="text-sm text-neutral-body">{{ strength }}</p>
          </li>
        </ul>
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
        <ul class="space-y-3">
          <li
            v-for="(weakness, index) in reportData.analysis.weaknesses"
            :key="index"
            class="flex items-start gap-2"
          >
            <div
              class="mt-1 w-1.5 h-1.5 rounded-full bg-auxiliary-red flex-shrink-0"
            ></div>
            <p class="text-sm text-neutral-body">{{ weakness }}</p>
          </li>
        </ul>
      </div>

      <!-- Suggestions -->
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
        <ul class="space-y-3">
          <li
            v-for="(suggestion, index) in reportData.analysis.suggestions"
            :key="index"
            class="flex items-start gap-2"
          >
            <div
              class="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"
            ></div>
            <p class="text-sm text-neutral-body">{{ suggestion }}</p>
          </li>
        </ul>
      </div>
    </div>

    <!-- Question Analysis -->
    <div
      class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
    >
      <h3 class="text-xl font-bold text-neutral-title mb-6">问题分析</h3>
      <div class="space-y-6">
        <div
          v-for="question in reportData.questions"
          :key="question.id"
          class="p-6 bg-neutral-bg rounded-2xl"
        >
          <div class="flex justify-between items-start mb-4">
            <h4 class="font-bold text-neutral-title">
              问题 {{ question.id }}: {{ question.question }}
            </h4>
            <div
              class="px-3 py-1 rounded-full text-xs font-bold"
              :class="
                question.score >= 85
                  ? 'bg-auxiliary-green/10 text-auxiliary-green'
                  : question.score >= 70
                    ? 'bg-auxiliary-orange/10 text-auxiliary-orange'
                    : 'bg-auxiliary-red/10 text-auxiliary-red'
              "
            >
              {{ question.score }}分
            </div>
          </div>
          <p class="text-sm text-neutral-body">{{ question.evaluation }}</p>
        </div>
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
  </div>
</template>

<style scoped>
.gradient-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, #6366f1 100%);
}
</style>
