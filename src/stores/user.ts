import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { authApi } from "@/api/modules/auth.api";
import { userApi } from "@/api/modules/user.api";
import {
  setToken,
  setRefreshToken,
  removeToken,
  isLoggedIn as checkTokenExists,
  getCachedUserInfo,
  cacheUserInfo,
} from "@/utils/auth";
import {
  isNetworkError,
  isTimeoutError,
} from "@/utils/error";
import { resetUnauthorizedFlag } from "@/utils/http";
import type {
  UserResponse,
  RoleResponse,
  InterviewHistoryItem,
  AbilityDataItem,
  AbilityDataResponse,
  GameInterviewDataResponse,
  ResumeData,
  ResumeDiagnoseResult,
  UserProfileUpdateRequest,
} from "@/api/types/user.types";

export type {
  GameInterviewDataResponse as GameInterviewData,
  ResumeData,
  ResumeDiagnoseResult,
  InterviewHistoryItem as InterviewRecord,
  AbilityDataItem,
} from "@/api/types/user.types";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isAuthenticated: boolean;
  role: "user" | "admin";
  skills: string[];
  profile?: Record<string, unknown>;
}

const defaultUser: UserInfo = {
  id: "",
  name: "",
  email: "",
  avatar: "",
  isAuthenticated: false,
  role: "user",
  skills: [],
};

