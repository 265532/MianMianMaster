<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useToast } from "@/composables/useToast";
import { getAuthErrorMessage } from "@/utils/error";
import { Bot, X, User, Mail, Phone, Lock, KeyRound } from "lucide-vue-next";

type FormMode = "login" | "register";

interface FormState {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface FieldErrors {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^1[3-9]\d{9}$/;

const userStore = useUserStore();
const { loading } = storeToRefs(userStore);
const toast = useToast();
const router = useRouter();
const route = useRoute();

const mode = ref<FormMode>("login");

const form = reactive<FormState>({
  username: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});

const fieldErrors = reactive<FieldErrors>({
  username: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});

const isLogin = computed(() => mode.value === "login");
const submitText = computed(() => {
  if (loading.value) return isLogin.value ? "登录中..." : "注册中...";
  return isLogin.value ? "立即登录" : "立即注册";
});
const switchModeText = computed(() =>
  isLogin.value ? "还没有账号？立即注册" : "已有账号？立即登录",
);
const titleText = computed(() =>
  isLogin.value ? "欢迎开启智能面试" : "创建你的账号",
);
const subtitleText = computed(() =>
  isLogin.value
    ? "登录后解锁 50+ 岗位模拟与 AI 报告"
    : "加入面面俱到，开启智能求职之旅",
);

function clearFieldError(key: keyof FieldErrors): void {
  if (fieldErrors[key]) fieldErrors[key] = "";
}

function validateForm(): boolean {
  let valid = true;
  fieldErrors.username = "";
  fieldErrors.email = "";
  fieldErrors.phone = "";
  fieldErrors.password = "";
  fieldErrors.confirmPassword = "";

  const username = form.username.trim();
  if (!username) {
    fieldErrors.username = "请输入用户名";
    valid = false;
  } else if (!USERNAME_RE.test(username)) {
    fieldErrors.username = "用户名为 3-20 位字母、数字或下划线";
    valid = false;
  }

  if (!isLogin.value) {
    const email = form.email.trim();
    if (!email) {
      fieldErrors.email = "请输入邮箱";
      valid = false;
    } else if (!EMAIL_RE.test(email)) {
      fieldErrors.email = "邮箱格式不正确";
      valid = false;
    }

    const phone = form.phone.trim();
    if (phone && !PHONE_RE.test(phone)) {
      fieldErrors.phone = "手机号格式不正确";
      valid = false;
    }
  }

  if (!form.password) {
    fieldErrors.password = "请输入密码";
    valid = false;
  } else if (form.password.length < 6) {
    fieldErrors.password = "密码长度不能少于 6 位";
    valid = false;
  } else if (form.password.length > 20) {
    fieldErrors.password = "密码长度不能超过 20 位";
    valid = false;
  }

  if (!isLogin.value) {
    if (!form.confirmPassword) {
      fieldErrors.confirmPassword = "请再次输入密码";
      valid = false;
    } else if (form.password !== form.confirmPassword) {
      fieldErrors.confirmPassword = "两次输入的密码不一致";
      valid = false;
    }
  }

  return valid;
}

function resetForm(): void {
  form.username = "";
  form.email = "";
  form.phone = "";
  form.password = "";
  form.confirmPassword = "";
  fieldErrors.username = "";
  fieldErrors.email = "";
  fieldErrors.phone = "";
  fieldErrors.password = "";
  fieldErrors.confirmPassword = "";
}

function switchMode(): void {
  mode.value = isLogin.value ? "register" : "login";
  resetForm();
}

const emit = defineEmits<{
  success: [];
  cancel: [];
}>();

async function handleSubmit(): Promise<void> {
  if (!validateForm()) return;

  try {
    if (isLogin.value) {
      await userStore.login(form.username.trim(), form.password);
      toast.success("登录成功！正在为你准备面试环境...");
      resetForm();
      emit("success");
      const redirect = (route.query.redirect as string) || "/";
      router.push(redirect).catch(() => undefined);
    } else {
      await userStore.register(
        form.username.trim(),
        form.email.trim(),
        form.password,
        form.phone.trim() || undefined,
      );
      toast.success("注册成功！请使用新账号登录");
      mode.value = "login";
      form.password = "";
      form.confirmPassword = "";
      fieldErrors.password = "";
      fieldErrors.confirmPassword = "";
    }
  } catch (err: unknown) {
    const message = getAuthErrorMessage(
      err,
      isLogin.value ? "login" : "register",
    );
    toast.error(message);
  }
}
</script>

<template>
  <div
    class="relative p-1 rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden"
    style="background: linear-gradient(135deg, #95e0e1 0%, #ffeac2 100%)"
  >
    <div
      class="bg-white rounded-[38px] p-8 sm:p-10 space-y-6 text-center relative z-10"
    >
      <button
        type="button"
        class="absolute top-5 right-5 p-2 hover:bg-neutral-bg rounded-full transition-colors text-neutral-helper"
        aria-label="关闭"
        @click="emit('cancel')"
      >
        <X :size="20" />
      </button>

      <div class="space-y-3">
        <div
          class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary"
        >
          <Bot :size="32" />
        </div>
        <h3 class="text-2xl font-black text-neutral-title">{{ titleText }}</h3>
        <p class="text-sm text-neutral-body">{{ subtitleText }}</p>
      </div>

