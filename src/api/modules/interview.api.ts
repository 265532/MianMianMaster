import { get, post } from "@/utils/request";
import type {
  InterviewSession,
  InterviewSessionCreate,
  InterviewReport,
  SseEvent,
  InterviewQuestion,
  GameLevel,
  GameStats,
  GameAchievement,
  LeaderboardEntry,
} from "../types/interview.types";
import type { ResponseModel } from "../types/response.types";
import { getToken } from "@/utils/auth";

const BASE_URL = "/interview";
const DEBUG = import.meta.env.VITE_ENABLE_DEBUG_LOG === "true";

function log(...args: unknown[]): void {
  if (DEBUG) {
    console.debug("[InterviewAPI]", ...args);
  }
}

export const interviewApi = {
  createSession(
    data: InterviewSessionCreate,
  ): Promise<ResponseModel<InterviewSession>> {
    log("createSession →", data);
    return post<ResponseModel<InterviewSession>>(`${BASE_URL}/sessions`, data);
  },

  getSession(sessionId: string): Promise<ResponseModel<InterviewSession>> {
    log("getSession →", sessionId);
    return get<ResponseModel<InterviewSession>>(
      `${BASE_URL}/sessions/${sessionId}`,
    );
  },

  getSessions(params?: {
    skip?: number;
    limit?: number;
    status?: string;
  }): Promise<ResponseModel<InterviewSession[]>> {
    log("getSessions →", params);
    return get<ResponseModel<InterviewSession[]>>(
      `${BASE_URL}/sessions`,
      params as Record<string, unknown>,
    );
  },

  startSession(sessionId: string): Promise<ResponseModel<InterviewSession>> {
    log("startSession →", sessionId);
    return post<ResponseModel<InterviewSession>>(
      `${BASE_URL}/sessions/${sessionId}/start`,
      {},
    );
  },

  chatSSE(
    sessionId: string,
    message: string,
    onEvent: (event: SseEvent) => void,
    onError?: (error: Error) => void,
  ): AbortController {
    const controller = new AbortController();
    const token = getToken();
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "/api/v1";
    const url = `${baseUrl}${BASE_URL}/sessions/${sessionId}/chat`;

    log("chatSSE →", { sessionId, message, url });

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ message }),
      signal: controller.signal,
    })
      .then(async (response) => {
        log("chatSSE response status:", response.status, response.statusText);
        log("chatSSE response headers content-type:", response.headers.get("content-type"));

        if (!response.ok) {
          log("chatSSE error: HTTP", response.status);
          throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          log("chatSSE error: No readable stream");
          throw new Error("No readable stream");
        }

        const decoder = new TextDecoder();
        let buffer = "";
        let eventCount = 0;

        log("chatSSE: starting stream read loop");

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            log("chatSSE: stream ended, total events:", eventCount);
            if (buffer) {
              log("chatSSE: remaining buffer on stream end:", JSON.stringify(buffer));
            }
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          log("chatSSE: raw chunk received:", JSON.stringify(chunk));

          buffer += chunk;
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          let currentEventType = "";
          for (const line of lines) {
            if (line.startsWith("event: ")) {
              currentEventType = line.slice(7).trim();
              log("chatSSE: parsed event type:", currentEventType);
            } else if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (currentEventType) {
                eventCount++;
                log(`chatSSE: dispatching event #${eventCount}`, { type: currentEventType, data });
                onEvent({ type: currentEventType as SseEvent["type"], data });
                currentEventType = "";
              } else {
                log("chatSSE: data line without event type, skipping:", data);
              }
            } else if (line.trim() === "") {
              // empty line = event separator, no action needed
            } else {
              log("chatSSE: unrecognized line format:", JSON.stringify(line));
            }
          }
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          log("chatSSE: request aborted by user");
        } else {
          log("chatSSE: fetch error:", err.message);
          onError?.(err);
        }
      });

    return controller;
  },

  endSession(sessionId: string): Promise<ResponseModel<InterviewSession>> {
    log("endSession →", sessionId);
    return post<ResponseModel<InterviewSession>>(
      `${BASE_URL}/sessions/${sessionId}/end`,
      {},
    );
  },

  cancelSession(sessionId: string): Promise<ResponseModel<InterviewSession>> {
    log("cancelSession →", sessionId);
    return post<ResponseModel<InterviewSession>>(
      `${BASE_URL}/sessions/${sessionId}/cancel`,
      {},
    );
  },

  getReport(sessionId: string): Promise<ResponseModel<InterviewReport>> {
    log("getReport →", sessionId);
    return get<ResponseModel<InterviewReport>>(
      `${BASE_URL}/sessions/${sessionId}/report`,
    );
  },

  getQuestions(params?: {
    category?: string;
    difficulty?: string;
    type?: string;
  }): Promise<ResponseModel<InterviewQuestion[]>> {
    log("getQuestions →", params);
    return get<ResponseModel<InterviewQuestion[]>>(
      `${BASE_URL}/questions`,
      params as Record<string, unknown>,
    );
  },

  getGameLevels(): Promise<ResponseModel<GameLevel[]>> {
    log("getGameLevels →");
    return get<ResponseModel<GameLevel[]>>(`${BASE_URL}/game/levels`);
  },

  getGameStats(): Promise<ResponseModel<GameStats>> {
    log("getGameStats →");
    return get<ResponseModel<GameStats>>(`${BASE_URL}/game/stats`);
  },

  getGameAchievements(): Promise<ResponseModel<GameAchievement[]>> {
    log("getGameAchievements →");
    return get<ResponseModel<GameAchievement[]>>(
      `${BASE_URL}/game/achievements`,
    );
  },

  getLeaderboard(): Promise<ResponseModel<LeaderboardEntry[]>> {
    log("getLeaderboard →");
    return get<ResponseModel<LeaderboardEntry[]>>(
      `${BASE_URL}/game/leaderboard`,
    );
  },
};
