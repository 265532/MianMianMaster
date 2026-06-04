/** 课程 */
export interface Course {
  id: number;
  title: string;
  description?: string;
  level?: string;
  cover_url?: string | null;
  created_at: string;
  updated_at: string;
  materials?: CourseMaterial[];
}

/** 创建课程请求 */
export interface CourseCreate {
  title: string;
  description?: string;
  level?: string;
  cover_url?: string;
}

/** 课程材料 */
export interface CourseMaterial {
  id: number;
  course_id: number;
  title: string;
  material_type: string;
  url: string;
  duration?: number;
  order_num?: number;
  knowledge_graph_id?: number;
  created_at: string;
}

/** 创建材料请求 */
export interface MaterialCreate {
  title: string;
  material_type: string;
  url: string;
  course_id: number;
  duration?: number;
  order_num?: number;
  knowledge_graph_id?: number;
}

/** 学习进度 */
export interface LearningProgress {
  id: number;
  user_id: number;
  course_id: number;
  material_id: number;
  progress_percent: number;
  is_completed?: boolean;
  last_accessed_at: string;
}

/** 更新进度请求（body部分） */
export interface ProgressUpdateBody {
  progress_percent: number;
  is_completed?: boolean;
}

/** 收藏集 */
export interface Collection {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  category?: string;
  difficulty?: string;
  questions?: unknown[];
  created_at: string;
}

/** 创建收藏集请求 */
export interface CollectionCreate {
  title: string;
  description?: string;
  category?: string;
  difficulty?: string;
  question_ids?: number[];
}

/** 错题 */
export interface WrongQuestion {
  id: number;
  user_id: number;
  question_id: number;
  wrong_answer: unknown;
  answer_count: number;
  is_mastered: boolean;
  last_answered_at: string;
}

/** 记录错题请求 */
export interface WrongQuestionCreate {
  question_id: number;
  wrong_answer: unknown;
}

/** 徽章 */
export interface Badge {
  id: number;
  name: string;
  description?: string;
  icon_url?: string;
  condition_type: string;
  condition_value?: string;
  created_at: string;
}

/** 创建徽章请求 */
export interface BadgeCreate {
  name: string;
  description?: string;
  icon_url?: string;
  condition_type: string;
  condition_value?: string;
}

/** 用户徽章 */
export interface UserBadge {
  id: number;
  user_id: number;
  badge_id: number;
  awarded_at: string;
  tx_hash?: string;
}
