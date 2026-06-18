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
  is_active?: boolean;
  created_at: string;
  updated_at: string;
  roles?: RoleResponse[];
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
  permissions?: PermissionResponse[];
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

// ─── 面试历史（对齐 GET /user/interview-history 契约） ─────

export interface InterviewHistoryItem {
  id: number;
  status: string;
  score?: number;
  current_round?: number;
  job_position_title?: string;
  start_time?: string;
  end_time?: string;
  created_at: string;
}

// ─── 能力数据（对齐 GET /user/ability-data 契约） ──────────

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

/** GET /user/ability-data 响应类型 */
export interface AbilityDataResponse {
  abilities?: AbilityDataItem[];
  overall_level?: number;
}

// ─── 游戏化面试数据（对齐 GET /user/game-interview-data 契约） ──

/** GET /user/game-interview-data 响应类型 */
export interface GameInterviewDataResponse {
  total_sessions?: number;
  completed_sessions?: number;
  average_score?: number;
  current_streak?: number;
  best_streak?: number;
}

// ─── 简历数据（对齐 GET /user/resume 契约） ──────────────

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

/** GET /user/resume 响应类型 */
export interface ResumeData {
  id: number;
  user_id: number;
  name: string;
  phone?: string;
  email?: string;
  summary?: string;
  skills?: string[];
  experience?: ResumeExperience[];
  education?: ResumeEducation[];
  created_at: string;
  updated_at: string;
}

// ─── 简历诊断（对齐 POST /user/resume/diagnose 契约） ──────

export interface ResumeDiagnoseScoreItem {
  category: string;
  score: number;
  suggestion?: string;
}

/** POST /user/resume/diagnose 请求类型 */
export interface ResumeDiagnoseRequest {
  resume_id: number;
  target_position?: string;
}

/** POST /user/resume/diagnose 响应类型 */
export interface ResumeDiagnoseResult {
  resume_id: number;
  overall_score: number;
  scores?: ResumeDiagnoseScoreItem[];
  summary: string;
  created_at: string;
}
