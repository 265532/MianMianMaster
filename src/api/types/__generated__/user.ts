// ============================================================
// user 模块 — 自动生成类型骨架
// 来源: docs/api/schemas/user.openapi.json
// 用途: 作为 src/api/types/ 下手动类型的参考基准，对齐后端 Schema
// ============================================================

export interface UserProfileUpdate {
  /** Avatar Url */
  avatar_url?: string | null;

  /** Education */
  education?: string | null;

  /** Target Position */
  target_position?: string | null;

  /** Work Years */
  work_years?: number | null;

}

export interface ChangePasswordRequest {
  /** Old Password */
  old_password: string;

  /** New Password */
  new_password: string;

}

export interface ChangePhoneRequest {
  /** New Phone */
  new_phone: string;

  /** Code */
  code: string;

}

export interface User {
  /** Username */
  username: string;

  /** Email */
  email: string;

  /** Phone */
  phone?: string | null;

  /** Is Active */
  is_active?: boolean;

  /** Id */
  id: number;

  /** Created At */
  created_at: string;

  /** Updated At */
  updated_at: string;

  /** Roles */
  roles?: Role[];

  /** profile */
  profile?: UserProfile | null;

}

export interface UserProfile {
  /** Avatar Url */
  avatar_url?: string | null;

  /** Education */
  education?: string | null;

  /** Target Position */
  target_position?: string | null;

  /** Work Years */
  work_years?: number | null;

  /** Id */
  id: number;

  /** User Id */
  user_id: number;

  /** Created At */
  created_at: string;

  /** Updated At */
  updated_at: string;

}

export interface Role {
  /** Name */
  name: string;

  /** Description */
  description?: string | null;

  /** Parent Id */
  parent_id?: number | null;

  /** Id */
  id: number;

  /** Created At */
  created_at: string;

  /** Updated At */
  updated_at: string;

  /** Permissions */
  permissions?: Permission[];

}

export interface Permission {
  /** Name */
  name: string;

  /** Description */
  description?: string | null;

  /** Resource */
  resource: string;

  /** Action */
  action: string;

  /** Id */
  id: number;

  /** Created At */
  created_at: string;

  /** Updated At */
  updated_at: string;

}

export interface InterviewHistoryItem {
  /** Id */
  id: number;

  /** YYYY-MM-DD */
  date: string;

  /** Company */
  company: string;

  /** Position */
  position: string;

  /** 一面/二面/三面/HR面 */
  round: string;

  /** 技术面/产品面/设计面/HR面 */
  type: string;

  /** Score */
  score: number;

  /** passed/failed/pending */
  status: string;

  /** Tags */
  tags?: string[];

  /** Feedback */
  feedback?: string | null;

  /** details */
  details?: InterviewDetails | null;

}

export interface InterviewDetails {
  /** Technical */
  technical: number;

  /** Communication */
  communication: number;

  /** Logic */
  logic: number;

  /** Problem Solving */
  problem_solving: number;

}

export interface InterviewHistoryResponse {
  /** Items */
  items: InterviewHistoryItem[];

  /** Total */
  total: number;

  /** Page */
  page: number;

  /** Page Size */
  page_size: number;

}

export interface AbilityDataIndicator {
  /** Name */
  name: string;

  /** Max */
  max: number;

}

export interface AbilityDataGapSkill {
  /** Name */
  name: string;

  /** Gap */
  gap: number;

  /** low/medium/high */
  level: string;

}

export interface AbilityDataStrength {
  /** Name */
  name: string;

  /** Score */
  score: number;

}

export interface AbilityDataItem {
  /** Current */
  current: number[];

  /** Required */
  required: number[];

  /** Indicators */
  indicators: AbilityDataIndicator[];

  /** Gap Skills */
  gap_skills: AbilityDataGapSkill[];

  /** Strengths */
  strengths: AbilityDataStrength[];

}

export interface GameStatItem {
  /** Label */
  label: string;

  /** Value */
  value: string;

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
  interviews?: number;

  /** Completed */
  completed?: number;

  /** Time Spent */
  timeSpent?: string;

  /** Success Rate */
  successRate?: string;

  /** Skills */
  skills?: string[];

  /** Unlock Requirements */
  unlockRequirements?: string | null;

  /** Icon */
  icon?: string;

  /** Background */
  background?: string;

  /** Difficulty */
  difficulty: string;

  /** Reward */
  reward?: string;

  /** Question Count */
  questionCount?: number;

  /** Time Limit */
  timeLimit?: number;

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

export interface GameInterviewDataResponse {
  /** Stats */
  stats: GameStatItem[];

  /** Levels */
  levels: GameLevel[];

  /** Achievements */
  achievements: GameAchievement[];

  /** Leaderboard */
  leaderboard: LeaderboardEntry[];

}

export interface ResumeBasicInfo {
  /** Name */
  name: string;

  /** Major */
  major: string;

  /** Grade */
  grade: string;

  /** School */
  school: string;

}

export interface ResumeEducation {
  /** School */
  school: string;

  /** Degree */
  degree: string;

  /** Major */
  major: string;

  /** Period */
  period: string;

}

export interface ResumeExperience {
  /** Company */
  company: string;

  /** Position */
  position: string;

  /** Period */
  period: string;

  /** Description */
  description: string;

}

export interface ResumeProject {
  /** Name */
  name: string;

  /** Role */
  role: string;

  /** Period */
  period: string;

  /** Description */
  description: string;

}

export interface ResumeData {
  /** basic_info */
  basic_info: ResumeBasicInfo;

  /** Education */
  education: ResumeEducation[];

  /** Experience */
  experience: ResumeExperience[];

  /** Skills */
  skills: string[];

  /** Projects */
  projects: ResumeProject[];

}

export interface MatchRateItem {
  /** Position */
  position: string;

  /** Rate */
  rate: number;

}

export interface ResumeDiagnosisResult {
  /** Overall Score */
  overall_score: number;

  /** Strengths */
  strengths: string[];

  /** Weaknesses */
  weaknesses: string[];

  /** Match Rate */
  match_rate: MatchRateItem[];

  /** Suggestions */
  suggestions: string[];

}
