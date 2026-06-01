<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Bot,
  UserCircle,
  TrendingUp,
  MessageSquare,
  Award,
  Bell,
  Search,
  Target,
  Zap,
  BookOpen,
  Gamepad2,
  LogIn,
} from "lucide-vue-next";
import { useUserStore } from "./stores/user";
import { useAuth } from "./composables/useAuth";
import { useErrorBoundary } from "./composables/useErrorBoundary";
import { useCrossTabSync } from "./composables/useCrossTabSync";

useErrorBoundary({
  handler: (err, _instance, info) => {
    console.error("[App ErrorBoundary]", err, info);
  },
});

useCrossTabSync();

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const { isAuthenticated, logout } = useAuth();
const isSidebarOpen = ref(true);
const isMobileMenuOpen = ref(false);

const navItems = [
  { name: "面试实战", path: "/interview", icon: Zap },
  { name: "游戏式面试", path: "/game-interview", icon: Gamepad2 },
  { name: "岗位匹配", path: "/matching", icon: Target },
  { name: "能力提升", path: "/growth", icon: TrendingUp },
  { name: "面试社区", path: "/community", icon: MessageSquare },
  { name: "知识库", path: "/knowledge", icon: BookOpen },
  { name: "个人中心", path: "/profile", icon: UserCircle },
];

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const navigateTo = (path: string) => {
  router.push(path);
  isMobileMenuOpen.value = false;
};

onMounted(async () => {
  await userStore.initialize();
});
</script>

