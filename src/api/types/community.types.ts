export type PostCategory = 'interview_review' | 'real_questions' | 'experience';

export interface Post {
  id: number;
  title: string;
  content: string;
  category: PostCategory;
  author_id: number;
  author_name?: string;
  author_avatar?: string;
  likes_count: number;
  comments_count: number;
  is_liked?: boolean;
  ai_review_content?: string;
  created_at: string;
  updated_at: string;
}

export interface PostCreate {
  title: string;
  content: string;
  category: PostCategory;
}

export interface Comment {
  id: number;
  post_id: number;
  author_id: number;
  author_name?: string;
  content: string;
  parent_id?: number;
  replies?: Comment[];
  created_at: string;
}

export interface CommentCreate {
  content: string;
  parent_id?: number;
}

export interface LikeResult {
  liked: boolean;
  likes_count: number;
}

export interface FollowResult {
  following: boolean;
}

export interface AiReviewResult {
  task_id: string;
  status: string;
  ai_review_content?: string;
}

export interface HotTopic {
  id: number;
  title: string;
  posts: number;
  participants: number;
}

export interface ActiveUser {
  id: number;
  name: string;
  avatar: string;
  posts: number;
  followers: number;
  bio: string;
}
