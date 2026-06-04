<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import {
  BookOpen,
  Search,
  ChevronRight,
  Zap,
  Code2,
  FileText,
  Database,
  Cpu,
  Layout,
  Layers,
  Sparkles,
  PlayCircle,
  Clock,
  BookMarked,
  Award,
  Heart,
  Server,
  Shield,
  Smartphone,
  Cloud,
  BarChart3,
  PenTool,
  MessageSquare,
  X,
} from "lucide-vue-next";
import { useKnowledgeStore } from "@/stores/knowledge";
import type { SkillTreeNode } from "@/api/types/job.types";

const knowledgeStore = useKnowledgeStore();
const { courses, jobPositions, skillTrees, loading } = storeToRefs(knowledgeStore);

// 岗位与技能树相关状态
const selectedJobId = ref<number | null>(null);
const skillTreeLoading = ref(false);

const selectJob = async (jobId: number) => {
  if (selectedJobId.value === jobId) {
    selectedJobId.value = null;
    return;
  }
  selectedJobId.value = jobId;
  if (!skillTrees.value[jobId]) {
    skillTreeLoading.value = true;
    try {
      await knowledgeStore.fetchSkillTree(jobId);
    } finally {
      skillTreeLoading.value = false;
    }
  }
};

const closeSkillTree = () => {
  selectedJobId.value = null;
};

const getSkillTreeNodes = (jobId: number): SkillTreeNode[] => {
  const tree = skillTrees.value[jobId];
  if (!tree || Object.keys(tree).length === 0) return [];
  return (tree as SkillTreeNode).children ?? [];
};

const categories = [
  {
    id: 1,
    name: "前端开发",
    icon: Layout,
    count: 450,
    color: "text-primary",
    description: "HTML、CSS、JavaScript、框架技术等前端相关知识",
  },
  {
    id: 2,
    name: "后端架构",
    icon: Database,
    count: 320,
    color: "text-auxiliary-orange",
    description: "服务器端开发、数据库、API设计等后端技术",
  },
  {
    id: 3,
    name: "算法数据结构",
    icon: Cpu,
    count: 280,
    color: "text-auxiliary-green",
    description: "排序、搜索、动态规划等算法与数据结构",
  },
  {
    id: 4,
    name: "系统设计",
    icon: Layers,
    count: 150,
    color: "text-neutral-title",
    description: "分布式系统、微服务、架构设计等",
  },
  {
    id: 5,
    name: "产品经理",
    icon: FileText,
    count: 200,
    color: "text-auxiliary-purple",
    description: "产品规划、用户体验、需求分析等",
  },
  {
    id: 6,
    name: "面试技巧",
    icon: Award,
    count: 180,
    color: "text-auxiliary-orange",
    description: "简历优化、行为面试、薪资谈判等",
  },
  {
    id: 7,
    name: "DevOps",
    icon: Server,
    count: 120,
    color: "text-primary",
    description: "CI/CD、容器化、自动化部署等",
  },
  {
    id: 8,
    name: "网络安全",
    icon: Shield,
    count: 90,
    color: "text-auxiliary-green",
    description: "Web安全、渗透测试、加密技术等",
  },
  {
    id: 9,
    name: "移动开发",
    icon: Smartphone,
    count: 160,
    color: "text-auxiliary-orange",
    description: "iOS、Android、跨平台开发等",
  },
  {
    id: 10,
    name: "云计算",
    icon: Cloud,
    count: 130,
    color: "text-primary",
    description: "AWS、Azure、GCP等云服务技术",
  },
  {
    id: 11,
    name: "数据分析",
    icon: BarChart3,
    count: 140,
    color: "text-auxiliary-purple",
    description: "数据挖掘、机器学习、统计分析等",
  },
  {
    id: 12,
    name: "UI/UX设计",
    icon: PenTool,
    count: 110,
    color: "text-neutral-title",
    description: "用户界面、用户体验、交互设计等",
  },
];

// 知识分类详情数据
const categoryDetails = {
  1: {
    subcategories: [
      { id: 101, name: "HTML/CSS", count: 120 },
      { id: 102, name: "JavaScript", count: 150 },
      { id: 103, name: "Vue", count: 80 },
      { id: 104, name: "React", count: 70 },
      { id: 105, name: "前端工程化", count: 30 },
    ],
    hotTopics: [
      "Vue3 响应式底层原理深度解析",
      "React Hooks 最佳实践与性能优化",
      "前端性能优化全攻略",
      "TypeScript 高级类型技巧",
      "现代CSS布局技术汇总",
    ],
  },
  2: {
    subcategories: [
      { id: 201, name: "Java", count: 100 },
      { id: 202, name: "Python", count: 80 },
      { id: 203, name: "Go", count: 60 },
      { id: 204, name: "数据库", count: 50 },
      { id: 205, name: "API设计", count: 30 },
    ],
    hotTopics: [
      "MySQL 索引优化与事务隔离级别",
      "Spring Boot 微服务架构实践",
      "Redis 高并发场景优化",
      "分布式事务解决方案",
      "后端性能调优技巧",
    ],
  },
  3: {
    subcategories: [
      { id: 301, name: "排序算法", count: 50 },
      { id: 302, name: "动态规划", count: 80 },
      { id: 303, name: "贪心算法", count: 40 },
      { id: 304, name: "图算法", count: 60 },
      { id: 305, name: "数据结构", count: 50 },
    ],
    hotTopics: [
      "动态规划：从入门到大厂实战题解",
      "二分查找的各种变体与应用",
      "链表问题的常见解法",
      "树结构算法汇总",
      "滑动窗口技巧详解",
    ],
  },
  4: {
    subcategories: [
      { id: 401, name: "分布式系统", count: 60 },
      { id: 402, name: "微服务架构", count: 40 },
      { id: 403, name: "高可用性设计", count: 30 },
      { id: 404, name: "负载均衡", count: 20 },
    ],
    hotTopics: [
      "系统设计面试题解析",
      "分布式一致性算法",
      "微服务架构设计原则",
      "大规模系统的可扩展性",
      "系统设计中的权衡取舍",
    ],
  },
  5: {
    subcategories: [
      { id: 501, name: "产品规划", count: 60 },
      { id: 502, name: "用户体验", count: 50 },
      { id: 503, name: "需求分析", count: 40 },
      { id: 504, name: "产品运营", count: 50 },
    ],
    hotTopics: [
      "产品经理面试常见问题与回答技巧",
      "用户故事编写最佳实践",
      "产品迭代策略",
      "市场分析方法",
      "产品上线前的准备工作",
    ],
  },
  6: {
    subcategories: [
      { id: 601, name: "简历优化", count: 40 },
      { id: 602, name: "行为面试", count: 50 },
      { id: 603, name: "技术面试", count: 60 },
      { id: 604, name: "薪资谈判", count: 30 },
    ],
    hotTopics: [
      "如何打造一份脱颖而出的技术简历",
      "STAR法则在行为面试中的应用",
      "技术面试中的算法题应对策略",
      "薪资谈判技巧与常见误区",
      "面试后的跟进与offer选择",
    ],
  },
  7: {
    subcategories: [
      { id: 701, name: "CI/CD", count: 40 },
      { id: 702, name: "容器化", count: 30 },
      { id: 703, name: "自动化部署", count: 30 },
      { id: 704, name: "监控告警", count: 20 },
    ],
    hotTopics: [
      "Docker 容器化实践",
      "Kubernetes 集群管理",
      "Jenkins 自动化构建",
      "Prometheus 监控系统",
      "DevOps 最佳实践",
    ],
  },
  8: {
    subcategories: [
      { id: 801, name: "Web安全", count: 30 },
      { id: 802, name: "渗透测试", count: 20 },
      { id: 803, name: "加密技术", count: 20 },
      { id: 804, name: "安全架构", count: 20 },
    ],
    hotTopics: [
      "常见Web安全漏洞与防护",
      "SQL注入攻击与防御",
      "XSS攻击的类型与防护措施",
      "CSRF攻击原理与防御",
      "密码学基础与应用",
    ],
  },
  9: {
    subcategories: [
      { id: 901, name: "iOS开发", count: 50 },
      { id: 902, name: "Android开发", count: 50 },
      { id: 903, name: "Flutter", count: 30 },
      { id: 904, name: "React Native", count: 30 },
    ],
    hotTopics: [
      "iOS 性能优化技巧",
      "Android 内存管理",
      "Flutter 跨平台开发实践",
      "React Native 性能调优",
      "移动应用安全最佳实践",
    ],
  },
  10: {
    subcategories: [
      { id: 1001, name: "AWS", count: 40 },
      { id: 1002, name: "Azure", count: 30 },
      { id: 1003, name: "GCP", count: 30 },
      { id: 1004, name: "云原生", count: 30 },
    ],
    hotTopics: [
      "AWS 服务架构最佳实践",
      "云存储方案对比",
      "Serverless 架构设计",
      "云安全策略",
      "多云管理策略",
    ],
  },
  11: {
    subcategories: [
      { id: 1101, name: "数据挖掘", count: 40 },
      { id: 1102, name: "机器学习", count: 50 },
      { id: 1103, name: "统计分析", count: 30 },
      { id: 1104, name: "数据可视化", count: 20 },
    ],
    hotTopics: [
      "机器学习算法入门",
      "数据清洗与预处理",
      "特征工程技巧",
      "模型评估与选择",
      "大数据处理框架",
    ],
  },
  12: {
    subcategories: [
      { id: 1201, name: "用户界面", count: 40 },
      { id: 1202, name: "用户体验", count: 30 },
      { id: 1203, name: "交互设计", count: 20 },
      { id: 1204, name: "设计工具", count: 20 },
    ],
    hotTopics: [
      "UI设计原则与最佳实践",
      "用户体验设计流程",
      "交互设计模式",
      "响应式设计技巧",
      "设计系统构建",
    ],
  },
};

// 状态管理
import { ref } from "vue";
const selectedCategory = ref<number | null>(null);
const isCategoryExpanded = ref<boolean>(false);

// 路由相关
import { useRouter } from "vue-router";
const router = useRouter();

// 专项通关路径相关状态
const practiceProgress = ref(0);
const isPracticeStarted = ref(false);
void practiceProgress.value;
void isPracticeStarted.value;

// 交互方法
const toggleCategory = (categoryId: number) => {
  if (selectedCategory.value === categoryId) {
    isCategoryExpanded.value = !isCategoryExpanded.value;
  } else {
    selectedCategory.value = categoryId;
    isCategoryExpanded.value = true;
  }
};