export const useUserStore = defineStore("user", () => {
  const DEBUG = import.meta.env.VITE_ENABLE_DEBUG_LOG === "true";

  const user = ref<UserInfo>({ ...defaultUser });
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 全局登录弹窗状态
  const showLoginModal = ref(false);

  const interviewHistory = ref<InterviewRecord[]>([]);
  const abilityData = ref<AbilityDataResponse | null>(null);
  const gameInterviewData = ref<GameInterviewData | null>(null);
  const resumeData = ref<ResumeData | null>(null);
  const resumeDiagnosisResult = ref<ResumeDiagnoseResult | null>(null);
  const dataLoading = ref(false);

  const isLoggedIn = computed(
    () => checkTokenExists() || user.value.isAuthenticated,
  );
  const hasSkills = computed(() => user.value.skills.length > 0);

  const passedInterviews = computed(() =>
    interviewHistory.value.filter((i) => i.status === "completed"),
  );

  const failedInterviews = computed(() =>
    interviewHistory.value.filter((i) => i.status === "failed"),
  );

  async function login(username: string, password: string): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const response = await authApi.login({ username, password });
      const tokenData = response.data;

      setToken(tokenData.access_token);
      if (tokenData.refresh_token) {
        setRefreshToken(tokenData.refresh_token);
      }
      resetUnauthorizedFlag();

      await fetchUserInfo();

      return true;
    } catch (err: any) {
      if (isNetworkError(err)) {
        error.value = "网络连接失败，请检查网络";
      } else if (isTimeoutError(err)) {
        error.value = "请求超时，请稍后重试";
      } else {
        error.value = err?.response?.data?.message || err?.message || "登录失败";
      }
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function register(
    username: string,
    email: string,
    password: string,
    phone?: string,
  ): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      await authApi.register({ username, email, password, phone });
      return true;
    } catch (err: any) {
      if (isNetworkError(err)) {
        error.value = "网络连接失败，请检查网络";
      } else if (isTimeoutError(err)) {
        error.value = "请求超时，请稍后重试";
      } else {
        error.value = err?.response?.data?.message || err?.message || "注册失败";
      }
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchUserInfo(): Promise<void> {
    try {
      const response = await authApi.getUserInfo();
      const apiUser = response.data;
      mapUserData(apiUser);
      user.value.isAuthenticated = true;
      cacheUserInfo(user.value);
    } catch (err) {
      if (DEBUG) console.error("[UserStore] fetchUserInfo error:", err);
      await logout();
    }
  }

  function mapUserData(apiUser: UserResponse): void {
    user.value = {
      id: apiUser.id?.toString() || "",
      name: apiUser.username || apiUser.email?.split("@")[0] || "",
      email: apiUser.email || "",
      avatar: apiUser.profile?.avatar_url || "",
      isAuthenticated: true,
      role: apiUser.roles?.some((r: RoleResponse) => r.name === "admin")
        ? "admin"
        : "user",
      skills:
        ((apiUser.profile as Record<string, unknown>)?.skills as string[]) ||
        [],
      profile: apiUser.profile as Record<string, unknown>,
    };
  }

  async function logout(): Promise<void> {
    try {
      await authApi.logout();
    } catch (err) {
      if (DEBUG) console.warn("[UserStore] logout API failed:", err);
    } finally {
      removeToken();
      user.value = { ...defaultUser };
      interviewHistory.value = [];
      abilityData.value = null;
      gameInterviewData.value = null;
      resumeData.value = null;
      resumeDiagnosisResult.value = null;
    }
  }

  function openLoginModal(): void {
    showLoginModal.value = true;
  }

  function closeLoginModal(): void {
    showLoginModal.value = false;
  }

  async function updateProfile(profileData: UserProfileUpdateRequest): Promise<void> {
    try {
      const response = await userApi.updateProfile(profileData);
      const updatedProfile = response.data;
      user.value.profile = updatedProfile as Record<string, unknown>;
      cacheUserInfo(user.value);
    } catch (err: any) {
      if (DEBUG) console.error("[UserStore] updateProfile error:", err);
      throw err;
    }
  }

  async function initialize(): Promise<void> {
    if (checkTokenExists()) {
      const cachedUser = getCachedUserInfo();
      if (cachedUser) {
        user.value = { ...cachedUser, isAuthenticated: true };
      } else {
        await fetchUserInfo();
      }
    }
  }

  async function fetchInterviewHistory(params?: { skip?: number; limit?: number }): Promise<void> {
    dataLoading.value = true;
    try {
      const response = await userApi.getInterviewHistory(params);
      interviewHistory.value = response.data;
    } catch (err: any) {
      if (DEBUG) console.warn("[UserStore] fetchInterviewHistory failed, using mock data:", err?.message);
      const { mockInterviewHistory } = await import("@/mock/data/user.mock");
      interviewHistory.value = mockInterviewHistory;
    } finally {
      dataLoading.value = false;
    }
  }

  async function fetchAbilityData(): Promise<void> {
    dataLoading.value = true;
    try {
      const response = await userApi.getAbilityData();
      abilityData.value = response.data;
    } catch (err: any) {
      if (DEBUG) console.warn("[UserStore] fetchAbilityData failed, using mock data:", err?.message);
      const { mockAbilityData } = await import("@/mock/data/user.mock");
      abilityData.value = mockAbilityData;
    } finally {
      dataLoading.value = false;
    }
  }

  async function fetchGameInterviewData(): Promise<void> {
    dataLoading.value = true;
    try {
      const response = await userApi.getGameInterviewData();
      gameInterviewData.value = response.data;
    } catch (err: any) {
      if (DEBUG) console.warn("[UserStore] fetchGameInterviewData failed, using mock data:", err?.message);
      const { mockGameInterviewData } = await import("@/mock/data/user.mock");
      gameInterviewData.value = mockGameInterviewData;
    } finally {
      dataLoading.value = false;
    }
  }

  async function fetchResume(): Promise<void> {
    dataLoading.value = true;
    try {
      const response = await userApi.getResume();
      resumeData.value = response.data;
    } catch (err: any) {
      if (DEBUG) console.error("[UserStore] fetchResume error:", err);
    } finally {
      dataLoading.value = false;
    }
  }

  async function diagnoseResume(
    resumeId: number,
    targetPosition?: string,
  ): Promise<void> {
    dataLoading.value = true;
    try {
      const response = await userApi.diagnoseResume({
        resume_id: resumeId,
        target_position: targetPosition,
      });
      resumeDiagnosisResult.value = response.data;
    } catch (err: any) {
      if (DEBUG) console.error("[UserStore] diagnoseResume error:", err);
    } finally {
      dataLoading.value = false;
    }
  }

  async function fetchAllUserData(): Promise<void> {
    dataLoading.value = true;
    try {
      await Promise.all([
        fetchInterviewHistory(),
        fetchAbilityData(),
        fetchGameInterviewData(),
      ]);
    } finally {
      dataLoading.value = false;
    }
  }

  return {
    user,
    loading,
    error,
    isLoggedIn,
    hasSkills,
    interviewHistory,
    abilityData,
    gameInterviewData,
    resumeData,
    resumeDiagnosisResult,
    dataLoading,
    passedInterviews,
    failedInterviews,
    showLoginModal,
    login,
    register,
    logout,
    openLoginModal,
    closeLoginModal,
    updateProfile,
    fetchUserInfo,
    initialize,
    fetchInterviewHistory,
    fetchAbilityData,
    fetchGameInterviewData,
    fetchResume,
    diagnoseResume,
    fetchAllUserData,
  };
});
