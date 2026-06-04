<script setup lang="ts">
import {
  Target,
  Sparkles,
  ChevronRight,
  Brain,
  PieChart,
  UserCheck,
  Briefcase,
  BarChart3,
  Award,
  Building,
  Heart,
  CheckCircle2,
  Clock,
  User,
  Zap,
  Calendar,
} from "lucide-vue-next";
import { ref, computed, onMounted } from "vue";
import {
  comprehensiveAssessmentQuestions,
  calculateAssessmentResult,
  calculateJobMatch,
  generateLearningPlan,
  getQuestionsByType,
} from "../utils/assessment";
import type { JobMatch, AssessmentResult } from "../utils/assessment";
import { useKnowledgeStore } from "@/stores/knowledge";
import { storeToRefs } from "pinia";
import { jobApi } from "@/api/modules/job.api";

interface LearningPlanResultData {
  score: number;
  percentage: number;
  totalPossibleScore: number;
  learningPath: string;
  recommendedCourses: string[];
  estimatedDuration: string;
  studyPlan: string[];
}

// Store 初始化
const knowledgeStore = useKnowledgeStore();
const { jobPositions } = storeToRefs(knowledgeStore);

// 匹配分数（异步加载）
const matchScores = ref<Record<number, number>>({});

const loadMatchScores = async () => {
  for (const job of jobPositions.value) {
    try {
      const res = await jobApi.getJobMatch(job.id);
      matchScores.value[job.id] = res.data;
    } catch {
      matchScores.value[job.id] = 0;
    }
  }
};