const closeCategory = () => {
  isCategoryExpanded.value = false;
  selectedCategory.value = null;
};

// 子分类点击处理
const handleSubcategoryClick = (subcategory: {
  id: number;
  name: string;
  count: number;
}) => {
  console.log("子分类点击:", subcategory);
  openSubcategoryDetail(subcategory);
};

// 热门话题点击处理
const handleHotTopicClick = (topic: string) => {
  console.log("热门话题点击:", topic);
  openTopicDetail(topic);
};

const recentTopics = [
  {
    id: 1,
    title: "Vue3 响应式底层原理深度解析",
    type: "前端",
    views: "2.4k",
    likes: 328,
    comments: 45,
    time: "2小时前",
    author: "前端专家",
    tags: ["Vue3", "响应式", "前端"],
    isHot: true,
  },
  {
    id: 2,
    title: "MySQL 索引优化与事务隔离级别",
    type: "后端",
    views: "1.8k",
    likes: 256,
    comments: 32,
    time: "4小时前",
    author: "数据库专家",
    tags: ["MySQL", "索引", "后端"],
  },
  {
    id: 3,
    title: "动态规划：从入门到大厂实战题解",
    type: "算法",
    views: "3.1k",
    likes: 412,
    comments: 56,
    time: "6小时前",
    author: "算法大师",
    tags: ["算法", "动态规划", "面试"],
    isHot: true,
  },
  {
    id: 4,
    title: "React Hooks 最佳实践与性能优化",
    type: "前端",
    views: "2.2k",
    likes: 298,
    comments: 41,
    time: "8小时前",
    author: "React 专家",
    tags: ["React", "Hooks", "前端"],
  },
  {
    id: 5,
    title: "微服务架构设计与实践",
    type: "后端",
    views: "1.9k",
    likes: 275,
    comments: 38,
    time: "1天前",
    author: "架构师",
    tags: ["微服务", "架构", "后端"],
  },
  {
    id: 6,
    title: "产品经理面试常见问题与回答技巧",
    type: "产品",
    views: "1.5k",
    likes: 210,
    comments: 29,
    time: "1天前",
    author: "产品专家",
    tags: ["产品经理", "面试", "产品"],
  },
  {
    id: 7,
    title: "Python 数据分析实战指南",
    type: "数据分析",
    views: "1.7k",
    likes: 234,
    comments: 35,
    time: "2天前",
    author: "数据专家",
    tags: ["Python", "数据分析", "实战"],
  },
  {
    id: 8,
    title: "DevOps 自动化部署最佳实践",
    type: "DevOps",
    views: "1.3k",
    likes: 189,
    comments: 27,
    time: "2天前",
    author: "DevOps 专家",
    tags: ["DevOps", "自动化", "部署"],
  },
];

// 热门面试解析数据
const hotInterviewAnalyses = [
  {
    id: 1,
    title: "Vue3 响应式底层原理深度解析",
    type: "前端",
    views: "2.4k",
    likes: 328,
    time: "2小时前",
    author: "前端专家",
    description:
      "深入剖析Vue3的响应式系统实现原理，包括Proxy的使用、依赖收集与触发机制，以及与Vue2的对比分析。",
    tags: ["Vue3", "响应式", "前端", "面试"],
    difficulty: "中等",
    company: "字节跳动",
    content:
      "Vue3采用Proxy代替Object.defineProperty实现响应式系统，具有更好的性能和更完善的类型支持。本文详细分析了其实现原理和使用技巧。",
  },
  {
    id: 2,
    title: "MySQL 索引优化与事务隔离级别",
    type: "后端",
    views: "1.8k",
    likes: 256,
    time: "4小时前",
    author: "数据库专家",
    description:
      "详细讲解MySQL索引的工作原理、优化策略，以及事务隔离级别的概念和应用场景。",
    tags: ["MySQL", "索引", "事务", "后端"],
    difficulty: "困难",
    company: "阿里巴巴",
    content:
      "MySQL索引是提高查询性能的关键，本文从B+树原理出发，讲解了索引的设计和优化策略，并详细分析了事务隔离级别的实现。",
  },
  {
    id: 3,
    title: "动态规划：从入门到大厂实战题解",
    type: "算法",
    views: "3.1k",
    likes: 412,
    time: "6小时前",
    author: "算法大师",
    description:
      "系统讲解动态规划的基本思想、解题步骤，以及大厂面试中常见的动态规划问题及解法。",
    tags: ["算法", "动态规划", "面试", "LeetCode"],
    difficulty: "困难",
    company: "腾讯",
    content:
      "动态规划是算法面试中的高频考点，本文通过经典例题详细讲解了动态规划的解题思路和技巧，帮助你在面试中轻松应对。",
  },
  {
    id: 4,
    title: "React Hooks 最佳实践与性能优化",
    type: "前端",
    views: "2.2k",
    likes: 298,
    time: "8小时前",
    author: "React 专家",
    description:
      "深入探讨React Hooks的使用方法、最佳实践，以及如何进行性能优化，避免常见的陷阱。",
    tags: ["React", "Hooks", "性能优化", "前端"],
    difficulty: "中等",
    company: "美团",
    content:
      "React Hooks改变了React的开发方式，本文分享了Hooks的最佳实践和性能优化技巧，帮助你写出更优雅、高效的React代码。",
  },
  {
    id: 5,
    title: "微服务架构设计与实践",
    type: "后端",
    views: "1.9k",
    likes: 275,
    time: "1天前",
    author: "架构师",
    description:
      "讲解微服务架构的设计原则、核心组件，以及在实际项目中的应用和挑战。",
    tags: ["微服务", "架构", "后端", "分布式"],
    difficulty: "困难",
    company: "亚马逊",
    content:
      "微服务架构已成为现代后端系统的主流选择，本文从设计原则到实践应用，全面讲解了微服务架构的各个方面。",
  },
  {
    id: 6,
    title: "产品经理面试常见问题与回答技巧",
    type: "产品",
    views: "1.5k",
    likes: 210,
    time: "1天前",
    author: "产品专家",
    description:
      "总结产品经理面试中的常见问题，提供专业的回答思路和技巧，帮助你在面试中脱颖而出。",
    tags: ["产品经理", "面试技巧", "行为面试", "产品"],
    difficulty: "简单",
    company: "腾讯",
    content:
      "产品经理面试注重考察候选人的产品思维和沟通能力，本文整理了常见问题和回答技巧，帮助你在面试中展现自己的优势。",
  },
];

// 状态管理
const likedItems = ref<Set<number>>(new Set());
const savedItems = ref<Set<number>>(new Set());

// 交互方法
const toggleLike = (id: number) => {
  if (likedItems.value.has(id)) {
    likedItems.value.delete(id);
  } else {
    likedItems.value.add(id);
  }
};

const toggleSave = (id: number) => {
  if (savedItems.value.has(id)) {
    savedItems.value.delete(id);
  } else {
    savedItems.value.add(id);
  }
};

// 推荐资源
const recommendedResources = [
  {
    id: 1,
    title: "前端工程师面试指南",
    type: "电子书",
    rating: 4.8,
    author: "前端专家",
    description:
      "全面覆盖前端面试常见问题，包括HTML/CSS、JavaScript、框架技术等核心知识点",
    tags: ["前端", "面试", "HTML/CSS", "JavaScript"],
    price: "¥99",
    originalPrice: "¥199",
    cover:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=front%20end%20engineering%20book%20cover%20with%20code%20and%20technology%20elements&image_size=square_hd",
    students: 12500,
    reviews: 489,
  },
  {
    id: 2,
    title: "算法竞赛入门经典",
    type: "电子书",
    rating: 4.9,
    author: "算法大师",
    description:
      "从基础到进阶，系统讲解算法与数据结构，包含大量实战例题和解题思路",
    tags: ["算法", "数据结构", "面试", "LeetCode"],
    price: "¥129",
    originalPrice: "¥259",
    cover:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=algorithm%20book%20cover%20with%20mathematical%20symbols%20and%20computer%20science%20elements&image_size=square_hd",
    students: 18900,
    reviews: 765,
  },
  {
    id: 3,
    title: "系统设计面试题解析",
    type: "视频课程",
    rating: 4.7,
    author: "架构师",
    description:
      "详解系统设计面试中的常见问题，包括分布式系统、微服务架构、高可用性设计等",
    tags: ["系统设计", "架构", "后端", "分布式"],
    price: "¥199",
    originalPrice: "¥399",
    cover:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=system%20design%20course%20cover%20with%20cloud%20computing%20and%20architecture%20diagrams&image_size=square_hd",
    students: 9800,
    reviews: 342,
  },
  {
    id: 4,
    title: "Java核心技术面试指南",
    type: "视频课程",
    rating: 4.6,
    author: "Java专家",
    description:
      "深入讲解Java核心技术，包括JVM、多线程、集合框架等面试高频考点",
    tags: ["Java", "后端", "面试", "JVM"],
    price: "¥159",
    originalPrice: "¥299",
    cover:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Java%20programming%20book%20cover%20with%20coffee%20cup%20and%20code%20elements&image_size=square_hd",
    students: 15600,
    reviews: 521,
  },
  {
    id: 5,
    title: "产品经理面试实战指南",
    type: "电子书",
    rating: 4.5,
    author: "产品专家",
    description:
      "系统讲解产品经理面试的各个环节，包括产品思维、用户体验、需求分析等",
    tags: ["产品经理", "面试", "用户体验", "需求分析"],
    price: "¥89",
    originalPrice: "¥179",
    cover:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=product%20manager%20book%20cover%20with%20business%20strategy%20and%20user%20interface%20elements&image_size=square_hd",
    students: 8700,
    reviews: 298,
  },
];

// 搜索和筛选相关状态
const searchQuery = ref("");

