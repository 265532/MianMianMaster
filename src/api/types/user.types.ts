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

export interface UserProfileUpdateRequest {
  avatar_url?: string;
  education?: string;
  target_position?: string;
  work_years?: number;
}

export interface RoleResponse {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  created_at: string;
  updated_at: string;
  permissions: PermissionResponse[];
}

export interface PermissionResponse {
  id: number;
  name: string;
  description?: string;
  resource: string;
  action: string;
  created_at: string;
  updated_at: string;
}

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
  gapSkills: AbilityDataGapSkill[];
  strengths: AbilityDataStrength[];
}

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
  basicInfo: ResumeBasicInfo;
  education: ResumeEducation[];
  experience: ResumeExperience[];
  skills: string[];
  projects: ResumeProject[];
}

export interface ResumeDiagnosisResult {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  matchRate: { position: string; rate: number }[];
  suggestions: string[];
}
