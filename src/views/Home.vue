<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useAuth } from "@/composables/useAuth";
import LoginForm from "@/components/LoginForm.vue";
import {
  Zap,
  Target,
  TrendingUp,
  Bot,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Menu,
  X,
  Monitor,
  BarChart3,
  CheckCircle,
  Award,
  ChevronDown,
  MessageCircle,
  Star,
  Smartphone,
  UserCheck,
  HelpCircle,
  QrCode,
  LogOut,
  User,
} from "lucide-vue-next";

const router = useRouter();
const userStore = useUserStore();
const { logout: authLogout } = useAuth();
const { isLoggedIn } = storeToRefs(userStore);
const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);
const activeSection = ref("hero");

// 登录与用户状态
const showLoginModal = ref(false);
const showUserMenu = ref(false);

const handleLoginSuccess = (): void => {
  showLoginModal.value = false;
};

const handleLoginCancel = (): void => {
  showLoginModal.value = false;
};

const handleLogout = async (): Promise<void> => {
  showUserMenu.value = false;
  await authLogout();
};

// 页脚官方渠道数据
const footerChannels = [
  { name: "微信公众号", icon: QrCode, type: "qr" },
  { name: "官方小程序", icon: Smartphone, type: "link" },
  { name: "客服微信", icon: UserCheck, type: "qr" },
  { name: "帮助中心", icon: HelpCircle, type: "link" },
];

const activeQr = ref<string | null>(null);

const handleChannelClick = (channel: any) => {
  if (channel.type === "qr") {
    activeQr.value = channel.name;
  } else {
    // 模拟跳转
    console.log(`跳转到: ${channel.name}`);
    alert(`正在跳转到${channel.name}...`);
  }
};

// 平滑滚动逻辑 (原生 JS 实现)
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const offset = 80; // 导航栏高度
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
  isMobileMenuOpen.value = false;
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);

  // 原生 IntersectionObserver 实现导航高亮
  const observerOptions = {
    root: null,
    rootMargin: "-10% 0px -80% 0px", // 聚焦于屏幕顶部区域
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    // 过滤出正在进入视口的模块
    const visibleEntries = entries.filter((entry) => entry.isIntersecting);
    if (visibleEntries.length > 0) {
      // 如果有多个模块同时在视口，取最顶部的那个（通常是 entries 中的最后一个，或者可以根据 entry.target.offsetTop 排序）
      // 这里简单处理：记录最后触发 entering 的模块
      const lastEntry = visibleEntries[visibleEntries.length - 1];
      if (lastEntry && lastEntry.target.id) {
        activeSection.value = lastEntry.target.id;
      }
    }
  }, observerOptions);

  // 监听所有目标模块
  const sections = [
    "hero",
    "core-function",
    "product-service",
    "platform-news",
    "faq",
  ];
  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const navigateTo = (path: string) => {
  router.push(path);
  isMobileMenuOpen.value = false;
};

const navLinks = [
  { name: "首页", id: "hero" },
  { name: "核心功能", id: "core-function" },
  { name: "产品服务", id: "product-service" },
  { name: "平台动态", id: "platform-news" },
  { name: "常见问题", id: "faq" },
];

// 学生端核心功能模块
const studentFeatures = [
  {
    title: "AI 面试模拟",
    subtitle: "Smart Interview",
    desc: "Java/前端/Python 等岗位情景模拟，多角色 AI 面试官，智能追问与语音交互",
    tag: "多模态",
    gradient: "from-primary to-primary-light",
  },
  {
    title: "面试复盘分析",
    subtitle: "Interview Review",
    desc: "音视频全记录，多维度 AI 评估技术/表达/非言语，生成结构化报告与认证",
    tag: "全维度",
    gradient: "from-primary-light to-auxiliary-yellow",
  },
  {
    title: "岗职双维测评",
    subtitle: "Career Assessment",
    desc: "岗位匹配度 + MBTI/霍兰德职业心理测评，适配度评分与职业发展建议",
    tag: "科学化",
    gradient: "from-auxiliary-yellow to-auxiliary-orange",
  },
  {
    title: "能力提升路径",
    subtitle: "Growth Path",
    desc: "游戏化通关面试，知识缺口诊断，定制学习路径，能力认证闭环",
    tag: "个性化",
    gradient: "from-auxiliary-orange to-primary",
  },
];

const services = [
  "技术面试",
  "小组面试",
  "无领导小组",
  "压力测试",
  "情景分析",
  "外语面试",
];
const activeService = ref("技术面试");

