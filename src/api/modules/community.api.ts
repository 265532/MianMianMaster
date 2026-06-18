import { get, post, put, del } from "@/utils/request";
import type {
  Post,
  PostCreate,
  Comment,
  CommentCreate,
  LikeResult,
  FollowResult,
  AiReviewResult,
  HotTopic,
  ActiveUser,
} from "../types/community.types";
import type { ResponseModel, PaginationParams } from "../types/response.types";

const BASE_URL = "/community";

export const communityApi = {
  getPosts(
    params?: PaginationParams & { keyword?: string },
  ): Promise<ResponseModel<Post[]>> {
    return get<ResponseModel<Post[]>>(
      `${BASE_URL}/posts/feed`,
      params as Record<string, any>,
    );
  },

  getPost(postId: number): Promise<ResponseModel<Post>> {
    return get<ResponseModel<Post>>(`${BASE_URL}/posts/${postId}`);
  },

  createPost(data: PostCreate): Promise<ResponseModel<Post>> {
    return post<ResponseModel<Post>>(`${BASE_URL}/posts`, data);
  },

  editPost(postId: number, data: PostCreate): Promise<ResponseModel<Post>> {
    return put<ResponseModel<Post>>(`${BASE_URL}/posts/${postId}`, data);
  },

  deletePost(postId: number): Promise<ResponseModel<string>> {
    return del<ResponseModel<string>>(`${BASE_URL}/posts/${postId}`);
  },

  createComment(
    postId: number,
    data: CommentCreate,
  ): Promise<ResponseModel<Comment>> {
    return post<ResponseModel<Comment>>(
      `${BASE_URL}/posts/${postId}/comments`,
      data,
    );
  },

  toggleLike(postId: number): Promise<ResponseModel<LikeResult>> {
    return post<ResponseModel<LikeResult>>(`${BASE_URL}/posts/${postId}/like`);
  },

  toggleFollow(userId: number): Promise<ResponseModel<FollowResult>> {
    return post<ResponseModel<FollowResult>>(
      `${BASE_URL}/users/${userId}/follow`,
    );
  },

  triggerAiReview(postId: number): Promise<ResponseModel<AiReviewResult>> {
    return post<ResponseModel<AiReviewResult>>(
      `${BASE_URL}/posts/${postId}/ai-review`,
    );
  },

  getPostComments(postId: number): Promise<ResponseModel<Comment[]>> {
    return get<ResponseModel<Comment[]>>(
      `${BASE_URL}/posts/${postId}/comments`,
    );
  },

  getHotTopics(): Promise<ResponseModel<HotTopic[]>> {
    return get<ResponseModel<HotTopic[]>>(`${BASE_URL}/hot-topics`);
  },

  getActiveUsers(): Promise<ResponseModel<ActiveUser[]>> {
    return get<ResponseModel<ActiveUser[]>>(`${BASE_URL}/active-users`);
  },
};