// 扩展的学习资源数据
const allResources = [
  {
    id: 1,
    title: "前端工程师面试指南",
    type: "电子书",
    rating: 4.8,
    author: "前端专家",
    description:
      "全面覆盖前端面试常见问题，包括HTML/CSS、JavaScript、框架技术等核心知识点",
    tags: ["前端", "面试", "HTML/CSS", "JavaScript"],
    price: "¥99",
    originalPrice: "¥199",
    cover:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=front%20end%20engineering%20book%20cover%20with%20code%20and%20technology%20elements&image_size=square_hd",
    students: 12500,
    reviews: 489,
    category: 1,
    createdAt: "2026-04-10",
    isFree: false,
  },
  {
    id: 2,
    title: "算法竞赛入门经典",
    type: "电子书",
    rating: 4.9,
    author: "算法大师",
    description:
      "从基础到进阶，系统讲解算法与数据结构，包含大量实战例题和解题思路",
    tags: ["算法", "数据结构", "面试", "LeetCode"],
    price: "¥129",
    originalPrice: "¥259",
    cover:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=algorithm%20book%20cover%20with%20mathematical%20symbols%20and%20computer%20science%20elements&image_size=square_hd",
    students: 18900,
    reviews: 765,
    category: 3,
    createdAt: "2026-04-09",
    isFree: false,
  },
  {
    id: 3,
    title: "系统设计面试题解析",
    type: "视频课程",
    rating: 4.7,
    author: "架构师",
    description:
      "详解系统设计面试中的常见问题，包括分布式系统、微服务架构、高可用性设计等",
    tags: ["系统设计", "架构", "后端", "分布式"],
    price: "¥199",
    originalPrice: "¥399",
    cover:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=system%20design%20course%20cover%20with%20cloud%20computing%20and%20architecture%20diagrams&image_size=square_hd",
    students: 9800,
    reviews: 342,
    category: 4,
    createdAt: "2026-04-08",
    isFree: false,
  },
  {
    id: 4,
    title: "Java核心技术面试指南",
    type: "视频课程",
    rating: 4.6,
    author: "Java专家",
    description:
      "深入讲解Java核心技术，包括JVM、多线程、集合框架等面试高频考点",
    tags: ["Java", "后端", "面试", "JVM"],
    price: "¥159",
    originalPrice: "¥299",
    cover:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Java%20programming%20book%20cover%20with%20coffee%20cup%20and%20code%20elements&image_size=square_hd",
    students: 15600,
    reviews: 521,
    category: 2,
    createdAt: "2026-04-07",
    isFree: false,
  },
  {
    id: 5,
    title: "产品经理面试实战指南",
    type: "电子书",
    rating: 4.5,
    author: "产品专家",
    description:
      "系统讲解产品经理面试的各个环节，包括产品思维、用户体验、需求分析等",
    tags: ["产品经理", "面试", "用户体验", "需求分析"],
    price: "¥89",
    originalPrice: "¥179",
    cover:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=product%20manager%20book%20cover%20with%20business%20strategy%20and%20user%20interface%20elements&image_size=square_hd",
    students: 8700,
    reviews: 298,
    category: 5,
    createdAt: "2026-04-06",
    isFree: false,
  },
  {
    id: 6,
    title: "前端性能优化全攻略",
    type: "视频课程",
    rating: 4.8,
    author: "前端专家",
    description: "从网络、渲染、资源加载等多个维度讲解前端性能优化的最佳实践",
    tags: ["前端", "性能优化", "Web", "面试"],
    price: "¥149",
    originalPrice: "¥299",
    cover:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=frontend%20performance%20optimization%20course%20cover%20with%20speed%20and%20optimization%20elements&image_size=square_hd",
    students: 11200,
    reviews: 412,
    category: 1,
    createdAt: "2026-04-05",
    isFree: false,
  },
  {
    id: 7,
    title: "Python数据分析实战",
    type: "电子书",
    rating: 4.7,
    author: "数据专家",
    description:
      "使用Python进行数据分析的实战指南，包括数据清洗、可视化和机器学习基础",
    tags: ["Python", "数据分析", "实战", "机器学习"],
    price: "¥119",
    originalPrice: "¥239",
    cover:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20data%20analysis%20book%20cover%20with%20charts%20and%20data%20visualization%20elements&image_size=square_hd",
    students: 13500,
    reviews: 567,
    category: 11,
    createdAt: "2026-04-04",
    isFree: false,
  },
  {
    id: 8,
    title: "React Native跨平台开发",
    type: "视频课程",
    rating: 4.6,
    author: "移动开发专家",
    description: "从零开始学习React Native，构建跨平台移动应用",
    tags: ["React Native", "移动开发", "跨平台", "前端"],
    price: "¥179",
    originalPrice: "¥359",
    cover:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=React%20Native%20mobile%20development%20course%20cover%20with%20smartphone%20and%20code%20elements&image_size=square_hd",
    students: 9200,
    reviews: 321,
    category: 9,
    createdAt: "2026-04-03",
    isFree: false,
  },
  {
    id: 9,
    title: "网络安全基础与实践",
    type: "电子书",
    rating: 4.5,
    author: "安全专家",
    description: "介绍网络安全的基本概念和实践技巧，包括常见漏洞和防御措施",
    tags: ["网络安全", "Web安全", "漏洞", "防御"],
    price: "¥109",
    originalPrice: "¥219",
    cover:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=network%20security%20book%20cover%20with%20shield%20and%20cybersecurity%20elements&image_size=square_hd",
    students: 7800,
    reviews: 289,
    category: 8,
    createdAt: "2026-04-02",
    isFree: false,
  },
  {
    id: 10,
    title: "Docker容器化实战",
    type: "视频课程",
    rating: 4.7,
    author: "DevOps专家",
    description: "学习Docker容器化技术，包括镜像构建、容器管理和编排",
    tags: ["Docker", "容器化", "DevOps", "CI/CD"],
    price: "¥139",
    originalPrice: "¥279",
    cover:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Docker%20containerization%20course%20cover%20with%20containers%20and%20cloud%20elements&image_size=square_hd",
    students: 10500,
    reviews: 398,
    category: 7,
    createdAt: "2026-04-01",
    isFree: false,
  },
  {
    id: 11,
    title: "Vue3实战教程",
    type: "视频课程",
    rating: 4.9,
    author: "前端专家",
    description: "从零开始学习Vue3，包括组合式API、响应式系统和生态系统",
    tags: ["Vue3", "前端", "实战", "组合式API"],
    price: "¥169",
    originalPrice: "¥339",
    cover:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Vue3%20tutorial%20course%20cover%20with%20Vue%20logo%20and%20modern%20UI%20elements&image_size=square_hd",
    students: 14200,
    reviews: 512,
    category: 1,
    createdAt: "2026-03-31",
    isFree: false,
  },
  {
    id: 12,
    title: "SQL优化实战指南",
    type: "电子书",
    rating: 4.6,
    author: "数据库专家",
    description: "深入讲解SQL优化技巧，包括索引设计、查询优化和性能调优",
    tags: ["SQL", "数据库", "优化", "性能"],
    price: "¥99",
    originalPrice: "¥199",
    cover:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=SQL%20optimization%20book%20cover%20with%20database%20and%20query%20elements&image_size=square_hd",
    students: 8900,
    reviews: 345,
    category: 2,
    createdAt: "2026-03-30",
    isFree: false,
  },
  {
    id: 13,
    title: "机器学习入门与实践",
    type: "视频课程",
    rating: 4.8,
    author: "AI专家",
    description: "介绍机器学习的基本概念和算法，通过实战项目加深理解",
    tags: ["机器学习", "AI", "算法", "实战"],
    price: "¥199",
    originalPrice: "¥399",
    cover:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=machine%20learning%20course%20cover%20with%20AI%20and%20data%20elements&image_size=square_hd",
    students: 15600,
    reviews: 623,
    category: 11,
    createdAt: "2026-03-29",
    isFree: false,
  },
  {
    id: 14,
    title: "UI/UX设计原则",
    type: "电子书",
    rating: 4.7,
    author: "设计专家",
    description: "讲解UI/UX设计的核心原则和最佳实践，提升产品的用户体验",
    tags: ["UI/UX", "设计", "用户体验", "产品"],
    price: "¥89",
    originalPrice: "¥179",
    cover:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=UI%20UX%20design%20book%20cover%20with%20user%20interface%20and%20experience%20elements&image_size=square_hd",
    students: 7600,
    reviews: 278,
    category: 12,
    createdAt: "2026-03-28",
    isFree: false,
  },
  {
    id: 15,
    title: "AWS云服务实战",
    type: "视频课程",
    rating: 4.6,
    author: "云专家",
    description: "学习AWS云服务的核心功能和最佳实践，包括EC2、S3、Lambda等",
    tags: ["AWS", "云计算", "云服务", "DevOps"],
    price: "¥179",
    originalPrice: "¥359",
    cover:
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AWS%20cloud%20services%20course%20cover%20with%20cloud%20computing%20and%20AWS%20logo%20elements&image_size=square_hd",
    students: 9800,
    reviews: 387,
    category: 10,
    createdAt: "2026-03-27",
    isFree: false,
  },
];

// 新页面状态
const isAllResourcesPageOpen = ref(false);
const isAllCategoriesPageOpen = ref(false);
const isAllTopicsPageOpen = ref(false);
const isAllAnalysesPageOpen = ref(false);
const isResourceDetailOpen = ref(false);
const isSubcategoryDetailOpen = ref(false);
const isTopicDetailOpen = ref(false);
const isAnalysisDetailOpen = ref(false);
const selectedResource = ref<Record<string, unknown> | null>(null);
const selectedSubcategory = ref<Record<string, unknown> | null>(null);
const selectedTopic = ref<string>("");
const selectedAnalysis = ref<Record<string, unknown> | null>(null);

// 新页面方法
const openAllResourcesPage = () => {
  isAllResourcesPageOpen.value = true;
};

const closeAllResourcesPage = () => {
  isAllResourcesPageOpen.value = false;
};

const openAllCategoriesPage = () => {
  console.log("openAllCategoriesPage called");
  // 重置分类详情状态，确保进入全部分类页面时显示所有分类
  isCategoryExpanded.value = false;
  selectedCategory.value = null;
  isAllCategoriesPageOpen.value = true;
};

const closeAllCategoriesPage = () => {
  isAllCategoriesPageOpen.value = false;
};

const openAllTopicsPage = () => {
  isAllTopicsPageOpen.value = true;
};

const closeAllTopicsPage = () => {
  isAllTopicsPageOpen.value = false;
};

const openResourceDetail = (resource: any) => {
  selectedResource.value = resource;
  isResourceDetailOpen.value = true;
};

const closeResourceDetail = () => {
  isResourceDetailOpen.value = false;
  selectedResource.value = null;
};

const openSubcategoryDetail = (subcategory: any) => {
  selectedSubcategory.value = subcategory;
  isSubcategoryDetailOpen.value = true;
};