// 平台动态
const newsItems = [
  {
    date: "2024/03/01",
    title: 'xxxx 获评"年度最具创新教育科技平台"',
    desc: "在 2024 全球教育科技大会上，平台凭借多维分析算法脱颖而出。",
  },
  {
    date: "2024/02/20",
    title: "春招特刊：前端/后端/算法核心专题上线",
    desc: "针对 2024 春招热点，更新 100+ 核心面试解析题目。",
  },
  {
    date: "2024/01/15",
    title: "拥抱 AI，改变求职：使命与愿景",
    desc: "致力于用 AI 消除信息差，让每一位求职者展现真实实力。",
  },
];

// 用户评价数据
const userReviews = [
  {
    name: "张同学",
    role: "Java开发 · 应届生",
    rating: 5,
    content:
      "AI面试官问的问题都很专业，和字节面试时遇到的问题几乎一样！通过3次模拟，我的回答逻辑清晰了很多，最终拿到了心仪的Offer。",
    tag: "已入职字节",
  },
  {
    name: "李同学",
    role: "前端开发 · 3年经验",
    rating: 5,
    content:
      "报告里的能力雷达图太有用了，让我清楚看到自己在项目表述上的不足。针对性练习后，面试通过率提升了不少。",
    tag: "成功跳槽阿里",
  },
  {
    name: "王同学",
    role: "产品经理 · 应届生",
    rating: 4,
    content:
      "作为非技术岗，最怕的就是结构化面试。平台的AI面试官帮我模拟了各种场景，从自我介绍到案例分析都有覆盖，非常实用！",
    tag: "收获腾讯Offer",
  },
];

// FAQ 数据
const faqItems = ref([
  {
    question: "AI 面试官的评估准确吗？",
    answer:
      "我们的 AI 面试官基于大语言模型和海量真实面试数据训练，能够从技术水平、逻辑思维、表达能力等多维度进行评估。根据用户反馈，AI 评估与真实面试官评估的一致性达到 85% 以上。",
    isOpen: false,
  },
  {
    question: "支持哪些岗位的面试模拟？",
    answer:
      "目前支持 Java、Python、前端、后端、算法、产品、运营等 50+ 热门岗位。每个岗位都有针对性的题库和评估标准，覆盖从初级到高级的不同职级。",
    isOpen: false,
  },
  {
    question: "面试报告包含哪些内容？",
    answer:
      "面试报告包含：1）综合能力评分雷达图；2）每道题的回答分析与改进建议；3）与优秀回答的对比；4）技术知识点掌握情况；5）表达能力与沟通技巧评估。报告可下载并分享。",
    isOpen: false,
  },
  {
    question: "如何保护我的隐私数据？",
    answer:
      "我们采用银行级加密技术保护用户数据，面试音视频仅用于生成报告，不会用于其他用途。用户可随时删除个人数据，我们严格遵守 GDPR 和国内数据保护法规。",
    isOpen: false,
  },
]);

const toggleFaq = (index: number) => {
  if (faqItems.value[index]) {
    faqItems.value[index].isOpen = !faqItems.value[index].isOpen;
  }
};
</script>

