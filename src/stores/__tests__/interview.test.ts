import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";

vi.mock("@/api/modules/interview.api", () => ({
  interviewApi: {
    createSession: vi.fn(),
    getSession: vi.fn(),
    getSessions: vi.fn(),
    startSession: vi.fn(),
    chatSSE: vi.fn(),
    endSession: vi.fn(),
    cancelSession: vi.fn(),
    getReport: vi.fn(),
    getQuestions: vi.fn(),
    getGameLevels: vi.fn(),
    getGameStats: vi.fn(),
    getGameAchievements: vi.fn(),
    getLeaderboard: vi.fn(),
  },
}));

vi.mock("@/utils/auth", () => ({
  getToken: vi.fn(() => "mock-token"),
  getRefreshToken: vi.fn(() => null),
  setToken: vi.fn(),
  removeToken: vi.fn(),
  isLoggedIn: vi.fn(() => true),
}));

describe("useInterviewStore integration", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe("fetchSessions", () => {
    it("should fetch sessions and update state", async () => {
      const { interviewApi } = await import(
        "@/api/modules/interview.api"
      );
      const mockedGetSessions = vi.mocked(interviewApi.getSessions);

      const mockSessions = [
        {
          id: "session-001",
          job_title: "前端开发",
          company: "字节跳动",
          status: "completed" as const,
          max_rounds: 10,
          current_round: 10,
          created_at: "2026-05-28T10:00:00Z",
          started_at: "2026-05-28T10:01:00Z",
          ended_at: "2026-05-28T10:30:00Z",
          total_score: 85,
        },
        {
          id: "session-002",
          job_title: "全栈开发",
          company: "腾讯",
          status: "in_progress" as const,
          max_rounds: 10,
          current_round: 3,
          created_at: "2026-05-30T14:00:00Z",
          started_at: "2026-05-30T14:01:00Z",
        },
      ];

      mockedGetSessions.mockResolvedValue({
        code: 200,
        message: "success",
        data: mockSessions,
      });

      const { useInterviewStore } = await import("@/stores/interview");
      const store = useInterviewStore();

      await store.fetchSessions();

      expect(mockedGetSessions).toHaveBeenCalledOnce();
      expect(store.sessions).toHaveLength(2);
      expect(store.sessions[0].id).toBe("session-001");
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });

    it("should handle fetch error", async () => {
      const { interviewApi } = await import(
        "@/api/modules/interview.api"
      );
      const mockedGetSessions = vi.mocked(interviewApi.getSessions);

      mockedGetSessions.mockRejectedValue(new Error("Network Error"));

      const { useInterviewStore } = await import("@/stores/interview");
      const store = useInterviewStore();

      await store.fetchSessions();

      expect(store.sessions).toHaveLength(0);
      expect(store.error).toBe("Network Error");
      expect(store.loading).toBe(false);
    });
  });

  describe("createSession", () => {
    it("should create session and set as current", async () => {
      const { interviewApi } = await import(
        "@/api/modules/interview.api"
      );
      const mockedCreate = vi.mocked(interviewApi.createSession);

      const newSession = {
        id: "session-new",
        job_title: "React 开发",
        company: "阿里巴巴",
        status: "scheduled" as const,
        type: "technical",
        max_rounds: 8,
        current_round: 0,
        created_at: "2026-05-31T09:00:00Z",
      };

      mockedCreate.mockResolvedValue({
        code: 200,
        message: "success",
        data: newSession,
      });

      const { useInterviewStore } = await import("@/stores/interview");
      const store = useInterviewStore();

      const result = await store.createSession({
        job_title: "React 开发",
        company: "阿里巴巴",
        type: "technical",
        max_rounds: 8,
      });

      expect(mockedCreate).toHaveBeenCalledWith({
        job_title: "React 开发",
        company: "阿里巴巴",
        type: "technical",
        max_rounds: 8,
      });
      expect(result).toEqual(newSession);
      expect(store.currentSession).toEqual(newSession);
      expect(store.sessions).toHaveLength(1);
      expect(store.sessions[0].id).toBe("session-new");
    });

    it("should handle create error", async () => {
      const { interviewApi } = await import(
        "@/api/modules/interview.api"
      );
      const mockedCreate = vi.mocked(interviewApi.createSession);

      mockedCreate.mockRejectedValue({
        response: { data: { message: "创建失败" } },
      });

      const { useInterviewStore } = await import("@/stores/interview");
      const store = useInterviewStore();

      await expect(
        store.createSession({ job_title: "测试" }),
      ).rejects.toBeDefined();
      expect(store.error).toBe("创建失败");
    });
  });

  describe("startInterview", () => {
    it("should start session and update state", async () => {
      const { interviewApi } = await import(
        "@/api/modules/interview.api"
      );
      const mockedCreate = vi.mocked(interviewApi.createSession);
      const mockedStart = vi.mocked(interviewApi.startSession);

      const { useInterviewStore } = await import("@/stores/interview");
      const store = useInterviewStore();

      mockedCreate.mockResolvedValue({
        code: 200,
        message: "success",
        data: {
          id: "session-003",
          job_title: "前端开发",
          status: "scheduled" as const,
          created_at: "2026-05-31T09:00:00Z",
        },
      });

      await store.createSession({ job_title: "前端开发" });

      const startedSession = {
        id: "session-003",
        job_title: "前端开发",
        status: "in_progress" as const,
        max_rounds: 10,
        current_round: 1,
        created_at: "2026-05-31T09:00:00Z",
        started_at: "2026-05-31T09:01:00Z",
      };

      mockedStart.mockResolvedValue({
        code: 200,
        message: "success",
        data: startedSession,
      });

      const result = await store.startInterview("session-003");

      expect(mockedStart).toHaveBeenCalledWith("session-003");
      expect(result?.status).toBe("in_progress");
      expect(store.currentSession?.status).toBe("in_progress");
    });
  });

  describe("sendChatMessage (SSE)", () => {
    it("should initiate SSE connection and dispatch events", async () => {
      const { interviewApi } = await import(
        "@/api/modules/interview.api"
      );
      const mockedChatSSE = vi.mocked(interviewApi.chatSSE);

      const mockController = new AbortController();
      mockedChatSSE.mockReturnValue(mockController);

      const { useInterviewStore } = await import("@/stores/interview");
      const store = useInterviewStore();

      const receivedEvents: Array<{ type: string; data: string }> = [];
      const onEvent = (event: { type: string; data: string }) => {
        receivedEvents.push(event);
      };

      store.sendChatMessage("session-003", "你好", onEvent);

      expect(mockedChatSSE).toHaveBeenCalledWith(
        "session-003",
        "你好",
        expect.any(Function),
        expect.any(Function),
      );

      const wrappedOnEvent = mockedChatSSE.mock.calls[0][2];

      wrappedOnEvent({ type: "token", data: "你" });
      wrappedOnEvent({ type: "token", data: "好" });
      wrappedOnEvent({ type: "done", data: "[DONE]" });

      expect(receivedEvents).toHaveLength(3);
      expect(receivedEvents[0]).toEqual({ type: "token", data: "你" });
      expect(receivedEvents[1]).toEqual({ type: "token", data: "好" });
      expect(receivedEvents[2]).toEqual({ type: "done", data: "[DONE]" });
    });

    it("should abort previous SSE connection before starting new one", async () => {
      const { interviewApi } = await import(
        "@/api/modules/interview.api"
      );
      const mockedChatSSE = vi.mocked(interviewApi.chatSSE);

      const firstController = new AbortController();
      const secondController = new AbortController();
      mockedChatSSE
        .mockReturnValueOnce(firstController)
        .mockReturnValueOnce(secondController);

      const { useInterviewStore } = await import("@/stores/interview");
      const store = useInterviewStore();

      const abortSpy = vi.spyOn(firstController, "abort");

      store.sendChatMessage("session-003", "第一条", () => {});
      store.sendChatMessage("session-003", "第二条", () => {});

      expect(abortSpy).toHaveBeenCalled();
    });

    it("should handle SSE error event", async () => {
      const { interviewApi } = await import(
        "@/api/modules/interview.api"
      );
      const mockedChatSSE = vi.mocked(interviewApi.chatSSE);

      const mockController = new AbortController();
      mockedChatSSE.mockReturnValue(mockController);

      const { useInterviewStore } = await import("@/stores/interview");
      const store = useInterviewStore();

      const receivedEvents: Array<{ type: string; data: string }> = [];
      const onEvent = (event: { type: string; data: string }) => {
        receivedEvents.push(event);
      };

      store.sendChatMessage("session-003", "你好", onEvent);

      const wrappedOnEvent = mockedChatSSE.mock.calls[0][2];

      wrappedOnEvent({ type: "error", data: "LLM 服务暂时不可用" });

      expect(receivedEvents).toHaveLength(1);
      expect(receivedEvents[0].type).toBe("error");
    });

    it("should handle round_limit event", async () => {
      const { interviewApi } = await import(
        "@/api/modules/interview.api"
      );
      const mockedChatSSE = vi.mocked(interviewApi.chatSSE);

      const mockController = new AbortController();
      mockedChatSSE.mockReturnValue(mockController);

      const { useInterviewStore } = await import("@/stores/interview");
      const store = useInterviewStore();

      const receivedEvents: Array<{ type: string; data: string }> = [];
      const onEvent = (event: { type: string; data: string }) => {
        receivedEvents.push(event);
      };

      store.sendChatMessage("session-003", "你好", onEvent);

      const wrappedOnEvent = mockedChatSSE.mock.calls[0][2];

      wrappedOnEvent({ type: "round_limit", data: "已达到最大轮次" });

      expect(receivedEvents).toHaveLength(1);
      expect(receivedEvents[0].type).toBe("round_limit");
    });
  });

  describe("stopChat", () => {
    it("should abort active SSE connection", async () => {
      const { interviewApi } = await import(
        "@/api/modules/interview.api"
      );
      const mockedChatSSE = vi.mocked(interviewApi.chatSSE);

      const mockController = new AbortController();
      mockedChatSSE.mockReturnValue(mockController);

      const { useInterviewStore } = await import("@/stores/interview");
      const store = useInterviewStore();

      store.sendChatMessage("session-003", "你好", () => {});

      const abortSpy = vi.spyOn(mockController, "abort");

      store.stopChat();

      expect(abortSpy).toHaveBeenCalled();
    });

    it("should be safe to call when no active connection", async () => {
      const { useInterviewStore } = await import("@/stores/interview");
      const store = useInterviewStore();

      expect(() => store.stopChat()).not.toThrow();
    });
  });

  describe("endInterview", () => {
    it("should end session and update state", async () => {
      const { interviewApi } = await import(
        "@/api/modules/interview.api"
      );
      const mockedCreate = vi.mocked(interviewApi.createSession);
      const mockedEnd = vi.mocked(interviewApi.endSession);

      const { useInterviewStore } = await import("@/stores/interview");
      const store = useInterviewStore();

      mockedCreate.mockResolvedValue({
        code: 200,
        message: "success",
        data: {
          id: "session-003",
          job_title: "前端开发",
          status: "in_progress" as const,
          created_at: "2026-05-31T09:00:00Z",
        },
      });

      await store.createSession({ job_title: "前端开发" });

      const endedSession = {
        id: "session-003",
        job_title: "前端开发",
        status: "completed" as const,
        total_score: 85,
        ended_at: "2026-05-31T09:30:00Z",
      };

      mockedEnd.mockResolvedValue({
        code: 200,
        message: "success",
        data: endedSession,
      });

      await store.endInterview("session-003");

      expect(mockedEnd).toHaveBeenCalledWith("session-003");
      expect(store.currentSession?.status).toBe("completed");
      expect(store.currentSession?.total_score).toBe(85);
    });
  });

  describe("cancelInterview", () => {
    it("should cancel session and update state", async () => {
      const { interviewApi } = await import(
        "@/api/modules/interview.api"
      );
      const mockedCreate = vi.mocked(interviewApi.createSession);
      const mockedCancel = vi.mocked(interviewApi.cancelSession);

      const { useInterviewStore } = await import("@/stores/interview");
      const store = useInterviewStore();

      mockedCreate.mockResolvedValue({
        code: 200,
        message: "success",
        data: {
          id: "session-003",
          job_title: "前端开发",
          status: "in_progress" as const,
          created_at: "2026-05-31T09:00:00Z",
        },
      });

      await store.createSession({ job_title: "前端开发" });

      const cancelledSession = {
        id: "session-003",
        job_title: "前端开发",
        status: "cancelled" as const,
      };

      mockedCancel.mockResolvedValue({
        code: 200,
        message: "success",
        data: cancelledSession,
      });

      await store.cancelInterview("session-003");

      expect(mockedCancel).toHaveBeenCalledWith("session-003");
      expect(store.currentSession?.status).toBe("cancelled");
    });
  });

  describe("fetchReport", () => {
    it("should fetch report and update state", async () => {
      const { interviewApi } = await import(
        "@/api/modules/interview.api"
      );
      const mockedGetReport = vi.mocked(interviewApi.getReport);

      const mockReport = {
        session_id: "session-001",
        status: "completed" as const,
        overall_score: 85,
        dimensions: {
          technical: 88,
          communication: 82,
          logic: 85,
          problem_solving: 80,
        },
        strengths: ["Vue 3 理解深入"],
        weaknesses: ["系统设计需加强"],
        suggestions: ["学习系统设计方法论"],
        generated_at: "2026-05-28T10:31:00Z",
      };

      mockedGetReport.mockResolvedValue({
        code: 200,
        message: "success",
        data: mockReport,
      });

      const { useInterviewStore } = await import("@/stores/interview");
      const store = useInterviewStore();

      const result = await store.fetchReport("session-001");

      expect(mockedGetReport).toHaveBeenCalledWith("session-001");
      expect(result).toEqual(mockReport);
      expect(store.currentReport).toEqual(mockReport);
      expect(store.currentReport?.overall_score).toBe(85);
    });

    it("should handle pending report status", async () => {
      const { interviewApi } = await import(
        "@/api/modules/interview.api"
      );
      const mockedGetReport = vi.mocked(interviewApi.getReport);

      mockedGetReport.mockResolvedValue({
        code: 200,
        message: "success",
        data: {
          session_id: "session-001",
          status: "generating" as const,
        },
      });

      const { useInterviewStore } = await import("@/stores/interview");
      const store = useInterviewStore();

      const result = await store.fetchReport("session-001");

      expect(result?.status).toBe("generating");
      expect(store.currentReport?.status).toBe("generating");
    });

    it("should return null on fetch error", async () => {
      const { interviewApi } = await import(
        "@/api/modules/interview.api"
      );
      const mockedGetReport = vi.mocked(interviewApi.getReport);

      mockedGetReport.mockRejectedValue(new Error("Server Error"));

      const { useInterviewStore } = await import("@/stores/interview");
      const store = useInterviewStore();

      const result = await store.fetchReport("session-001");

      expect(result).toBeNull();
    });
  });

  describe("computed properties", () => {
    it("should filter active sessions correctly", async () => {
      const { interviewApi } = await import(
        "@/api/modules/interview.api"
      );
      const mockedGetSessions = vi.mocked(interviewApi.getSessions);

      mockedGetSessions.mockResolvedValue({
        code: 200,
        message: "success",
        data: [
          {
            id: "1",
            job_title: "前端",
            status: "scheduled" as const,
            created_at: "2026-05-31T09:00:00Z",
          },
          {
            id: "2",
            job_title: "后端",
            status: "in_progress" as const,
            created_at: "2026-05-31T09:00:00Z",
          },
          {
            id: "3",
            job_title: "全栈",
            status: "completed" as const,
            created_at: "2026-05-31T09:00:00Z",
          },
          {
            id: "4",
            job_title: "移动端",
            status: "cancelled" as const,
            created_at: "2026-05-31T09:00:00Z",
          },
        ],
      });

      const { useInterviewStore } = await import("@/stores/interview");
      const store = useInterviewStore();

      await store.fetchSessions();

      expect(store.activeSessions).toHaveLength(2);
      expect(store.completedSessions).toHaveLength(1);
    });
  });

  describe("full interview flow", () => {
    it("should complete create → start → chat → end → report flow", async () => {
      const { interviewApi } = await import(
        "@/api/modules/interview.api"
      );
      const mockedCreate = vi.mocked(interviewApi.createSession);
      const mockedStart = vi.mocked(interviewApi.startSession);
      const mockedChatSSE = vi.mocked(interviewApi.chatSSE);
      const mockedEnd = vi.mocked(interviewApi.endSession);
      const mockedGetReport = vi.mocked(interviewApi.getReport);

      const sessionId = "session-flow-test";

      mockedCreate.mockResolvedValue({
        code: 200,
        message: "success",
        data: {
          id: sessionId,
          job_title: "前端开发",
          company: "字节跳动",
          status: "scheduled" as const,
          max_rounds: 10,
          current_round: 0,
          created_at: "2026-05-31T09:00:00Z",
        },
      });

      mockedStart.mockResolvedValue({
        code: 200,
        message: "success",
        data: {
          id: sessionId,
          job_title: "前端开发",
          company: "字节跳动",
          status: "in_progress" as const,
          max_rounds: 10,
          current_round: 1,
          created_at: "2026-05-31T09:00:00Z",
          started_at: "2026-05-31T09:01:00Z",
        },
      });

      const mockController = new AbortController();
      mockedChatSSE.mockReturnValue(mockController);

      mockedEnd.mockResolvedValue({
        code: 200,
        message: "success",
        data: {
          id: sessionId,
          job_title: "前端开发",
          company: "字节跳动",
          status: "completed" as const,
          total_score: 90,
          ended_at: "2026-05-31T09:30:00Z",
        },
      });

      mockedGetReport.mockResolvedValue({
        code: 200,
        message: "success",
        data: {
          session_id: sessionId,
          status: "completed" as const,
          overall_score: 90,
          dimensions: {
            technical: 92,
            communication: 88,
            logic: 90,
            problem_solving: 86,
          },
          strengths: ["技术基础扎实"],
          weaknesses: ["系统设计需加强"],
          suggestions: ["学习分布式系统设计"],
          generated_at: "2026-05-31T09:31:00Z",
        },
      });

      const { useInterviewStore } = await import("@/stores/interview");
      const store = useInterviewStore();

      const session = await store.createSession({
        job_title: "前端开发",
        company: "字节跳动",
      });
      expect(session?.status).toBe("scheduled");

      const started = await store.startInterview(sessionId);
      expect(started?.status).toBe("in_progress");

      const chatEvents: Array<{ type: string; data: string }> = [];
      store.sendChatMessage(sessionId, "请介绍一下你自己", (event) => {
        chatEvents.push(event);
      });

      const wrappedOnEvent = mockedChatSSE.mock.calls[0][2];
      wrappedOnEvent({ type: "token", data: "你好" });
      wrappedOnEvent({ type: "token", data: "！" });
      wrappedOnEvent({ type: "done", data: "[DONE]" });

      expect(chatEvents).toHaveLength(3);

      await store.endInterview(sessionId);
      expect(store.currentSession?.status).toBe("completed");
      expect(store.currentSession?.total_score).toBe(90);

      const report = await store.fetchReport(sessionId);
      expect(report?.status).toBe("completed");
      expect(report?.overall_score).toBe(90);
      expect(report?.strengths).toHaveLength(1);
    });
  });
});
