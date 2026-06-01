import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { interviewApi } from "@/api/modules/interview.api";
import type {
  InterviewSession,
  InterviewSessionCreate,
  InterviewReport,
  SseEvent,
  GameLevel,
  GameStats,
  GameAchievement,
  LeaderboardEntry,
} from "@/api/types/interview.types";

const DEBUG = import.meta.env.VITE_ENABLE_DEBUG_LOG === "true";

function log(...args: unknown[]): void {
  if (DEBUG) {
    console.debug("[InterviewStore]", ...args);
  }
}

export const useInterviewStore = defineStore("interview", () => {
  const sessions = ref<InterviewSession[]>([]);
  const currentSession = ref<InterviewSession | null>(null);
  const currentReport = ref<InterviewReport | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const chatAbortController = ref<AbortController | null>(null);

  const gameLevels = ref<GameLevel[]>([]);
  const gameStats = ref<GameStats | null>(null);
  const gameAchievements = ref<GameAchievement[]>([]);
  const leaderboard = ref<LeaderboardEntry[]>([]);

  const activeSessions = computed(() =>
    sessions.value.filter(
      (s) => s.status === "in_progress" || s.status === "scheduled",
    ),
  );

  const completedSessions = computed(() =>
    sessions.value.filter((s) => s.status === "completed"),
  );

  async function fetchSessions(params?: {
    skip?: number;
    limit?: number;
    status?: string;
  }): Promise<void> {
    log("fetchSessions →", params);
    loading.value = true;
    error.value = null;
    try {
      const response = await interviewApi.getSessions(params);
      sessions.value = response.data;
      log("fetchSessions ✓ received", response.data.length, "sessions");
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || err?.message || "获取面试记录失败";
      log("fetchSessions ✗ error:", error.value);
    } finally {
      loading.value = false;
    }
  }

  async function createSession(
    data: InterviewSessionCreate,
  ): Promise<InterviewSession | null> {
    log("createSession →", data);
    loading.value = true;
    error.value = null;
    try {
      const response = await interviewApi.createSession(data);
      const session = response.data;
      sessions.value.unshift(session);
      currentSession.value = session;
      log("createSession ✓ session created:", session.id, "status:", session.status);
      return session;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || err?.message || "创建面试失败";
      log("createSession ✗ error:", error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function startInterview(
    sessionId: string,
  ): Promise<InterviewSession | null> {
    log("startInterview →", sessionId);
    try {
      const response = await interviewApi.startSession(sessionId);
      const session = response.data;
      if (currentSession.value?.id === sessionId) {
        currentSession.value = session;
      }
      const idx = sessions.value.findIndex((s) => s.id === sessionId);
      if (idx !== -1) {
        sessions.value[idx] = session;
      }
      log("startInterview ✓ session:", sessionId, "status:", session.status, "current_round:", session.current_round);
      return session;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || err?.message || "开始面试失败";
      log("startInterview ✗ error:", error.value);
      throw err;
    }
  }

  function sendChatMessage(
    sessionId: string,
    message: string,
    onEvent: (event: SseEvent) => void,
    onError?: (error: Error) => void,
  ): void {
    log("sendChatMessage →", { sessionId, message });

    if (chatAbortController.value) {
      log("sendChatMessage: aborting previous chat connection");
      chatAbortController.value.abort();
    }

    let tokenBuffer = "";
    const wrappedOnEvent = (event: SseEvent) => {
      log("sendChatMessage: SSE event received:", event.type, event.data);

      if (event.type === "token") {
        tokenBuffer += event.data;
      } else if (event.type === "done") {
        log("sendChatMessage: stream complete, full response:", tokenBuffer);
      } else if (event.type === "error") {
        log("sendChatMessage: SSE error event:", event.data);
      } else if (event.type === "round_limit") {
        log("sendChatMessage: round limit reached:", event.data);
      }

      onEvent(event);
    };

    const wrappedOnError = (err: Error) => {
      log("sendChatMessage: SSE connection error:", err.message);
      onError?.(err);
    };

    chatAbortController.value = interviewApi.chatSSE(
      sessionId,
      message,
      wrappedOnEvent,
      wrappedOnError,
    );
    log("sendChatMessage: SSE connection initiated, abort controller set");
  }

  function stopChat(): void {
    log("stopChat → abortController:", chatAbortController.value ? "active" : "null");
    if (chatAbortController.value) {
      chatAbortController.value.abort();
      chatAbortController.value = null;
      log("stopChat ✓ chat aborted");
    }
  }

  async function endInterview(sessionId: string): Promise<void> {
    log("endInterview →", sessionId);
    try {
      stopChat();
      const response = await interviewApi.endSession(sessionId);
      const session = response.data;
      if (currentSession.value?.id === sessionId) {
        currentSession.value = session;
      }
      const idx = sessions.value.findIndex((s) => s.id === sessionId);
      if (idx !== -1) {
        sessions.value[idx] = session;
      }
      log("endInterview ✓ session:", sessionId, "status:", session.status, "total_score:", session.total_score);
    } catch (err: any) {
      log("endInterview ✗ error:", err?.message);
    }
  }

  async function cancelInterview(sessionId: string): Promise<void> {
    log("cancelInterview →", sessionId);
    try {
      stopChat();
      const response = await interviewApi.cancelSession(sessionId);
      const session = response.data;
      if (currentSession.value?.id === sessionId) {
        currentSession.value = session;
      }
      const idx = sessions.value.findIndex((s) => s.id === sessionId);
      if (idx !== -1) {
        sessions.value[idx] = session;
      }
      log("cancelInterview ✓ session:", sessionId, "status:", session.status);
    } catch (err: any) {
      log("cancelInterview ✗ error:", err?.message);
    }
  }

  async function fetchReport(sessionId: string): Promise<InterviewReport | null> {
    log("fetchReport →", sessionId);
    try {
      const response = await interviewApi.getReport(sessionId);
      currentReport.value = response.data;
      log("fetchReport ✓ report status:", response.data.status, "score:", response.data.overall_score);
      return response.data;
    } catch (err: any) {
      log("fetchReport ✗ error:", err?.message);
      return null;
    }
  }

  function getSessionById(id: string) {
    return sessions.value.find((s) => s.id === id);
  }

  async function fetchGameLevels(): Promise<void> {
    log("fetchGameLevels →");
    try {
      const response = await interviewApi.getGameLevels();
      gameLevels.value = response.data;
      log("fetchGameLevels ✓", response.data.length, "levels");
    } catch (err: any) {
      log("fetchGameLevels ✗ error:", err?.message);
    }
  }

  async function fetchGameStats(): Promise<void> {
    log("fetchGameStats →");
    try {
      const response = await interviewApi.getGameStats();
      gameStats.value = response.data;
      log("fetchGameStats ✓", response.data);
    } catch (err: any) {
      log("fetchGameStats ✗ error:", err?.message);
    }
  }

  async function fetchGameAchievements(): Promise<void> {
    log("fetchGameAchievements →");
    try {
      const response = await interviewApi.getGameAchievements();
      gameAchievements.value = response.data;
      log("fetchGameAchievements ✓", response.data.length, "achievements");
    } catch (err: any) {
      log("fetchGameAchievements ✗ error:", err?.message);
    }
  }

  async function fetchLeaderboard(): Promise<void> {
    log("fetchLeaderboard →");
    try {
      const response = await interviewApi.getLeaderboard();
      leaderboard.value = response.data;
      log("fetchLeaderboard ✓", response.data.length, "entries");
    } catch (err: any) {
      log("fetchLeaderboard ✗ error:", err?.message);
    }
  }

  async function fetchAllGameData(): Promise<void> {
    log("fetchAllGameData →");
    loading.value = true;
    try {
      await Promise.all([
        fetchGameLevels(),
        fetchGameStats(),
        fetchGameAchievements(),
        fetchLeaderboard(),
      ]);
      log("fetchAllGameData ✓ all game data loaded");
    } finally {
      loading.value = false;
    }
  }

  return {
    sessions,
    currentSession,
    currentReport,
    loading,
    error,
    gameLevels,
    gameStats,
    gameAchievements,
    leaderboard,
    activeSessions,
    completedSessions,
    fetchSessions,
    createSession,
    startInterview,
    sendChatMessage,
    stopChat,
    endInterview,
    cancelInterview,
    fetchReport,
    getSessionById,
    fetchGameLevels,
    fetchGameStats,
    fetchGameAchievements,
    fetchLeaderboard,
    fetchAllGameData,
  };
});