const closeSubcategoryDetail = () => {
  isSubcategoryDetailOpen.value = false;
  selectedSubcategory.value = null;
};

const openTopicDetail = (topic: string) => {
  selectedTopic.value = topic;
  isTopicDetailOpen.value = true;
};

const closeTopicDetail = () => {
  isTopicDetailOpen.value = false;
  selectedTopic.value = "";
};

const openAllAnalysesPage = () => {
  isAllAnalysesPageOpen.value = true;
};

const closeAllAnalysesPage = () => {
  isAllAnalysesPageOpen.value = false;
};

const openAnalysisDetail = (analysis: any) => {
  selectedAnalysis.value = analysis;
  isAnalysisDetailOpen.value = true;
};

const closeAnalysisDetail = () => {
  isAnalysisDetailOpen.value = false;
  selectedAnalysis.value = null;
};

// 最新动态交互方法
const handleLikeClick = (topic: any) => {
  if (likedItems.value.has(topic.id)) {
    likedItems.value.delete(topic.id);
  } else {
    likedItems.value.add(topic.id);
  }
};

const handleCommentClick = (topic: any) => {
  alert(`查看"${topic.title}"的评论`);
};

const handleReadMoreClick = (topic: any) => {
  alert(`阅读"${topic.title}"的详细内容`);
};

// 查看全部资源按钮方法
const handleViewAllResources = () => {
  openAllResourcesPage();
};

// 专项通关路径相关方法
const openPathPractice = (path: string) => {
  router.push(`/path-practice?path=${encodeURIComponent(path)}`);
};

// 专项通关路径开启首次练习
const startPractice = () => {
  router.push("/path-practice?path=简历押题专项");
};

onMounted(async () => {
  await knowledgeStore.fetchAllData();
});
</script>

