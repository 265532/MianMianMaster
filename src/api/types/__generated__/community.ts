// ============================================================
// community 模块 — 自动生成类型骨架
// 来源: docs/api/schemas/community.openapi.json
// 用途: 作为 src/api/types/ 下手动类型的参考基准，对齐后端 Schema
// ============================================================

export interface PostCreate {
  /** Title */
  title: string;

  /** Content */
  content: string;

  /** Category */
  category: string;

}

export interface PostUpdate {
  /** Title */
  title?: string | null;

  /** Content */
  content?: string | null;

  /** Category */
  category?: string | null;

}

export interface Post {
  /** Id */
  id: number;

  /** Title */
  title: string;

  /** Content */
  content: string;

  /** Category */
  category: string;

  /** Author Id */
  author_id: number;

  /** Author Name */
  author_name?: string | null;

  /** Author Avatar */
  author_avatar?: string | null;

  /** Likes Count */
  likes_count?: number;

  /** Comments Count */
  comments_count?: number;

  /** Is Liked */
  is_liked?: boolean;

  /** AI Review Content */
  ai_review_content?: string | null;

  /** Created At */
  created_at: string;

  /** Updated At */
  updated_at: string;

}

export interface CommentCreate {
  /** Content */
  content: string;

  /** 楼中楼回复目标评论ID */
  parent_id?: number | null;

}

export interface Comment {
  /** Id */
  id: number;

  /** Post Id */
  post_id: number;

  /** Author Id */
  author_id: number;

  /** Author Name */
  author_name?: string | null;

  /** Content */
  content: string;

  /** Parent Id */
  parent_id?: number | null;

  /** Replies */
  replies?: Comment[];

  /** Created At */
  created_at: string;

}

export interface LikeResult {
  /** Liked */
  liked: boolean;

  /** Likes Count */
  likes_count: number;

}

export interface FollowResult {
  /** Following */
  following: boolean;

}

export interface AiReviewResult {
  /** Task Id */
  task_id: string;

  /** Status */
  status: string;

  /** AI Review Content */
  ai_review_content?: string | null;

}

export interface HotTopic {
  /** Id */
  id: number;

  /** Title */
  title: string;

  /** Posts */
  posts: number;

  /** Participants */
  participants: number;

}

export interface ActiveUser {
  /** Id */
  id: number;

  /** Name */
  name: string;

  /** Avatar */
  avatar: string;

  /** Posts */
  posts: number;

  /** Followers */
  followers: number;

  /** Bio */
  bio: string;

}