<template>
  <div class="min-h-screen flex bg-neutral-bg">
    <!-- Sidebar (Desktop) -->
    <aside
      v-if="!route.meta.hideSidebar"
      class="hidden md:flex flex-col bg-white border-r border-neutral-border transition-all duration-300 z-50 fixed left-0 top-0 bottom-0"
      :class="isSidebarOpen ? 'w-64' : 'w-20'"
    >
      <div
        class="h-16 flex items-center px-6 gap-3 border-b border-neutral-border cursor-pointer"
        @click="navigateTo('/')"
      >
        <div
          class="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0"
        >
          <Bot :size="20" class="text-white" />
        </div>
        <span
          v-if="isSidebarOpen"
          class="font-bold text-xl text-neutral-title whitespace-nowrap"
          >面面俱到</span
        >
      </div>

      <div class="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden">
        <div
          v-for="item in navItems"
          :key="item.path"
          class="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 group"
          :class="
            route.path === item.path
              ? 'bg-primary/10 text-primary font-bold shadow-sm'
              : 'text-neutral-body hover:bg-neutral-bg'
          "
          @click="navigateTo(item.path)"
        >
          <component
            :is="item.icon"
            :size="20"
            :class="
              route.path === item.path
                ? 'text-primary'
                : 'text-neutral-helper group-hover:text-primary'
            "
          />
          <span v-if="isSidebarOpen" class="whitespace-nowrap">{{
            item.name
          }}</span>
        </div>
      </div>

      <div class="p-4 border-t border-neutral-border">
        <div
          v-if="isSidebarOpen"
          class="bg-gradient-to-r from-primary to-primary-light p-4 rounded-2xl text-white relative overflow-hidden group cursor-pointer"
        >
          <div class="relative z-10">
            <p class="text-xs opacity-80 mb-1">AI 简历认证</p>
            <p class="text-sm font-bold">获取权威背书</p>
          </div>
          <div
            class="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform"
          >
            <Award :size="80" />
          </div>
        </div>
        <button
          v-else
          class="w-full aspect-square rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
        >
          <Award :size="20" />
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div
      class="flex-1 flex flex-col min-w-0"
      :class="
        !route.meta.hideSidebar ? (isSidebarOpen ? 'md:ml-64' : 'md:ml-20') : ''
      "
    >
      <!-- Header -->
      <header
        v-if="!route.meta.hideSidebar"
        class="h-16 bg-white border-b border-neutral-border flex items-center justify-between px-4 md:px-8 sticky top-0 z-40"
      >
        <div class="flex items-center gap-4">
          <button
            class="hidden md:flex p-2 hover:bg-neutral-bg rounded-lg text-neutral-helper transition-all-300"
            @click="toggleSidebar"
          >
            <Menu v-if="!isSidebarOpen" :size="20" />
            <X v-else :size="20" />
          </button>
          <button
            class="md:hidden p-2 hover:bg-neutral-bg rounded-lg text-neutral-helper"
            @click="toggleMobileMenu"
          >
            <Menu :size="20" />
          </button>

          <div class="relative hidden sm:block">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-helper"
              :size="16"
            />
            <input
              type="text"
              placeholder="搜索专属题库、岗位匹配..."
              class="pl-10 pr-4 py-2 bg-neutral-bg border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div class="flex items-center gap-2 md:gap-4">
          <button
            class="p-2 text-neutral-helper hover:bg-neutral-bg rounded-full relative"
          >
            <Bell :size="20" />
            <span
              v-if="isAuthenticated"
              class="absolute top-1 right-1 w-2 h-2 bg-auxiliary-orange rounded-full border-2 border-white"
            ></span>
          </button>
          <div class="h-8 w-[1px] bg-neutral-border mx-2"></div>
          <template v-if="isAuthenticated">
            <div
              class="flex items-center gap-3 pl-2 cursor-pointer group"
              @click="navigateTo('/profile')"
            >
              <div class="text-right hidden sm:block">
                <p
                  class="text-sm font-bold text-neutral-title group-hover:text-primary transition-colors"
                >
                  {{ userStore.user.name }}
                </p>
                <p class="text-[10px] text-neutral-helper">
                  {{
                    userStore.user.role === "admin"
                      ? "管理员"
                      : "已获 AI 能力认证"
                  }}
                </p>
              </div>
              <div
                class="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5 group-hover:border-primary transition-all overflow-hidden bg-neutral-bg flex items-center justify-center"
              >
                <UserIcon :size="20" class="text-neutral-helper" />
              </div>
            </div>
          </template>
          <template v-else>
            <button
              class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors text-sm font-medium"
              @click="navigateTo('/login')"
            >
              <LogIn :size="16" />
              <span class="hidden sm:inline">登录</span>
            </button>
          </template>
        </div>
      </header>

      <!-- Page Content -->
      <main
        class="flex-1 overflow-auto"
        :class="!route.meta.hideSidebar ? 'p-4 md:p-8' : ''"
      >
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" v-if="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- Mobile Menu Overlay -->
    <Transition name="fade">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 bg-black/50 z-[60] md:hidden"
        @click="toggleMobileMenu"
      ></div>
    </Transition>

    <!-- Mobile Sidebar -->
    <Transition name="slide">
      <div
        v-if="isMobileMenuOpen"
        class="fixed left-0 top-0 bottom-0 w-72 bg-white z-[70] md:hidden flex flex-col shadow-2xl"
      >
        <div
          class="h-16 flex items-center justify-between px-6 border-b border-neutral-border"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center"
            >
              <Bot :size="20" class="text-white" />
            </div>
            <span class="font-bold text-xl text-neutral-title">面面俱到</span>
          </div>
          <button class="p-2 text-neutral-helper" @click="toggleMobileMenu">
            <X :size="24" />
          </button>
        </div>
        <div class="flex-1 py-6 px-4 space-y-2">
          <div
            v-for="item in navItems"
            :key="item.path"
            class="flex items-center gap-4 px-4 py-4 rounded-xl cursor-pointer"
            :class="
              route.path === item.path
                ? 'bg-primary/10 text-primary font-bold'
                : 'text-neutral-body hover:bg-neutral-bg'
            "
            @click="navigateTo(item.path)"
          >
            <component :is="item.icon" :size="24" />
            <span class="text-lg">{{ item.name }}</span>
          </div>
        </div>
        <div class="p-6 border-t border-neutral-border">
          <template v-if="isAuthenticated">
            <button
              class="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all"
              @click="logout"
            >
              <LogOut :size="20" />
              退出登录
            </button>
          </template>
          <template v-else>
            <button
              class="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all"
              @click="navigateTo('/login')"
            >
              <LogIn :size="20" />
              登录
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

/* Hide scrollbar for Chrome, Safari and Opera */
::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
aside {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