<template>
  <div>
    <div class="flex flex-col gap-8 max-w-7xl mx-auto">
      <!-- Header: Knowledge Base -->
      <div
        class="gradient-primary p-10 rounded-[40px] text-white relative overflow-hidden shadow-xl"
      >
        <div class="relative z-10 max-w-2xl">
          <h1 class="text-4xl font-black mb-4 tracking-tight">AI 面试知识库</h1>
          <p class="text-white/80 mb-8 text-lg leading-relaxed">
            系统化的面试知识图谱，结合大厂真实题库，为您提供全方位的技术储备与解题思路。
          </p>

          <!-- Search Box -->
          <div class="relative max-w-lg group">
            <Search
              class="absolute left-4 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform"
              :size="20"
            />
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="搜索知识点、面试真题、大厂面经..."
              class="w-full pl-12 pr-20 py-4 bg-white text-neutral-title rounded-2xl shadow-lg border-none focus:ring-4 focus:ring-white/20 transition-all text-sm font-medium"
            />
            <button
              class="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-dark transition-all text-sm font-bold"
            >
              搜索
            </button>
          </div>
        </div>
        <div class="absolute -right-20 -bottom-20 opacity-10">
          <BookOpen :size="320" />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <!-- Left: Main Content -->
        <div class="lg:col-span-8 space-y-8">
          <!-- 知识分类 -->
          <div
            class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
          >
            <div class="flex items-center justify-between mb-8">
              <h2
                class="text-xl font-bold text-neutral-title flex items-center gap-3"
              >
                <div class="w-2 h-6 gradient-primary rounded-full"></div>
                知识分类
              </h2>
              <button
                class="px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-xl hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                @click="openAllCategoriesPage"
              >
                查看更多 <ChevronRight :size="16" />
              </button>
            </div>

            <!-- 分类网格 - 只显示前8个 -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="cat in categories.slice(0, 8)"
                :key="cat.id"
                class="p-6 bg-neutral-bg rounded-[24px] hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-neutral-border group cursor-pointer text-center"
                @click="toggleCategory(cat.id)"
              >
                <div
                  class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:gradient-primary group-hover:text-white transition-all"
                >
                  <component :is="cat.icon" :size="24" />
                </div>
                <h3 class="text-sm font-bold text-neutral-title mb-1">
                  {{ cat.name }}
                </h3>
                <p class="text-[10px] text-neutral-helper font-bold uppercase">
                  {{ cat.count }} 知识点
                </p>
                <div
                  class="mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <p class="text-[10px] text-neutral-helper">
                    {{ cat.description }}
                  </p>
                </div>
              </div>
            </div>

            <!-- 分类详情 -->
            <div
              v-if="isCategoryExpanded && selectedCategory"
              class="mt-8 p-6 bg-neutral-bg rounded-[24px] border border-neutral-border"
            >
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center text-white"
                  >
                    <component
                      :is="
                        categories.find((c) => c.id === selectedCategory)?.icon
                      "
                      :size="20"
                    />
                  </div>
                  <h3 class="text-lg font-bold text-neutral-title">
                    {{
                      categories.find((c) => c.id === selectedCategory)?.name
                    }}
                  </h3>
                </div>
                <button
                  class="p-2 bg-white rounded-xl shadow-sm hover:bg-primary hover:text-white transition-all"
                  @click="closeCategory"
                >
                  <ChevronRight :size="16" class="rotate-90" />
                </button>
              </div>

              <!-- 子分类 -->
              <div class="mb-8">
                <h4 class="text-sm font-bold text-neutral-title mb-4">
                  子分类
                </h4>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div
                    v-for="subcat in categoryDetails[
                      selectedCategory as keyof typeof categoryDetails
                    ]?.subcategories"
                    :key="subcat.id"
                    class="p-3 bg-white rounded-xl border border-neutral-border hover:border-primary hover:shadow-sm transition-all cursor-pointer flex items-center justify-between"
                    @click="handleSubcategoryClick(subcat)"
                  >
                    <span class="text-xs font-bold text-neutral-title">{{
                      subcat.name
                    }}</span>
                    <span class="text-[10px] text-neutral-helper font-bold">{{
                      subcat.count
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- 热门话题 -->
              <div>
                <h4 class="text-sm font-bold text-neutral-title mb-4">
                  热门话题
                </h4>
                <div class="space-y-3">
                  <div
                    v-for="(topic, index) in categoryDetails[
                      selectedCategory as keyof typeof categoryDetails
                    ]?.hotTopics"
                    :key="index"
                    class="p-3 bg-white rounded-xl border border-neutral-border hover:border-primary hover:shadow-sm transition-all cursor-pointer flex items-center gap-3"
                    @click="handleHotTopicClick(topic)"
                  >
                    <div
                      class="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold"
                    >
                      {{ index + 1 }}
                    </div>
                    <span
                      class="text-xs font-bold text-neutral-title line-clamp-1"
                      >{{ topic }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 岗位与技能树 -->
          <div
            class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
          >
            <div class="flex items-center justify-between mb-8">
              <h2
                class="text-xl font-bold text-neutral-title flex items-center gap-3"
              >
                <div class="w-2 h-6 gradient-primary rounded-full"></div>
                岗位与技能树
              </h2>
            </div>

            <!-- 岗位列表 -->
            <div v-if="jobPositions.length > 0" class="space-y-4">
              <div
                v-for="job in jobPositions"
                :key="job.id"
                class="rounded-[24px] border transition-all"
                :class="
                  selectedJobId === job.id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-neutral-border bg-neutral-bg hover:border-primary/50'
                "
              >
                <!-- 岗位卡片 -->
                <div
                  class="p-5 cursor-pointer flex items-center justify-between"
                  @click="selectJob(job.id)"
                >
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-2">
                      <h3
                        class="text-sm font-bold text-neutral-title truncate"
                      >
                        {{ job.title }}
                      </h3>
                      <span
                        v-if="job.level"
                        class="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full"
                      >
                        {{ job.level }}
                      </span>
                      <span
                        v-if="job.industry"
                        class="text-xs font-bold text-auxiliary-orange bg-auxiliary-orange/10 px-2.5 py-0.5 rounded-full"
                      >
                        {{ job.industry }}
                      </span>
                    </div>
                    <div class="flex items-center gap-4 text-xs text-neutral-helper">
                      <span v-if="job.company">{{ job.company }}</span>
                      <span v-if="job.location">{{ job.location }}</span>
                      <span v-if="job.salary_range">{{
                        job.salary_range
                      }}</span>
                    </div>
                    <p
                      v-if="job.description"
                      class="text-xs text-neutral-body mt-2 line-clamp-2"
                    >
                      {{ job.description }}
                    </p>
                  </div>
                  <ChevronRight
                    :size="18"
                    class="text-neutral-helper transition-transform flex-shrink-0 ml-3"
                    :class="selectedJobId === job.id ? 'rotate-90' : ''"
                  />
                </div>

                <!-- 技能树展开区域 -->
                <div
                  v-if="selectedJobId === job.id"
                  class="px-5 pb-5 border-t border-neutral-border"
                >
                  <div class="pt-4">
                    <div class="flex items-center justify-between mb-4">
                      <h4 class="text-sm font-bold text-neutral-title">
                        技能树
                      </h4>
                      <button
                        class="text-xs text-neutral-helper hover:text-primary transition-colors"
                        @click.stop="closeSkillTree"
                      >
                        收起
                      </button>
                    </div>

                    <!-- 加载中 -->
                    <div
                      v-if="skillTreeLoading"
                      class="flex items-center justify-center py-8"
                    >
                      <div
                        class="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"
                      ></div>
                      <span class="ml-2 text-sm text-neutral-helper"
                        >加载技能树...</span
                      >
                    </div>

                    <!-- 技能树内容 -->
                    <div v-else-if="getSkillTreeNodes(job.id).length > 0">
                      <div class="space-y-2">
                        <div
                          v-for="node in getSkillTreeNodes(job.id)"
                          :key="node.id"
                          class="flex items-center gap-3 p-3 rounded-xl"
                          :class="
                            node.is_required
                              ? 'bg-primary/10 border border-primary/30'
                              : 'bg-neutral-bg border border-transparent'
                          "
                        >
                          <div
                            class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                            :class="
                              node.is_required
                                ? 'gradient-primary text-white'
                                : 'bg-white text-neutral-helper'
                            "
                          >
                            {{ node.level ?? '-' }}
                          </div>
                          <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2">
                              <span class="text-xs font-bold text-neutral-title">
                                {{ node.name }}
                              </span>
                              <span
                                v-if="node.is_required"
                                class="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded"
                              >
                                必需
                              </span>
                              <span
                                v-if="node.has_required_child"
                                class="text-[10px] font-bold text-auxiliary-orange bg-auxiliary-orange/10 px-1.5 py-0.5 rounded"
                              >
                                含必需子项
                              </span>
                            </div>
                            <span
                              v-if="node.category"
                              class="text-[10px] text-neutral-helper"
                            >
                              {{ node.category }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 空状态 -->
                    <div v-else class="text-center py-8">
                      <Sparkles
                        :size="32"
                        class="text-neutral-helper mx-auto mb-3 opacity-50"
                      />
                      <p class="text-sm text-neutral-helper">
                        暂无技能树数据
                      </p>
                      <p class="text-xs text-neutral-helper/70 mt-1">
                        后端技能树接口待完善
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 空状态 -->
            <div v-else class="text-center py-12">
              <Briefcase
                :size="40"
                class="text-neutral-helper mx-auto mb-4 opacity-50"
              />
              <p class="text-sm text-neutral-helper">暂无岗位数据</p>
              <p class="text-xs text-neutral-helper/70 mt-1">
                请先在后台添加岗位信息
              </p>
            </div>
          </div>

          <!-- 热门面试解析 -->
          <div
            class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
          >
            <div class="flex items-center justify-between mb-6">
              <h2
                class="text-xl font-bold text-neutral-title flex items-center gap-3"
              >
                <Zap :size="24" class="text-primary" />
                热门面试解析
              </h2>
              <button
                class="px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-xl hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                @click="openAllAnalysesPage"
              >
                查看全部 <ChevronRight :size="16" />
              </button>
            </div>
            <div class="space-y-6">
              <div
                v-for="analysis in hotInterviewAnalyses.slice(0, 5)"
                :key="analysis.id"
                class="p-6 bg-neutral-bg rounded-[24px] hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-neutral-border group cursor-pointer"
                @click="openAnalysisDetail(analysis)"
              >
                <!-- 顶部信息 -->
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center gap-4">
                    <div
                      class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:gradient-primary group-hover:text-white transition-all"
                    >
                      <Code2 :size="20" />
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-2">
                        <span
                          class="text-xs font-bold text-primary uppercase bg-primary/10 px-3 py-1 rounded-full"
                          >{{ analysis.type }}</span
                        >
                        <span
                          class="text-xs font-bold text-auxiliary-orange uppercase bg-auxiliary-orange/10 px-3 py-1 rounded-full"
                          >{{ analysis.company }}</span
                        >
                        <span
                          v-if="analysis.difficulty === '简单'"
                          class="text-xs font-bold text-auxiliary-green uppercase bg-auxiliary-green/10 px-3 py-1 rounded-full"
                          >{{ analysis.difficulty }}</span
                        >
                        <span
                          v-else-if="analysis.difficulty === '中等'"
                          class="text-xs font-bold text-primary uppercase bg-primary/10 px-3 py-1 rounded-full"
                          >{{ analysis.difficulty }}</span
                        >
                        <span
                          v-else
                          class="text-xs font-bold text-auxiliary-orange uppercase bg-auxiliary-orange/10 px-3 py-1 rounded-full"
                          >{{ analysis.difficulty }}</span
                        >
                      </div>
                      <h3
                        class="text-sm font-bold text-neutral-title group-hover:text-primary transition-colors mb-2 line-clamp-2"
                      >
                        {{ analysis.title }}
                      </h3>
                      <div class="flex items-center gap-3">
                        <span
                          class="text-xs text-neutral-helper flex items-center gap-1"
                          ><Clock :size="12" /> {{ analysis.time }}</span
                        >
                        <span
                          class="text-xs text-neutral-helper flex items-center gap-1"
                          ><BookOpen :size="12" /> {{ analysis.author }}</span
                        >
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col gap-2">
                    <button
                      class="p-2 rounded-xl hover:bg-white/50 transition-all"
                      @click.stop="toggleLike(analysis.id)"
                    >
                      <Heart
                        :size="18"
                        :class="
                          likedItems.has(analysis.id)
                            ? 'text-auxiliary-orange fill-auxiliary-orange'
                            : 'text-neutral-helper'
                        "
                      />
                    </button>
                    <button
                      class="p-2 rounded-xl hover:bg-white/50 transition-all"
                      @click.stop="toggleSave(analysis.id)"
                    >
                      <BookMarked
                        :size="18"
                        :class="
                          savedItems.has(analysis.id)
                            ? 'text-primary fill-primary'
                            : 'text-neutral-helper'
                        "
                      />
                    </button>
                  </div>
                </div>

                <!-- 描述 -->
                <p class="text-sm text-neutral-body mb-4 line-clamp-2">
                  {{ analysis.description }}
                </p>

                <!-- 标签 -->
                <div class="flex flex-wrap gap-2 mb-4">
                  <span
                    v-for="tag in analysis.tags"
                    :key="tag"
                    class="text-xs font-bold text-neutral-helper bg-white px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-all"
                  >
                    {{ tag }}
                  </span>
                </div>

                <!-- 底部统计 -->
                <div
                  class="flex items-center justify-between pt-4 border-t border-neutral-border"
                >
                  <div class="flex items-center gap-6">
                    <span
                      class="text-sm text-neutral-helper flex items-center gap-2"
                    >
                      <Heart
                        :size="14"
                        :class="
                          likedItems.has(analysis.id)
                            ? 'text-auxiliary-orange'
                            : ''
                        "
                      />
                      {{
                        likedItems.has(analysis.id)
                          ? analysis.likes + 1
                          : analysis.likes
                      }}
                    </span>
                    <span
                      class="text-sm text-neutral-helper flex items-center gap-2"
                    >
                      <BookOpen :size="14" />
                      {{ analysis.views }}
                    </span>
                  </div>
                  <button
                    class="text-primary text-sm font-bold hover:underline flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    @click.stop="openAnalysisDetail(analysis)"
                  >
                    阅读详情 <ChevronRight :size="14" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Sidebar -->
        <div class="lg:col-span-4 space-y-8">
          <!-- 专项通关路径 -->
          <div
            class="bg-neutral-title p-6 rounded-[32px] text-white shadow-xl relative overflow-hidden flex flex-col"
          >
            <div class="relative z-10">
              <div class="flex items-center gap-2 mb-4">
                <Sparkles :size="24" class="text-auxiliary-orange" />
                <h2 class="text-xl font-black italic text-white">
                  专项通关路径
                </h2>
              </div>
              <p class="text-white/60 text-xs mb-6 leading-relaxed">
                基于 AI 模型分析判断，为您推荐最适合的通关路径。
              </p>

              <div class="space-y-4">
                <div
                  v-for="path in [
                    { n: '简历押题专项', d: '预测面试官提问', i: FileText },
                    {
                      n: '沉浸式综合模拟',
                      d: '模拟完整面试流程',
                      i: PlayCircle,
                    },
                  ]"
                  :key="path.n"
                  class="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                  @click="openPathPractice(path.n)"
                >
                  <div class="p-2 bg-primary/20 rounded-lg text-primary">
                    <component :is="path.i" :size="16" />
                  </div>
                  <div class="flex-1">
                    <h4 class="text-xs font-bold">{{ path.n }}</h4>
                    <p class="text-[9px] text-white/40">{{ path.d }}</p>
                  </div>
                  <ChevronRight :size="16" class="text-white/60" />
                </div>
              </div>
            </div>

            <button
              class="w-full mt-6 py-3 gradient-primary text-white font-bold rounded-xl shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-1.5 group relative z-10 text-sm"
              @click="startPractice"
            >
              开启首次练习
              <ChevronRight
                :size="16"
                class="group-hover:translate-x-1 transition-transform"
              />
            </button>

            <div
              class="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform"
            >
              <Database :size="180" />
            </div>
          </div>

          <!-- 推荐资源 -->
          <div
            class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
          >
            <div class="flex items-center justify-between mb-6">
              <h2
                class="text-xl font-bold text-neutral-title flex items-center gap-3"
              >
                <BookMarked :size="24" class="text-primary" />
                推荐资源
              </h2>
              <button
                class="px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-xl hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                @click="handleViewAllResources"
              >
                查看全部 <ChevronRight :size="16" />
              </button>
            </div>
            <div class="space-y-6">
              <div
                v-for="resource in recommendedResources.slice(0, 3)"
                :key="resource.id"
                class="flex gap-4 p-5 bg-neutral-bg rounded-[24px] hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-neutral-border group cursor-pointer"
                @click="openResourceDetail(resource)"
              >
                <!-- 封面图片 -->
                <div
                  class="w-20 h-28 flex-shrink-0 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all"
                >
                  <img
                    :src="resource.cover"
                    :alt="resource.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <!-- 资源信息 -->
                <div class="flex-1 min-w-0">
                  <!-- 标题和类型 -->
                  <div class="flex items-start justify-between mb-2">
                    <h3
                      class="text-sm font-bold text-neutral-title mb-1 line-clamp-2 group-hover:text-primary transition-colors"
                    >
                      {{ resource.title }}
                    </h3>
                    <span
                      class="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full"
                      >{{ resource.type }}</span
                    >
                  </div>
                  <!-- 作者 -->
                  <p class="text-xs text-neutral-helper mb-3">
                    作者: {{ resource.author }}
                  </p>
                  <!-- 描述 -->
                  <p class="text-xs text-neutral-body mb-3 line-clamp-2">
                    {{ resource.description }}
                  </p>
                  <!-- 标签 -->
                  <div class="flex flex-wrap gap-1.5 mb-3">
                    <span
                      v-for="tag in resource.tags.slice(0, 3)"
                      :key="tag"
                      class="text-[9px] font-bold text-neutral-helper bg-white px-2 py-0.5 rounded-full hover:bg-primary hover:text-white transition-all"
                    >
                      {{ tag }}
                    </span>
                  </div>
                  <!-- 底部信息 -->
                  <div class="flex items-center justify-between">
                    <!-- 价格 -->
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-bold text-auxiliary-orange">{{
                        resource.price
                      }}</span>
                      <span class="text-xs text-neutral-helper line-through">{{
                        resource.originalPrice
                      }}</span>
                    </div>
                    <!-- 评分和统计 -->
                    <div class="flex items-center gap-3">
                      <div class="flex items-center gap-1">
                        <span class="text-xs font-bold text-auxiliary-orange">{{
                          resource.rating
                        }}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="text-auxiliary-orange"
                        >
                          <polygon
                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                          ></polygon>
                        </svg>
                      </div>
                      <span class="text-[10px] text-neutral-helper"
                        >{{ resource.students }}人学习</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 最新动态 -->
          <div
            class="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-border"
          >
            <div class="flex items-center justify-between mb-6">
              <h2
                class="text-xl font-bold text-neutral-title flex items-center gap-3"
              >
                <Zap :size="24" class="text-auxiliary-orange" />
                最新动态
              </h2>
              <button
                class="px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-xl hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                @click="openAllTopicsPage"
              >
                查看全部 <ChevronRight :size="16" />
              </button>
            </div>
            <div class="space-y-4">
              <div
                v-for="topic in recentTopics.slice(0, 3)"
                :key="topic.id"
                class="p-5 bg-neutral-bg rounded-[24px] hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-neutral-border group cursor-pointer"
              >
                <!-- 顶部信息 -->
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <span
                        class="text-xs font-bold text-primary uppercase bg-primary/10 px-3 py-1 rounded-full"
                        >{{ topic.type }}</span
                      >
                      <span
                        v-if="topic.isHot"
                        class="text-xs font-bold text-auxiliary-orange uppercase bg-auxiliary-orange/10 px-3 py-1 rounded-full"
                        >热门</span
                      >
                    </div>
                    <h3
                      class="text-sm font-bold text-neutral-title group-hover:text-primary transition-colors mb-2 line-clamp-2"
                    >
                      {{ topic.title }}
                    </h3>
                    <div class="flex items-center gap-3 mb-3">
                      <span
                        class="text-xs text-neutral-helper flex items-center gap-1"
                        ><Clock :size="12" /> {{ topic.time }}</span
                      >
                      <span
                        class="text-xs text-neutral-helper flex items-center gap-1"
                        ><BookOpen :size="12" /> {{ topic.author }}</span
                      >
                    </div>
                    <!-- 标签 -->
                    <div class="flex flex-wrap gap-2 mb-4">
                      <span
                        v-for="tag in topic.tags"
                        :key="tag"
                        class="text-xs font-bold text-neutral-helper bg-white px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-all"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                  <div class="flex flex-col gap-2">
                    <button
                      class="p-2 rounded-xl hover:bg-white/50 transition-all"
                      @click.stop="handleLikeClick(topic)"
                    >
                      <Heart
                        :size="18"
                        :class="
                          likedItems.has(topic.id)
                            ? 'text-auxiliary-orange fill-auxiliary-orange'
                            : 'text-neutral-helper'
                        "
                      />
                    </button>
                    <button
                      class="p-2 rounded-xl hover:bg-white/50 transition-all"
                      @click.stop="handleCommentClick(topic)"
                    >
                      <BookMarked
                        :size="18"
                        :class="
                          savedItems.has(topic.id)
                            ? 'text-primary fill-primary'
                            : 'text-neutral-helper'
                        "
                      />
                    </button>
                  </div>
                </div>

                <!-- 底部统计 -->
                <div
                  class="flex items-center justify-between pt-4 border-t border-neutral-border"
                >
                  <div class="flex items-center gap-6">
                    <span
                      class="text-sm text-neutral-helper flex items-center gap-2"
                    >
                      <Heart
                        :size="14"
                        :class="
                          likedItems.has(topic.id)
                            ? 'text-auxiliary-orange'
                            : ''
                        "
                      />
                      {{
                        likedItems.has(topic.id) ? topic.likes + 1 : topic.likes
                      }}
                    </span>
                    <span
                      class="text-sm text-neutral-helper flex items-center gap-2"
                    >
                      <BookOpen :size="14" />
                      {{ topic.views }}
                    </span>
                    <span
                      class="text-sm text-neutral-helper flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                      @click="handleCommentClick(topic)"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                        ></path>
                      </svg>
                      {{ topic.comments }}
                    </span>
                  </div>
                  <button
                    class="text-primary text-sm font-bold hover:underline flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    @click="handleReadMoreClick(topic)"
                  >
                    阅读详情 <ChevronRight :size="14" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 查看全部资源页面 -->
    <div
      v-if="isAllResourcesPageOpen"
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
            <BookOpen :size="24" class="text-primary" />
            全部学习资源
          </h3>
          <button
            class="p-2 text-neutral-helper hover:text-neutral-title"
            @click="closeAllResourcesPage"
          >
            <X :size="24" />
          </button>
        </div>
        <div class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="resource in allResources"
              :key="resource.id"
              class="p-6 bg-neutral-bg rounded-[24px] hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-neutral-border group cursor-pointer"
              @click="openResourceDetail(resource)"
            >
              <div class="flex gap-4">
                <div
                  class="w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all"
                >
                  <img
                    :src="resource.cover"
                    :alt="resource.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between mb-2">
                    <h3
                      class="text-sm font-bold text-neutral-title mb-1 line-clamp-2 group-hover:text-primary transition-colors"
                    >
                      {{ resource.title }}
                    </h3>
                    <span
                      class="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full"
                      >{{ resource.type }}</span
                    >
                  </div>
                  <p class="text-xs text-neutral-helper mb-2">
                    {{ resource.author }}
                  </p>
                  <p class="text-xs text-neutral-body line-clamp-2 mb-2">
                    {{ resource.description }}
                  </p>
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-auxiliary-orange"
                      >¥{{ resource.price }}</span
                    >
                    <span class="text-xs text-neutral-helper line-through"
                      >¥{{ resource.originalPrice }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 全部分类页面 -->
    <div
      v-if="isAllCategoriesPageOpen"
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
            <Layers :size="24" class="text-primary" />
            全部知识分类
          </h3>
          <button
            class="p-2 text-neutral-helper hover:text-neutral-title"
            @click="closeAllCategoriesPage"
          >
            <X :size="24" />
          </button>
        </div>
        <div class="p-8">
          <div v-if="!isCategoryExpanded || !selectedCategory">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div
                v-for="cat in categories"
                :key="cat.id"
                class="p-6 bg-neutral-bg rounded-[24px] hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-neutral-border group cursor-pointer text-center"
                @click="toggleCategory(cat.id)"
              >
                <div
                  class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:gradient-primary group-hover:text-white transition-all"
                >
                  <component :is="cat.icon" :size="24" />
                </div>
                <h3 class="text-sm font-bold text-neutral-title mb-1">
                  {{ cat.name }}
                </h3>
                <p class="text-[10px] text-neutral-helper font-bold uppercase">
                  {{ cat.count }} 知识点
                </p>
              </div>
            </div>
          </div>

          <!-- 分类详情 -->
          <div
            v-else-if="isCategoryExpanded && selectedCategory"
            class="mt-8 p-6 bg-neutral-bg rounded-[24px] border border-neutral-border"
          >
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center text-white"
                >
                  <component
                    :is="
                      categories.find((c) => c.id === selectedCategory)?.icon
                    "
                    :size="20"
                  />
                </div>
                <h3 class="text-lg font-bold text-neutral-title">
                  {{ categories.find((c) => c.id === selectedCategory)?.name }}
                </h3>
              </div>
              <button
                class="p-2 bg-white rounded-xl shadow-sm hover:bg-primary hover:text-white transition-all"
                @click="closeCategory"
              >
                <ChevronRight :size="16" class="rotate-90" />
              </button>
            </div>

            <!-- 子分类 -->
            <div class="mb-8">
              <h4 class="text-sm font-bold text-neutral-title mb-4">子分类</h4>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div
                  v-for="subcat in categoryDetails[
                    selectedCategory as keyof typeof categoryDetails
                  ]?.subcategories"
                  :key="subcat.id"
                  class="p-3 bg-white rounded-xl border border-neutral-border hover:border-primary hover:shadow-sm transition-all cursor-pointer flex items-center justify-between"
                  @click="handleSubcategoryClick(subcat)"
                >
                  <span class="text-xs font-bold text-neutral-title">{{
                    subcat.name
                  }}</span>
                  <span class="text-[10px] text-neutral-helper font-bold">{{
                    subcat.count
                  }}</span>
                </div>
              </div>
            </div>

            <!-- 热门话题 -->
            <div>
              <h4 class="text-sm font-bold text-neutral-title mb-4">
                热门话题
              </h4>
              <div class="space-y-3">
                <div
                  v-for="(topic, index) in categoryDetails[
                    selectedCategory as keyof typeof categoryDetails
                  ]?.hotTopics"
                  :key="index"
                  class="p-3 bg-white rounded-xl border border-neutral-border hover:border-primary hover:shadow-sm transition-all cursor-pointer flex items-center gap-3"
                  @click="handleHotTopicClick(topic)"
                >
                  <span
                    class="text-xs font-bold text-neutral-title truncate flex-1"
                    >{{ topic }}</span
                  >
                  <ChevronRight :size="14" class="text-neutral-helper" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 全部话题页面 -->
    <div
      v-if="isAllTopicsPageOpen"
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
            <Zap :size="24" class="text-auxiliary-orange" />
            全部最新动态
          </h3>
          <button
            class="p-2 text-neutral-helper hover:text-neutral-title"
            @click="closeAllTopicsPage"
          >
            <X :size="24" />
          </button>
        </div>
        <div class="p-8 space-y-4">
          <div
            v-for="topic in recentTopics"
            :key="topic.id"
            class="p-5 bg-neutral-bg rounded-[24px] hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-neutral-border group cursor-pointer"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span
                    class="text-xs font-bold text-primary uppercase bg-primary/10 px-3 py-1 rounded-full"
                    >{{ topic.type }}</span
                  >
                  <span
                    v-if="topic.isHot"
                    class="text-xs font-bold text-auxiliary-orange uppercase bg-auxiliary-orange/10 px-3 py-1 rounded-full"
                    >热门</span
                  >
                </div>
                <h3
                  class="text-sm font-bold text-neutral-title group-hover:text-primary transition-colors mb-2 line-clamp-2"
                >
                  {{ topic.title }}
                </h3>
                <div class="flex items-center gap-3">
                  <span
                    class="text-xs text-neutral-helper flex items-center gap-1"
                    ><Clock :size="12" /> {{ topic.time }}</span
                  >
                  <span
                    class="text-xs text-neutral-helper flex items-center gap-1"
                    ><BookOpen :size="12" /> {{ topic.author }}</span
                  >
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <button
                  class="p-2 rounded-xl hover:bg-white/50 transition-all"
                  @click.stop="handleLikeClick(topic)"
                >
                  <Heart
                    :size="18"
                    :class="
                      likedItems.has(topic.id)
                        ? 'text-auxiliary-orange fill-auxiliary-orange'
                        : 'text-neutral-helper'
                    "
                  />
                </button>
              </div>
            </div>
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tag in topic.tags"
                :key="tag"
                class="text-xs font-bold text-neutral-helper bg-white px-3 py-1 rounded-full"
              >
                {{ tag }}
              </span>
            </div>
            <div
              class="flex items-center justify-between pt-4 border-t border-neutral-border"
            >
              <div class="flex items-center gap-6">
                <span
                  class="text-sm text-neutral-helper flex items-center gap-2"
                >
                  <Heart
                    :size="14"
                    :class="
                      likedItems.has(topic.id) ? 'text-auxiliary-orange' : ''
                    "
                  />
                  {{ likedItems.has(topic.id) ? topic.likes + 1 : topic.likes }}
                </span>
                <span
                  class="text-sm text-neutral-helper flex items-center gap-2"
                >
                  <BookOpen :size="14" />
                  {{ topic.views }}
                </span>
              </div>
              <button
                class="text-primary text-sm font-bold hover:underline flex items-center gap-1"
                @click="handleReadMoreClick(topic)"
              >
                阅读详情 <ChevronRight :size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 资源详情页面 -->
    <div
      v-if="isResourceDetailOpen"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div
          class="p-8 border-b border-neutral-border flex justify-between items-center"
        >
          <h3
            class="text-xl font-bold text-neutral-title flex items-center gap-2"
          >
            <BookOpen :size="24" class="text-primary" />
            资源详情
          </h3>
          <button
            class="p-2 text-neutral-helper hover:text-neutral-title"
            @click="closeResourceDetail"
          >
            <X :size="24" />
          </button>
        </div>
        <div v-if="selectedResource" class="p-8">
          <div class="flex gap-4 mb-6">
            <div
              class="w-32 h-40 flex-shrink-0 rounded-xl overflow-hidden shadow-md"
            >
              <img
                :src="selectedResource.cover"
                :alt="selectedResource.title"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="flex-1">
              <h4 class="text-lg font-bold text-neutral-title mb-2">
                {{ selectedResource.title }}
              </h4>
              <p class="text-sm text-neutral-helper mb-2">
                {{ selectedResource.author }}
              </p>
              <div class="flex items-center gap-2 mb-2">
                <span
                  class="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full"
                  >{{ selectedResource.type }}</span
                >
                <span class="text-xs font-bold text-auxiliary-orange"
                  >¥{{ selectedResource.price }}</span
                >
                <span class="text-xs text-neutral-helper line-through"
                  >¥{{ selectedResource.originalPrice }}</span
                >
              </div>
              <p class="text-sm text-neutral-body">
                {{ selectedResource.students.toLocaleString() }} 学生 |
                {{ selectedResource.reviews }} 评价
              </p>
            </div>
          </div>
          <p class="text-sm text-neutral-body mb-6">
            {{ selectedResource.description }}
          </p>
          <div class="flex flex-wrap gap-2 mb-6">
            <span
              v-for="tag in selectedResource.tags"
              :key="tag"
              class="text-xs font-bold text-neutral-helper bg-neutral-bg px-3 py-1 rounded-full"
            >
              {{ tag }}
            </span>
          </div>
          <div class="flex justify-end gap-4">
            <button
              class="px-6 py-3 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all"
            >
              收藏
            </button>
            <button
              class="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all"
            >
              开始学习
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 子分类详情页面 -->
    <div
      v-if="isSubcategoryDetailOpen"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div
          class="p-8 border-b border-neutral-border flex justify-between items-center"
        >
          <h3
            class="text-xl font-bold text-neutral-title flex items-center gap-2"
          >
            <Layers :size="24" class="text-primary" />
            {{ selectedSubcategory?.name }} - 详情
          </h3>
          <button
            class="p-2 text-neutral-helper hover:text-neutral-title"
            @click="closeSubcategoryDetail"
          >
            <X :size="24" />
          </button>
        </div>
        <div class="p-8 space-y-6">
          <div class="p-6 bg-neutral-bg rounded-[24px]">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-bold text-neutral-title">子分类信息</h4>
              <span class="text-xs font-bold text-auxiliary-orange"
                >{{ selectedSubcategory?.count }} 知识点</span
              >
            </div>
            <p class="text-sm text-neutral-helper">
              {{ selectedSubcategory?.name }}
              是一个专业的知识分类，包含了丰富的学习资源和实践案例，帮助你深入了解相关领域的核心概念和应用技巧。
            </p>
          </div>
          <div>
            <h4 class="text-sm font-bold text-neutral-title mb-4">
              推荐学习资源
            </h4>
            <div class="space-y-4">
              <div
                v-for="i in 3"
                :key="i"
                class="p-4 bg-neutral-bg rounded-[24px] hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-neutral-border"
              >
                <h5 class="text-sm font-bold text-neutral-title mb-2">
                  {{ selectedSubcategory?.name }} 学习资源 {{ i }}
                </h5>
                <p class="text-xs text-neutral-helper mb-3">
                  这是一份关于
                  {{ selectedSubcategory?.name }}
                  的优质学习资源，包含了详细的理论知识和实践案例，适合不同水平的学习者。
                </p>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-neutral-helper"
                    >难度: {{ ["初级", "中级", "高级"][i - 1] }}</span
                  >
                  <button
                    class="text-primary text-xs font-bold hover:underline"
                  >
                    查看详情
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="pt-6 border-t border-neutral-border">
            <h4 class="text-sm font-bold text-neutral-title mb-4">热门话题</h4>
            <div class="space-y-3">
              <div
                v-for="i in 5"
                :key="i"
                class="p-3 bg-white rounded-xl border border-neutral-border hover:border-primary hover:shadow-sm transition-all cursor-pointer"
              >
                <span class="text-xs font-bold text-neutral-title"
                  >{{ selectedSubcategory?.name }} 相关话题 {{ i }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 热门话题详情页面 -->
    <div
      v-if="isTopicDetailOpen"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div
          class="p-8 border-b border-neutral-border flex justify-between items-center"
        >
          <h3
            class="text-xl font-bold text-neutral-title flex items-center gap-2"
          >
            <Zap :size="24" class="text-auxiliary-orange" />
            {{ selectedTopic }} - 详情
          </h3>
          <button
            class="p-2 text-neutral-helper hover:text-neutral-title"
            @click="closeTopicDetail"
          >
            <X :size="24" />
          </button>
        </div>
        <div class="p-8 space-y-6">
          <div class="p-6 bg-neutral-bg rounded-[24px]">
            <h4 class="text-sm font-bold text-neutral-title mb-4">
              {{ selectedTopic }}
            </h4>
            <p class="text-sm text-neutral-helper">
              {{ selectedTopic }}
              是一个热门的技术话题，吸引了众多开发者和技术爱好者的关注。本页面提供了关于这个话题的详细介绍、最新动态和相关资源。
            </p>
          </div>
          <div>
            <h4 class="text-sm font-bold text-neutral-title mb-4">相关资源</h4>
            <div class="space-y-4">
              <div
                v-for="i in 3"
                :key="i"
                class="p-4 bg-neutral-bg rounded-[24px] hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-neutral-border"
              >
                <h5 class="text-sm font-bold text-neutral-title mb-2">
                  {{ selectedTopic }} 相关资源 {{ i }}
                </h5>
                <p class="text-xs text-neutral-helper mb-3">
                  这是一份关于
                  {{ selectedTopic }}
                  的优质学习资源，包含了详细的理论知识和实践案例，适合不同水平的学习者。
                </p>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-neutral-helper"
                    >浏览量: {{ 1000 + i * 200 }}</span
                  >
                  <button
                    class="text-primary text-xs font-bold hover:underline"
                  >
                    查看详情
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="pt-6 border-t border-neutral-border">
            <h4 class="text-sm font-bold text-neutral-title mb-4">最新讨论</h4>
            <div class="space-y-4">
              <div
                v-for="i in 4"
                :key="i"
                class="p-4 bg-white rounded-xl border border-neutral-border hover:border-primary hover:shadow-sm transition-all"
              >
                <div class="flex items-start justify-between mb-3">
                  <h5 class="text-sm font-bold text-neutral-title">
                    {{ selectedTopic }} 的讨论 {{ i }}
                  </h5>
                  <span class="text-xs text-neutral-helper"
                    >{{ i }} 小时前</span
                  >
                </div>
                <p class="text-xs text-neutral-helper mb-3">
                  这是关于
                  {{ selectedTopic }}
                  的一个讨论，分享了作者的经验和见解，欢迎大家参与讨论。
                </p>
                <div class="flex items-center gap-6">
                  <span
                    class="text-xs text-neutral-helper flex items-center gap-1"
                    ><Heart :size="12" /> {{ 20 + i * 5 }}</span
                  >
                  <span
                    class="text-xs text-neutral-helper flex items-center gap-1"
                    ><MessageSquare :size="12" /> {{ 5 + i }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 全部面试解析页面 -->
    <div
      v-if="isAllAnalysesPageOpen"
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
            <Zap :size="24" class="text-primary" />
            全部面试解析
          </h3>
          <button
            class="p-2 text-neutral-helper hover:text-neutral-title"
            @click="closeAllAnalysesPage"
          >
            <X :size="24" />
          </button>
        </div>
        <div class="p-8 space-y-6">
          <div
            v-for="analysis in hotInterviewAnalyses"
            :key="analysis.id"
            class="p-6 bg-neutral-bg rounded-[24px] hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-neutral-border group cursor-pointer"
            @click="openAnalysisDetail(analysis)"
          >
            <!-- 顶部信息 -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:gradient-primary group-hover:text-white transition-all"
                >
                  <Code2 :size="20" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <span
                      class="text-xs font-bold text-primary uppercase bg-primary/10 px-3 py-1 rounded-full"
                      >{{ analysis.type }}</span
                    >
                    <span
                      class="text-xs font-bold text-auxiliary-orange uppercase bg-auxiliary-orange/10 px-3 py-1 rounded-full"
                      >{{ analysis.company }}</span
                    >
                    <span
                      v-if="analysis.difficulty === '简单'"
                      class="text-xs font-bold text-auxiliary-green uppercase bg-auxiliary-green/10 px-3 py-1 rounded-full"
                      >{{ analysis.difficulty }}</span
                    >
                    <span
                      v-else-if="analysis.difficulty === '中等'"
                      class="text-xs font-bold text-primary uppercase bg-primary/10 px-3 py-1 rounded-full"
                      >{{ analysis.difficulty }}</span
                    >
                    <span
                      v-else
                      class="text-xs font-bold text-auxiliary-orange uppercase bg-auxiliary-orange/10 px-3 py-1 rounded-full"
                      >{{ analysis.difficulty }}</span
                    >
                  </div>
                  <h3
                    class="text-sm font-bold text-neutral-title group-hover:text-primary transition-colors mb-2 line-clamp-2"
                  >
                    {{ analysis.title }}
                  </h3>
                  <div class="flex items-center gap-3">
                    <span
                      class="text-xs text-neutral-helper flex items-center gap-1"
                      ><Clock :size="12" /> {{ analysis.time }}</span
                    >
                    <span
                      class="text-xs text-neutral-helper flex items-center gap-1"
                      ><BookOpen :size="12" /> {{ analysis.author }}</span
                    >
                  </div>
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <button
                  class="p-2 rounded-xl hover:bg-white/50 transition-all"
                  @click.stop="toggleLike(analysis.id)"
                >
                  <Heart
                    :size="18"
                    :class="
                      likedItems.has(analysis.id)
                        ? 'text-auxiliary-orange fill-auxiliary-orange'
                        : 'text-neutral-helper'
                    "
                  />
                </button>
                <button
                  class="p-2 rounded-xl hover:bg-white/50 transition-all"
                  @click.stop="toggleSave(analysis.id)"
                >
                  <BookMarked
                    :size="18"
                    :class="
                      savedItems.has(analysis.id)
                        ? 'text-primary fill-primary'
                        : 'text-neutral-helper'
                    "
                  />
                </button>
              </div>
            </div>

            <!-- 描述 -->
            <p class="text-sm text-neutral-body mb-4 line-clamp-2">
              {{ analysis.description }}
            </p>

            <!-- 标签 -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tag in analysis.tags"
                :key="tag"
                class="text-xs font-bold text-neutral-helper bg-white px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-all"
              >
                {{ tag }}
              </span>
            </div>

            <!-- 底部统计 -->
            <div
              class="flex items-center justify-between pt-4 border-t border-neutral-border"
            >
              <div class="flex items-center gap-6">
                <span
                  class="text-sm text-neutral-helper flex items-center gap-2"
                >
                  <Heart
                    :size="14"
                    :class="
                      likedItems.has(analysis.id) ? 'text-auxiliary-orange' : ''
                    "
                  />
                  {{
                    likedItems.has(analysis.id)
                      ? analysis.likes + 1
                      : analysis.likes
                  }}
                </span>
                <span
                  class="text-sm text-neutral-helper flex items-center gap-2"
                >
                  <BookOpen :size="14" />
                  {{ analysis.views }}
                </span>
              </div>
              <button
                class="text-primary text-sm font-bold hover:underline flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                @click.stop="openAnalysisDetail(analysis)"
              >
                阅读详情 <ChevronRight :size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 面试解析详情页面 -->
    <div
      v-if="isAnalysisDetailOpen"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div
          class="p-8 border-b border-neutral-border flex justify-between items-center"
        >
          <h3
            class="text-xl font-bold text-neutral-title flex items-center gap-2"
          >
            <Code2 :size="24" class="text-primary" />
            {{ selectedAnalysis?.title }} - 详情
          </h3>
          <button
            class="p-2 text-neutral-helper hover:text-neutral-title"
            @click="closeAnalysisDetail"
          >
            <X :size="24" />
          </button>
        </div>
        <div v-if="selectedAnalysis" class="p-8 space-y-6">
          <div class="p-6 bg-neutral-bg rounded-[24px]">
            <div class="flex items-center gap-4 mb-4">
              <div
                class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm"
              >
                <Code2 :size="20" />
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span
                    class="text-xs font-bold text-primary uppercase bg-primary/10 px-3 py-1 rounded-full"
                    >{{ selectedAnalysis.type }}</span
                  >
                  <span
                    class="text-xs font-bold text-auxiliary-orange uppercase bg-auxiliary-orange/10 px-3 py-1 rounded-full"
                    >{{ selectedAnalysis.company }}</span
                  >
                  <span
                    v-if="selectedAnalysis.difficulty === '简单'"
                    class="text-xs font-bold text-auxiliary-green uppercase bg-auxiliary-green/10 px-3 py-1 rounded-full"
                    >{{ selectedAnalysis.difficulty }}</span
                  >
                  <span
                    v-else-if="selectedAnalysis.difficulty === '中等'"
                    class="text-xs font-bold text-primary uppercase bg-primary/10 px-3 py-1 rounded-full"
                    >{{ selectedAnalysis.difficulty }}</span
                  >
                  <span
                    v-else
                    class="text-xs font-bold text-auxiliary-orange uppercase bg-auxiliary-orange/10 px-3 py-1 rounded-full"
                    >{{ selectedAnalysis.difficulty }}</span
                  >
                </div>
                <h4 class="text-lg font-bold text-neutral-title mb-2">
                  {{ selectedAnalysis.title }}
                </h4>
                <div class="flex items-center gap-3">
                  <span
                    class="text-xs text-neutral-helper flex items-center gap-1"
                    ><Clock :size="12" /> {{ selectedAnalysis.time }}</span
                  >
                  <span
                    class="text-xs text-neutral-helper flex items-center gap-1"
                    ><BookOpen :size="12" /> {{ selectedAnalysis.author }}</span
                  >
                </div>
              </div>
            </div>
            <p class="text-sm text-neutral-helper mb-4">
              {{ selectedAnalysis.description }}
            </p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tag in selectedAnalysis.tags"
                :key="tag"
                class="text-xs font-bold text-neutral-helper bg-white px-3 py-1 rounded-full"
              >
                {{ tag }}
              </span>
            </div>
            <div class="flex items-center gap-6">
              <span class="text-sm text-neutral-helper flex items-center gap-2">
                <Heart
                  :size="14"
                  :class="
                    likedItems.has(selectedAnalysis.id)
                      ? 'text-auxiliary-orange'
                      : ''
                  "
                />
                {{
                  likedItems.has(selectedAnalysis.id)
                    ? selectedAnalysis.likes + 1
                    : selectedAnalysis.likes
                }}
              </span>
              <span class="text-sm text-neutral-helper flex items-center gap-2">
                <BookOpen :size="14" />
                {{ selectedAnalysis.views }}
              </span>
            </div>
          </div>
          <div>
            <h4 class="text-sm font-bold text-neutral-title mb-4">解析内容</h4>
            <div class="p-6 bg-neutral-bg rounded-[24px] space-y-4">
              <div>
                <h5 class="text-sm font-bold text-neutral-title mb-2">
                  问题分析
                </h5>
                <p class="text-sm text-neutral-helper">
                  这道面试题主要考察了
                  {{ selectedAnalysis.type }}
                  领域的核心概念，需要候选人具备扎实的基础知识和实践经验。问题的难点在于理解
                  {{ selectedAnalysis.title }}
                  的本质，以及如何在实际项目中应用相关技术。
                </p>
              </div>
              <div>
                <h5 class="text-sm font-bold text-neutral-title mb-2">
                  解决方案
                </h5>
                <p class="text-sm text-neutral-helper">
                  针对这个问题，我们可以采用以下步骤来解决：
                </p>
                <ol
                  class="list-decimal list-inside text-sm text-neutral-helper mt-2 space-y-1"
                >
                  <li>理解问题的核心需求和约束条件</li>
                  <li>分析可能的解决方案及其优缺点</li>
                  <li>选择最合适的解决方案并实现</li>
                  <li>测试解决方案的正确性和性能</li>
                  <li>优化解决方案以提高效率</li>
                </ol>
              </div>
              <div>
                <h5 class="text-sm font-bold text-neutral-title mb-2">
                  代码示例
                </h5>
                <div
                  class="bg-neutral-title text-white p-4 rounded-xl text-xs font-mono overflow-x-auto"
                >
                  <pre>{{ selectedAnalysis.code || "// 代码示例" }}</pre>
                </div>
              </div>
            </div>
          </div>
          <div class="pt-6 border-t border-neutral-border">
            <h4 class="text-sm font-bold text-neutral-title mb-4">相关讨论</h4>
            <div class="space-y-4">
              <div
                v-for="i in 3"
                :key="i"
                class="p-4 bg-white rounded-xl border border-neutral-border hover:border-primary hover:shadow-sm transition-all"
              >
                <div class="flex items-start justify-between mb-3">
                  <h5 class="text-sm font-bold text-neutral-title">
                    关于 {{ selectedAnalysis.title }} 的讨论 {{ i }}
                  </h5>
                  <span class="text-xs text-neutral-helper"
                    >{{ i }} 小时前</span
                  >
                </div>
                <p class="text-xs text-neutral-helper mb-3">
                  这是关于
                  {{ selectedAnalysis.title }}
                  的一个讨论，分享了作者的经验和见解，欢迎大家参与讨论。
                </p>
                <div class="flex items-center gap-6">
                  <span
                    class="text-xs text-neutral-helper flex items-center gap-1"
                    ><Heart :size="12" /> {{ 15 + i * 3 }}</span
                  >
                  <span
                    class="text-xs text-neutral-helper flex items-center gap-1"
                    ><MessageSquare :size="12" /> {{ 3 + i }}</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="flex gap-4 justify-end">
            <button
              class="px-6 py-3 bg-neutral-bg text-neutral-title font-bold rounded-xl hover:bg-neutral-border/50 transition-all flex items-center gap-2"
              @click.stop="toggleSave(selectedAnalysis.id)"
            >
              <BookMarked
                :size="16"
                :class="
                  savedItems.has(selectedAnalysis.id)
                    ? 'text-primary fill-primary'
                    : 'text-neutral-helper'
                "
              />
              {{ savedItems.has(selectedAnalysis.id) ? "已收藏" : "收藏" }}
            </button>
            <button
              class="px-6 py-3 bg-auxiliary-orange text-white font-bold rounded-xl hover:bg-auxiliary-orange/80 transition-all flex items-center gap-2"
              @click.stop="toggleLike(selectedAnalysis.id)"
            >
              <Heart
                :size="16"
                :class="likedItems.has(selectedAnalysis.id) ? 'fill-white' : ''"
              />
              {{ likedItems.has(selectedAnalysis.id) ? "已点赞" : "点赞" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
