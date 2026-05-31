import { get, post } from '@/utils/request'
import type {
  Post,
  PostCreate,
  Comment,
  CommentCreate,
  LikeResult,
  FollowResult,
  AiReviewResult
} from '../types/community.types'
import type { ResponseModel, PaginationParams } from '../types/response.types'

const BASE_URL = '/community'

export const communityApi = {
  getPosts(
    params?: PaginationParams & { keyword?: string }
  ): Promise<ResponseModel<Post[]>> {
    return get<ResponseModel<Post[]>>(`${BASE_URL}/posts/feed`, params as Record<string, any>)
  },

  getPost(postId: number): Promise<ResponseModel<Post>> {
    return get<ResponseModel<Post>>(`${BASE_URL}/posts/${postId}`)
  },

  createPost(data: PostCreate): Promise<ResponseModel<Post>> {
    return post<ResponseModel<Post>>(`${BASE_URL}/posts`, data)
  },

  createComment(postId: number, data: CommentCreate): Promise<ResponseModel<Comment>> {
    return post<ResponseModel<Comment>>(`${BASE_URL}/posts/${postId}/comments`, data)
  },

  toggleLike(postId: number): Promise<ResponseModel<LikeResult>> {
    return post<ResponseModel<LikeResult>>(`${BASE_URL}/posts/${postId}/like`)
  },

  toggleFollow(userId: number): Promise<ResponseModel<FollowResult>> {
    return post<ResponseModel<FollowResult>>(`${BASE_URL}/users/${userId}/follow`)
  },

  triggerAiReview(postId: number): Promise<ResponseModel<AiReviewResult>> {
    return post<ResponseModel<AiReviewResult>>(`${BASE_URL}/posts/${postId}/ai-review`)
  },

  getPostComments(postId: number): Promise<ResponseModel<Comment[]>> {
    return get<ResponseModel<Comment[]>>(`${BASE_URL}/posts/${postId}/comments`)
  },

  getHotTopics(): Promise<ResponseModel<any[]>> {
    return get<ResponseModel<any[]>>(`${BASE_URL}/hot-topics`)
  },

  getActiveUsers(): Promise<ResponseModel<any[]>> {
    return get<ResponseModel<any[]>>(`${BASE_URL}/active-users`)
  }
}