<template>
  <div
    class="min-h-screen font-sans text-neutral-title overflow-x-hidden relative bg-white"
  >
    <!-- Hero Background - Only for top section -->
    <div class="hero-background">
      <div class="gradient-layer"></div>
      <div class="noise-layer"></div>
    </div>

    <!-- 1. Navbar -->
    <nav
      class="fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6 md:px-12 h-20 flex items-center justify-between"
      :class="
        isScrolled
          ? 'bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]'
          : 'bg-transparent'
      "
    >
      <div
        class="flex items-center gap-2 cursor-pointer"
        @click="scrollToSection('hero')"
      >
        <div
          class="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center"
        >
          <Bot :size="20" class="text-white" />
        </div>
        <span
          class="font-bold text-xl tracking-tight"
          :class="isScrolled ? 'text-[#333]' : 'text-neutral-title'"
          >面面俱到</span
        >
      </div>

      <!-- Desktop Links -->
      <div class="hidden md:flex items-center gap-8">
        <a
          v-for="link in navLinks"
          :key="link.id"
          class="text-sm font-bold transition-all duration-300 cursor-pointer"
          :style="{ color: activeSection === link.id ? '#FFC585' : '#333' }"
          @click="scrollToSection(link.id)"
        >
          {{ link.name }}
        </a>
      </div>

      <div class="hidden md:flex items-center gap-6">
        <!-- 帮助中心 -->
        <div
          class="flex items-center gap-1 cursor-pointer group"
          style="color: #333"
          @click="scrollToSection('faq')"
        >
          <HelpCircle
            :size="20"
            class="group-hover:text-[#FFC585] transition-colors"
          />
          <span
            class="text-sm font-bold group-hover:text-[#FFC585] transition-colors"
            >帮助中心</span
          >
        </div>

        <!-- 登录/注册 或 用户头像 -->
        <div
          v-if="!isLoggedIn"
          class="cursor-pointer group"
          style="color: #333"
          @click="showLoginModal = true"
        >
          <span
            class="text-sm font-bold group-hover:text-[#FFC585] transition-colors"
            >登录/注册</span
          >
        </div>

        <div v-else class="relative">
          <div
            class="w-10 h-10 rounded-full border-2 border-primary/10 bg-neutral-bg overflow-hidden cursor-pointer hover:border-primary/30 transition-all"
            @click="showUserMenu = !showUserMenu"
          >
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123"
              alt="User Avatar"
            />
          </div>
          <!-- 用户下拉菜单 -->
          <Transition name="fade">
            <div
              v-if="showUserMenu"
              class="absolute top-12 right-0 w-48 bg-white rounded-2xl shadow-2xl border border-neutral-border/30 p-2 z-[110]"
            >
              <div
                class="flex items-center gap-3 px-4 py-3 hover:bg-neutral-bg rounded-xl cursor-pointer transition-colors group"
                @click="navigateTo('/profile')"
              >
                <User
                  :size="18"
                  class="text-neutral-helper group-hover:text-primary"
                />
                <span class="text-sm font-bold text-neutral-title"
                  >个人中心</span
                >
              </div>
              <div
                class="flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl cursor-pointer transition-colors group"
                @click="handleLogout"
              >
                <LogOut
                  :size="18"
                  class="text-neutral-helper group-hover:text-red-500"
                />
                <span
                  class="text-sm font-bold text-neutral-title group-hover:text-red-500"
                  >退出登录</span
                >
              </div>
            </div>
          </Transition>
        </div>

        <button
          class="px-6 py-2 rounded-full font-bold text-sm transition-all transform active:scale-95 bg-neutral-title text-[#FFC585] hover:scale-105 shadow-lg"
          @click="
            isLoggedIn ? navigateTo('/interview') : (showLoginModal = true)
          "
        >
          立即体验
        </button>
      </div>

      <!-- Mobile Toggle -->
      <button
        class="md:hidden p-2"
        :style="{ color: '#333' }"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <Menu v-if="!isMobileMenuOpen" :size="24" />
        <X v-else :size="24" />
      </button>
    </nav>

    <!-- Mobile Menu Overlay -->
    <Transition name="fade">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 bg-white z-[90] md:hidden flex flex-col items-center justify-center gap-8"
      >
        <a
          v-for="link in navLinks"
          :key="link.id"
          class="text-2xl font-bold transition-colors"
          :style="{ color: activeSection === link.id ? '#FFC585' : '#333' }"
          @click="scrollToSection(link.id)"
        >
          {{ link.name }}
        </a>
        <button
          class="px-12 py-4 bg-primary text-white rounded-full font-bold text-xl shadow-xl shadow-primary/20"
          @click="navigateTo('/profile')"
        >
          立即体验
        </button>
      </div>
    </Transition>

    <!-- 登录弹窗 -->
    <Transition name="fade">
      <div
        v-if="showLoginModal"
        class="fixed inset-0 z-[200] flex items-center justify-center p-6"
      >
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="handleLoginCancel"
        ></div>
        <div class="relative animate-in zoom-in duration-300 w-[500px] max-w-md overflow-hidden">
          <LoginForm
            @success="handleLoginSuccess"
            @cancel="handleLoginCancel"
          />
        </div>
      </div>
    </Transition>

    <!-- 2. Hero Section -->
    <section
      id="hero"
      class="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-8 animate-in slide-in-from-left-12 duration-1000">
          <div
            class="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10"
          >
            <Sparkles :size="16" class="text-primary" />
            <span
              class="text-xs font-bold text-primary tracking-widest uppercase"
              >AI 驱动面试革命</span
            >
          </div>
          <h1
            class="text-5xl md:text-7xl font-black leading-tight tracking-tight text-neutral-title"
          >
            AI 驱动的<br />
            <span class="text-primary italic">智能面试平台</span>
          </h1>
          <p class="text-lg text-neutral-body max-w-lg leading-relaxed">
            基于多模态大语言模型，深度还原真实面试场景。为每一位求职者提供“没人练、没反馈、没方向”的全链条解决方案。
          </p>
          <div class="flex items-center gap-4">
            <button
              class="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              @click="navigateTo('/interview')"
            >
              深入了解
              <ArrowRight :size="20" />
            </button>
            <div class="flex items-center gap-2 ml-4">
              <div class="flex -space-x-3">
                <div
                  v-for="i in 3"
                  :key="i"
                  class="w-10 h-10 rounded-full border-2 border-white bg-neutral-bg overflow-hidden"
                >
                  <img
                    :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`"
                    alt="user"
                  />
                </div>
              </div>
              <p class="text-xs text-neutral-helper font-medium ml-2">
                已有
                <span class="text-primary font-bold">12k+</span> 同学成功入职
              </p>
            </div>
          </div>
        </div>

        <div class="relative animate-in slide-in-from-right-12 duration-1000">
          <div
            class="w-full aspect-square relative flex items-center justify-center"
          >
            <!-- 3D Abstract Shape Simulation -->
            <div
              class="absolute inset-0 bg-primary/5 rounded-full blur-[100px]"
            ></div>
            <div
              class="relative w-[80%] h-[80%] gradient-primary rounded-[60px] rotate-12 shadow-2xl flex items-center justify-center overflow-hidden"
            >
              <div class="absolute inset-0 bg-white/10 backdrop-blur-3xl"></div>
              <div class="relative z-10 flex flex-col items-center gap-6">
                <div
                  class="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center text-white backdrop-blur-md border border-white/30 animate-pulse"
                >
                  <Bot :size="80" />
                </div>
                <div class="text-white text-center">
                  <p class="text-2xl font-black">AI Interview</p>
                  <p class="text-xs opacity-60">Multi-modal Analysis</p>
                </div>
              </div>
              <!-- Floating UI Cards -->
              <div
                class="absolute top-10 right-10 p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white animate-bounce shadow-xl"
              >
                <Zap :size="24" />
              </div>
              <div
                class="absolute bottom-10 left-10 p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white animate-bounce shadow-xl"
                style="animation-delay: 1s"
              >
                <Target :size="24" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination Dots -->
      <div class="flex items-center justify-center gap-2 mt-12">
        <div
          v-for="i in 3"
          :key="i"
          class="w-2 h-2 rounded-full transition-all duration-300"
          :class="i === 1 ? 'w-8 bg-primary' : 'bg-neutral-border'"
        ></div>
      </div>
    </section>

    <!-- 3. Feature Section -->
    <section id="core-function" class="py-24 bg-neutral-bg/50 px-6 md:px-12">
      <div class="max-w-7xl mx-auto space-y-20">
        <div class="max-w-2xl space-y-4">
          <h2
            class="text-4xl font-black text-neutral-title tracking-tight italic"
          >
            面面俱到
          </h2>
          <p class="text-neutral-body leading-relaxed">
            面向学生与企业双端，提供 AI
            面试模拟、能力测评、招聘管理一体化解决方案。以智能技术赋能求职与人才选拔，让每一次面试都有价值。
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <template v-for="(card, index) in studentFeatures" :key="card.title">
            <div
              class="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-border/30 group relative overflow-hidden"
            >
              <!-- 装饰元素 -->
              <div
                class="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-5 group-hover:opacity-10 transition-opacity"
                :class="
                  index === 0
                    ? 'bg-primary'
                    : index === 1
                      ? 'bg-auxiliary-yellow'
                      : index === 2
                        ? 'bg-auxiliary-orange'
                        : 'bg-primary'
                "
              ></div>

              <!-- 图标和标签 -->
              <div class="flex items-center justify-between mb-4 relative z-10">
                <div
                  class="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  :class="
                    index === 0
                      ? 'bg-primary/10 text-primary'
                      : index === 1
                        ? 'bg-auxiliary-yellow/30 text-auxiliary-orange'
                        : index === 2
                          ? 'bg-auxiliary-orange/20 text-auxiliary-orange'
                          : 'bg-primary/10 text-primary'
                  "
                >
                  <component
                    :is="
                      index === 0
                        ? Bot
                        : index === 1
                          ? BarChart3
                          : index === 2
                            ? Target
                            : TrendingUp
                    "
                    :size="24"
                  />
                </div>
                <span
                  class="px-3 py-1 text-[10px] font-bold rounded-full"
                  :class="
                    index === 0
                      ? 'bg-primary/10 text-primary'
                      : index === 1
                        ? 'bg-auxiliary-yellow/50 text-neutral-title'
                        : index === 2
                          ? 'bg-auxiliary-orange/20 text-auxiliary-orange'
                          : 'bg-primary/10 text-primary'
                  "
                >
                  {{ card.tag }}
                </span>
              </div>

              <!-- 标题 -->
              <div class="mb-3 relative z-10">
                <h3
                  class="text-lg font-bold text-neutral-title group-hover:text-primary transition-colors"
                >
                  {{ card.title }}
                </h3>
                <p
                  class="text-xs text-neutral-helper uppercase tracking-wider mt-1"
                >
                  {{ card.subtitle }}
                </p>
              </div>

              <!-- 描述 -->
              <p
                class="text-sm text-neutral-body leading-relaxed relative z-10"
              >
                {{ card.desc }}
              </p>

              <!-- 底部装饰线 -->
              <div
                class="mt-4 h-1 rounded-full w-12 transition-all duration-300 group-hover:w-full"
                :class="
                  index === 0
                    ? 'bg-primary'
                    : index === 1
                      ? 'bg-auxiliary-yellow'
                      : index === 2
                        ? 'bg-auxiliary-orange'
                        : 'bg-primary'
                "
              ></div>
            </div>
          </template>
        </div>

        <!-- User Reviews Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="(review, index) in userReviews"
            :key="index"
            class="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-border/30 group relative overflow-hidden"
          >
            <!-- 装饰元素 -->
            <div
              class="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
              :style="{
                background:
                  index === 0 ? '#95E0E1' : index === 1 ? '#FFEAC2' : '#FFC585',
              }"
            ></div>

            <!-- 用户信息 -->
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md"
              >
                <img
                  :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.name}`"
                  :alt="review.name"
                  class="w-full h-full"
                />
              </div>
              <div>
                <h4 class="font-bold text-neutral-title text-sm">
                  {{ review.name }}
                </h4>
                <p class="text-xs text-neutral-helper">{{ review.role }}</p>
              </div>
            </div>

            <!-- 星级评分 -->
            <div class="flex items-center gap-1 mb-3">
              <Star
                v-for="s in 5"
                :key="s"
                :size="14"
                :class="
                  s <= review.rating
                    ? 'text-auxiliary-orange fill-auxiliary-orange'
                    : 'text-neutral-border'
                "
              />
            </div>

            <!-- 评价内容 -->
            <p class="text-sm text-neutral-body leading-relaxed relative z-10">
              " {{ review.content }} "
            </p>

            <!-- 标签 -->
            <div class="mt-4 flex items-center gap-2">
              <span
                class="px-2 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded-full"
              >
                {{ review.tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Products & Services - Light Theme with Brand Colors -->
    <section
      id="product-service"
      class="py-24 relative overflow-hidden"
      style="
        background: linear-gradient(
          135deg,
          rgba(149, 224, 225, 0.15) 0%,
          rgba(255, 234, 194, 0.2) 50%,
          rgba(255, 197, 133, 0.15) 100%
        );
      "
    >
      <!-- Soft gradient background decoration -->
      <div class="absolute inset-0 z-0">
        <div
          class="absolute top-0 right-0 w-[60%] h-[60%] rounded-full blur-[120px]"
          style="background: rgba(149, 224, 225, 0.3)"
        ></div>
        <div
          class="absolute bottom-0 left-0 w-[50%] h-[50%] rounded-full blur-[100px]"
          style="background: rgba(255, 197, 133, 0.25)"
        ></div>
      </div>

      <div class="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-16">
        <div class="text-center space-y-4">
          <h2 class="text-4xl font-black tracking-tight" style="color: #1e293b">
            丰富、高效的产品及服务
          </h2>
          <!-- Service Tabs -->
          <div class="flex flex-wrap items-center justify-center gap-8 mt-8">
            <button
              v-for="service in services"
              :key="service"
              class="text-sm font-medium transition-all relative py-2"
              :class="
                activeService === service
                  ? 'text-[#18C5C7]'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              "
              @click="activeService = service"
            >
              {{ service }}
              <div
                v-if="activeService === service"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#18C5C7] rounded-full animate-in fade-in zoom-in duration-300"
              ></div>
            </button>
          </div>
        </div>

        <!-- Featured Service Card -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <!-- Side Card (Left) - 真实环境模拟 -->
          <div
            class="hidden lg:flex lg:col-span-3 flex-col justify-between p-6 rounded-3xl border"
            style="
              background: rgba(149, 224, 225, 0.25);
              border-color: rgba(149, 224, 225, 0.4);
            "
          >
            <div>
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style="background: rgba(149, 224, 225, 0.5)"
              >
                <Monitor :size="24" style="color: #1e293b" />
              </div>
              <h4 class="text-lg font-bold mb-2" style="color: #1e293b">
                真实环境模拟
              </h4>
              <p
                class="text-sm leading-relaxed mb-4"
                style="color: rgba(30, 41, 59, 0.7)"
              >
                1:1 还原大厂面试场景，支持视频/语音/文字多种交互模式
              </p>
            </div>
            <div class="space-y-2">
              <div
                class="flex items-center gap-2 text-xs"
                style="color: rgba(30, 41, 59, 0.8)"
              >
                <CheckCircle :size="14" style="color: #18c5c7" />
                <span>视频面试模拟</span>
              </div>
              <div
                class="flex items-center gap-2 text-xs"
                style="color: rgba(30, 41, 59, 0.8)"
              >
                <CheckCircle :size="14" style="color: #18c5c7" />
                <span>代码实时编辑</span>
              </div>
              <div
                class="flex items-center gap-2 text-xs"
                style="color: rgba(30, 41, 59, 0.8)"
              >
                <CheckCircle :size="14" style="color: #18c5c7" />
                <span>白板算法演练</span>
              </div>
            </div>
          </div>

          <!-- Center Card -->
          <div
            class="lg:col-span-6 p-10 rounded-[40px] shadow-2xl relative overflow-hidden group"
            style="
              background: linear-gradient(
                135deg,
                #95e0e1 0%,
                #ffeac2 50%,
                #ffc585 100%
              );
            "
          >
            <div class="relative z-10 space-y-6">
              <h3 class="text-3xl font-black" style="color: #1e293b">
                AI 面试管家专业版
              </h3>
              <p class="leading-relaxed" style="color: rgba(30, 41, 59, 0.8)">
                全流程 AI
                模拟面试，从自我介绍到项目深挖，从技术拷问到综合素质评估。我们提供
                7x24 小时在线面试官，随时随地开启练习，无需等待。
              </p>
              <button
                class="px-8 py-3 font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl"
                style="background: #1e293b; color: #ffffff"
              >
                立即开始练习
              </button>
            </div>
            <!-- Background Decoration -->
            <div
              class="absolute -right-10 -bottom-10 opacity-30 group-hover:scale-110 transition-transform duration-700"
              style="color: #1e293b"
            >
              <Bot :size="240" />
            </div>
          </div>

          <!-- Side Card (Right) - 能力洞察分析 -->
          <div
            class="hidden lg:flex lg:col-span-3 flex-col justify-between p-6 rounded-3xl border"
            style="
              background: rgba(255, 197, 133, 0.25);
              border-color: rgba(255, 197, 133, 0.4);
            "
          >
            <div>
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style="background: rgba(255, 197, 133, 0.5)"
              >
                <BarChart3 :size="24" style="color: #1e293b" />
              </div>
              <h4 class="text-lg font-bold mb-2" style="color: #1e293b">
                能力洞察分析
              </h4>
              <p
                class="text-sm leading-relaxed mb-4"
                style="color: rgba(30, 41, 59, 0.7)"
              >
                多维度 AI 评估体系，精准定位能力短板，生成个性化提升方案
              </p>
            </div>
            <div class="space-y-2">
              <div
                class="flex items-center gap-2 text-xs"
                style="color: rgba(30, 41, 59, 0.8)"
              >
                <CheckCircle :size="14" style="color: #ffc585" />
                <span>技术能力评估</span>
              </div>
              <div
                class="flex items-center gap-2 text-xs"
                style="color: rgba(30, 41, 59, 0.8)"
              >
                <CheckCircle :size="14" style="color: #ffc585" />
                <span>表达逻辑分析</span>
              </div>
              <div
                class="flex items-center gap-2 text-xs"
                style="color: rgba(30, 41, 59, 0.8)"
              >
                <CheckCircle :size="14" style="color: #ffc585" />
                <span>非言语行为检测</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. News Section -->
    <section id="platform-news" class="py-24 px-6 md:px-12 bg-white">
      <div class="max-w-7xl mx-auto space-y-16">
        <div
          class="flex items-end justify-between border-b border-neutral-border pb-8"
        >
          <div class="space-y-2">
            <h2 class="text-4xl font-black text-neutral-title tracking-tight">
              平台动态
            </h2>
            <p class="text-neutral-helper text-sm uppercase tracking-widest">
              News & Updates
            </p>
          </div>
          <button
            class="text-primary font-bold text-sm hover:underline flex items-center gap-1"
          >
            查看更多 <ChevronRight :size="16" />
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <!-- Featured News -->
          <div class="lg:col-span-7 group cursor-pointer">
            <div
              class="aspect-[16/9] rounded-[32px] overflow-hidden relative mb-6 shadow-sm border border-neutral-border/30"
              style="
                background: linear-gradient(135deg, #95e0e1 0%, #ffeac2 100%);
              "
            >
              <!-- 使用与页面配色相符的渐变背景代替图片 -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <div
                    class="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                    style="background: rgba(255, 255, 255, 0.4)"
                  >
                    <Award :size="40" style="color: #1e293b" />
                  </div>
                  <p class="text-lg font-bold" style="color: #1e293b">
                    行业认可
                  </p>
                </div>
              </div>
              <!-- 柔和渐变遮罩，从透明到半透明白色 -->
              <div
                class="absolute inset-0"
                style="
                  background: linear-gradient(
                    to top,
                    rgba(255, 255, 255, 0.85) 0%,
                    rgba(255, 255, 255, 0.4) 40%,
                    transparent 100%
                  );
                "
              ></div>
              <!-- 文字区域 -->
              <div
                class="absolute bottom-8 left-8 right-8"
                style="color: #1e293b"
              >
                <span
                  class="px-3 py-1 text-[10px] font-bold rounded-full mb-3 inline-block uppercase"
                  style="background: #18c5c7; color: #ffffff"
                  >年度精选</span
                >
                <h3 class="text-2xl font-black mb-2 leading-tight">
                  xxxx 入选爱分析《云数据平台市场厂商》
                </h3>
                <p
                  class="text-sm line-clamp-1"
                  style="color: rgba(30, 41, 59, 0.7)"
                >
                  我们在面试数字化与人才评估领域的技术沉淀再次获得行业认可...
                </p>
              </div>
            </div>
          </div>

          <!-- News List -->
          <div class="lg:col-span-5 space-y-8">
            <div
              v-for="item in newsItems"
              :key="item.title"
              class="group flex gap-6 cursor-pointer border-b border-neutral-border pb-8 last:border-0 last:pb-0"
            >
              <div
                class="text-neutral-helper font-bold text-xs uppercase tracking-tighter w-24 pt-1"
              >
                {{ item.date }}
              </div>
              <div class="flex-1 space-y-2">
                <h4
                  class="text-base font-bold text-neutral-title group-hover:text-primary transition-colors leading-tight"
                >
                  {{ item.title }}
                </h4>
                <p
                  class="text-sm text-neutral-body line-clamp-2 leading-relaxed"
                >
                  {{ item.desc }}
                </p>
                <div
                  class="text-primary font-bold text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all"
                >
                  阅读全文 <ArrowRight :size="14" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. FAQ Section -->
    <section id="faq" class="py-24 px-6 md:px-12 bg-neutral-bg/30">
      <div class="max-w-4xl mx-auto space-y-12">
        <div class="text-center space-y-4">
          <h2 class="text-4xl font-black text-neutral-title tracking-tight">
            常见问题
          </h2>
          <p class="text-neutral-helper">关于 AI 面试的疑问，这里都有答案</p>
        </div>

        <div class="space-y-4">
          <div
            v-for="(faq, index) in faqItems"
            :key="index"
            class="bg-white rounded-2xl border border-neutral-border/50 p-6 hover:shadow-lg transition-all cursor-pointer group"
            @click="toggleFaq(index)"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <h3
                  class="text-base font-bold text-neutral-title group-hover:text-primary transition-colors mb-2"
                >
                  {{ faq.question }}
                </h3>
                <p
                  class="text-sm text-neutral-body leading-relaxed overflow-hidden transition-all duration-300"
                  :class="
                    faq.isOpen
                      ? 'max-h-40 opacity-100 mt-2'
                      : 'max-h-0 opacity-0'
                  "
                >
                  {{ faq.answer }}
                </p>
              </div>
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                :class="
                  faq.isOpen
                    ? 'bg-primary text-white rotate-180'
                    : 'bg-neutral-bg text-neutral-helper group-hover:bg-primary/10 group-hover:text-primary'
                "
              >
                <ChevronDown :size="18" />
              </div>
            </div>
          </div>
        </div>

        <div class="text-center pt-8">
          <p class="text-neutral-helper text-sm mb-4">还有其他问题？</p>
          <button
            class="px-6 py-3 bg-white border border-neutral-border rounded-xl font-bold text-neutral-title hover:border-primary hover:text-primary transition-all flex items-center gap-2 mx-auto"
          >
            <MessageCircle :size="18" />
            联系客服
          </button>
        </div>
      </div>
    </section>

    <!-- 7. Footer -->
    <footer
      class="bg-gradient-to-b from-primary to-primary-dark pt-24 pb-12 text-white relative overflow-hidden"
    >
      <!-- Background Wave Simulation -->
      <div
        class="absolute top-0 left-0 right-0 h-32 bg-white rounded-b-[100px] -translate-y-16"
      ></div>

      <div class="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20"
        >
          <!-- Footer Logo -->
          <div class="lg:col-span-2 space-y-6">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-xl"
              >
                <Bot :size="24" />
              </div>
              <span class="font-black text-3xl italic tracking-tighter"
                >面面俱到</span
              >
            </div>
            <p class="text-white/60 text-sm leading-relaxed max-w-xs">
              助力每一位学子成就职场梦想。AI 驱动的面试数字化与人才评估平台。
            </p>
            <div class="flex items-center gap-4">
              <div
                v-for="channel in footerChannels"
                :key="channel.name"
                class="w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer hover:scale-110 group"
                style="background-color: #26bfbf"
                :title="channel.name"
                @click="handleChannelClick(channel)"
              >
                <component
                  :is="channel.icon"
                  :size="24"
                  class="text-white group-hover:text-[#FFC585] transition-colors"
                />
              </div>
            </div>
          </div>

          <!-- Links Columns -->
          <div
            v-for="col in [
              {
                title: '快速入口',
                links: ['面试实战', '岗位匹配', '能力提升', '面试社区'],
              },
              {
                title: '解决方案',
                links: ['应届生求职', '大厂跳槽', '简历押题', '综合能力评估'],
              },
              {
                title: '关于我们',
                links: ['平台愿景', '联系合作', '隐私政策', '服务条款'],
              },
            ]"
            :key="col.title"
            class="space-y-6"
          >
            <h4 class="font-bold text-lg" style="color: #ffffff">
              {{ col.title }}
            </h4>
            <ul class="space-y-4">
              <li v-for="link in col.links" :key="link">
                <a
                  href="#"
                  class="text-sm transition-colors"
                  style="color: #e0f7fa"
                  onmouseover="this.style.color = '#FFFFFF'"
                  onmouseout="this.style.color = '#E0F7FA'"
                  >{{ link }}</a
                >
              </li>
            </ul>
          </div>
        </div>

        <div
          class="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs"
          style="color: #b2ebf2"
        >
          <p>© 2026 面面俱到 版权所有</p>
          <div class="flex items-center gap-6">
            <a
              href="#"
              class="transition-colors hover:text-white"
              style="color: #b2ebf2"
              >隐私权政策</a
            >
            <a
              href="#"
              class="transition-colors hover:text-white"
              style="color: #b2ebf2"
              >法律协议</a
            >
            <a
              href="#"
              class="transition-colors hover:text-white"
              style="color: #b2ebf2"
              >粤ICP备20240301号</a
            >
          </div>
        </div>
      </div>
    </footer>

    <!-- 二维码弹窗 -->
    <Transition name="fade">
      <div
        v-if="activeQr"
        class="fixed inset-0 z-[200] flex items-center justify-center p-6"
      >
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="activeQr = null"
        ></div>
        <div
          class="relative bg-white p-8 rounded-[32px] shadow-2xl w-full max-w-sm text-center animate-in zoom-in duration-300"
        >
          <button
            class="absolute top-4 right-4 p-2 hover:bg-neutral-bg rounded-full transition-colors text-neutral-helper"
            @click="activeQr = null"
          >
            <X :size="20" />
          </button>
          <div class="space-y-6">
            <h3 class="text-xl font-bold text-neutral-title">
              扫描二维码关注{{ activeQr }}
            </h3>
            <div
              class="aspect-square bg-neutral-bg rounded-2xl flex items-center justify-center border-2 border-primary/10"
            >
              <QrCode :size="160" class="text-primary opacity-20" />
              <!-- 这里模拟二维码图片 -->
              <div class="absolute text-xs text-neutral-helper font-medium">
                二维码占位图
              </div>
            </div>
            <p class="text-sm text-neutral-body leading-relaxed">
              打开手机微信，扫描上方二维码<br />
              即可关注我们的官方渠道
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Hero Background Styles */
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1000px;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.gradient-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  /* 
   * 110度对角线渐变：青蓝色主导左侧/顶部，暖橙色主导右侧/底部
   * 使用多层radial-gradient叠加实现弥散晕染效果
   */
  background:
    /* 第一层：青蓝色 #95E0E1 - 主导左上角区域 */
    radial-gradient(
      ellipse 80% 70% at 5% 10%,
      rgba(149, 224, 225, 0.9) 0%,
      transparent 60%
    ),
    /* 第二层：青蓝色扩展 - 覆盖左上半部分 */
    radial-gradient(
        ellipse 70% 60% at 20% 25%,
        rgba(149, 224, 225, 0.7) 0%,
        transparent 55%
      ),
    /* 第三层：浅米黄色 #FFEAC2 - 中间过渡区域 */
    radial-gradient(
        ellipse 65% 55% at 40% 40%,
        rgba(255, 234, 194, 0.8) 0%,
        transparent 50%
      ),
    /* 第四层：浅米黄色扩展 - 中右过渡 */
    radial-gradient(
        ellipse 60% 50% at 55% 55%,
        rgba(255, 234, 194, 0.6) 0%,
        transparent 50%
      ),
    /* 第五层：暖橙色 #FFC585 - 主导右下角 */
    radial-gradient(
        ellipse 75% 65% at 80% 75%,
        rgba(255, 197, 133, 0.85) 0%,
        transparent 60%
      ),
    /* 第六层：暖橙色补充 - 右下角边缘 */
    radial-gradient(
        ellipse 60% 55% at 90% 90%,
        rgba(255, 197, 133, 0.6) 0%,
        transparent 50%
      );
  filter: blur(80px);
}

/* Smooth fade to white at bottom - 与下方白色背景平滑融合 */
.gradient-layer::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 400px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.15) 20%,
    rgba(255, 255, 255, 0.4) 40%,
    rgba(255, 255, 255, 0.7) 60%,
    rgba(255, 255, 255, 0.9) 80%,
    rgba(255, 255, 255, 1) 100%
  );
}

.noise-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.025;
}

.gradient-primary {
  background: var(--background-gradient-primary);
}

.animate-in {
  animation-fill-mode: forwards;
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoom-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.slide-in-from-left-12 {
  animation: slide-in-left 1s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-in-from-right-12 {
  animation: slide-in-right 1s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-in {
  animation: fade-in 1s ease-out;
}
.zoom-in {
  animation: zoom-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Fade Transition for Modals */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
