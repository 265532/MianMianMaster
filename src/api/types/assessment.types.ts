/** 测评列表项 / 创建响应 */
export interface Assessment {
  id: number;
  title: string;
  description?: string;
  job_position_id?: number | null;
  created_at: string;
  updated_at: string;
  questions_count?: number;
  questions?: AssessmentQuestion[];
}

/** 测评题目 */
export interface AssessmentQuestion {
  id: number;
  content: string;
  question_type: 'single_choice' | 'multiple_choice' | 'text';
  options?: string[];
  correct_answer?: string | string[];
  points?: number;
}

/** 创建测评题目请求 */
export interface QuestionCreate {
  content: string;
  question_type: 'single_choice' | 'multiple_choice' | 'text';
  options?: string[];
  correct_answer?: string | string[];
  points?: number;
}

/** 创建测评请求 */
export interface AssessmentCreate {
  title: string;
  description?: string;
  job_position_id?: number;
  questions?: QuestionCreate[];
}

/** 提交测评答案项 */
export interface AssessmentSubmitItem {
  question_id: number;
  answer: string | string[];
}

/** 提交测评请求 */
export interface AssessmentSubmit {
  assessment_id: number;
  answers: AssessmentSubmitItem[];
}

/** 测评结果 */
export interface AssessmentResult {
  id: number;
  user_id: number;
  assessment_id: number;
  total_score: number;
  details?: Record<string, unknown>;
  created_at: string;
}