      <form class="space-y-3" novalidate @submit.prevent="handleSubmit">
        <!-- 用户名 -->
        <div class="space-y-1.5 text-left">
          <label
            for="login-username"
            class="text-xs font-bold text-neutral-helper uppercase tracking-wider ml-1 flex items-center gap-1"
          >
            <User :size="12" />
            用户名
          </label>
          <input
            id="login-username"
            v-model="form.username"
            type="text"
            placeholder="3-20 位字母、数字或下划线"
            autocomplete="username"
            :class="[
              'w-full px-6 py-3.5 bg-neutral-bg rounded-2xl border-2 outline-none transition-all font-medium',
              fieldErrors.username
                ? 'border-red-300 focus:border-red-400'
                : 'border-transparent focus:border-primary/20',
            ]"
            @input="clearFieldError('username')"
          />
          <p
            v-if="fieldErrors.username"
            class="text-xs text-red-500 font-medium ml-1"
          >
            {{ fieldErrors.username }}
          </p>
        </div>

        <!-- 邮箱（仅注册） -->
        <div v-if="!isLogin" class="space-y-1.5 text-left">
          <label
            for="login-email"
            class="text-xs font-bold text-neutral-helper uppercase tracking-wider ml-1 flex items-center gap-1"
          >
            <Mail :size="12" />
            邮箱
          </label>
          <input
            id="login-email"
            v-model="form.email"
            type="email"
            placeholder="请输入邮箱"
            autocomplete="email"
            :class="[
              'w-full px-6 py-3.5 bg-neutral-bg rounded-2xl border-2 outline-none transition-all font-medium',
              fieldErrors.email
                ? 'border-red-300 focus:border-red-400'
                : 'border-transparent focus:border-primary/20',
            ]"
            @input="clearFieldError('email')"
          />
          <p
            v-if="fieldErrors.email"
            class="text-xs text-red-500 font-medium ml-1"
          >
            {{ fieldErrors.email }}
          </p>
        </div>

        <!-- 手机号（仅注册，可选） -->
        <div v-if="!isLogin" class="space-y-1.5 text-left">
          <label
            for="login-phone"
            class="text-xs font-bold text-neutral-helper uppercase tracking-wider ml-1 flex items-center gap-1"
          >
            <Phone :size="12" />
            手机号
            <span class="text-neutral-helper/60 normal-case font-medium"
              >（选填）</span
            >
          </label>
          <input
            id="login-phone"
            v-model="form.phone"
            type="tel"
            placeholder="11 位手机号"
            autocomplete="tel"
            :class="[
              'w-full px-6 py-3.5 bg-neutral-bg rounded-2xl border-2 outline-none transition-all font-medium',
              fieldErrors.phone
                ? 'border-red-300 focus:border-red-400'
                : 'border-transparent focus:border-primary/20',
            ]"
            @input="clearFieldError('phone')"
          />
          <p
            v-if="fieldErrors.phone"
            class="text-xs text-red-500 font-medium ml-1"
          >
            {{ fieldErrors.phone }}
          </p>
        </div>

        <!-- 密码 -->
        <div class="space-y-1.5 text-left">
          <label
            for="login-password"
            class="text-xs font-bold text-neutral-helper uppercase tracking-wider ml-1 flex items-center gap-1"
          >
            <Lock :size="12" />
            密码
          </label>
          <input
            id="login-password"
            v-model="form.password"
            type="password"
            :placeholder="isLogin ? '请输入密码' : '6-20 位密码'"
            :autocomplete="isLogin ? 'current-password' : 'new-password'"
            :class="[
              'w-full px-6 py-3.5 bg-neutral-bg rounded-2xl border-2 outline-none transition-all font-medium',
              fieldErrors.password
                ? 'border-red-300 focus:border-red-400'
                : 'border-transparent focus:border-primary/20',
            ]"
            @input="clearFieldError('password')"
          />
          <p
            v-if="fieldErrors.password"
            class="text-xs text-red-500 font-medium ml-1"
          >
            {{ fieldErrors.password }}
          </p>
        </div>

        <!-- 确认密码（仅注册） -->
        <div v-if="!isLogin" class="space-y-1.5 text-left">
          <label
            for="login-confirm-password"
            class="text-xs font-bold text-neutral-helper uppercase tracking-wider ml-1 flex items-center gap-1"
          >
            <KeyRound :size="12" />
            确认密码
          </label>
          <input
            id="login-confirm-password"
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            autocomplete="new-password"
            :class="[
              'w-full px-6 py-3.5 bg-neutral-bg rounded-2xl border-2 outline-none transition-all font-medium',
              fieldErrors.confirmPassword
                ? 'border-red-300 focus:border-red-400'
                : 'border-transparent focus:border-primary/20',
            ]"
            @input="clearFieldError('confirmPassword')"
          />
          <p
            v-if="fieldErrors.confirmPassword"
            class="text-xs text-red-500 font-medium ml-1"
          >
            {{ fieldErrors.confirmPassword }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-4 mt-2 bg-neutral-title text-[#FFC585] font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {{ submitText }}
        </button>
      </form>

      <div class="pt-1 text-sm text-neutral-helper font-medium">
        <button
          type="button"
          class="hover:text-primary transition-colors font-bold"
          @click="switchMode"
        >
          {{ switchModeText }}
        </button>
      </div>
    </div>
    <!-- 装饰元素 -->
    <div
      class="absolute -right-12 -bottom-12 opacity-10 text-primary pointer-events-none"
    >
      <Bot :size="200" />
    </div>
  </div>
</template>
