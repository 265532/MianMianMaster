<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import {
  Gamepad2,
  Trophy,
  Zap,
  Brain,
  Target,
  CheckCircle,
  Star,
  BarChart3,
  Users,
  Clock,
  Award as AwardIcon,
  Settings,
  HelpCircle,
  Volume2,
  VolumeX,
  X,
  Briefcase,
  Building,
  User,
} from "lucide-vue-next";
import { useInterviewStore } from "@/stores/interview";

const router = useRouter();
const interviewStore = useInterviewStore();
const { gameLevels, gameStats, gameAchievements, leaderboard, loading } =
  storeToRefs(interviewStore);

interface Certification {
  id: number;
  name: string;
  status: string;
  level: number;
  description: string;
  icon: any;
  skills: string[];
  date: string | null;
  progress: number;
  condition: string;
}

const certifications = ref<Certification[]>([]);

const activeTab = ref("levels");

interface StatItem {
  label: string
  value: string | number | undefined
  icon: any
  color: string
}

const statItems = computed<StatItem[]>(() =>
  gameStats.value
    ? [
        { label: '已完成关卡', value: gameStats.value.completedLevels, icon: Trophy, color: 'text-auxiliary-orange' },
        { label: '总面试次数', value: gameStats.value.totalQuestions, icon: Users, color: 'text-primary' },
        { label: '成功率', value: gameStats.value.correctRate, icon: CheckCircle, color: 'text-auxiliary-green' },
        { label: '总游戏时间', value: gameStats.value.streak, icon: Clock, color: 'text-auxiliary-blue' },
      ]
    : [],
)
const isLeaderboardOpen = ref(false);
const isSettingsOpen = ref(false);
const isHelpOpen = ref(false);
const isAchievementDetailOpen = ref(false);
const isCertificationDetailOpen = ref(false);

interface Achievement {
  id: number;
  name: string;
  description: string;
  unlocked: boolean;
  icon: any;
  points: number;
  date: string | null;
  rarity: string;
  condition: string;
}

const selectedAchievement = ref<Achievement | null>(null);
const selectedCertification = ref<Certification | null>(null);
const currentVolume = ref(70);
const soundEnabled = ref(true);

const startLevel = (levelId: number) => {
  router.push(`/game-interview/level/${levelId}/detail`);
};

const startGame = () => {
  const firstUnlockedLevel = gameLevels.value.find(
    (level) => level.status === "已解锁" || level.status === "unlocked",
  );
  if (firstUnlockedLevel) {
    router.push(`/game-interview/level/${firstUnlockedLevel.id}/detail`);
  }
};

const toggleLeaderboard = () => {
  isLeaderboardOpen.value = !isLeaderboardOpen.value;
};

const toggleSettings = () => {
  isSettingsOpen.value = !isSettingsOpen.value;
};

const toggleHelp = () => {
  isHelpOpen.value = !isHelpOpen.value;
};

const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value;
};

const adjustVolume = (value: number) => {
  currentVolume.value = value;
};

const viewAchievementDetail = (achievement: Achievement) => {
  selectedAchievement.value = achievement;
  isAchievementDetailOpen.value = true;
};

const viewCertificationDetail = (cert: Certification) => {
  selectedCertification.value = cert;
  isCertificationDetailOpen.value = true;
};

const closeAchievementDetail = () => {
  isAchievementDetailOpen.value = false;
  selectedAchievement.value = null;
};

const closeCertificationDetail = () => {
  isCertificationDetailOpen.value = false;
  selectedCertification.value = null;
};

onMounted(async () => {
  await interviewStore.fetchAllGameData();
});
</script>

