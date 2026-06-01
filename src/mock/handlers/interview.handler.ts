import type MockAdapter from "axios-mock-adapter";
import {
  mockGameLevels,
  mockGameStats,
  mockGameAchievements,
  mockLeaderboard,
  mockInterviewSessions,
  mockInterviewReport,
} from "../data/interview.mock";

function success<T>(
  data: T,
): [number, { code: number; message: string; data: T }] {
  return [200, { code: 200, message: "success", data }];
}

export function registerInterviewHandlers(mock: MockAdapter): void {
  mock.onPost("/interview/sessions").reply((config) => {
    const data = JSON.parse(config.data);
    const newSession = {
      id: `session-${Date.now()}`,
      job_title: data.job_title || "前端开发",
      company: data.company || "",
      status: "scheduled" as const,
      type: data.type || "technical",
      max_rounds: data.max_rounds || 10,
      current_round: 0,
      created_at: new Date().toISOString(),
    };
    mockInterviewSessions.unshift(newSession);
    return success(newSession);
  });

  mock.onGet("/interview/sessions").reply(() => {
    return success(mockInterviewSessions);
  });

  mock.onGet(/\/interview\/sessions\/[\w-]+$/).reply((config) => {
    const id = config.url?.split("/").pop();
    const session = mockInterviewSessions.find((s) => s.id === id);
    if (session) {
      return success(session);
    }
    return success({
      id,
      job_title: "前端开发",
      company: "字节跳动",
      status: "in_progress" as const,
      max_rounds: 10,
      current_round: 3,
      created_at: new Date().toISOString(),
      started_at: new Date().toISOString(),
    });
  });

  mock.onPost(/\/interview\/sessions\/[\w-]+\/start$/).reply((config) => {
    const id = config.url?.split("/")[3];
    const session = mockInterviewSessions.find((s) => s.id === id);
    if (session) {
      session.status = "in_progress";
      session.started_at = new Date().toISOString();
      return success(session);
    }
    return success({
      id: id || `session-${Date.now()}`,
      job_title: "前端开发",
      company: "字节跳动",
      status: "in_progress" as const,
      max_rounds: 10,
      current_round: 1,
      created_at: new Date().toISOString(),
      started_at: new Date().toISOString(),
    });
  });

  mock.onPost(/\/interview\/sessions\/[\w-]+\/end$/).reply((config) => {
    const id = config.url?.split("/")[3];
    const session = mockInterviewSessions.find((s) => s.id === id);
    if (session) {
      session.status = "completed";
      session.ended_at = new Date().toISOString();
      session.total_score = 85;
      return success(session);
    }
    return success({
      id: id || "session-1",
      job_title: "前端开发",
      status: "completed" as const,
      total_score: 85,
      ended_at: new Date().toISOString(),
    });
  });

  mock.onPost(/\/interview\/sessions\/[\w-]+\/cancel$/).reply((config) => {
    const id = config.url?.split("/")[3];
    const session = mockInterviewSessions.find((s) => s.id === id);
    if (session) {
      session.status = "cancelled";
      return success(session);
    }
    return success({
      id: id || "session-1",
      job_title: "前端开发",
      status: "cancelled" as const,
    });
  });

  mock.onGet(/\/interview\/sessions\/[\w-]+\/report$/).reply((config) => {
    const id = config.url?.split("/")[3];
    return success({
      ...mockInterviewReport,
      session_id: id,
    });
  });

  mock.onGet("/interview/questions").reply(() => {
    return success([]);
  });

  mock.onGet("/interview/game/levels").reply(() => {
    return success(mockGameLevels);
  });

  mock.onGet("/interview/game/stats").reply(() => {
    return success(mockGameStats);
  });

  mock.onGet("/interview/game/achievements").reply(() => {
    return success(mockGameAchievements);
  });

  mock.onGet("/interview/game/leaderboard").reply(() => {
    return success(mockLeaderboard);
  });

  console.log("[Mock] Interview handlers registered (aligned with backend API)");
}
