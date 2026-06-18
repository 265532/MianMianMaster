// ============================================================
// assessment 模块 — 自动生成类型骨架
// 来源: docs/api/schemas/assessment.openapi.json
// 用途: 作为 src/api/types/ 下手动类型的参考基准，对齐后端 Schema
// ============================================================

export interface Assessment {
  /** Id */
  id: number;

  /** Title */
  title?: string | null;

  /** Type */
  type?: string | null;

  /** Created At */
  created_at: string;

}

export interface AssessmentQuestion {
  /** Id */
  id: number;

  /** Type */
  type: string;

  /** Content */
  content: string;

  /** Options */
  options?: string[];

  /** Correct Answer */
  correct_answer?: string | null;

  /** Points */
  points: number;

}

export interface AssessmentCreate {
  /** Type */
  type?: string | null;

  /** Questions */
  questions: AssessmentQuestion[];

}

export interface AssessmentAnswerItem {
  /** Question Id */
  question_id: number;

  /** Answer */
  answer: string;

}

export interface AssessmentSubmit {
  /** Assessment Id */
  assessment_id: number;

  /** Answers */
  answers: AssessmentAnswerItem[];

}

export interface AssessmentResult {
  /** Id */
  id: number;

  /** Assessment Id */
  assessment_id: number;

  /** Score */
  score?: number | null;

  /** Details */
  details?: Record<string, unknown>;

  /** Created At */
  created_at: string;

}
