/** 面试会话 */
export interface InterviewSession {
  id: number;
  candidate_id: number;
  config_id?: number | null;
  strategy_id?: number | null;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  current_round?: number;
  score?: number;
  summary?: string;
  start_time?: string;
  end_time?: string;
  created_at: string;
  conversation_turns?: unknown[];
}

/** 创建面试会话请求 */
export interface InterviewSessionCreate {
  job_position_id?: number;
  strategy_id?: number;
  max_rounds?: number;
}

/** 开始面试响应 */
export interface InterviewStartResponse {
  session_id: number;
  opening_message: string;
  status: string;
}

/** 聊天请求 */
export interface ChatRequest {
  message: string;
}

/** 面试报告 */
export interface InterviewReport {
  id: number;
  session_id: number;
  content_score?: number;
  depth_score?: number;
  logic_score?: number;
  match_score?: number;
  overall_score?: number;
  clarity_score?: number;
  confidence_score?: number;
  strength_areas?: string[];
  weakness_areas?: string[];
  improvement_plan?: string;
  offer_recommendation?: string;
  full_report_text?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

/** 面试题目 */
export interface InterviewQuestion {
  id: number;
  content: string;
  question_type: string;
  difficulty?: string | null;
}

/** SSE 事件类型 */
export type SseEventType = "token" | "done" | "error" | "round_limit";

/** SSE 事件 */
export interface SseEvent {
  type: SseEventType;
  data: string;
}

/** 游戏关卡 */
export interface GameLevel {
  id: number;
  name: string;
  description?: string;
  difficulty: string;
  is_unlocked?: boolean;
  questions_count?: number;
}

/** 游戏统计 */
export interface GameStats {
  total_xp?: number;
  current_level?: number;
  completed_challenges?: number;
  accuracy_rate?: number;
}

/** 游戏成就 */
export interface GameAchievement {
  id: number;
  name: string;
  description?: string;
  icon_url?: string;
  is_unlocked?: boolean;
  unlocked_at?: string | null;
}

/** 排行榜条目 */
export interface LeaderboardEntry {
  rank: number;
  user_id: number;
  username: string;
  avatar_url?: string;
  score: number;
}
