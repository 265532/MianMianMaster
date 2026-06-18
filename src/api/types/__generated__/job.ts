// ============================================================
// job 模块 — 自动生成类型骨架
// 来源: docs/api/schemas/job.openapi.json
// 用途: 作为 src/api/types/ 下手动类型的参考基准，对齐后端 Schema
// ============================================================

export interface JobPositionCreate {
  /** Title */
  title: string;

  /** Description */
  description?: string | null;

  /** Company */
  company?: string | null;

  /** Location */
  location?: string | null;

  /** Salary Range */
  salary_range?: string | null;

  /** Requirements */
  requirements?: string[];

}

export interface JobPosition {
  /** Id */
  id: number;

  /** Title */
  title: string;

  /** Description */
  description?: string | null;

  /** Company */
  company?: string | null;

  /** Location */
  location?: string | null;

  /** Salary Range */
  salary_range?: string | null;

  /** Requirements */
  requirements?: string[];

  /** Created At */
  created_at: string;

  /** Updated At */
  updated_at: string;

}

export interface SkillTreeNode {
  /** Id */
  id: number;

  /** Name */
  name: string;

  /** Category */
  category?: string | null;

  /** Level */
  level?: number | null;

  /** Is Required */
  is_required: boolean;

  /** Has Required Child */
  has_required_child: boolean;

  /** Children */
  children?: SkillTreeNode[];

}

export interface JobMatchResult {
  /** Job Id */
  job_id: number;

  /** Match Score */
  match_score: number;

  /** Matched Skills */
  matched_skills?: string[];

  /** Missing Skills */
  missing_skills?: string[];

}
