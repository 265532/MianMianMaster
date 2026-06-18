// ============================================================
// learning 模块 — 自动生成类型骨架
// 来源: docs/api/schemas/learning.openapi.json
// 用途: 作为 src/api/types/ 下手动类型的参考基准，对齐后端 Schema
// ============================================================

export interface CourseCreate {
  /** Title */
  title: string;

  /** Description */
  description?: string | null;

  /** Category */
  category?: string | null;

  /** Difficulty */
  difficulty?: string | null;

}

export interface Course {
  /** Id */
  id: number;

  /** Title */
  title: string;

  /** Description */
  description?: string | null;

  /** Category */
  category?: string | null;

  /** Difficulty */
  difficulty?: string | null;

  /** Created At */
  created_at: string;

  /** Updated At */
  updated_at: string;

}

export interface MaterialCreate {
  /** Course Id */
  course_id: number;

  /** Title */
  title: string;

  /** Type */
  type?: string | null;

  /** Url */
  url?: string | null;

}

export interface Material {
  /** Id */
  id: number;

  /** Course Id */
  course_id: number;

  /** Title */
  title: string;

  /** Type */
  type?: string | null;

  /** Url */
  url?: string | null;

  /** Created At */
  created_at: string;

}

export interface ProgressUpdateRequest {
  /** Course Id */
  course_id: number;

  /** 进度百分比 0-100 */
  progress: number;

}

export interface LearningProgress {
  /** Id */
  id: number;

  /** User Id */
  user_id: number;

  /** Course Id */
  course_id: number;

  /** Progress */
  progress: number;

  /** Updated At */
  updated_at: string;

}

export interface AddToCollectionRequest {
  /** Title */
  title: string;

  /** Description */
  description?: string | null;

  /** Question Ids */
  question_ids?: number[];

  /** Category */
  category?: string | null;

  /** Difficulty */
  difficulty?: string | null;

}

export interface Collection {
  /** Id */
  id: number;

  /** Title */
  title: string;

  /** Description */
  description?: string | null;

  /** Question Count */
  question_count?: number | null;

  /** Category */
  category?: string | null;

  /** Difficulty */
  difficulty?: string | null;

  /** Saved At */
  saved_at?: string | null;

  /** Last Practiced */
  last_practiced?: string | null;

}

export interface RecordWrongQuestionRequest {
  /** Question */
  question: string;

  /** User Answer */
  user_answer?: string | null;

  /** Correct Answer */
  correct_answer?: string | null;

  /** Explanation */
  explanation?: string | null;

  /** Category */
  category?: string | null;

  /** Difficulty */
  difficulty?: string | null;

}

export interface WrongQuestion {
  /** Id */
  id: number;

  /** Question */
  question: string;

  /** User Answer */
  user_answer?: string | null;

  /** Correct Answer */
  correct_answer?: string | null;

  /** Explanation */
  explanation?: string | null;

  /** Category */
  category?: string | null;

  /** Difficulty */
  difficulty?: string | null;

  /** Mistake Count */
  mistake_count?: number | null;

  /** Last Mistake At */
  last_mistake_at?: string | null;

  /** Status */
  status?: string | null;

}

export interface CreateBadgeRequest {
  /** Name */
  name: string;

  /** Description */
  description?: string | null;

  /** Icon Url */
  icon_url?: string | null;

}

export interface Badge {
  /** Id */
  id: number;

  /** Name */
  name: string;

  /** Description */
  description?: string | null;

  /** Icon Url */
  icon_url?: string | null;

  /** Created At */
  created_at: string;

}

export interface UserBadge {
  /** Id */
  id: number;

  /** Badge Id */
  badge_id: number;

  /** badge */
  badge?: Badge | null;

  /** Awarded At */
  awarded_at: string;

}
