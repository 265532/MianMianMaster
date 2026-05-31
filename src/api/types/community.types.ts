export interface Post {
  id: number
  title: string
  content: string
  author_id: number
  author_name?: string
  author_avatar?: string
  likes_count: number
  comments_count: number
  is_liked?: boolean
  created_at: string
  updated_at: string
}

export interface PostCreate {
  title: string
  content: string
}

export interface Comment {
  id: number
  post_id: number
  author_id: number
  author_name?: string
  content: string
  created_at: string
}

export interface CommentCreate {
  content: string
}

export interface LikeResult {
  liked: boolean
  likes_count: number
}

export interface FollowResult {
  following: boolean
}

export interface AiReviewResult {
  task_id: string
  status: string
}