<template>
  <div class="flex flex-col gap-8 max-w-7xl mx-auto">
    <!-- Hero: Game-based Interview -->
    <div
      class="gradient-primary p-10 rounded-[40px] text-white relative overflow-hidden shadow-xl"
    >
      <div class="relative z-10 max-w-2xl">
        <h1 class="text-4xl font-black mb-4">游戏式面试</h1>
        <p class="text-white/80 mb-8 text-lg">
          通过闯关模式，让面试准备变得更加有趣和有效。每完成一个关卡，你将获得相应的技能认证。
        </p>
        <div class="flex flex-wrap gap-4">
          <button
            class="px-8 py-4 bg-white text-primary font-bold rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            @click="startGame"
          >
            <Gamepad2 :size="20" />
            开始游戏闯关
          </button>
          <button
            class="px-8 py-4 bg-white/20 backdrop-blur-md text-white font-bold rounded-2xl hover:bg-white/30 transition-all flex items-center gap-2"
            @click="toggleLeaderboard"
          >
            <Users :size="20" />
            查看排行榜
          </button>
          <button
            class="px-8 py-4 bg-white/20 backdrop-blur-md text-white font-bold rounded-2xl hover:bg-white/30 transition-all flex items-center gap-2"
            @click="toggleSettings"
          >
            <Settings :size="20" />
            设置
          </button>
          <button
            class="px-8 py-4 bg-white/20 backdrop-blur-md text-white font-bold rounded-2xl hover:bg-white/30 transition-all flex items-center gap-2"
            @click="toggleHelp"
          >
            <HelpCircle :size="20" />
            帮助
          </button>
        </div>
      </div>
      <div class="absolute -right-20 -bottom-20 opacity-10">
        <Gamepad2 :size="320" />
      </div>
    </div>

    <!-- Game Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="stat in statItems"
        :key="stat.label"
        class="bg-white p-8 rounded-[24px] shadow-sm border border-neutral-border flex flex-col items-center justify-center gap-4 group hover:shadow-md transition-all"
      >
        <component
          :is="stat.icon"
          :size="32"
          :class="stat.color"
          class="group-hover:scale-110 transition-transform"
        />
        <div class="text-center">
          <p class="text-3xl font-black text-neutral-title">{{ stat.value }}</p>
          <p class="text-xs text-neutral-helper uppercase font-bold mt-1">
            {{ stat.label }}
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content Tabs -->
    <div
      class="bg-white rounded-[32px] shadow-sm border border-neutral-border overflow-hidden"
    >
      <!-- Tab Navigation -->
      <div class="flex border-b border-neutral-border">
        <button
          class="flex-1 py-4 px-6 font-bold transition-all"
          :class="
            activeTab === 'levels'
              ? 'text-primary border-b-2 border-primary'
              : 'text-neutral-helper hover:text-neutral-title'
          "
          @click="activeTab = 'levels'"
        >
          闯关模式
        </button>
        <button
          class="flex-1 py-4 px-6 font-bold transition-all"
          :class="
            activeTab === 'achievements'
              ? 'text-primary border-b-2 border-primary'
              : 'text-neutral-helper hover:text-neutral-title'
          "
          @click="activeTab = 'achievements'"
        >
          成就系统
        </button>
        <button
          class="flex-1 py-4 px-6 font-bold transition-all"
          :class="
            activeTab === 'certifications'
              ? 'text-primary border-b-2 border-primary'
              : 'text-neutral-helper hover:text-neutral-title'
          "
          @click="activeTab = 'certifications'"
        >
          技能认证
        </button>
      </div>

      <!-- Tab Content -->
      <div class="p-8">
        <!-- Levels Tab -->
        <div v-if="activeTab === 'levels'" class="space-y-6">
          <div
            v-for="level in gameLevels"
            :key="level.id"
            class="p-6 rounded-[24px] relative overflow-hidden group hover:shadow-md transition-all border border-transparent hover:border-neutral-border"
            :class="level.background"
          >
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <p class="text-[10px] font-bold text-primary uppercase">
                    {{ level.name }}
                  </p>
                  <span
                    v-if="level.status === '已解锁'"
                    class="px-2 py-1 bg-auxiliary-green/10 text-auxiliary-green text-[10px] font-bold rounded-full"
                    >已解锁</span
                  >
                  <span
                    v-else
                    class="px-2 py-1 bg-neutral-border/50 text-neutral-helper text-[10px] font-bold rounded-full"
                    >未解锁</span
                  >
                </div>
                <h4 class="font-bold text-neutral-title mb-2">
                  {{ level.title }}
                </h4>
                <p class="text-sm text-neutral-helper mb-4">
                  {{ level.description }}
                </p>
              </div>
              <div
                class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:gradient-primary group-hover:text-white transition-all"
              >
                <span class="text-2xl">{{ level.icon }}</span>
              </div>
            </div>

            <!-- 面试场景信息 -->
            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4"
            >
              <div class="flex items-center gap-2">
                <Building :size="16" class="text-neutral-helper" />
                <div>
                  <div class="text-xs text-neutral-helper">公司</div>
                  <div class="text-sm font-bold text-neutral-title">
                    {{ level.公司 }}
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Briefcase :size="16" class="text-neutral-helper" />
                <div>
                  <div class="text-xs text-neutral-helper">面试类型</div>
                  <div class="text-sm font-bold text-neutral-title">
                    {{ level.面试类型 }}
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <User :size="16" class="text-neutral-helper" />
                <div>
                  <div class="text-xs text-neutral-helper">面试官</div>
                  <div class="text-sm font-bold text-neutral-title">
                    {{ level.面试官 }}
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Trophy :size="16" class="text-neutral-helper" />
                <div>
                  <div class="text-xs text-neutral-helper">难度</div>
                  <div class="text-sm font-bold text-neutral-title">
                    {{ level.难度 }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 进度信息 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <div
                  class="flex justify-between text-xs text-neutral-helper mb-1"
                >
                  <span>进度</span>
                  <span>{{ level.progress }}%</span>
                </div>
                <div class="h-2 bg-white rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary transition-all duration-1000"
                    :style="{ width: level.progress + '%' }"
                  ></div>
                </div>
              </div>
              <div>
                <div class="text-xs text-neutral-helper mb-1">面试进度</div>
                <div class="text-sm font-bold text-neutral-title">
                  {{ level.completed }}/{{ level.interviews }} 次
                </div>
              </div>
              <div>
                <div class="text-xs text-neutral-helper mb-1">成功率</div>
                <div class="text-sm font-bold text-neutral-title">
                  {{ level.successRate }}
                </div>
              </div>
            </div>

            <!-- 其他信息 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <div class="text-xs text-neutral-helper mb-1">问题数量</div>
                <div class="text-sm font-bold text-neutral-title">
                  {{ level.问题数量 }} 题
                </div>
              </div>
              <div>
                <div class="text-xs text-neutral-helper mb-1">时间限制</div>
                <div class="text-sm font-bold text-neutral-title">
                  {{ level.时间限制 }} 分钟
                </div>
              </div>
              <div>
                <div class="text-xs text-neutral-helper mb-1">奖励</div>
                <div class="text-sm font-bold text-neutral-title">
                  {{ level.奖励 }}
                </div>
              </div>
            </div>

            <!-- 技能标签 -->
            <div class="mb-4">
              <div class="text-xs text-neutral-helper mb-2">关键技能</div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(skill, index) in level.skills"
                  :key="index"
                  class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full"
                >
                  {{ skill }}
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between mb-4">
              <div class="text-xs text-neutral-helper">
                用时: {{ level.timeSpent }}
              </div>
            </div>

            <div class="flex justify-end">
              <button
                class="px-6 py-2 rounded-xl font-bold text-sm transition-all"
                :class="
                  level.status === '已解锁'
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'bg-neutral-border text-neutral-helper cursor-not-allowed'
                "
                @click="startLevel(level.id)"
              >
                {{ level.status === "已解锁" ? "开始面试" : "未解锁" }}
              </button>
            </div>
          </div>
        </div>

        <!-- Achievements Tab -->
        <div v-if="activeTab === 'achievements'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="achievement in gameAchievements"
              :key="achievement.id"
              class="p-6 rounded-[24px] relative overflow-hidden group hover:shadow-md transition-all border border-transparent hover:border-neutral-border cursor-pointer"
              :class="
                achievement.unlocked ? achievement.color : 'bg-neutral-bg'
              "
              @click="viewAchievementDetail(achievement)"
            >
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform"
                :class="
                  achievement.unlocked
                    ? 'bg-white text-primary group-hover:gradient-primary group-hover:text-white animate-' +
                      achievement.animation
                    : 'bg-neutral-border text-neutral-helper'
                "
              >
                <component :is="achievement.icon" :size="24" />
              </div>
              <h3 class="font-bold text-neutral-title mb-1">
                {{ achievement.name }}
              </h3>
              <p class="text-sm text-neutral-helper mb-4">
                {{ achievement.description }}
              </p>
              <div class="flex items-center justify-between mt-auto">
                <div class="flex items-center gap-2">
                  <span
                    class="text-xs font-bold"
                    :class="
                      achievement.unlocked
                        ? 'text-auxiliary-green'
                        : 'text-neutral-helper'
                    "
                    >{{ achievement.unlocked ? "已获得" : "未获得" }}</span
                  >
                  <span
                    class="text-xs font-bold px-2 py-1 rounded-full"
                    :class="
                      achievement.rarity === 'common'
                        ? 'bg-gray-200 text-gray-700'
                        : achievement.rarity === 'uncommon'
                          ? 'bg-blue-200 text-blue-700'
                          : achievement.rarity === 'rare'
                            ? 'bg-purple-200 text-purple-700'
                            : achievement.rarity === 'epic'
                              ? 'bg-pink-200 text-pink-700'
                              : 'bg-orange-200 text-orange-700'
                    "
                  >
                    {{
                      achievement.rarity === "common"
                        ? "普通"
                        : achievement.rarity === "uncommon"
                          ? "优秀"
                          : achievement.rarity === "rare"
                            ? "稀有"
                            : achievement.rarity === "epic"
                              ? "史诗"
                              : "传说"
                    }}
                  </span>
                </div>
                <div class="flex items-center gap-1">
                  <Star :size="14" class="text-yellow-400" />
                  <span class="text-xs font-bold text-neutral-title">{{
                    achievement.points
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Certifications Tab -->
        <div v-if="activeTab === 'certifications'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="cert in certifications"
              :key="cert.id"
              class="p-6 rounded-[24px] relative overflow-hidden group hover:shadow-md transition-all border border-transparent hover:border-neutral-border cursor-pointer"
              :class="cert.status === '已认证' ? cert.color : 'bg-neutral-bg'"
              @click="viewCertificationDetail(cert)"
            >
              <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform"
                :class="
                  cert.status === '已认证'
                    ? 'bg-white text-primary group-hover:gradient-primary group-hover:text-white'
                    : 'bg-neutral-border text-neutral-helper'
                "
              >
                <span class="text-2xl">{{ cert.badge }}</span>
              </div>
              <h3 class="font-bold text-neutral-title mb-1">{{ cert.name }}</h3>
              <p class="text-sm text-neutral-helper mb-4">
                {{ cert.description }}
              </p>
              <div class="mb-3">
                <div
                  class="w-full h-2 bg-neutral-border rounded-full overflow-hidden"
                >
                  <div
                    class="h-full bg-primary transition-all duration-1000"
                    :style="{ width: cert.progress + '%' }"
                  ></div>
                </div>
                <div class="flex justify-between mt-1">
                  <span class="text-xs text-neutral-helper">0%</span>
                  <span class="text-xs font-bold text-neutral-title"
                    >{{ cert.progress }}%</span
                  >
                  <span class="text-xs text-neutral-helper">100%</span>
                </div>
              </div>
              <div class="flex items-center justify-between mt-auto">
                <span
                  class="text-xs font-bold"
                  :class="
                    cert.status === '已认证'
                      ? 'text-auxiliary-green'
                      : cert.status === '进行中'
                        ? 'text-primary'
                        : 'text-neutral-helper'
                  "
                  >{{ cert.status }}</span
                >
                <span class="text-xs font-bold text-neutral-title"
                  >等级 {{ cert.level }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Leaderboard Modal -->
    <div
      v-if="isLeaderboardOpen"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-[32px] w-full max-w-2xl max-h-[80vh] overflow-y-auto"
      >
        <div
          class="p-8 border-b border-neutral-border flex justify-between items-center"
        >
          <h3
            class="text-xl font-bold text-neutral-title flex items-center gap-2"
          >
            <Users :size="24" class="text-primary" />
            排行榜
          </h3>
          <button
            class="p-2 text-neutral-helper hover:text-neutral-title"
            @click="toggleLeaderboard"
          >
            <X :size="24" />
          </button>
        </div>
        <div class="p-8">
          <div class="space-y-4">
            <div
              v-for="item in leaderboard"
              :key="item.rank"
              class="flex items-center justify-between p-4 rounded-[20px]"
              :class="
                item.name === '王同学'
                  ? 'bg-primary/10 border border-primary/20'
                  : 'bg-neutral-bg'
              "
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                  :class="
                    item.rank <= 3
                      ? 'bg-auxiliary-orange text-white'
                      : 'bg-neutral-border text-neutral-helper'
                  "
                >
                  {{ item.rank }}
                </div>
                <div class="text-2xl">{{ item.avatar }}</div>
                <div>
                  <h4 class="font-bold text-neutral-title">{{ item.name }}</h4>
                  <div class="flex flex-wrap gap-2 text-xs text-neutral-helper">
                    <span>关卡 {{ item.level }}</span>
                    <span>•</span>
                    <span>已完成 {{ item.completedLevels }} 关</span>
                    <span>•</span>
                    <span>成功率 {{ item.successRate }}</span>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <p class="font-black text-neutral-title text-xl">
                  {{ item.score }}
                </p>
                <p class="text-xs text-neutral-helper">积分</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <div
      v-if="isSettingsOpen"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-[32px] w-full max-w-md">
        <div
          class="p-8 border-b border-neutral-border flex justify-between items-center"
        >
          <h3
            class="text-xl font-bold text-neutral-title flex items-center gap-2"
          >
            <Settings :size="24" class="text-primary" />
            设置
          </h3>
          <button
            class="p-2 text-neutral-helper hover:text-neutral-title"
            @click="toggleSettings"
          >
            <X :size="24" />
          </button>
        </div>
        <div class="p-8 space-y-6">
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-sm font-bold text-neutral-title">音效</label>
              <button
                class="p-2 rounded-full"
                :class="
                  soundEnabled
                    ? 'bg-primary/10 text-primary'
                    : 'bg-neutral-border text-neutral-helper'
                "
                @click="toggleSound"
              >
                <Volume2 v-if="soundEnabled" :size="20" />
                <VolumeX v-else :size="20" />
              </button>
            </div>
            <div v-if="soundEnabled" class="flex items-center gap-2">
              <input
                v-model.number="currentVolume"
                type="range"
                min="0"
                max="100"
                class="flex-1 h-2 bg-neutral-border rounded-full appearance-none cursor-pointer"
                @input="adjustVolume(currentVolume)"
              />
              <span
                class="text-sm font-bold text-neutral-title w-10 text-center"
                >{{ currentVolume }}%</span
              >
            </div>
          </div>
          <div>
            <label class="text-sm font-bold text-neutral-title block mb-2"
              >难度设置</label
            >
            <div class="flex gap-2">
              <button
                class="flex-1 py-2 rounded-xl font-bold text-sm bg-primary text-white"
              >
                简单
              </button>
              <button
                class="flex-1 py-2 rounded-xl font-bold text-sm bg-neutral-bg text-neutral-title"
              >
                中等
              </button>
              <button
                class="flex-1 py-2 rounded-xl font-bold text-sm bg-neutral-bg text-neutral-title"
              >
                困难
              </button>
            </div>
          </div>
          <div>
            <label class="text-sm font-bold text-neutral-title block mb-2"
              >通知设置</label
            >
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm text-neutral-body">关卡解锁通知</span>
                <input
                  type="checkbox"
                  checked
                  class="w-5 h-5 rounded-full border-2 border-primary bg-primary text-white"
                />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-neutral-body">成就获得通知</span>
                <input
                  type="checkbox"
                  checked
                  class="w-5 h-5 rounded-full border-2 border-primary bg-primary text-white"
                />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-neutral-body">排行榜更新通知</span>
                <input
                  type="checkbox"
                  class="w-5 h-5 rounded-full border-2 border-neutral-border"
                />
              </div>
            </div>
          </div>
          <div>
            <label class="text-sm font-bold text-neutral-title block mb-2"
              >语言设置</label
            >
            <div class="flex gap-2">
              <button
                class="flex-1 py-2 rounded-xl font-bold text-sm bg-primary text-white"
              >
                中文
              </button>
              <button
                class="flex-1 py-2 rounded-xl font-bold text-sm bg-neutral-bg text-neutral-title"
              >
                英文
              </button>
            </div>
          </div>
          <div>
            <label class="text-sm font-bold text-neutral-title block mb-2"
              >主题设置</label
            >
            <div class="flex gap-2">
              <button
                class="flex-1 py-2 rounded-xl font-bold text-sm bg-primary text-white"
              >
                浅色
              </button>
              <button
                class="flex-1 py-2 rounded-xl font-bold text-sm bg-neutral-bg text-neutral-title"
              >
                深色
              </button>
            </div>
          </div>
          <div>
            <label class="text-sm font-bold text-neutral-title block mb-2"
              >数据设置</label
            >
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm text-neutral-body">自动保存进度</span>
                <input
                  type="checkbox"
                  checked
                  class="w-5 h-5 rounded-full border-2 border-primary bg-primary text-white"
                />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-neutral-body">清除缓存</span>
                <button class="text-sm text-primary font-bold">清除</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Help Modal -->
    <div
      v-if="isHelpOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300"
      >
        <div
          class="p-8 border-b border-neutral-border flex justify-between items-center"
        >
          <h3
            class="text-2xl font-black text-neutral-title flex items-center gap-3"
          >
            <HelpCircle :size="28" class="text-primary" />
            游戏式面试帮助中心
          </h3>
          <button
            class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all"
            @click="toggleHelp"
          >
            <X :size="20" />
          </button>
        </div>
        <div class="p-8 space-y-6">
          <div
            class="p-6 bg-neutral-bg rounded-[20px] border border-neutral-border hover:border-primary/20 transition-all hover:shadow-md"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0"
              >
                1
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-neutral-title mb-2">
                  如何开始游戏？
                </h4>
                <p class="text-sm text-neutral-body">
                  点击首页的"开始游戏闯关"按钮，选择已解锁的关卡即可开始挑战。每个关卡都有不同的难度和挑战目标，模拟真实的面试场景。
                </p>
              </div>
            </div>
          </div>
          <div
            class="p-6 bg-neutral-bg rounded-[20px] border border-neutral-border hover:border-primary/20 transition-all hover:shadow-md"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0"
              >
                2
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-neutral-title mb-2">
                  如何获得成就？
                </h4>
                <p class="text-sm text-neutral-body">
                  完成特定的游戏目标，如连续答对10题、5分钟内完成10题、通过所有初级面试等，即可获得相应的成就。成就可以在成就系统页面查看详细信息。
                </p>
              </div>
            </div>
          </div>
          <div
            class="p-6 bg-neutral-bg rounded-[20px] border border-neutral-border hover:border-primary/20 transition-all hover:shadow-md"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0"
              >
                3
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-neutral-title mb-2">
                  如何解锁技能认证？
                </h4>
                <p class="text-sm text-neutral-body">
                  完成相应的关卡后，系统会自动解锁对应的技能认证，证明你的能力水平。技能认证可以在技能认证页面查看详细信息，包括认证等级和认证技能。
                </p>
              </div>
            </div>
          </div>
          <div
            class="p-6 bg-neutral-bg rounded-[20px] border border-neutral-border hover:border-primary/20 transition-all hover:shadow-md"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0"
              >
                4
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-neutral-title mb-2">
                  如何查看排行榜？
                </h4>
                <p class="text-sm text-neutral-body">
                  点击首页的"查看排行榜"按钮，即可查看所有用户的排名情况。排行榜显示用户的积分、关卡进度、成功率和总面试次数等信息。
                </p>
              </div>
            </div>
          </div>
          <div
            class="p-6 bg-neutral-bg rounded-[20px] border border-neutral-border hover:border-primary/20 transition-all hover:shadow-md"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0"
              >
                5
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-neutral-title mb-2">
                  如何提高面试成功率？
                </h4>
                <p class="text-sm text-neutral-body">
                  1. 充分准备常见面试问题<br />2.
                  练习回答技巧，注意逻辑和结构<br />3.
                  查看示例回答，学习优秀的回答方式<br />4. 多次练习，积累经验<br />5.
                  分析面试反馈，不断改进
                </p>
              </div>
            </div>
          </div>
          <div
            class="p-6 bg-neutral-bg rounded-[20px] border border-neutral-border hover:border-primary/20 transition-all hover:shadow-md"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0"
              >
                6
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-neutral-title mb-2">游戏积分规则</h4>
                <p class="text-sm text-neutral-body">
                  1. 完成面试关卡：+100积分<br />2. 答对问题：+10-30积分/题<br />3.
                  获得成就：+50-200积分/个<br />4.
                  排行榜排名奖励：+50-500积分/周<br />5. 连续登录：+10积分/天
                </p>
              </div>
            </div>
          </div>
          <div
            class="p-6 bg-neutral-bg rounded-[20px] border border-neutral-border hover:border-primary/20 transition-all hover:shadow-md"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0"
              >
                7
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-neutral-title mb-2">游戏难度设置</h4>
                <p class="text-sm text-neutral-body">
                  在设置页面可以调整游戏难度，包括简单、中等和困难三个级别。不同难度级别对应不同的问题数量、时间限制和评分标准。
                </p>
              </div>
            </div>
          </div>
          <div
            class="p-6 bg-neutral-bg rounded-[20px] border border-neutral-border hover:border-primary/20 transition-all hover:shadow-md"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0"
              >
                8
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-neutral-title mb-2">游戏数据保存</h4>
                <p class="text-sm text-neutral-body">
                  游戏进度会自动保存，包括已完成的关卡、获得的成就和技能认证等。你可以在设置页面查看和管理游戏数据。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Achievement Detail Modal -->
    <div
      v-if="isAchievementDetailOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-[32px] w-full max-w-md animate-in zoom-in-95 duration-300"
      >
        <div
          class="p-8 border-b border-neutral-border flex justify-between items-center"
        >
          <h3
            class="text-2xl font-black text-neutral-title flex items-center gap-3"
          >
            <Trophy :size="28" class="text-primary" />
            成就详情
          </h3>
          <button
            class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all"
            @click="closeAchievementDetail"
          >
            <X :size="20" />
          </button>
        </div>
        <div class="p-8 space-y-6">
          <div class="flex flex-col items-center">
            <div
              class="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg"
              :class="
                selectedAchievement?.unlocked
                  ? 'bg-white text-primary'
                  : 'bg-neutral-border text-neutral-helper'
              "
            >
              <component :is="selectedAchievement?.icon" :size="48" />
            </div>
            <h4 class="text-xl font-bold text-neutral-title mb-2">
              {{ selectedAchievement?.name }}
            </h4>
            <p class="text-sm text-neutral-helper mb-4 text-center">
              {{ selectedAchievement?.description }}
            </p>
            <div class="flex items-center gap-2">
              <span
                class="px-4 py-2 rounded-full text-sm font-bold"
                :class="
                  selectedAchievement?.unlocked
                    ? 'bg-auxiliary-green/10 text-auxiliary-green'
                    : 'bg-neutral-border/50 text-neutral-helper'
                "
              >
                {{ selectedAchievement?.unlocked ? "已获得" : "未获得" }}
              </span>
              <span
                class="px-4 py-2 rounded-full text-sm font-bold"
                :class="
                  selectedAchievement?.rarity === 'common'
                    ? 'bg-neutral-border/50 text-neutral-helper'
                    : selectedAchievement?.rarity === 'uncommon'
                      ? 'bg-primary/10 text-primary'
                      : selectedAchievement?.rarity === 'rare'
                        ? 'bg-auxiliary-orange/10 text-auxiliary-orange'
                        : selectedAchievement?.rarity === 'epic'
                          ? 'bg-auxiliary-purple/10 text-auxiliary-purple'
                          : 'bg-auxiliary-red/10 text-auxiliary-red'
                "
              >
                {{
                  selectedAchievement?.rarity === "common"
                    ? "普通"
                    : selectedAchievement?.rarity === "uncommon"
                      ? "优秀"
                      : selectedAchievement?.rarity === "rare"
                        ? "稀有"
                        : selectedAchievement?.rarity === "epic"
                          ? "史诗"
                          : "传说"
                }}
              </span>
            </div>
          </div>
          <div
            v-if="selectedAchievement?.unlocked"
            class="p-4 bg-neutral-bg rounded-[20px]"
          >
            <h5 class="font-bold text-neutral-title mb-2">获得时间</h5>
            <p class="text-sm text-neutral-body">
              {{ selectedAchievement?.date }} 14:30
            </p>
          </div>
          <div class="p-4 bg-neutral-bg rounded-[20px]">
            <h5 class="font-bold text-neutral-title mb-2">成就价值</h5>
            <p class="text-sm text-neutral-body">
              +{{ selectedAchievement?.points }} 积分
            </p>
          </div>
          <div class="p-4 bg-neutral-bg rounded-[20px]">
            <h5 class="font-bold text-neutral-title mb-2">获取条件</h5>
            <p class="text-sm text-neutral-body">
              {{ selectedAchievement?.condition }}
            </p>
          </div>
          <div class="p-4 bg-neutral-bg rounded-[20px]">
            <h5 class="font-bold text-neutral-title mb-2">进度</h5>
            <div
              class="w-full h-2 bg-neutral-border rounded-full overflow-hidden"
            >
              <div
                class="h-full bg-primary transition-all duration-1000"
                :style="{
                  width: selectedAchievement?.unlocked ? '100%' : '0%',
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Certification Detail Modal -->
    <div
      v-if="isCertificationDetailOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-[32px] w-full max-w-md animate-in zoom-in-95 duration-300"
      >
        <div
          class="p-8 border-b border-neutral-border flex justify-between items-center"
        >
          <h3
            class="text-2xl font-black text-neutral-title flex items-center gap-3"
          >
            <AwardIcon :size="28" class="text-primary" />
            技能认证详情
          </h3>
          <button
            class="w-10 h-10 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-helper hover:bg-primary/10 hover:text-primary transition-all"
            @click="closeCertificationDetail"
          >
            <X :size="20" />
          </button>
        </div>
        <div class="p-8 space-y-6">
          <div class="flex flex-col items-center">
            <div
              class="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg"
              :class="
                selectedCertification?.status === '已认证'
                  ? 'bg-white text-primary'
                  : 'bg-neutral-border text-neutral-helper'
              "
            >
              <component :is="selectedCertification?.icon" :size="48" />
            </div>
            <h4 class="text-xl font-bold text-neutral-title mb-2">
              {{ selectedCertification?.name }}
            </h4>
            <p class="text-sm text-neutral-helper mb-4 text-center">
              {{ selectedCertification?.description }}
            </p>
            <span
              class="px-4 py-2 rounded-full text-sm font-bold"
              :class="
                selectedCertification?.status === '已认证'
                  ? 'bg-auxiliary-green/10 text-auxiliary-green'
                  : selectedCertification?.status === '进行中'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-neutral-border/50 text-neutral-helper'
              "
            >
              {{ selectedCertification?.status }}
            </span>
          </div>
          <div
            v-if="selectedCertification?.status === '已认证'"
            class="p-4 bg-neutral-bg rounded-[20px]"
          >
            <h5 class="font-bold text-neutral-title mb-2">认证时间</h5>
            <p class="text-sm text-neutral-body">
              {{ selectedCertification?.date }} 14:30
            </p>
          </div>
          <div class="p-4 bg-neutral-bg rounded-[20px]">
            <h5 class="font-bold text-neutral-title mb-2">认证等级</h5>
            <p class="text-sm text-neutral-body">
              等级 {{ selectedCertification?.level }}
            </p>
          </div>
          <div class="p-4 bg-neutral-bg rounded-[20px]">
            <h5 class="font-bold text-neutral-title mb-2">认证技能</h5>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(skill, index) in selectedCertification?.skills"
                :key="index"
                class="px-3 py-1 bg-primary/10 rounded-full text-xs font-bold text-primary"
              >
                {{ skill }}
              </span>
            </div>
          </div>
          <div class="p-4 bg-neutral-bg rounded-[20px]">
            <h5 class="font-bold text-neutral-title mb-2">获取条件</h5>
            <p class="text-sm text-neutral-body">
              {{ selectedCertification?.condition }}
            </p>
          </div>
          <div class="p-4 bg-neutral-bg rounded-[20px]">
            <h5 class="font-bold text-neutral-title mb-2">进度</h5>
            <div
              class="w-full h-2 bg-neutral-border rounded-full overflow-hidden"
            >
              <div
                class="h-full bg-primary transition-all duration-1000"
                :style="{ width: selectedCertification?.progress + '%' }"
              ></div>
            </div>
            <div class="flex justify-between mt-1">
              <span class="text-xs text-neutral-helper">0%</span>
              <span class="text-xs text-neutral-helper"
                >{{ selectedCertification?.progress }}%</span
              >
              <span class="text-xs text-neutral-helper">100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义滑块样式 */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #18c5c7;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #18c5c7;
  cursor: pointer;
  border: none;
}
</style>
