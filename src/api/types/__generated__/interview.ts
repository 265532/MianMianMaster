// ============================================================
// interview 模块 — 自动生成类型骨架
// 来源: docs/api/schemas/interview.openapi.json
// 用途: 作为 src/api/types/ 下手动类型的参考基准，对齐后端 Schema
// ============================================================

export interface InterviewSessionCreate {
  /** Job Title */
  job_title: string;

  /** Company */
  company?: string | null;

  /** Type */
  type?: string | null;

  /** Max Rounds */
  max_rounds?: number | null;

}

export interface InterviewSession {
  /** Id */
  id: string;

  /** Job Title */
  job_title: string;

  /** Company */
  company?: string | null;

  /** Status */
  status: string;

  /** Type */
  type?: string | null;

  /** Max Rounds */
  max_rounds?: number | null;

  /** Current Round */
  current_round?: number | null;

  /** Created At */
  created_at: string;

  /** Started At */
  started_at?: string | null;

  /** Ended At */
  ended_at?: string | null;

  /** Total Score */
  total_score?: number | null;

  /** Feedback */
  feedback?: string | null;

  /** Details */
  details?: Record<string, unknown> | null;

}

export interface ChatRequest {
  /** 用户发送的面试回答 */
  message: string;

}

export interface InterviewReport {
  /** Session Id */
  session_id: string;

  /** Status */
  status: string;

  /** Overall Score */
  overall_score?: number | null;

  /** Dimensions */
  dimensions?: Record<string, unknown> | null;

  /** Strengths */
  strengths?: string[];

  /** Weaknesses */
  weaknesses?: string[];

  /** Suggestions */
  suggestions?: string[];

  /** Generated At */
  generated_at?: string | null;

}

export interface InterviewQuestion {
  /** Id */
  id: string;

  /** Content */
  content: string;

  /** Type */
  type: string;

  /** Difficulty */
  difficulty: string;

  /** Category */
  category: string;

  /** Answered */
  answered: boolean;

  /** Answer */
  answer?: string | null;

  /** Score */
  score?: number | null;

  /** Star Answer */
  starAnswer?: Record<string, unknown> | null;

  /** Alternative Answers */
  alternativeAnswers?: Record<string, unknown>[];

  /** Common Mistakes */
  commonMistakes?: string[];

}

export interface GameLevel {
  /** Id */
  id: number;

  /** Name */
  name: string;

  /** Title */
  title: string;

  /** Status */
  status: string;

  /** Progress */
  progress: number;

  /** Description */
  description: string;

  /** Interviews */
  interviews: number;

  /** Completed */
  completed: number;

  /** Time Spent */
  timeSpent: string;

  /** Success Rate */
  successRate: string;

  /** Skills */
  skills?: string[];

  /** Unlock Requirements */
  unlockRequirements?: string | null;

  /** Icon */
  icon: string;

  /** Background */
  background: string;

  /** Difficulty */
  difficulty: string;

  /** Reward */
  reward: string;

  /** Question Count */
  questionCount: number;

  /** Time Limit */
  timeLimit: number;

}

export interface GameStats {
  /** Completed Levels */
  completedLevels: number;

  /** Total Questions */
  totalQuestions: number;

  /** Correct Rate */
  correctRate: string;

  /** Certifications */
  certifications: number;

  /** Streak */
  streak: string;

  /** Total Score */
  totalScore: string;

}

export interface GameAchievement {
  /** Id */
  id: number;

  /** Name */
  name: string;

  /** Description */
  description: string;

  /** Unlocked */
  unlocked: boolean;

  /** Unlocked At */
  unlockedAt?: string | null;

  /** Progress */
  progress?: number | null;

  /** Icon */
  icon?: string | null;

}

export interface LeaderboardEntry {
  /** Rank */
  rank: number;

  /** Name */
  name: string;

  /** Score */
  score: number;

  /** Avatar */
  avatar: string;

  /** Is Current User */
  isCurrentUser?: boolean;

}
