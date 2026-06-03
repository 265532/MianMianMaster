import type { components } from "@/api/generated/api-schema";

/**
 * User API 类型定义
 *
 * 所有字段统一使用 snake_case，匹配后端线格式。
 * 后端已有 Schema 的类型从生成文件 re-export。
 */

// ─── 从后端 Schema 派生的类型 ─────────────────────────

/** 用户信息（来自 /auth/me 响应） */
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  roles: RoleResponse[];
  profile?: UserProfileResponse;
}

/** 用户画像 */
export interface UserProfileResponse {
  id: number;
  user_id: number;
  avatar_url?: string;
  education?: string;
  target_position?: string;
  work_years?: number;
  created_at: string;
  updated_at: string;
}

// ─── 请求类型 ────────────────────────────────────────

export interface UserProfileUpdateRequest {
  avatar_url?: string;
  education?: string;
  target_position?: string;
  work_years?: number;
}

/** 角色（后端 Schema 中有，暂在 role 模块统一处理） */
export interface RoleResponse {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  created_at: string;
  updated_at: string;
}

/** 权限 */
export interface PermissionResponse {
  id: number;
  name: string;
  description?: string;
  resource: string;
  action: string;
  created_at: string;
  updated_at: string;
}

// ─── 面试历史（蛇形命名） ─────────────────────────────

export interface InterviewHistoryItem {
  id: number;
  date: string;
  company: string;
  position: string;
  round: string;
  type: string;
  score: number;
  status: string;
  tags?: string[];
  feedback?: string;
  details?: {
    technical: number;
    communication: number;
    logic: number;
    problem_solving: number;
  };
}

export interface InterviewHistoryResponse {
  items: InterviewHistoryItem[];
  total: number;
  page: number;
  page_size: number;
}

// ─── 能力数据 ────────────────────────────────────────

export interface AbilityDataIndicator {
  name: string;
  max: number;
}

export interface AbilityDataGapSkill {
  name: string;
  gap: number;
  level: string;
}

export interface AbilityDataStrength {
  name: string;
  score: number;
}

export interface AbilityDataItem {
  current: number[];
  required: number[];
  indicators: AbilityDataIndicator[];
  gap_skills: AbilityDataGapSkill[];
  strengths: AbilityDataStrength[];
}

// ─── 游戏化面试数据 ───────────────────────────────────

export interface GameStatItem {
  label: string;
  value: string | number;
}

export interface GameInterviewDataResponse {
  stats: GameStatItem[];
  levels: import("@/api/types/interview.types").GameLevel[];
  achievements: import("@/api/types/interview.types").GameAchievement[];
  leaderboard: import("@/api/types/interview.types").LeaderboardEntry[];
}

// ─── 简历数据 ────────────────────────────────────────

export interface ResumeBasicInfo {
  name: string;
  major: string;
  grade: string;
  school: string;
}

export interface ResumeEducation {
  school: string;
  degree: string;
  major: string;
  period: string;
}

export interface ResumeExperience {
  company: string;
  position: string;
  period: string;
  description: string;
}

export interface ResumeProject {
  name: string;
  role: string;
  period: string;
  description: string;
}

export interface ResumeData {
  basic_info: ResumeBasicInfo;
  education: ResumeEducation[];
  experience: ResumeExperience[];
  skills: string[];
  projects: ResumeProject[];
}

export interface ResumeDiagnosisResult {
  overall_score: number;
  strengths: string[];
  weaknesses: string[];
  match_rate: { position: string; rate: number }[];
  suggestions: string[];
}
