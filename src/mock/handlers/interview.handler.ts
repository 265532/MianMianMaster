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
      id: Date.now(),
      candidate_id: 1,
      strategy_id: data.strategy_id ?? null,
      status: "scheduled" as const,
      max_rounds: data.max_rounds,
      current_round: 0,
      created_at: new Date().toISOString(),
    };
    mockInterviewSessions.unshift(newSession as any);
    return success(newSession);
  });

  mock.onGet("/interview/sessions").reply(() => {
    return success(mockInterviewSessions);
  });

  mock.onGet(/\/interview\/sessions\/\d+$/).reply((config) => {
    const id = parseInt(config.url?.split("/").pop() ?? "0");
    const session = mockInterviewSessions.find((s) => s.id === id);
    if (session) {
      return success(session);
    }
    return success({
      id,
      candidate_id: 1,
      status: "in_progress" as const,
      current_round: 3,
      created_at: new Date().toISOString(),
      start_time: new Date().toISOString(),
    });
  });

  mock.onPost(/\/interview\/sessions\/\d+\/start$/).reply((config) => {
    const id = parseInt(config.url?.split("/")[3]);
    const session = mockInterviewSessions.find((s) => s.id === id);
    if (session) {
      session.status = "in_progress";
      session.start_time = new Date().toISOString();
    }
    return success({
      session_id: id,
      opening_message: "你好！我是你的AI面试官，今天我们将进行一次技术面试。请先做个自我介绍吧。",
      status: "in_progress",
    });
  });

  mock.onPost(/\/interview\/sessions\/\d+\/end$/).reply((config) => {
    const id = parseInt(config.url?.split("/")[3]);
    const session = mockInterviewSessions.find((s) => s.id === id);
    if (session) {
      session.status = "completed";
      session.end_time = new Date().toISOString();
      session.score = 85;
      return success(session);
    }
    return success({
      id,
      candidate_id: 1,
      status: "completed" as const,
      score: 85,
      end_time: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });
  });

  mock.onPost(/\/interview\/sessions\/\d+\/cancel$/).reply((config) => {
    const id = parseInt(config.url?.split("/")[3]);
    const session = mockInterviewSessions.find((s) => s.id === id);
    if (session) {
      session.status = "cancelled";
      return success(session);
    }
    return success({
      id,
      candidate_id: 1,
      status: "cancelled" as const,
      created_at: new Date().toISOString(),
    });
  });

  mock.onGet(/\/interview\/sessions\/\d+\/report$/).reply((config) => {
    const id = parseInt(config.url?.split("/")[3]);
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

  console.log("[Mock] Interview handlers registered");
}
