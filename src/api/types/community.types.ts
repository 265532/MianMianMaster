/**
 * Community 模块类型定义
 * 与后端契约严格对齐 (api-contract-summary.md § Community)
 * 端点 C1-C12
 */

/** 帖子分类 (与后端 enum 对齐) */
export type PostCategory =
  | "interview_review"
  | "real_questions"
  | "experience";

/** 帖子状态 */
export type PostStatus = "draft" | "published" | "archived";

/** AI 分析状态 */
export type AiAnalysisStatus = "pending" | "processing" | "completed" | "failed";

/**
 * 帖子响应 (C1/C2/C3/C4 响应)
 * 契约字段: id, title, content, category, status?, user_id, ai_analysis_status,
 *           ai_review_content?, created_at, updated_at, likes_count?, comments_count?
 */
export interface Post {
  id: number;
  title: string;
  content: string;
  category: PostCategory;
  status?: PostStatus;
  user_id: number;
  ai_analysis_status: AiAnalysisStatus;
  ai_review_content?: string;
  created_at: string;
  updated_at: string;
  likes_count?: number;
  comments_count?: number;
}

/**
 * 创建帖子请求 (C1 请求)
 * 契约字段: title, content, category, status?
 */
export interface PostCreate {
  title: string;
  content: string;
  category: PostCategory;
  status?: PostStatus;
}

/**
 * 更新帖子请求 (C4 请求)
 * 契约字段: title?, content?, category?, status? (全部可选)
 */
export interface PostUpdate {
  title?: string;
  content?: string;
  category?: PostCategory;
  status?: PostStatus;
}

/**
 * 评论响应 (C6/C7 响应)
 * 契约字段: content, parent_id?, id, post_id, user_id, created_at, updated_at
 */
export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  parent_id?: number;
  created_at: string;
  updated_at: string;
}

/**
 * 创建评论请求 (C6 请求)
 * 契约字段: content, parent_id?, post_id
 */
export interface CommentCreate {
  content: string;
  parent_id?: number;
  post_id: number;
}

/**
 * 热门话题 (C11 响应)
 * 契约字段: id, title, posts_count?, category
 */
export interface HotTopic {
  id: number;
  title: string;
  posts_count?: number;
  category: PostCategory;
}

/**
 * 活跃用户 (C12 响应)
 * 契约字段: id, username, avatar_url?, posts_count?, followers_count?
 */
export interface ActiveUser {
  id: number;
  username: string;
  avatar_url?: string;
  posts_count?: number;
  followers_count?: number;
}