// 岗位匹配结果数据（从 Store 映射）
const jobMatches = computed<JobMatch[]>(() =>
  jobPositions.value.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company ?? "未知公司",
    matchRate: matchScores.value[job.id] ?? 0,
    salary: job.salary_range ?? "面议",
    location: job.location ?? "未知",
    tags:
      job.required_skills?.map((s) => s.concept_name).length
        ? job.required_skills!.map((s) => s.concept_name)
        : ["暂无标签"],
    description: job.description ?? "暂无描述",
    responsibilities: ["暂无数据"],
    requirements: job.requirements ? [job.requirements] : ["暂无数据"],
    benefits: ["暂无数据"],
    experience: job.level ?? "不限",
    education: "不限",
    logo: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(job.company ?? "Unknown")}%20logo%20minimalist%20design&image_size=square`,
    isFavorite: false,
    companyInfo: "暂无公司信息",
    jobType: "全职",
    publishDate: job.created_at?.split("T")[0] ?? "",
    deadline: "",
  })),
);

// 职业测评结果数据
const careerAssessment = {
  personality: "ISTJ",
  strengths: ["逻辑思维", "问题解决", "团队协作", "责任心"],
  weaknesses: ["创新能力", "冒险精神"],
  recommendedCareers: ["软件工程师", "系统分析师", "技术项目经理"],
  careerPath: "技术专家路线",
};

// 能力雷达图数据
const skillRadarData = [
  { skill: "前端开发", score: 90 },
  { skill: "后端开发", score: 75 },
  { skill: "数据库", score: 70 },
  { skill: "系统设计", score: 65 },
  { skill: "项目管理", score: 80 },
  { skill: "沟通能力", score: 85 },
];

// 热门岗位推荐数据
const hotJobs = [
  {
    id: 101,
    title: "高级前端开发工程师",
    company: "字节跳动",
    matchRate: 92,
    salary: "25K-35K",
    location: "北京",
    experience: "3-5年",
    tags: ["Vue3", "React", "TypeScript", "Node.js", "微前端"],
    logo: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ByteDance%20logo%20minimalist%20design&image_size=square",
    isFavorite: false,
    description:
      "负责公司核心产品的前端开发，参与产品需求分析和技术方案设计，与后端团队协作完成功能开发，优化用户体验和页面性能。",
    responsibilities: [
      "负责公司核心产品的前端开发和维护",
      "参与产品需求分析和技术方案设计",
      "与后端团队协作完成功能开发",
      "优化用户体验和页面性能",
      "制定前端技术规范和最佳实践",
      "指导初级前端开发工程师",
    ],
    requirements: [
      "本科及以上学历，计算机相关专业",
      "3-5年前端开发经验",
      "精通Vue3、React、TypeScript等前端技术",
      "熟悉Node.js和后端技术",
      "有微前端开发经验优先",
      "良好的沟通能力和团队协作精神",
    ],
    education: "本科及以上",
    benefits: [
      "五险一金",
      "年终奖",
      "带薪年假",
      "期权激励",
      "免费三餐",
      "健身房",
      "定期团建",
    ],
    companyInfo:
      "字节跳动是全球领先的内容平台公司，旗下拥有抖音、今日头条等知名产品，致力于通过技术创新为用户创造价值。",
    jobType: "全职",
    publishDate: "2024-01-15",
    deadline: "2024-02-15",
  },
  {
    id: 102,
    title: "全栈开发工程师",
    company: "阿里巴巴",
    matchRate: 85,
    salary: "30K-40K",
    location: "杭州",
    experience: "5年以上",
    tags: ["JavaScript", "Node.js", "React", "Java", "Docker"],
    logo: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Alibaba%20logo%20minimalist%20design&image_size=square",
    isFavorite: false,
    description:
      "负责公司项目的全栈开发，包括前端界面和后端服务，参与技术架构设计和优化，解决复杂的技术问题。",
    responsibilities: [
      "负责公司项目的全栈开发，包括前端界面和后端服务",
      "参与技术架构设计和优化",
      "解决复杂的技术问题",
      "与团队成员协作完成项目目标",
      "编写技术文档和代码注释",
    ],
    requirements: [
      "本科及以上学历，计算机相关专业",
      "5年以上全栈开发经验",
      "精通JavaScript、Node.js、React等前端技术",
      "熟悉Java等后端技术",
      "了解Docker和Kubernetes",
      "良好的问题解决能力和学习能力",
    ],
    education: "本科及以上",
    benefits: [
      "五险一金",
      "年终奖",
      "带薪年假",
      "股票期权",
      "免费三餐",
      "员工宿舍",
      "班车接送",
    ],
    companyInfo:
      "阿里巴巴集团是全球领先的数字商业公司，旗下拥有淘宝、天猫、支付宝等知名产品，致力于通过数字技术推动商业进步。",
    jobType: "全职",
    publishDate: "2024-01-10",
    deadline: "2024-02-10",
  },
  {
    id: 103,
    title: "Web前端工程师",
    company: "腾讯",
    matchRate: 78,
    salary: "20K-30K",
    location: "深圳",
    experience: "2-4年",
    tags: ["HTML5", "CSS3", "JavaScript", "Vue", "Webpack"],
    logo: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Tencent%20logo%20minimalist%20design&image_size=square",
    isFavorite: false,
    description:
      "负责腾讯旗下产品的前端开发，优化用户体验，提升页面性能，与设计和后端团队紧密合作。",
    responsibilities: [
      "负责腾讯旗下产品的前端开发",
      "优化用户体验，提升页面性能",
      "与设计和后端团队紧密合作",
      "参与产品需求讨论和技术方案设计",
      "维护和更新现有项目",
    ],
    requirements: [
      "本科及以上学历，计算机相关专业",
      "2-4年前端开发经验",
      "精通HTML5、CSS3、JavaScript等前端技术",
      "熟悉Vue框架",
      "了解Webpack等构建工具",
      "良好的团队协作能力",
    ],
    education: "本科及以上",
    benefits: [
      "五险一金",
      "年终奖",
      "带薪年假",
      "班车接送",
      "免费午餐",
      "健身房",
    ],
    companyInfo:
      "腾讯是中国领先的互联网公司，旗下拥有微信、QQ、腾讯视频等知名产品，致力于通过互联网服务提升人类生活品质。",
    jobType: "全职",
    publishDate: "2024-01-08",
    deadline: "2024-02-08",
  },
  {
    id: 104,
    title: "前端架构师",
    company: "美团",
    matchRate: 88,
    salary: "35K-45K",
    location: "北京",
    experience: "5年以上",
    tags: ["Vue3", "React", "TypeScript", "微前端", "性能优化"],
    logo: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Meituan%20logo%20minimalist%20design&image_size=square",
    isFavorite: false,
    description:
      "负责美团前端技术架构设计和演进，制定前端技术规范和最佳实践，指导团队成员提升技术能力。",
    responsibilities: [
      "负责美团前端技术架构设计和演进",
      "制定前端技术规范和最佳实践",
      "指导团队成员提升技术能力",
      "解决复杂的前端技术问题",
      "参与技术选型和评估",
    ],
    requirements: [
      "本科及以上学历，计算机相关专业",
      "5年以上前端开发经验",
      "精通Vue3、React、TypeScript等前端技术",
      "有微前端和性能优化经验",
      "良好的技术领导力和沟通能力",
      "有大型项目架构经验",
    ],
    education: "本科及以上",
    benefits: [
      "五险一金",
      "年终奖",
      "带薪年假",
      "免费午餐",
      "健身房",
      "定期团建",
    ],
    companyInfo:
      "美团是中国领先的生活服务平台，旗下拥有美团外卖、美团打车等服务，致力于通过科技创新提升人们的生活品质。",
    jobType: "全职",
    publishDate: "2024-01-12",
    deadline: "2024-02-12",
  },
];

// 模态框状态
const showJobDetailModal = ref(false);
const showAssessmentDetailModal = ref(false);
const showSkillAssessmentModal = ref(false);
const showPsychologicalAssessmentModal = ref(false);
const showTechnicalAssessmentModal = ref(false);
const showConsultationModal = ref(false);
const showPlanModal = ref(false);
const showMatchingTestModal = ref(false);
const showReportModal = ref(false);
const showMoreJobsModal = ref(false);
const showAssessmentTestModal = ref(false);
const showApplicationModal = ref(false);
const showLearningPlanTestModal = ref(false);

// 当前选中的岗位
const selectedJob = ref<JobMatch | null>(null);

// 测评相关状态
const currentAssessmentStep = ref(0);
const assessmentScore = ref(0);
const assessmentAnswers = ref<(string | string[])[]>([]);
const assessmentResult = ref<AssessmentResult | null>(null);
const textAnswer = ref("");
const selectedMultipleOptions = ref<string[]>([]);
const currentAssessmentType = ref<string | null>(null);
const assessmentStep = ref("select"); // select, ongoing, completed

// 学习计划测评相关状态
const currentLearningPlanStep = ref(0);
const learningPlanScore = ref(0);
const learningPlanAnswers = ref<(string | string[])[]>([]);
const learningPlanResult = ref<LearningPlanResultData | null>(null);

// 简历上传相关状态
const resumeFile = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);

// 学习计划测评问题数据
const learningPlanQuestions = [
  {
    id: 1,
    category: "学习目标",
    question: "您的学习目标是什么？",
    type: "single",
    options: [
      { value: "1", label: "入门前端开发", score: 1 },
      { value: "2", label: "提升现有技能", score: 2 },
      { value: "3", label: "转向前端开发", score: 3 },
      { value: "4", label: "成为前端专家", score: 4 },
    ],
    weight: 5,
  },
  {
    id: 2,
    category: "学习时间",
    question: "您每天可以投入多少时间学习？",
    type: "single",
    options: [
      { value: "1", label: "1小时以下", score: 1 },
      { value: "2", label: "1-2小时", score: 2 },
      { value: "3", label: "2-4小时", score: 3 },
      { value: "4", label: "4小时以上", score: 4 },
    ],
    weight: 4,
  },
  {
    id: 3,
    category: "学习方式",
    question: "您偏好的学习方式是什么？",
    type: "multiple",
    options: [
      { value: "video", label: "视频教程" },
      { value: "book", label: "书籍阅读" },
      { value: "practice", label: "实战练习" },
      { value: "course", label: "在线课程" },
    ],
    weight: 3,
  },
  {
    id: 4,
    category: "技术背景",
    question: "您的技术背景是什么？",
    type: "single",
    options: [
      { value: "1", label: "零基础", score: 1 },
      { value: "2", label: "有其他编程经验", score: 2 },
      { value: "3", label: "有前端基础", score: 3 },
      { value: "4", label: "有丰富前端经验", score: 4 },
    ],
    weight: 5,
  },
  {
    id: 5,
    category: "职业规划",
    question: "您的职业规划是什么？",
    type: "single",
    options: [
      { value: "1", label: "找到第一份前端工作", score: 1 },
      { value: "2", label: "晋升为高级前端工程师", score: 2 },
      { value: "3", label: "转向管理岗位", score: 3 },
      { value: "4", label: "创业或自由职业", score: 4 },
    ],
    weight: 4,
  },
];

// 热门岗位推荐的交互逻辑
const toggleFavorite = (jobId: number) => {
  const job =
    jobMatches.find((job) => job.id === jobId) ||
    hotJobs.find((job) => job.id === jobId);
  if (job) {
    job.isFavorite = !job.isFavorite;
  }
};

const showJobDetails = (jobId: number) => {
  // 查找选中的岗位
  selectedJob.value =
    jobMatches.find((job) => job.id === jobId) ||
    hotJobs.find((job) => job.id === jobId);
  if (selectedJob.value) {
    // 关闭更多岗位推荐模态框
    showMoreJobsModal.value = false;
    // 打开岗位详情模态框
    showJobDetailModal.value = true;
  }
};

const applyJob = (jobId: number) => {
  // 查找选中的岗位
  selectedJob.value =
    jobMatches.find((job) => job.id === jobId) ||
    hotJobs.find((job) => job.id === jobId);
  if (selectedJob.value) {
    // 关闭更多岗位推荐模态框
    showMoreJobsModal.value = false;
    // 打开立即申请模态框
    showApplicationModal.value = true;
  }
};

// 主要按钮交互逻辑
const startMatchingTest = () => {
  showMatchingTestModal.value = true;
};

const startAssessmentTest = (type: string = "technical") => {
  // 重置测评状态
  currentAssessmentStep.value = 0;
  assessmentScore.value = 0;
  assessmentAnswers.value = [];
  assessmentResult.value = null;
  textAnswer.value = "";
  selectedMultipleOptions.value = [];
  currentAssessmentType.value = type;
  assessmentStep.value = "ongoing";

  // 关闭当前模态框并打开测评模态框
  showSkillAssessmentModal.value = false;
  showPsychologicalAssessmentModal.value = false;
  showTechnicalAssessmentModal.value = false;
  showAssessmentTestModal.value = true;
};

const submitAssessmentAnswer = (answer: string | string[]) => {
  // 保存答案
  assessmentAnswers.value.push(answer);

  // 根据测评类型获取问题
  const questions =
    getQuestionsByType(currentAssessmentType.value as any) ||
    comprehensiveAssessmentQuestions;

  // 进入下一题或完成测评
  if (currentAssessmentStep.value < questions.length - 1) {
    currentAssessmentStep.value++;
    // 重置文本题和多选题的状态
    textAnswer.value = "";
    selectedMultipleOptions.value = [];
  } else {
    // 完成测评，计算结果
    assessmentResult.value = calculateAssessmentResult(
      assessmentAnswers.value,
      currentAssessmentType.value as any,
    );
    assessmentStep.value = "completed";

    // 重新计算岗位匹配度
    const updatedJobs = calculateJobMatch(assessmentResult.value, jobMatches);
    jobMatches.splice(0, jobMatches.length, ...updatedJobs);

    // 生成个性化学习计划
    const learningPlan = generateLearningPlan(assessmentResult.value);
    learningPlanResult.value = {
      ...learningPlanResult.value,
      learningPath: learningPlan.title,
      estimatedDuration: learningPlan.duration,
      recommendedCourses: learningPlan.resources,
      studyPlan: learningPlan.weeklyPlan,
    };
  }
};

const toggleMultipleChoice = (value: string) => {
  const index = selectedMultipleOptions.value.indexOf(value);
  if (index === -1) {
    selectedMultipleOptions.value.push(value);
  } else {
    selectedMultipleOptions.value.splice(index, 1);
  }
};

const submitMultipleChoiceAnswer = () => {
  submitAssessmentAnswer(selectedMultipleOptions.value);
};

const submitTextAnswer = () => {
  submitAssessmentAnswer(textAnswer.value);
};

// 学习计划测评相关函数
const startLearningPlanTest = () => {
  // 重置测评状态
  currentLearningPlanStep.value = 0;
  learningPlanScore.value = 0;
  learningPlanAnswers.value = [];
  learningPlanResult.value = null;
  selectedMultipleOptions.value = [];

  // 关闭当前模态框并打开测评模态框
  showPlanModal.value = false;
  showLearningPlanTestModal.value = true;
};

const submitLearningPlanAnswer = (answer: string | string[]) => {
  // 保存答案
  learningPlanAnswers.value.push(answer);

  // 计算得分
  const currentQuestion = learningPlanQuestions[currentLearningPlanStep.value];
  if (currentQuestion) {
    if (currentQuestion.type === "single") {
      const selectedOption = currentQuestion.options.find(
        (opt) => opt.value === answer,
      );
      if (selectedOption && "score" in selectedOption && selectedOption.score) {
        learningPlanScore.value +=
          Number(selectedOption.score) * Number(currentQuestion.weight);
      }
    } else if (currentQuestion.type === "multiple") {
      // 多选题得分基于选择的选项数量
      learningPlanScore.value += answer.length * currentQuestion.weight;
      // 重置多选题选择
      selectedMultipleOptions.value = [];
    }
  }

  // 进入下一题或完成测评
  if (currentLearningPlanStep.value < learningPlanQuestions.length - 1) {
    currentLearningPlanStep.value++;
  } else {
    // 完成测评，计算结果
    calculateLearningPlanResult();
  }
};

const calculateLearningPlanResult = () => {
  // 计算总分和百分比
  const totalPossibleScore = learningPlanQuestions.reduce((total, q) => {
    if (q.type === "single") {
      const maxScore = Math.max(
        ...q.options.map((opt) => ("score" in opt ? opt.score : 0)),
      );
      return total + maxScore * q.weight;
    } else {
      return total + q.options.length * q.weight;
    }
  }, 0);

  const scorePercentage = Math.round(
    (learningPlanScore.value / totalPossibleScore) * 100,
  );

  // 生成测评结果
  learningPlanResult.value = {
    score: learningPlanScore.value,
    percentage: scorePercentage,
    totalPossibleScore,
    learningPath: "",
    recommendedCourses: [],
    estimatedDuration: "",
    studyPlan: [],
  };

  // 分析结果，生成个性化学习计划
  if (scorePercentage >= 80) {
    // 高级学习者
    learningPlanResult.value.learningPath = "高级前端工程师路径";
    learningPlanResult.value.estimatedDuration = "8周";
    learningPlanResult.value.recommendedCourses = [
      "前端架构设计与实现",
      "性能优化高级课程",
      "微前端实战",
      "TypeScript高级特性",
      "前端工程化最佳实践",
    ];
    learningPlanResult.value.studyPlan = [
      "第1-2周：前端架构设计与实现",
      "第3-4周：性能优化高级课程",
      "第5-6周：微前端实战",
      "第7-8周：TypeScript高级特性与前端工程化",
    ];
  } else if (scorePercentage >= 60) {
    // 中级学习者
    learningPlanResult.value.learningPath = "中级前端工程师路径";
    learningPlanResult.value.estimatedDuration = "12周";
    learningPlanResult.value.recommendedCourses = [
      "Vue3高级特性",
      "React Hooks深入",
      "TypeScript基础与实践",
      "前端工程化工具",
      "响应式设计与动画",
    ];
    learningPlanResult.value.studyPlan = [
      "第1-3周：Vue3高级特性",
      "第4-6周：React Hooks深入",
      "第7-9周：TypeScript基础与实践",
      "第10-12周：前端工程化工具与响应式设计",
    ];
  } else {
    // 初级学习者
    learningPlanResult.value.learningPath = "前端开发入门路径";
    learningPlanResult.value.estimatedDuration = "16周";
    learningPlanResult.value.recommendedCourses = [
      "HTML5基础与进阶",
      "CSS3与响应式设计",
      "JavaScript核心概念",
      "Vue3基础",
      "React基础",
    ];
    learningPlanResult.value.studyPlan = [
      "第1-4周：HTML5基础与进阶",
      "第5-8周：CSS3与响应式设计",
      "第9-12周：JavaScript核心概念",
      "第13-14周：Vue3基础",
      "第15-16周：React基础",
    ];
  }
};

const viewAnalysisReport = () => {
  // 关闭测评测试模态框
  showAssessmentTestModal.value = false;
  // 打开分析报告模态框
  showReportModal.value = true;
};

const generatePersonalizedPlan = () => {
  showPlanModal.value = true;
};

const bookConsultation = () => {
  showConsultationModal.value = true;
};

// 测评模块点击处理
const showSkillAssessment = () => {
  showSkillAssessmentModal.value = true;
};

const showPsychologicalAssessment = () => {
  showPsychologicalAssessmentModal.value = true;
};

const showTechnicalAssessment = () => {
  showTechnicalAssessmentModal.value = true;
};

// 加载更多岗位
const loadMoreJobs = () => {
  showMoreJobsModal.value = true;
};

// 简历上传相关方法
const triggerFileInput = () => {
  resumeFile.value?.click();
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0 && target.files[0]) {
    selectedFile.value = target.files[0];
  }
};

// 关闭模态框
const closeModal = () => {
  showJobDetailModal.value = false;
  showAssessmentDetailModal.value = false;
  showSkillAssessmentModal.value = false;
  showPsychologicalAssessmentModal.value = false;
  showTechnicalAssessmentModal.value = false;
  showConsultationModal.value = false;
  showPlanModal.value = false;
  showMatchingTestModal.value = false;
  showReportModal.value = false;
  showMoreJobsModal.value = false;
  showAssessmentTestModal.value = false;
  showApplicationModal.value = false;
  showLearningPlanTestModal.value = false;
  selectedJob.value = null;
  selectedFile.value = null;
  if (resumeFile.value) {
    resumeFile.value.value = "";
  }
};

// 初始化：加载 Store 数据和匹配分数
onMounted(async () => {
  await knowledgeStore.fetchAllData();
  await loadMatchScores();
});
</script>

<template>
  <div class="flex flex-col gap-8 max-w-7xl mx-auto">
    <!-- Hero: Job Matching -->
    <div
      class="gradient-primary p-10 rounded-[40px] text-white relative overflow-hidden shadow-xl"
    >
      <div class="relative z-10 max-w-2xl">
        <h1 class="text-4xl font-black mb-4">岗位匹配与职业测评</h1>
        <p class="text-white/80 mb-8 text-lg">
          基于岗位知识图谱，计算个人能力与目标岗位的匹配百分比，为您推荐最精准的求职方向。
        </p>
        <div class="flex gap-4">
          <button
            class="px-8 py-4 bg-white text-primary font-bold rounded-2xl shadow-lg hover:scale-105 transition-all"
            @click="startMatchingTest"
          >
            开始智能匹配测评
          </button>
          <button
            class="px-8 py-4 bg-white/20 backdrop-blur-md text-white font-bold rounded-2xl hover:bg-white/30 transition-all"
            @click="viewAnalysisReport"
          >
            查看分析报告
          </button>
        </div>
      </div>
      <div class="absolute -right-20 -bottom-20 opacity-10">
        <Target :size="320" />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      <!-- Left: Main Content -->
      <div class="lg:col-span-8 space-y-8">
        <!-- 一体化分析报告 -->
        <div
          class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
        >
          <div class="flex items-center justify-between mb-8">
            <h2
              class="text-xl font-bold text-neutral-title flex items-center gap-3"
            >
              <div class="w-2 h-6 gradient-primary rounded-full"></div>
              一体化分析报告
            </h2>
            <button
              class="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-sm flex items-center gap-2"
              @click="viewAnalysisReport"
            >
              生成完整报告
              <ChevronRight :size="16" />
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div
              class="p-6 bg-neutral-bg rounded-[24px] hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-neutral-border group cursor-pointer"
              @click="showSkillAssessment"
            >
              <div
                class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:gradient-primary group-hover:text-white transition-all"
              >
                <PieChart :size="24" />
              </div>
              <h3 class="font-bold text-neutral-title mb-1">岗位技能测评</h3>
              <p class="text-xs text-neutral-helper mb-4">基于能力图谱匹配</p>
              <div class="flex items-center justify-between mt-auto">
                <span class="text-[10px] font-bold uppercase text-primary"
                  >进行中</span
                >
                <ChevronRight
                  :size="16"
                  class="text-neutral-helper group-hover:text-white transition-all"
                />
              </div>
            </div>
            <div
              class="p-6 bg-neutral-bg rounded-[24px] hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-neutral-border group cursor-pointer"
              @click="showPsychologicalAssessment"
            >
              <div
                class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:gradient-primary group-hover:text-white transition-all"
              >
                <Brain :size="24" />
              </div>
              <h3 class="font-bold text-neutral-title mb-1">职业心理测评</h3>
              <p class="text-xs text-neutral-helper mb-4">MBTI 专业性格测试</p>
              <div class="flex items-center justify-between mt-auto">
                <span
                  class="text-[10px] font-bold uppercase text-auxiliary-orange"
                  >待开始</span
                >
                <ChevronRight
                  :size="16"
                  class="text-neutral-helper group-hover:text-white transition-all"
                />
              </div>
            </div>
            <div
              class="p-6 bg-neutral-bg rounded-[24px] hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-neutral-border group cursor-pointer"
              @click="showTechnicalAssessment"
            >
              <div
                class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:gradient-primary group-hover:text-white transition-all"
              >
                <Zap :size="24" />
              </div>
              <h3 class="font-bold text-neutral-title mb-1">综合技术测评</h3>
              <p class="text-xs text-neutral-helper mb-4">专业水平与沟通评估</p>
              <div class="flex items-center justify-between mt-auto">
                <span
                  class="text-[10px] font-bold uppercase text-auxiliary-green"
                  >待开始</span
                >
                <ChevronRight
                  :size="16"
                  class="text-neutral-helper group-hover:text-white transition-all"
                />
              </div>
            </div>
          </div>

          <!-- 简要分析结果 -->
          <div
            class="p-6 bg-neutral-bg rounded-[24px] border border-neutral-border mb-8"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-neutral-title">测评概览</h3>
            </div>
            <div class="space-y-4">
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="font-bold text-neutral-title">技术能力</span>
                  <span class="text-auxiliary-green font-bold">85%</span>
                </div>
                <div class="h-2 bg-neutral-border rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary transition-all"
                    style="width: 85%"
                  ></div>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="font-bold text-neutral-title">沟通能力</span>
                  <span class="text-auxiliary-green font-bold">75%</span>
                </div>
                <div class="h-2 bg-neutral-border rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary transition-all"
                    style="width: 75%"
                  ></div>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="font-bold text-neutral-title">问题解决</span>
                  <span class="text-auxiliary-green font-bold">88%</span>
                </div>
                <div class="h-2 bg-neutral-border rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary transition-all"
                    style="width: 88%"
                  ></div>
                </div>
              </div>
            </div>
            <p class="text-sm text-neutral-body mt-4">
              点击"生成完整报告"查看详细的测评分析和提升建议。
            </p>
          </div>

          <!-- 总体评估与建议 -->
          <div
            class="mt-8 p-6 bg-primary/5 rounded-[24px] border border-primary/20"
          >
            <h3 class="font-bold text-primary mb-4">总体评估与建议</h3>
            <p class="text-sm text-neutral-body mb-4">
              基于您的综合测评结果，您在技术能力和问题解决方面表现出色，但在行业知识和沟通能力方面有提升空间。
              建议您专注于学习行业最新趋势，并加强沟通技巧的训练。
            </p>
            <div class="flex gap-4">
              <button
                class="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-sm"
                @click="generatePersonalizedPlan"
              >
                生成个性化提升计划
              </button>
              <button
                class="px-4 py-2 bg-white text-primary font-bold rounded-xl hover:bg-primary/10 transition-all text-sm border border-primary/20"
                @click="bookConsultation"
              >
                预约职业咨询
              </button>
            </div>
          </div>
        </div>

        <!-- 岗位匹配结果 -->
        <div
          class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
        >
          <div class="flex items-center justify-between mb-8">
            <h2
              class="text-xl font-bold text-neutral-title flex items-center gap-3"
            >
              <Briefcase :size="24" class="text-primary" />
              岗位匹配结果
            </h2>
            <div class="flex items-center gap-2">
              <select
                class="px-4 py-2 bg-neutral-bg border border-neutral-border rounded-xl text-sm font-bold"
              >
                <option>匹配度排序</option>
                <option>薪资排序</option>
                <option>最新发布</option>
              </select>
            </div>
          </div>
          <div class="space-y-6">
            <div
              v-for="job in jobMatches.slice(0, 2)"
              :key="job.id"
              class="p-6 bg-neutral-bg rounded-[24px] hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-neutral-border group"
            >
              <div
                class="flex flex-col md:flex-row md:items-start justify-between mb-6"
              >
                <div class="flex items-start gap-4 mb-4 md:mb-0">
                  <div
                    class="w-12 h-12 rounded-2xl overflow-hidden bg-white shadow-sm flex items-center justify-center"
                  >
                    <img
                      :src="job.logo"
                      alt="{{ job.company }}"
                      class="w-8 h-8 object-contain"
                    />
                  </div>
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <h3 class="font-bold text-neutral-title text-lg">
                        {{ job.title }}
                      </h3>
                      <button
                        class="text-neutral-helper hover:text-auxiliary-orange transition-colors"
                        @click="toggleFavorite(job.id)"
                      >
                        <Heart
                          :size="18"
                          :fill="job.isFavorite ? 'currentColor' : 'none'"
                        />
                      </button>
                    </div>
                    <div class="flex items-center gap-4 mb-2">
                      <span
                        class="text-sm text-neutral-helper flex items-center gap-1"
                        ><Building :size="14" /> {{ job.company }}</span
                      >
                      <span
                        class="text-sm text-neutral-helper flex items-center gap-1"
                        ><Heart :size="14" /> {{ job.location }}</span
                      >
                      <span class="text-sm text-auxiliary-green font-bold">{{
                        job.salary
                      }}</span>
                    </div>
                    <div class="flex items-center gap-4 mb-2">
                      <span
                        class="text-sm text-neutral-helper flex items-center gap-1"
                        ><UserCheck :size="14" /> {{ job.experience }}</span
                      >
                      <span
                        class="text-sm text-neutral-helper flex items-center gap-1"
                        ><Brain :size="14" /> {{ job.education }}</span
                      >
                    </div>
                    <div class="flex flex-wrap gap-2 mb-4">
                      <span
                        v-for="benefit in job.benefits"
                        :key="benefit"
                        class="px-3 py-1 bg-auxiliary-green/10 text-auxiliary-green text-xs font-bold rounded-full"
                        >{{ benefit }}</span
                      >
                    </div>
                  </div>
                </div>
                <div class="flex flex-col items-end">
                  <div class="flex items-center gap-2 mb-4">
                    <span
                      class="text-sm font-bold text-neutral-title min-w-[80px]"
                      >{{ job.matchRate }}% 匹配</span
                    >
                    <div
                      class="h-2 w-32 bg-neutral-border rounded-full overflow-hidden"
                    >
                      <div
                        class="h-full bg-primary transition-all"
                        :style="{ width: job.matchRate + '%' }"
                      ></div>
                    </div>
                  </div>
                  <div class="flex flex-col gap-2 w-full md:w-auto">
                    <button
                      class="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-sm flex items-center justify-center gap-2 group-hover:scale-105"
                      @click="showJobDetails(job.id)"
                    >
                      查看详情
                      <ChevronRight
                        :size="16"
                        class="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                    <button
                      class="px-4 py-2 bg-white text-primary font-bold rounded-xl hover:bg-primary/10 transition-all text-sm border border-primary/20"
                      @click="applyJob(job.id)"
                    >
                      立即申请
                    </button>
                  </div>
                </div>
              </div>
              <div class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="tag in job.tags"
                  :key="tag"
                  class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full"
                  >{{ tag }}</span
                >
              </div>
              <p class="text-sm text-neutral-body mb-2 line-clamp-2">
                {{ job.description }}
              </p>
              <button class="text-xs text-primary font-bold hover:underline">
                查看完整职位描述
              </button>
            </div>
          </div>
          <div class="mt-8 flex justify-center">
            <button
              class="px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-primary/10 transition-all text-sm border border-primary/20 flex items-center gap-2"
              @click="loadMoreJobs"
            >
              加载更多岗位
              <ChevronRight :size="16" />
            </button>
          </div>
        </div>

        <!-- AI 个性化培养方案 -->
        <div
          class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
        >
          <div class="flex items-center justify-between mb-8">
            <h2
              class="text-xl font-bold text-neutral-title flex items-center gap-3"
            >
              <Sparkles :size="24" class="text-auxiliary-orange" />
              AI 个性化培养方案
            </h2>
          </div>

          <!-- 培养方案概览 -->
          <div
            class="p-8 bg-neutral-title rounded-[32px] text-white relative overflow-hidden mb-8"
          >
            <div class="absolute -right-20 -bottom-20 opacity-10">
              <Brain :size="200" />
            </div>
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-6">
                <div
                  class="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center text-white"
                >
                  <Sparkles :size="24" />
                </div>
                <h3 class="text-2xl font-bold italic text-white">
                  前端开发工程师培养方案
                </h3>
              </div>
              <p class="text-white/60 text-sm mb-6 leading-relaxed">
                基于您的测评结果，我们为您定制了专属的学习路径，覆盖技术盲区与沟通短板，帮助您成为更具竞争力的前端开发工程师。
              </p>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div class="text-2xl font-bold text-primary mb-1">12周</div>
                  <div class="text-sm text-white/60">培养周期</div>
                </div>
                <div class="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div class="text-2xl font-bold text-primary mb-1">18个</div>
                  <div class="text-sm text-white/60">核心技能</div>
                </div>
                <div class="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div class="text-2xl font-bold text-primary mb-1">3个</div>
                  <div class="text-sm text-white/60">实战项目</div>
                </div>
              </div>

              <button
                class="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all flex items-center gap-2 group"
                @click="generatePersonalizedPlan"
              >
                开始学习
                <ChevronRight
                  :size="16"
                  class="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>

          <p class="text-sm text-neutral-body text-center">
            点击"开始学习"查看完整的学习路径、培养目标、实战项目和学习进度。
          </p>
        </div>
      </div>

      <!-- Right: Sidebar -->
      <div class="lg:col-span-4 space-y-8">
        <!-- 职业测评结果 -->
        <div
          class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
        >
          <h2
            class="text-xl font-bold text-neutral-title mb-6 flex items-center gap-3"
          >
            <UserCheck :size="24" class="text-primary" />
            职业测评结果
          </h2>
          <div class="space-y-6">
            <div class="p-4 bg-neutral-bg rounded-[20px]">
              <h3 class="text-sm font-bold text-neutral-title mb-2">
                性格类型
              </h3>
              <div class="flex items-center gap-2">
                <span class="text-xl font-black text-primary">{{
                  careerAssessment.personality
                }}</span>
                <span class="text-sm text-neutral-helper"
                  >内向 | 感觉 | 思考 | 判断</span
                >
              </div>
            </div>
            <div class="p-4 bg-neutral-bg rounded-[20px]">
              <h3 class="text-sm font-bold text-neutral-title mb-3">优势</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="strength in careerAssessment.strengths"
                  :key="strength"
                  class="px-3 py-1 bg-auxiliary-green/10 text-auxiliary-green text-xs font-bold rounded-full"
                  >{{ strength }}</span
                >
              </div>
            </div>
            <div class="p-4 bg-neutral-bg rounded-[20px]">
              <h3 class="text-sm font-bold text-neutral-title mb-3">
                改进方向
              </h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="weakness in careerAssessment.weaknesses"
                  :key="weakness"
                  class="px-3 py-1 bg-auxiliary-orange/10 text-auxiliary-orange text-xs font-bold rounded-full"
                  >{{ weakness }}</span
                >
              </div>
            </div>
            <div class="p-4 bg-neutral-bg rounded-[20px]">
              <h3 class="text-sm font-bold text-neutral-title mb-2">
                推荐职业
              </h3>
              <ul class="space-y-2">
                <li
                  v-for="(career, index) in careerAssessment.recommendedCareers"
                  :key="index"
                  class="text-sm text-neutral-body flex items-center gap-2"
                >
                  <ChevronRight :size="14" class="text-primary" />
                  {{ career }}
                </li>
              </ul>
            </div>
            <div class="p-4 bg-primary/10 rounded-[20px]">
              <h3 class="text-sm font-bold text-primary mb-2">职业发展路径</h3>
              <p class="text-sm text-neutral-title">
                {{ careerAssessment.careerPath }}
              </p>
            </div>
          </div>
        </div>

        <!-- 能力雷达图 -->
        <div
          class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
        >
          <h2
            class="text-xl font-bold text-neutral-title mb-6 flex items-center gap-3"
          >
            <BarChart3 :size="24" class="text-primary" />
            能力评估
          </h2>
          <div class="p-6 bg-neutral-bg rounded-[20px]">
            <div
              v-for="skill in skillRadarData"
              :key="skill.skill"
              class="mb-4"
            >
              <div class="flex justify-between text-sm mb-1">
                <span class="font-bold text-neutral-title">{{
                  skill.skill
                }}</span>
                <span class="text-auxiliary-green font-bold"
                  >{{ skill.score }}%</span
                >
              </div>
              <div class="h-2 bg-neutral-border rounded-full overflow-hidden">
                <div
                  class="h-full bg-primary transition-all"
                  :style="{ width: skill.score + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 热门岗位推荐 -->
        <div
          class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
        >
          <h2
            class="text-xl font-bold text-neutral-title mb-6 flex items-center gap-3"
          >
            <Award :size="24" class="text-auxiliary-orange" />
            热门岗位推荐
          </h2>
          <div class="space-y-4">
            <div
              v-for="job in hotJobs"
              :key="job.id"
              class="p-4 bg-neutral-bg rounded-[20px] hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-neutral-border group cursor-pointer"
            >
              <div class="flex items-start gap-3 mb-3">
                <div
                  class="w-10 h-10 rounded-2xl overflow-hidden bg-white shadow-sm flex items-center justify-center flex-shrink-0"
                >
                  <img
                    :src="job.logo"
                    :alt="job.company"
                    class="w-6 h-6 object-contain"
                  />
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <h3 class="text-sm font-bold text-neutral-title">
                      {{ job.title }}
                    </h3>
                    <button
                      class="text-neutral-helper hover:text-auxiliary-orange transition-colors"
                      @click.stop="toggleFavorite(job.id)"
                    >
                      <Heart
                        :size="16"
                        :fill="job.isFavorite ? 'currentColor' : 'none'"
                      />
                    </button>
                  </div>
                  <p class="text-xs text-neutral-helper mb-2">
                    {{ job.company }} · {{ job.location }}
                  </p>
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-xs text-auxiliary-green font-bold">{{
                      job.salary
                    }}</span>
                    <span class="text-xs text-neutral-helper">{{
                      job.experience
                    }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div
                      class="flex-1 h-1.5 bg-neutral-border rounded-full overflow-hidden"
                    >
                      <div
                        class="h-full bg-primary transition-all"
                        :style="{ width: job.matchRate + '%' }"
                      ></div>
                    </div>
                    <span
                      class="text-xs text-primary font-bold min-w-[80px] text-right"
                      >{{ job.matchRate }}% 匹配</span
                    >
                  </div>
                </div>
              </div>
              <div class="flex flex-wrap gap-1 mb-3">
                <span
                  v-for="tag in job.tags.slice(0, 3)"
                  :key="tag"
                  class="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full"
                  >{{ tag }}</span
                >
                <span
                  v-if="job.tags.length > 3"
                  class="px-2 py-0.5 bg-neutral-bg text-neutral-helper text-[10px] font-bold rounded-full"
                  >+{{ (job.tags.length - 3).toString() }}</span
                >
              </div>
              <div class="flex gap-2">
                <button
                  class="flex-1 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-xs flex items-center justify-center gap-1 group-hover:scale-105"
                  @click="showJobDetails(job.id)"
                >
                  查看详情
                  <ChevronRight
                    :size="14"
                    class="group-hover:translate-x-1 transition-transform"
                  />
                </button>
                <button
                  class="flex-1 py-2 bg-white text-primary font-bold rounded-xl hover:bg-primary/10 transition-all text-xs border border-primary/20"
                  @click="applyJob(job.id)"
                >
                  立即申请
                </button>
              </div>
            </div>
          </div>
          <div class="mt-6 flex justify-center">
            <button
              class="px-4 py-2 bg-white text-primary font-bold rounded-xl hover:bg-primary/10 transition-all text-sm border border-primary/20 flex items-center gap-2"
            >
              查看更多岗位
              <ChevronRight :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 模态框组件 -->
    <!-- 岗位详情模态框 -->
    <div
      v-if="showJobDetailModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
      >
        <div class="p-8 border-b border-neutral-border">
          <div class="flex justify-between items-center">
            <h2
              class="text-2xl font-black text-neutral-title flex items-center gap-3"
            >
              <Briefcase class="text-primary" :size="28" />
              {{ selectedJob?.title }}
            </h2>
            <button
              class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all"
              @click="closeModal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-8">
          <div class="flex items-center gap-4 mb-6">
            <div
              class="w-16 h-16 rounded-2xl overflow-hidden bg-white shadow-sm flex items-center justify-center"
            >
              <img
                :src="selectedJob?.logo"
                :alt="selectedJob?.company"
                class="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <h3 class="text-lg font-bold text-neutral-title">
                {{ selectedJob?.company }}
              </h3>
              <div class="flex flex-wrap items-center gap-4 mt-2">
                <span
                  class="text-sm text-neutral-helper flex items-center gap-1"
                  ><Building :size="14" /> {{ selectedJob?.location }}</span
                >
                <span class="text-sm text-auxiliary-green font-bold">{{
                  selectedJob?.salary
                }}</span>
                <span
                  class="text-sm text-neutral-helper flex items-center gap-1"
                  ><UserCheck :size="14" /> {{ selectedJob?.experience }}</span
                >
                <span
                  class="text-sm text-neutral-helper flex items-center gap-1"
                  ><Brain :size="14" /> {{ selectedJob?.education }}</span
                >
                <span
                  class="text-sm text-neutral-helper flex items-center gap-1"
                  ><Clock :size="14" /> {{ selectedJob?.jobType }}</span
                >
              </div>
              <div class="flex flex-wrap items-center gap-4 mt-2">
                <span
                  class="text-sm text-neutral-helper flex items-center gap-1"
                  ><Calendar :size="14" /> 发布日期：{{
                    selectedJob?.publishDate
                  }}</span
                >
                <span
                  class="text-sm text-neutral-helper flex items-center gap-1"
                  ><Target :size="14" /> 截止日期：{{
                    selectedJob?.deadline
                  }}</span
                >
              </div>
            </div>
            <div class="ml-auto">
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-neutral-title"
                  >{{ selectedJob?.matchRate }}% 匹配</span
                >
                <div
                  class="h-2 w-32 bg-neutral-border rounded-full overflow-hidden"
                >
                  <div
                    class="h-full bg-primary transition-all"
                    :style="{ width: selectedJob?.matchRate + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 公司信息 -->
          <div
            class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border mb-6"
          >
            <h4 class="text-sm font-bold text-neutral-title mb-3">公司信息</h4>
            <p class="text-sm text-neutral-body leading-relaxed">
              {{ selectedJob?.companyInfo }}
            </p>
          </div>

          <!-- 职位描述 -->
          <div class="mb-6">
            <h4 class="text-sm font-bold text-neutral-title mb-3">职位描述</h4>
            <p class="text-sm text-neutral-body leading-relaxed mb-4">
              {{ selectedJob?.description }}
            </p>

            <h5 class="text-xs font-bold text-neutral-title mb-2">岗位职责</h5>
            <ul class="space-y-2 mb-4">
              <li
                v-for="(responsibility, index) in selectedJob?.responsibilities"
                :key="index"
                class="text-sm text-neutral-body flex items-start gap-2"
              >
                <div class="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                {{ responsibility }}
              </li>
            </ul>
          </div>

          <!-- 任职要求 -->
          <div class="mb-6">
            <h4 class="text-sm font-bold text-neutral-title mb-3">任职要求</h4>
            <ul class="space-y-2">
              <li
                v-for="(requirement, index) in selectedJob?.requirements"
                :key="index"
                class="text-sm text-neutral-body flex items-start gap-2"
              >
                <div class="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                {{ requirement }}
              </li>
            </ul>
          </div>

          <!-- 技能要求 -->
          <div class="mb-6">
            <h4 class="text-sm font-bold text-neutral-title mb-3">技能要求</h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in selectedJob?.tags"
                :key="tag"
                class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full"
                >{{ tag }}</span
              >
            </div>
          </div>

          <!-- 福利待遇 -->
          <div class="mb-6">
            <h4 class="text-sm font-bold text-neutral-title mb-3">福利待遇</h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="benefit in selectedJob?.benefits"
                :key="benefit"
                class="px-3 py-1 bg-auxiliary-green/10 text-auxiliary-green text-xs font-bold rounded-full"
                >{{ benefit }}</span
              >
            </div>
          </div>

          <!-- 行动按钮 -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              class="flex-1 py-4 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
              @click="applyJob(selectedJob?.id)"
            >
              立即申请
              <ChevronRight :size="20" />
            </button>
            <button
              class="flex-1 py-4 bg-white text-primary font-bold rounded-2xl shadow-sm hover:bg-primary/10 transition-all text-sm border border-primary/20"
              @click="closeModal"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 测评详情模态框 -->
    <div
      v-if="showAssessmentDetailModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
      >
        <div class="p-8 border-b border-neutral-border">
          <div class="flex justify-between items-center">
            <h2
              class="text-2xl font-black text-neutral-title flex items-center gap-3"
            >
              <PieChart class="text-primary" :size="28" />
              测评详情分析
            </h2>
            <button
              class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all"
              @click="closeModal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-8">
          <div class="space-y-6">
            <div
              class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border"
            >
              <h3 class="font-bold text-neutral-title mb-4">详细评分</h3>
              <div class="space-y-4">
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="font-bold text-neutral-title">技术能力</span>
                    <span class="text-auxiliary-green font-bold">85%</span>
                  </div>
                  <div
                    class="h-2 bg-neutral-border rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-primary transition-all"
                      style="width: 85%"
                    ></div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="font-bold text-neutral-title">项目经验</span>
                    <span class="text-auxiliary-green font-bold">78%</span>
                  </div>
                  <div
                    class="h-2 bg-neutral-border rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-primary transition-all"
                      style="width: 78%"
                    ></div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="font-bold text-neutral-title">行业知识</span>
                    <span class="text-auxiliary-green font-bold">70%</span>
                  </div>
                  <div
                    class="h-2 bg-neutral-border rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-primary transition-all"
                      style="width: 70%"
                    ></div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="font-bold text-neutral-title">沟通能力</span>
                    <span class="text-auxiliary-green font-bold">75%</span>
                  </div>
                  <div
                    class="h-2 bg-neutral-border rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-primary transition-all"
                      style="width: 75%"
                    ></div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="font-bold text-neutral-title">问题解决</span>
                    <span class="text-auxiliary-green font-bold">88%</span>
                  </div>
                  <div
                    class="h-2 bg-neutral-border rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-primary transition-all"
                      style="width: 88%"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-6 bg-primary/5 rounded-2xl border border-primary/20">
              <h3 class="font-bold text-primary mb-4">提升建议</h3>
              <ul class="space-y-3">
                <li class="text-sm text-neutral-body flex items-start gap-3">
                  <div
                    class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5"
                  >
                    <CheckCircle2 :size="12" />
                  </div>
                  <p>加强行业知识学习，关注最新技术趋势和最佳实践</p>
                </li>
                <li class="text-sm text-neutral-body flex items-start gap-3">
                  <div
                    class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5"
                  >
                    <CheckCircle2 :size="12" />
                  </div>
                  <p>提升沟通能力，练习清晰表达技术概念和解决方案</p>
                </li>
                <li class="text-sm text-neutral-body flex items-start gap-3">
                  <div
                    class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5"
                  >
                    <CheckCircle2 :size="12" />
                  </div>
                  <p>积累更多项目经验，参与复杂项目的设计和开发</p>
                </li>
              </ul>
            </div>
          </div>
          <div class="mt-8 flex justify-center">
            <button
              class="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-sm"
              @click="closeModal"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 智能匹配测试模态框 -->
    <div
      v-if="showMatchingTestModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-3xl max-w-2xl w-full animate-in zoom-in-95 duration-300"
      >
        <div class="p-8 border-b border-neutral-border">
          <div class="flex justify-between items-center">
            <h2
              class="text-2xl font-black text-neutral-title flex items-center gap-3"
            >
              <Target class="text-primary" :size="28" />
              智能匹配测评
            </h2>
            <button
              class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all"
              @click="closeModal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-8">
          <p class="text-neutral-body mb-6">
            智能匹配测评将根据您的技能、经验和职业偏好，为您推荐最适合的岗位。测评过程大约需要10分钟，包含技术能力评估和职业倾向测试。
          </p>
          <div class="space-y-4 mb-8">
            <div
              class="flex items-center gap-3 p-4 bg-neutral-bg rounded-2xl border border-neutral-border"
            >
              <div
                class="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white"
              >
                <Clock :size="20" />
              </div>
              <div>
                <h3 class="font-bold text-neutral-title">测评时间</h3>
                <p class="text-sm text-neutral-helper">约10分钟</p>
              </div>
            </div>
            <div
              class="flex items-center gap-3 p-4 bg-neutral-bg rounded-2xl border border-neutral-border"
            >
              <div
                class="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white"
              >
                <Brain :size="20" />
              </div>
              <div>
                <h3 class="font-bold text-neutral-title">测评内容</h3>
                <p class="text-sm text-neutral-helper">
                  技术能力评估 + 职业倾向测试
                </p>
              </div>
            </div>
            <div
              class="flex items-center gap-3 p-4 bg-neutral-bg rounded-2xl border border-neutral-border"
            >
              <div
                class="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white"
              >
                <Award :size="20" />
              </div>
              <div>
                <h3 class="font-bold text-neutral-title">测评结果</h3>
                <p class="text-sm text-neutral-helper">
                  个性化岗位推荐 + 能力分析报告
                </p>
              </div>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              class="flex-1 py-4 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
              @click="startAssessmentTest('technical')"
            >
              开始测评
              <ChevronRight :size="20" />
            </button>
            <button
              class="flex-1 py-4 bg-white text-primary font-bold rounded-2xl shadow-sm hover:bg-primary/10 transition-all text-sm border border-primary/20"
              @click="closeModal"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分析报告模态框 -->
    <div
      v-if="showReportModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
      >
        <div class="p-8 border-b border-neutral-border">
          <div class="flex justify-between items-center">
            <h2
              class="text-2xl font-black text-neutral-title flex items-center gap-3"
            >
              <BarChart3 class="text-primary" :size="28" />
              详细分析报告
            </h2>
            <button
              class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all"
              @click="closeModal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-8">
          <div class="space-y-6">
            <div
              class="p-6 bg-neutral-title rounded-2xl text-white relative overflow-hidden"
            >
              <div class="absolute -right-20 -bottom-20 opacity-10">
                <Brain :size="200" />
              </div>
              <div class="relative z-10">
                <h3 class="text-2xl font-bold mb-4">综合评估结果</h3>
                <p class="text-white/80 text-sm mb-6">
                  基于您的测评数据，我们为您生成了详细的能力分析报告，帮助您了解自己的优势和改进空间。
                </p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    class="p-4 bg-white/5 rounded-2xl border border-white/10"
                  >
                    <div class="text-2xl font-bold text-primary mb-1">85%</div>
                    <div class="text-sm text-white/60">技术能力</div>
                  </div>
                  <div
                    class="p-4 bg-white/5 rounded-2xl border border-white/10"
                  >
                    <div class="text-2xl font-bold text-primary mb-1">75%</div>
                    <div class="text-sm text-white/60">沟通能力</div>
                  </div>
                  <div
                    class="p-4 bg-white/5 rounded-2xl border border-white/10"
                  >
                    <div class="text-2xl font-bold text-primary mb-1">88%</div>
                    <div class="text-sm text-white/60">问题解决</div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border"
            >
              <h3 class="font-bold text-neutral-title mb-4">能力雷达图</h3>
              <div class="space-y-4">
                <div
                  v-for="skill in skillRadarData"
                  :key="skill.skill"
                  class="space-y-2"
                >
                  <div class="flex justify-between text-sm">
                    <span class="font-bold text-neutral-title">{{
                      skill.skill
                    }}</span>
                    <span class="text-auxiliary-green font-bold"
                      >{{ skill.score }}%</span
                    >
                  </div>
                  <div
                    class="h-2 bg-neutral-border rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-primary transition-all"
                      :style="{ width: skill.score + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-6 bg-primary/5 rounded-2xl border border-primary/20">
              <h3 class="font-bold text-primary mb-4">职业建议</h3>
              <p class="text-sm text-neutral-body mb-4">
                基于您的能力评估结果，我们建议您：
              </p>
              <ul class="space-y-3">
                <li class="text-sm text-neutral-body flex items-start gap-3">
                  <div
                    class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5"
                  >
                    <CheckCircle2 :size="12" />
                  </div>
                  <p>专注于提升行业知识，关注前端领域的最新技术趋势</p>
                </li>
                <li class="text-sm text-neutral-body flex items-start gap-3">
                  <div
                    class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5"
                  >
                    <CheckCircle2 :size="12" />
                  </div>
                  <p>加强沟通能力训练，提高团队协作效率</p>
                </li>
                <li class="text-sm text-neutral-body flex items-start gap-3">
                  <div
                    class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5"
                  >
                    <CheckCircle2 :size="12" />
                  </div>
                  <p>积累更多复杂项目经验，提升技术深度</p>
                </li>
                <li class="text-sm text-neutral-body flex items-start gap-3">
                  <div
                    class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5"
                  >
                    <CheckCircle2 :size="12" />
                  </div>
                  <p>建立个人技术博客，分享学习心得和项目经验</p>
                </li>
                <li class="text-sm text-neutral-body flex items-start gap-3">
                  <div
                    class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5"
                  >
                    <CheckCircle2 :size="12" />
                  </div>
                  <p>参与开源项目，扩展技术视野和人脉网络</p>
                </li>
              </ul>
            </div>

            <!-- 行业对比分析 -->
            <div
              class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border"
            >
              <h3 class="font-bold text-neutral-title mb-4">行业对比分析</h3>
              <div class="space-y-4">
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="font-bold text-neutral-title">技术能力</span>
                    <div class="flex items-center gap-2">
                      <span class="text-auxiliary-green font-bold">85%</span>
                      <span class="text-xs text-neutral-helper"
                        >(行业平均: 75%)</span
                      >
                    </div>
                  </div>
                  <div
                    class="h-2 bg-neutral-border rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-primary transition-all"
                      style="width: 85%"
                    ></div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="font-bold text-neutral-title">沟通能力</span>
                    <div class="flex items-center gap-2">
                      <span class="text-auxiliary-green font-bold">75%</span>
                      <span class="text-xs text-neutral-helper"
                        >(行业平均: 70%)</span
                      >
                    </div>
                  </div>
                  <div
                    class="h-2 bg-neutral-border rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-primary transition-all"
                      style="width: 75%"
                    ></div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="font-bold text-neutral-title">问题解决</span>
                    <div class="flex items-center gap-2">
                      <span class="text-auxiliary-green font-bold">88%</span>
                      <span class="text-xs text-neutral-helper"
                        >(行业平均: 72%)</span
                      >
                    </div>
                  </div>
                  <div
                    class="h-2 bg-neutral-border rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-primary transition-all"
                      style="width: 88%"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-8 flex justify-center">
            <button
              class="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-sm"
              @click="closeModal"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 测评测试模态框 -->
    <div
      v-if="showAssessmentTestModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
      >
        <!-- 测评问题界面 -->
        <div v-if="assessmentStep === 'ongoing'" class="p-8">
          <div class="flex justify-between items-center mb-8">
            <h2
              class="text-2xl font-black text-neutral-title flex items-center gap-3"
            >
              <Target class="text-primary" :size="28" />
              {{
                currentAssessmentType === "jobSkill"
                  ? "岗位技能测评"
                  : currentAssessmentType === "psychological"
                    ? "职业心理测评"
                    : currentAssessmentType === "technical"
                      ? "综合技术测评"
                      : "智能匹配测评"
              }}
            </h2>
            <button
              class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all"
              @click="closeModal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <!-- 进度条 -->
          <div class="mb-8">
            <div class="flex justify-between text-sm mb-2">
              <span class="font-bold text-neutral-title"
                >问题 {{ currentAssessmentStep + 1 }} /
                {{
                  (
                    getQuestionsByType(currentAssessmentType as any) ||
                    comprehensiveAssessmentQuestions
                  ).length
                }}</span
              >
              <span class="text-auxiliary-green font-bold"
                >{{
                  Math.round(
                    ((currentAssessmentStep + 1) /
                      (
                        getQuestionsByType(currentAssessmentType as any) ||
                        comprehensiveAssessmentQuestions
                      ).length) *
                      100,
                  )
                }}% 完成</span
              >
            </div>
            <div class="h-2 bg-neutral-border rounded-full overflow-hidden">
              <div
                class="h-full bg-primary transition-all"
                :style="{
                  width:
                    ((currentAssessmentStep + 1) /
                      (
                        getQuestionsByType(currentAssessmentType as any) ||
                        comprehensiveAssessmentQuestions
                      ).length) *
                      100 +
                    '%',
                }"
              ></div>
            </div>
          </div>

          <!-- 问题内容 -->
          <div class="mb-8">
            <div
              class="px-3 py-1 bg-primary/10 rounded-full text-xs font-bold text-primary inline-block mb-3"
            >
              {{
                (getQuestionsByType(currentAssessmentType as any) ||
                  comprehensiveAssessmentQuestions)[currentAssessmentStep]
                  ?.category
              }}{{
                (getQuestionsByType(currentAssessmentType as any) ||
                  comprehensiveAssessmentQuestions)[currentAssessmentStep]
                  ?.subcategory
                  ? " - " +
                    (getQuestionsByType(currentAssessmentType as any) ||
                      comprehensiveAssessmentQuestions)[currentAssessmentStep]
                      ?.subcategory
                  : ""
              }}
            </div>
            <h3 class="text-lg font-bold text-neutral-title mb-6">
              {{
                (getQuestionsByType(currentAssessmentType as any) ||
                  comprehensiveAssessmentQuestions)[currentAssessmentStep]
                  ?.question
              }}
            </h3>

            <!-- 单选题 -->
            <div
              v-if="
                (getQuestionsByType(currentAssessmentType as any) ||
                  comprehensiveAssessmentQuestions)[currentAssessmentStep]
                  ?.type === 'single'
              "
              class="space-y-3"
            >
              <button
                v-for="option in (getQuestionsByType(
                  currentAssessmentType as any,
                ) || comprehensiveAssessmentQuestions)[currentAssessmentStep]
                  ?.options"
                :key="option.value"
                class="w-full p-4 bg-neutral-bg rounded-2xl border border-neutral-border hover:border-primary hover:bg-primary/5 transition-all text-left"
                @click="submitAssessmentAnswer(option.value)"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-5 h-5 rounded-full border border-neutral-border flex items-center justify-center"
                  >
                    <div
                      class="w-3 h-3 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    ></div>
                  </div>
                  <span class="font-medium text-neutral-title">{{
                    option.label
                  }}</span>
                </div>
              </button>
            </div>

            <!-- 多选题 -->
            <div
              v-else-if="
                (getQuestionsByType(currentAssessmentType as any) ||
                  comprehensiveAssessmentQuestions)[currentAssessmentStep]
                  ?.type === 'multiple'
              "
              class="space-y-3"
            >
              <div class="space-y-3">
                <div
                  v-for="option in (getQuestionsByType(
                    currentAssessmentType as any,
                  ) || comprehensiveAssessmentQuestions)[currentAssessmentStep]
                    ?.options"
                  :key="option.value"
                  class="flex items-center p-4 bg-neutral-bg rounded-2xl border border-neutral-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
                  @click="toggleMultipleChoice(option.value)"
                >
                  <input
                    type="checkbox"
                    :checked="selectedMultipleOptions.includes(option.value)"
                    class="mr-3"
                  />
                  <span class="font-medium text-neutral-title">{{
                    option.label
                  }}</span>
                </div>
                <button
                  class="w-full p-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition-all"
                  @click="submitMultipleChoiceAnswer"
                >
                  提交答案
                </button>
              </div>
            </div>

            <!-- 量表题 -->
            <div
              v-else-if="
                (getQuestionsByType(currentAssessmentType as any) ||
                  comprehensiveAssessmentQuestions)[currentAssessmentStep]
                  ?.type === 'scale'
              "
              class="space-y-3"
            >
              <div class="flex justify-between">
                <span class="text-sm text-neutral-helper">非常不同意</span>
                <span class="text-sm text-neutral-helper">非常同意</span>
              </div>
              <div class="flex justify-between">
                <button
                  v-for="i in 5"
                  :key="i"
                  class="flex-1 p-4 mx-1 bg-neutral-bg rounded-2xl border border-neutral-border hover:border-primary hover:bg-primary/5 transition-all"
                  @click="submitAssessmentAnswer(i)"
                >
                  {{ i }}
                </button>
              </div>
            </div>

            <!-- 文本题 -->
            <div
              v-else-if="
                (getQuestionsByType(currentAssessmentType as any) ||
                  comprehensiveAssessmentQuestions)[currentAssessmentStep]
                  ?.type === 'text'
              "
              class="space-y-3"
            >
              <textarea
                v-model="textAnswer"
                class="w-full p-4 bg-neutral-bg rounded-2xl border border-neutral-border"
                rows="4"
                placeholder="请输入您的回答..."
              ></textarea>
              <button
                class="w-full p-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition-all"
                @click="submitTextAnswer"
              >
                提交答案
              </button>
            </div>
          </div>
        </div>

        <!-- 测评结果界面 -->
        <div v-else-if="assessmentStep === 'completed'" class="p-8">
          <div class="flex justify-between items-center mb-8">
            <h2
              class="text-2xl font-black text-neutral-title flex items-center gap-3"
            >
              <Award class="text-auxiliary-orange" :size="28" />
              测评结果
            </h2>
            <button
              class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all"
              @click="closeModal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div
            class="p-6 bg-neutral-title rounded-2xl text-white relative overflow-hidden mb-8"
          >
            <div class="absolute -right-20 -bottom-20 opacity-10">
              <Award :size="200" />
            </div>
            <div class="relative z-10">
              <h3 class="text-2xl font-bold mb-4">您的测评得分</h3>
              <div class="flex items-end gap-2 mb-4">
                <div class="text-4xl font-bold text-primary">
                  {{ assessmentResult.percentage }}%
                </div>
                <div class="text-white/60 text-sm mb-1">
                  ({{ assessmentResult.score }} /
                  {{ assessmentResult.totalPossibleScore }})
                </div>
              </div>
              <p class="text-white/80 text-sm mb-4">
                {{
                  assessmentResult.percentage >= 80
                    ? "优秀！您的能力水平很高，适合申请高级岗位。"
                    : assessmentResult.percentage >= 60
                      ? "良好！您的能力水平不错，适合申请中级岗位。"
                      : "需要努力！建议提升技能水平，适合申请初级岗位。"
                }}
              </p>
              <div
                v-if="assessmentResult.personalityType"
                class="flex items-center gap-2"
              >
                <span class="text-sm text-white/80">性格类型：</span>
                <span class="text-sm font-bold text-primary">{{
                  assessmentResult.personalityType
                }}</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div
              class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border"
            >
              <h3 class="font-bold text-neutral-title mb-4">优势</h3>
              <ul class="space-y-3">
                <li
                  v-for="(strength, index) in assessmentResult.strengths"
                  :key="index"
                  class="text-sm text-neutral-body flex items-start gap-3"
                >
                  <div
                    class="w-5 h-5 rounded-full bg-auxiliary-green/10 flex items-center justify-center text-auxiliary-green mt-0.5"
                  >
                    <CheckCircle2 :size="12" />
                  </div>
                  <p>{{ strength }}</p>
                </li>
              </ul>
            </div>
            <div
              class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border"
            >
              <h3 class="font-bold text-neutral-title mb-4">改进空间</h3>
              <ul class="space-y-3">
                <li
                  v-for="(weakness, index) in assessmentResult.weaknesses"
                  :key="index"
                  class="text-sm text-neutral-body flex items-start gap-3"
                >
                  <div
                    class="w-5 h-5 rounded-full bg-auxiliary-orange/10 flex items-center justify-center text-auxiliary-orange mt-0.5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-alert-circle"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <p>{{ weakness }}</p>
                </li>
              </ul>
            </div>
          </div>

          <div
            v-if="
              assessmentResult.careerFit &&
              assessmentResult.careerFit.length > 0
            "
            class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border mb-8"
          >
            <h3 class="font-bold text-neutral-title mb-4">推荐职业</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(career, index) in assessmentResult.careerFit"
                :key="index"
                class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full"
              >
                {{ career }}
              </span>
            </div>
          </div>

          <div
            class="p-6 bg-primary/5 rounded-2xl border border-primary/20 mb-8"
          >
            <h3 class="font-bold text-primary mb-4">职业建议</h3>
            <ul class="space-y-3">
              <li
                v-for="(
                  recommendation, index
                ) in assessmentResult.recommendations"
                :key="index"
                class="text-sm text-neutral-body flex items-start gap-3"
              >
                <div
                  class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5"
                >
                  <CheckCircle2 :size="12" />
                </div>
                <p>{{ recommendation }}</p>
              </li>
            </ul>
          </div>

          <div
            class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border mb-8"
          >
            <h3 class="font-bold text-neutral-title mb-4">详细得分</h3>
            <div class="space-y-4">
              <div
                v-for="(score, category) in assessmentResult.detailedScores"
                :key="category"
                class="space-y-2"
              >
                <div class="flex justify-between text-sm">
                  <span class="font-bold text-neutral-title">{{
                    category
                  }}</span>
                  <span class="text-auxiliary-green font-bold"
                    >{{ score }}%</span
                  >
                </div>
                <div class="h-2 bg-neutral-border rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary transition-all"
                    :style="{ width: score + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <button
              class="flex-1 py-4 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
              @click="viewAnalysisReport"
            >
              查看详细报告
              <ChevronRight :size="20" />
            </button>
            <button
              class="flex-1 py-4 bg-white text-primary font-bold rounded-2xl shadow-sm hover:bg-primary/10 transition-all text-sm border border-primary/20"
              @click="closeModal"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 立即申请模态框 -->
    <div
      v-if="showApplicationModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
      >
        <div class="p-8 border-b border-neutral-border">
          <div class="flex justify-between items-center">
            <h2
              class="text-2xl font-black text-neutral-title flex items-center gap-3"
            >
              <Briefcase class="text-primary" :size="28" />
              立即申请：{{ selectedJob?.title }}
            </h2>
            <button
              class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all"
              @click="closeModal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-8">
          <div class="mb-8">
            <h3 class="text-lg font-bold text-neutral-title mb-6">个人信息</h3>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-neutral-title mb-2"
                    >姓名</label
                  >
                  <input
                    type="text"
                    class="w-full p-4 bg-neutral-bg border border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-all"
                    placeholder="请输入您的姓名"
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-neutral-title mb-2"
                    >手机号码</label
                  >
                  <input
                    type="tel"
                    class="w-full p-4 bg-neutral-bg border border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-all"
                    placeholder="请输入您的手机号码"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-bold text-neutral-title mb-2"
                  >电子邮箱</label
                >
                <input
                  type="email"
                  class="w-full p-4 bg-neutral-bg border border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-all"
                  placeholder="请输入您的电子邮箱"
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-neutral-title mb-2"
                  >目前薪资</label
                >
                <input
                  type="text"
                  class="w-full p-4 bg-neutral-bg border border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-all"
                  placeholder="请输入您的目前薪资"
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-neutral-title mb-2"
                  >期望薪资</label
                >
                <input
                  type="text"
                  class="w-full p-4 bg-neutral-bg border border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-all"
                  placeholder="请输入您的期望薪资"
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-neutral-title mb-2"
                  >工作经验</label
                >
                <select
                  class="w-full p-4 bg-neutral-bg border border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-all"
                >
                  <option>请选择工作经验</option>
                  <option>1年以下</option>
                  <option>1-2年</option>
                  <option>3-5年</option>
                  <option>5-8年</option>
                  <option>8年以上</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-bold text-neutral-title mb-2"
                  >学历</label
                >
                <select
                  class="w-full p-4 bg-neutral-bg border border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-all"
                >
                  <option>请选择学历</option>
                  <option>高中及以下</option>
                  <option>大专</option>
                  <option>本科</option>
                  <option>硕士</option>
                  <option>博士</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-bold text-neutral-title mb-2"
                  >简历上传</label
                >
                <div
                  class="p-6 bg-neutral-bg border border-dashed border-neutral-border rounded-xl text-center cursor-pointer hover:border-primary transition-all"
                >
                  <input
                    ref="resumeFile"
                    type="file"
                    class="hidden"
                    accept=".pdf,.doc,.docx"
                    @change="handleFileUpload"
                  />
                  <div class="mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-file-upload text-neutral-helper mx-auto"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <p class="text-sm text-neutral-helper mb-4">
                    点击或拖拽文件到此处上传
                  </p>
                  <p class="text-xs text-neutral-helper mb-4">
                    支持 PDF、Word 格式，大小不超过 10MB
                  </p>
                  <button
                    class="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-sm"
                    @click="triggerFileInput"
                  >
                    选择文件
                  </button>
                  <div
                    v-if="selectedFile"
                    class="mt-4 p-2 bg-white rounded-lg text-sm text-neutral-title"
                  >
                    {{ selectedFile.name }}
                  </div>
                </div>
              </div>
              <div>
                <label class="block text-sm font-bold text-neutral-title mb-2"
                  >自我介绍</label
                >
                <textarea
                  class="w-full p-4 bg-neutral-bg border border-neutral-border rounded-xl focus:outline-none focus:border-primary transition-all h-32"
                  placeholder="请简要介绍一下您的专业技能和工作经验"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <button
              class="flex-1 py-4 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
              @click="closeModal"
            >
              提交申请
              <ChevronRight :size="20" />
            </button>
            <button
              class="flex-1 py-4 bg-white text-primary font-bold rounded-2xl shadow-sm hover:bg-primary/10 transition-all text-sm border border-primary/20"
              @click="closeModal"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 个性化提升计划模态框 -->
    <div
      v-if="showPlanModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
      >
        <div class="p-8 border-b border-neutral-border">
          <div class="flex justify-between items-center">
            <h2
              class="text-2xl font-black text-neutral-title flex items-center gap-3"
            >
              <Sparkles class="text-auxiliary-orange" :size="28" />
              个性化提升计划
            </h2>
            <button
              class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all"
              @click="closeModal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-8">
          <div
            class="p-6 bg-neutral-title rounded-2xl text-white relative overflow-hidden mb-6"
          >
            <div class="absolute -right-20 -bottom-20 opacity-10">
              <Brain :size="200" />
            </div>
            <div class="relative z-10">
              <h3 class="text-2xl font-bold mb-4">前端开发工程师提升计划</h3>
              <p class="text-white/80 text-sm mb-6">
                基于您的测评结果，我们为您定制了专属的学习路径，帮助您成为更具竞争力的前端开发工程师。
              </p>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div class="text-2xl font-bold text-primary mb-1">12周</div>
                  <div class="text-sm text-white/60">培养周期</div>
                </div>
                <div class="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div class="text-2xl font-bold text-primary mb-1">18个</div>
                  <div class="text-sm text-white/60">核心技能</div>
                </div>
                <div class="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div class="text-2xl font-bold text-primary mb-1">3个</div>
                  <div class="text-sm text-white/60">实战项目</div>
                </div>
              </div>
            </div>
          </div>
          <div class="space-y-6">
            <div
              class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border"
            >
              <h3 class="font-bold text-neutral-title mb-4">学习路径</h3>
              <div class="space-y-4">
                <div
                  class="flex items-center gap-4 p-4 bg-white rounded-2xl border border-neutral-border"
                >
                  <div
                    class="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white font-bold"
                  >
                    1
                  </div>
                  <div class="flex-1">
                    <h4 class="font-bold text-neutral-title">基础强化阶段</h4>
                    <p class="text-sm text-neutral-helper">
                      4周 - 巩固HTML、CSS和JavaScript核心概念
                    </p>
                  </div>
                </div>
                <div
                  class="flex items-center gap-4 p-4 bg-white rounded-2xl border border-neutral-border"
                >
                  <div
                    class="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white font-bold"
                  >
                    2
                  </div>
                  <div class="flex-1">
                    <h4 class="font-bold text-neutral-title">框架学习阶段</h4>
                    <p class="text-sm text-neutral-helper">
                      4周 - 深入学习Vue3和React
                    </p>
                  </div>
                </div>
                <div
                  class="flex items-center gap-4 p-4 bg-white rounded-2xl border border-neutral-border"
                >
                  <div
                    class="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white font-bold"
                  >
                    3
                  </div>
                  <div class="flex-1">
                    <h4 class="font-bold text-neutral-title">高级应用阶段</h4>
                    <p class="text-sm text-neutral-helper">
                      4周 - 前端工程化和性能优化
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 培养目标 -->
            <div class="p-6 bg-primary/5 rounded-2xl border border-primary/20">
              <h3 class="font-bold text-primary mb-4">培养目标</h3>
              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <div
                    class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5"
                  >
                    <CheckCircle2 :size="12" />
                  </div>
                  <p class="text-sm text-neutral-body">
                    掌握现代前端技术栈，包括HTML5、CSS3、JavaScript ES6+
                  </p>
                </div>
                <div class="flex items-start gap-3">
                  <div
                    class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5"
                  >
                    <CheckCircle2 :size="12" />
                  </div>
                  <p class="text-sm text-neutral-body">
                    深入理解Vue3和React框架的核心原理和最佳实践
                  </p>
                </div>
                <div class="flex items-start gap-3">
                  <div
                    class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5"
                  >
                    <CheckCircle2 :size="12" />
                  </div>
                  <p class="text-sm text-neutral-body">
                    掌握前端工程化工具，如Webpack、Vite、Git等
                  </p>
                </div>
                <div class="flex items-start gap-3">
                  <div
                    class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5"
                  >
                    <CheckCircle2 :size="12" />
                  </div>
                  <p class="text-sm text-neutral-body">
                    提升代码质量和性能优化能力
                  </p>
                </div>
                <div class="flex items-start gap-3">
                  <div
                    class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5"
                  >
                    <CheckCircle2 :size="12" />
                  </div>
                  <p class="text-sm text-neutral-body">
                    培养良好的团队协作和沟通能力
                  </p>
                </div>
              </div>
            </div>

            <!-- 实战项目 -->
            <div
              class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border"
            >
              <h3 class="font-bold text-neutral-title mb-4">实战项目</h3>
              <div class="space-y-4">
                <div
                  class="p-4 bg-white rounded-2xl border border-neutral-border"
                >
                  <h4 class="font-bold text-neutral-title mb-2">
                    项目一：个人作品集网站
                  </h4>
                  <p class="text-sm text-neutral-helper mb-3">
                    使用Vue3 + TypeScript + Tailwind
                    CSS构建响应式个人作品集网站，展示个人项目和技能。
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full"
                      >Vue3</span
                    >
                    <span
                      class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full"
                      >TypeScript</span
                    >
                    <span
                      class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full"
                      >Tailwind CSS</span
                    >
                    <span
                      class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full"
                      >响应式设计</span
                    >
                  </div>
                </div>
                <div
                  class="p-4 bg-white rounded-2xl border border-neutral-border"
                >
                  <h4 class="font-bold text-neutral-title mb-2">
                    项目二：电商购物车
                  </h4>
                  <p class="text-sm text-neutral-helper mb-3">
                    使用React + Redux + Stripe
                    API构建电商购物车功能，实现商品浏览、添加购物车、结算等功能。
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full"
                      >React</span
                    >
                    <span
                      class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full"
                      >Redux</span
                    >
                    <span
                      class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full"
                      >Stripe API</span
                    >
                    <span
                      class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full"
                      >状态管理</span
                    >
                  </div>
                </div>
                <div
                  class="p-4 bg-white rounded-2xl border border-neutral-border"
                >
                  <h4 class="font-bold text-neutral-title mb-2">
                    项目三：实时聊天应用
                  </h4>
                  <p class="text-sm text-neutral-helper mb-3">
                    使用Next.js + Socket.io +
                    Firebase构建实时聊天应用，支持多人聊天、消息推送等功能。
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full"
                      >Next.js</span
                    >
                    <span
                      class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full"
                      >Socket.io</span
                    >
                    <span
                      class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full"
                      >Firebase</span
                    >
                    <span
                      class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full"
                      >实时通信</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- 学习进度 -->
            <div class="p-6 bg-neutral-title rounded-2xl text-white">
              <h3 class="font-bold text-white mb-4">学习进度</h3>
              <div class="space-y-4">
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="font-bold text-white">基础强化阶段</span>
                    <span class="text-primary font-bold">0%</span>
                  </div>
                  <div class="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-primary transition-all"
                      style="width: 0%"
                    ></div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="font-bold text-white">框架学习阶段</span>
                    <span class="text-primary font-bold">0%</span>
                  </div>
                  <div class="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-primary transition-all"
                      style="width: 0%"
                    ></div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="font-bold text-white">高级应用阶段</span>
                    <span class="text-primary font-bold">0%</span>
                  </div>
                  <div class="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-primary transition-all"
                      style="width: 0%"
                    ></div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="font-bold text-white">实战项目</span>
                    <span class="text-primary font-bold">0%</span>
                  </div>
                  <div class="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-primary transition-all"
                      style="width: 0%"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              class="flex-1 py-4 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
              @click="startLearningPlanTest"
            >
              开始学习计划
              <ChevronRight :size="20" />
            </button>
            <button
              class="flex-1 py-4 bg-white text-primary font-bold rounded-2xl shadow-sm hover:bg-primary/10 transition-all text-sm border border-primary/20"
              @click="closeModal"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 岗位技能测评模态框 -->
    <div
      v-if="showSkillAssessmentModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
      >
        <div class="p-8 border-b border-neutral-border">
          <div class="flex justify-between items-center">
            <h2
              class="text-2xl font-black text-neutral-title flex items-center gap-3"
            >
              <PieChart class="text-primary" :size="28" />
              岗位技能测评
            </h2>
            <button
              class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all"
              @click="closeModal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-8">
          <div class="space-y-6">
            <div
              class="p-6 bg-neutral-title rounded-2xl text-white relative overflow-hidden"
            >
              <div class="absolute -right-20 -bottom-20 opacity-10">
                <PieChart :size="200" />
              </div>
              <div class="relative z-10">
                <h3 class="text-2xl font-bold mb-4">技能测评概览</h3>
                <p class="text-white/80 text-sm mb-6">
                  基于岗位知识图谱，评估您的技能水平与目标岗位的匹配度，为您提供详细的能力分析和提升建议。
                </p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    class="p-4 bg-white/5 rounded-2xl border border-white/10"
                  >
                    <div class="text-2xl font-bold text-primary mb-1">85%</div>
                    <div class="text-sm text-white/60">技能匹配度</div>
                  </div>
                  <div
                    class="p-4 bg-white/5 rounded-2xl border border-white/10"
                  >
                    <div class="text-2xl font-bold text-primary mb-1">12项</div>
                    <div class="text-sm text-white/60">评估技能</div>
                  </div>
                  <div
                    class="p-4 bg-white/5 rounded-2xl border border-white/10"
                  >
                    <div class="text-2xl font-bold text-primary mb-1">
                      30分钟
                    </div>
                    <div class="text-sm text-white/60">测评时长</div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border"
            >
              <h3 class="font-bold text-neutral-title mb-4">技能评估维度</h3>
              <div class="space-y-4">
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="font-bold text-neutral-title">前端开发</span>
                    <span class="text-auxiliary-green font-bold">90%</span>
                  </div>
                  <div
                    class="h-2 bg-neutral-border rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-primary transition-all"
                      style="width: 90%"
                    ></div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="font-bold text-neutral-title">后端开发</span>
                    <span class="text-auxiliary-green font-bold">75%</span>
                  </div>
                  <div
                    class="h-2 bg-neutral-border rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-primary transition-all"
                      style="width: 75%"
                    ></div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="font-bold text-neutral-title">数据库</span>
                    <span class="text-auxiliary-green font-bold">70%</span>
                  </div>
                  <div
                    class="h-2 bg-neutral-border rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-primary transition-all"
                      style="width: 70%"
                    ></div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="font-bold text-neutral-title">系统设计</span>
                    <span class="text-auxiliary-orange font-bold">65%</span>
                  </div>
                  <div
                    class="h-2 bg-neutral-border rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-primary transition-all"
                      style="width: 65%"
                    ></div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="font-bold text-neutral-title">项目管理</span>
                    <span class="text-auxiliary-green font-bold">80%</span>
                  </div>
                  <div
                    class="h-2 bg-neutral-border rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-primary transition-all"
                      style="width: 80%"
                    ></div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="font-bold text-neutral-title">沟通能力</span>
                    <span class="text-auxiliary-green font-bold">85%</span>
                  </div>
                  <div
                    class="h-2 bg-neutral-border rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-primary transition-all"
                      style="width: 85%"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-6 bg-primary/5 rounded-2xl border border-primary/20">
              <h3 class="font-bold text-primary mb-4">提升建议</h3>
              <ul class="space-y-3">
                <li class="text-sm text-neutral-body flex items-start gap-3">
                  <div
                    class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5"
                  >
                    <CheckCircle2 :size="12" />
                  </div>
                  <p>加强系统设计能力，学习微服务架构和分布式系统</p>
                </li>
                <li class="text-sm text-neutral-body flex items-start gap-3">
                  <div
                    class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5"
                  >
                    <CheckCircle2 :size="12" />
                  </div>
                  <p>提升数据库性能优化能力，学习NoSQL数据库</p>
                </li>
                <li class="text-sm text-neutral-body flex items-start gap-3">
                  <div
                    class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5"
                  >
                    <CheckCircle2 :size="12" />
                  </div>
                  <p>参与更多大型项目，积累复杂系统的开发经验</p>
                </li>
              </ul>
            </div>
          </div>
          <div class="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              class="flex-1 py-4 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
              @click="startAssessmentTest('jobSkill')"
            >
              开始技能测评
              <ChevronRight :size="20" />
            </button>
            <button
              class="flex-1 py-4 bg-white text-primary font-bold rounded-2xl shadow-sm hover:bg-primary/10 transition-all text-sm border border-primary/20"
              @click="closeModal"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 职业心理测评模态框 -->
    <div
      v-if="showPsychologicalAssessmentModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
      >
        <div class="p-8 border-b border-neutral-border">
          <div class="flex justify-between items-center">
            <h2
              class="text-2xl font-black text-neutral-title flex items-center gap-3"
            >
              <Brain class="text-auxiliary-orange" :size="28" />
              职业心理测评
            </h2>
            <button
              class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all"
              @click="closeModal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-8">
          <div class="space-y-6">
            <div
              class="p-6 bg-neutral-title rounded-2xl text-white relative overflow-hidden"
            >
              <div class="absolute -right-20 -bottom-20 opacity-10">
                <Brain :size="200" />
              </div>
              <div class="relative z-10">
                <h3 class="text-2xl font-bold mb-4">MBTI 专业性格测试</h3>
                <p class="text-white/80 text-sm mb-6">
                  通过MBTI性格测试，了解您的性格类型和职业倾向，为您的职业规划提供科学依据。
                </p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    class="p-4 bg-white/5 rounded-2xl border border-white/10"
                  >
                    <div class="text-2xl font-bold text-primary mb-1">
                      4维度
                    </div>
                    <div class="text-sm text-white/60">性格评估</div>
                  </div>
                  <div
                    class="p-4 bg-white/5 rounded-2xl border border-white/10"
                  >
                    <div class="text-2xl font-bold text-primary mb-1">
                      16类型
                    </div>
                    <div class="text-sm text-white/60">性格类型</div>
                  </div>
                  <div
                    class="p-4 bg-white/5 rounded-2xl border border-white/10"
                  >
                    <div class="text-2xl font-bold text-primary mb-1">
                      20分钟
                    </div>
                    <div class="text-sm text-white/60">测试时长</div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border"
            >
              <h3 class="font-bold text-neutral-title mb-4">MBTI 测试维度</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  class="p-4 bg-white rounded-2xl border border-neutral-border"
                >
                  <h4 class="font-bold text-neutral-title mb-2">
                    能量来源 (E/I)
                  </h4>
                  <p class="text-sm text-neutral-helper">
                    外倾(E) vs 内倾(I) - 您获取能量的方式
                  </p>
                </div>
                <div
                  class="p-4 bg-white rounded-2xl border border-neutral-border"
                >
                  <h4 class="font-bold text-neutral-title mb-2">
                    信息获取 (S/N)
                  </h4>
                  <p class="text-sm text-neutral-helper">
                    感觉(S) vs 直觉(N) - 您收集信息的方式
                  </p>
                </div>
                <div
                  class="p-4 bg-white rounded-2xl border border-neutral-border"
                >
                  <h4 class="font-bold text-neutral-title mb-2">
                    决策方式 (T/F)
                  </h4>
                  <p class="text-sm text-neutral-helper">
                    思考(T) vs 情感(F) - 您做决策的方式
                  </p>
                </div>
                <div
                  class="p-4 bg-white rounded-2xl border border-neutral-border"
                >
                  <h4 class="font-bold text-neutral-title mb-2">
                    生活方式 (J/P)
                  </h4>
                  <p class="text-sm text-neutral-helper">
                    判断(J) vs 感知(P) - 您的生活和工作方式
                  </p>
                </div>
              </div>
            </div>

            <div class="p-6 bg-primary/5 rounded-2xl border border-primary/20">
              <h3 class="font-bold text-primary mb-4">测试意义</h3>
              <ul class="space-y-3">
                <li class="text-sm text-neutral-body flex items-start gap-3">
                  <div
                    class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5"
                  >
                    <CheckCircle2 :size="12" />
                  </div>
                  <p>了解自己的性格特点和优势，找到适合的职业方向</p>
                </li>
                <li class="text-sm text-neutral-body flex items-start gap-3">
                  <div
                    class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5"
                  >
                    <CheckCircle2 :size="12" />
                  </div>
                  <p>改善沟通方式，提高团队协作效率</p>
                </li>
                <li class="text-sm text-neutral-body flex items-start gap-3">
                  <div
                    class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5"
                  >
                    <CheckCircle2 :size="12" />
                  </div>
                  <p>制定个性化的职业发展规划，实现自我价值</p>
                </li>
              </ul>
            </div>
          </div>
          <div class="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              class="flex-1 py-4 bg-auxiliary-orange text-white font-bold rounded-2xl shadow-lg hover:shadow-auxiliary-orange/30 transition-all flex items-center justify-center gap-2"
              @click="startAssessmentTest('psychological')"
            >
              开始心理测评
              <ChevronRight :size="20" />
            </button>
            <button
              class="flex-1 py-4 bg-white text-primary font-bold rounded-2xl shadow-sm hover:bg-primary/10 transition-all text-sm border border-primary/20"
              @click="closeModal"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 综合技术测评模态框 -->
    <div
      v-if="showTechnicalAssessmentModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
      >
        <div class="p-8 border-b border-neutral-border">
          <div class="flex justify-between items-center">
            <h2
              class="text-2xl font-black text-neutral-title flex items-center gap-3"
            >
              <Zap class="text-auxiliary-green" :size="28" />
              综合技术测评
            </h2>
            <button
              class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all"
              @click="closeModal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-8">
          <div class="space-y-6">
            <div
              class="p-6 bg-neutral-title rounded-2xl text-white relative overflow-hidden"
            >
              <div class="absolute -right-20 -bottom-20 opacity-10">
                <Zap :size="200" />
              </div>
              <div class="relative z-10">
                <h3 class="text-2xl font-bold mb-4">专业水平与沟通评估</h3>
                <p class="text-white/80 text-sm mb-6">
                  全面评估您的技术专业水平和沟通能力，为您的职业发展提供全方位的分析和建议。
                </p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    class="p-4 bg-white/5 rounded-2xl border border-white/10"
                  >
                    <div class="text-2xl font-bold text-primary mb-1">
                      2部分
                    </div>
                    <div class="text-sm text-white/60">评估内容</div>
                  </div>
                  <div
                    class="p-4 bg-white/5 rounded-2xl border border-white/10"
                  >
                    <div class="text-2xl font-bold text-primary mb-1">
                      45分钟
                    </div>
                    <div class="text-sm text-white/60">评估时长</div>
                  </div>
                  <div
                    class="p-4 bg-white/5 rounded-2xl border border-white/10"
                  >
                    <div class="text-2xl font-bold text-primary mb-1">100%</div>
                    <div class="text-sm text-white/60">综合评估</div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border"
            >
              <h3 class="font-bold text-neutral-title mb-4">评估内容</h3>
              <div class="space-y-4">
                <div
                  class="p-4 bg-white rounded-2xl border border-neutral-border"
                >
                  <h4 class="font-bold text-neutral-title mb-2">
                    技术专业评估
                  </h4>
                  <ul class="space-y-2 text-sm text-neutral-helper">
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      专业知识测试（选择题）
                    </li>
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      编程能力测试（代码编写）
                    </li>
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      系统设计能力测试
                    </li>
                  </ul>
                </div>
                <div
                  class="p-4 bg-white rounded-2xl border border-neutral-border"
                >
                  <h4 class="font-bold text-neutral-title mb-2">
                    沟通能力评估
                  </h4>
                  <ul class="space-y-2 text-sm text-neutral-helper">
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      技术概念表达能力
                    </li>
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      团队协作沟通能力
                    </li>
                    <li class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      问题解决沟通能力
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="p-6 bg-primary/5 rounded-2xl border border-primary/20">
              <h3 class="font-bold text-primary mb-4">评估标准</h3>
              <div class="space-y-4">
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="font-bold text-neutral-title"
                      >技术专业水平</span
                    >
                    <span class="text-auxiliary-green font-bold">占比 60%</span>
                  </div>
                  <div
                    class="h-2 bg-neutral-border rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-primary transition-all"
                      style="width: 60%"
                    ></div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="font-bold text-neutral-title">沟通能力</span>
                    <span class="text-auxiliary-green font-bold">占比 40%</span>
                  </div>
                  <div
                    class="h-2 bg-neutral-border rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full bg-primary transition-all"
                      style="width: 40%"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              class="flex-1 py-4 bg-auxiliary-green text-white font-bold rounded-2xl shadow-lg hover:shadow-auxiliary-green/30 transition-all flex items-center justify-center gap-2"
              @click="startAssessmentTest('technical')"
            >
              开始综合测评
              <ChevronRight :size="20" />
            </button>
            <button
              class="flex-1 py-4 bg-white text-primary font-bold rounded-2xl shadow-sm hover:bg-primary/10 transition-all text-sm border border-primary/20"
              @click="closeModal"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 更多岗位模态框 -->
    <div
      v-if="showMoreJobsModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
      >
        <div class="p-8 border-b border-neutral-border">
          <div class="flex justify-between items-center">
            <h2
              class="text-2xl font-black text-neutral-title flex items-center gap-3"
            >
              <Briefcase class="text-primary" :size="28" />
              更多岗位推荐
            </h2>
            <button
              class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all"
              @click="closeModal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-8">
          <div class="space-y-6">
            <div
              v-for="job in jobMatches.slice(2)"
              :key="job.id"
              class="p-6 bg-neutral-bg rounded-[24px] hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-neutral-border group"
            >
              <div
                class="flex flex-col md:flex-row md:items-start justify-between mb-6"
              >
                <div class="flex items-start gap-4 mb-4 md:mb-0">
                  <div
                    class="w-12 h-12 rounded-2xl overflow-hidden bg-white shadow-sm flex items-center justify-center"
                  >
                    <img
                      :src="job.logo"
                      :alt="job.company"
                      class="w-8 h-8 object-contain"
                    />
                  </div>
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <h3 class="font-bold text-neutral-title text-lg">
                        {{ job.title }}
                      </h3>
                      <button
                        class="text-neutral-helper hover:text-auxiliary-orange transition-colors"
                        @click="toggleFavorite(job.id)"
                      >
                        <Heart
                          :size="18"
                          :fill="job.isFavorite ? 'currentColor' : 'none'"
                        />
                      </button>
                    </div>
                    <div class="flex items-center gap-4 mb-2">
                      <span
                        class="text-sm text-neutral-helper flex items-center gap-1"
                        ><Building :size="14" /> {{ job.company }}</span
                      >
                      <span
                        class="text-sm text-neutral-helper flex items-center gap-1"
                        ><Heart :size="14" /> {{ job.location }}</span
                      >
                      <span class="text-sm text-auxiliary-green font-bold">{{
                        job.salary
                      }}</span>
                    </div>
                    <div class="flex items-center gap-4 mb-2">
                      <span
                        class="text-sm text-neutral-helper flex items-center gap-1"
                        ><UserCheck :size="14" /> {{ job.experience }}</span
                      >
                      <span
                        class="text-sm text-neutral-helper flex items-center gap-1"
                        ><Brain :size="14" /> {{ job.education }}</span
                      >
                    </div>
                    <div class="flex flex-wrap gap-2 mb-4">
                      <span
                        v-for="benefit in job.benefits"
                        :key="benefit"
                        class="px-3 py-1 bg-auxiliary-green/10 text-auxiliary-green text-xs font-bold rounded-full"
                        >{{ benefit }}</span
                      >
                    </div>
                  </div>
                </div>
                <div class="flex flex-col items-end">
                  <div class="flex items-center gap-2 mb-4">
                    <span
                      class="text-sm font-bold text-neutral-title min-w-[80px]"
                      >{{ job.matchRate }}% 匹配</span
                    >
                    <div
                      class="h-2 w-32 bg-neutral-border rounded-full overflow-hidden"
                    >
                      <div
                        class="h-full bg-primary transition-all"
                        :style="{ width: job.matchRate + '%' }"
                      ></div>
                    </div>
                  </div>
                  <div class="flex flex-col gap-2 w-full md:w-auto">
                    <button
                      class="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-sm flex items-center justify-center gap-2 group-hover:scale-105"
                      @click="showJobDetails(job.id)"
                    >
                      查看详情
                      <ChevronRight
                        :size="16"
                        class="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                    <button
                      class="px-4 py-2 bg-white text-primary font-bold rounded-xl hover:bg-primary/10 transition-all text-sm border border-primary/20"
                      @click="applyJob(job.id)"
                    >
                      立即申请
                    </button>
                  </div>
                </div>
              </div>
              <div class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="tag in job.tags"
                  :key="tag"
                  class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full"
                  >{{ tag }}</span
                >
              </div>
              <p class="text-sm text-neutral-body mb-2 line-clamp-2">
                {{ job.description }}
              </p>
            </div>
          </div>
          <div class="mt-8 flex justify-center">
            <button
              class="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-sm"
              @click="closeModal"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 预约咨询模态框 -->
    <div
      v-if="showConsultationModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-3xl max-w-2xl w-full animate-in zoom-in-95 duration-300"
      >
        <div class="p-8 border-b border-neutral-border">
          <div class="flex justify-between items-center">
            <h2
              class="text-2xl font-black text-neutral-title flex items-center gap-3"
            >
              <User class="text-primary" :size="28" />
              预约职业咨询
            </h2>
            <button
              class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all"
              @click="closeModal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-8">
          <p class="text-neutral-body mb-6">
            预约专业的职业咨询，获得个性化的职业发展建议和指导。我们的职业顾问将根据您的测评结果，为您提供针对性的职业规划方案。
          </p>
          <div class="space-y-4 mb-8">
            <div>
              <label class="block text-sm font-bold text-neutral-title mb-2"
                >姓名</label
              >
              <input
                type="text"
                class="w-full p-4 bg-neutral-bg rounded-xl border border-neutral-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="请输入您的姓名"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-neutral-title mb-2"
                >电话</label
              >
              <input
                type="tel"
                class="w-full p-4 bg-neutral-bg rounded-xl border border-neutral-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="请输入您的电话"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-neutral-title mb-2"
                >预约时间</label
              >
              <input
                type="date"
                class="w-full p-4 bg-neutral-bg rounded-xl border border-neutral-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-neutral-title mb-2"
                >咨询需求</label
              >
              <textarea
                class="w-full p-4 bg-neutral-bg rounded-xl border border-neutral-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none h-32"
                placeholder="请简要描述您的职业咨询需求"
              ></textarea>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              class="flex-1 py-4 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
              @click="closeModal"
            >
              提交预约
              <ChevronRight :size="20" />
            </button>
            <button
              class="flex-1 py-4 bg-white text-primary font-bold rounded-2xl shadow-sm hover:bg-primary/10 transition-all text-sm border border-primary/20"
              @click="closeModal"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习计划测评模态框 -->
    <div
      v-if="showLearningPlanTestModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
      >
        <div class="p-8 border-b border-neutral-border">
          <div class="flex justify-between items-center">
            <h2
              class="text-2xl font-black text-neutral-title flex items-center gap-3"
            >
              <Brain :size="28" class="text-auxiliary-orange" />
              学习计划测评
            </h2>
            <button
              class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all"
              @click="closeModal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-8">
          <!-- 测评问题 -->
          <div v-if="!learningPlanResult" class="space-y-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div
                  class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm"
                >
                  {{ currentLearningPlanStep + 1 }}
                </div>
                <span class="text-sm text-neutral-helper">
                  第 {{ currentLearningPlanStep + 1 }} 题，共
                  {{ learningPlanQuestions.length }} 题
                </span>
              </div>
              <div class="text-sm font-bold text-primary">
                {{
                  Math.round(
                    ((currentLearningPlanStep + 1) /
                      learningPlanQuestions.length) *
                      100,
                  )
                }}%
              </div>
            </div>

            <div class="w-full bg-neutral-bg rounded-full h-2">
              <div
                class="bg-primary h-2 rounded-full transition-all"
                :style="{
                  width:
                    ((currentLearningPlanStep + 1) /
                      learningPlanQuestions.length) *
                      100 +
                    '%',
                }"
              ></div>
            </div>

            <div
              class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border"
            >
              <h3 class="font-bold text-neutral-title mb-2">
                {{ learningPlanQuestions[currentLearningPlanStep]?.category }}
              </h3>
              <p class="text-lg font-bold text-neutral-title mb-6">
                {{ learningPlanQuestions[currentLearningPlanStep]?.question }}
              </p>

              <div class="space-y-3">
                <!-- 单选题 -->
                <div
                  v-if="
                    learningPlanQuestions[currentLearningPlanStep]?.type ===
                    'single'
                  "
                  class="space-y-2"
                >
                  <div
                    v-for="option in learningPlanQuestions[
                      currentLearningPlanStep
                    ]?.options"
                    :key="option.value"
                    class="p-4 bg-white rounded-2xl border border-neutral-border hover:border-primary hover:bg-primary/5 cursor-pointer transition-all"
                    @click="submitLearningPlanAnswer(option.value)"
                  >
                    <div class="flex items-center gap-3">
                      <div
                        class="w-5 h-5 rounded-full border border-neutral-border flex items-center justify-center"
                      >
                        <div
                          class="w-3 h-3 rounded-full bg-primary opacity-0"
                        ></div>
                      </div>
                      <span class="text-neutral-body">{{ option.label }}</span>
                    </div>
                  </div>
                </div>

                <!-- 多选题 -->
                <div
                  v-else-if="
                    learningPlanQuestions[currentLearningPlanStep]?.type ===
                    'multiple'
                  "
                  class="space-y-2"
                >
                  <div class="space-y-2">
                    <div
                      v-for="option in learningPlanQuestions[
                        currentLearningPlanStep
                      ]?.options"
                      :key="option.value"
                      class="flex items-center p-4 bg-white rounded-2xl border border-neutral-border hover:border-primary hover:bg-primary/5 cursor-pointer transition-all"
                      @click="toggleMultipleChoice(option.value)"
                    >
                      <input
                        type="checkbox"
                        :checked="
                          selectedMultipleOptions.includes(option.value)
                        "
                        class="mr-3"
                      />
                      <span class="text-neutral-body">{{ option.label }}</span>
                    </div>
                    <button
                      class="w-full p-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition-all"
                      @click="submitLearningPlanAnswer(selectedMultipleOptions)"
                    >
                      提交答案
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 测评结果 -->
          <div v-else class="space-y-6">
            <div class="p-6 bg-primary/10 rounded-2xl border border-primary/20">
              <h3 class="text-xl font-bold text-primary mb-4">测评完成！</h3>
              <div class="flex flex-col items-center gap-4">
                <div class="text-4xl font-bold text-primary">
                  {{ learningPlanResult.percentage }}%
                </div>
                <p class="text-sm text-neutral-helper">
                  基于您的回答，我们为您定制了个性化学习计划
                </p>
              </div>
            </div>

            <div
              class="p-6 bg-neutral-bg rounded-2xl border border-neutral-border"
            >
              <h3 class="font-bold text-neutral-title mb-4">学习路径</h3>
              <div class="text-lg font-bold text-primary mb-2">
                {{ learningPlanResult.learningPath }}
              </div>
              <div class="text-sm text-neutral-helper mb-4">
                预计学习周期：{{ learningPlanResult.estimatedDuration }}
              </div>

              <h3 class="font-bold text-neutral-title mb-3">推荐课程</h3>
              <div class="space-y-2">
                <div
                  v-for="(
                    course, index
                  ) in learningPlanResult.recommendedCourses"
                  :key="index"
                  class="flex items-center gap-3 p-3 bg-white rounded-xl border border-neutral-border"
                >
                  <div
                    class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm"
                  >
                    {{ Number(index) + 1 }}
                  </div>
                  <span class="text-neutral-body">{{ course }}</span>
                </div>
              </div>

              <h3 class="font-bold text-neutral-title mb-3 mt-6">学习计划</h3>
              <div class="space-y-2">
                <div
                  v-for="(plan, index) in learningPlanResult.studyPlan"
                  :key="index"
                  class="flex items-center gap-3 p-3 bg-white rounded-xl border border-neutral-border"
                >
                  <div
                    class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm"
                  >
                    {{ Number(index) + 1 }}
                  </div>
                  <span class="text-neutral-body">{{ plan }}</span>
                </div>
              </div>
            </div>

            <div class="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                class="flex-1 py-4 gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/30 transition-all"
                @click="closeModal"
              >
                开始学习
              </button>
              <button
                class="flex-1 py-4 bg-white text-primary font-bold rounded-2xl shadow-sm hover:bg-primary/10 transition-all text-sm border border-primary/20"
                @click="closeModal"
              >
                稍后再说
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
