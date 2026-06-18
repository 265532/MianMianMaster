import { get, post, put, del } from "@/utils/request";
import type {
  Post,
  PostCreate,
  PostUpdate,
  Comment,
  CommentCreate,
  HotTopic,
  ActiveUser,
} from "../types/community.types";
import type { ResponseModel, PaginationParams } from "../types/response.types";

const BASE_URL = "/community";

export const communityApi = {
  /**
   * C2: GET /community/posts/feed
   * 查询参数: skip?, limit?, keyword?
   */
  getPosts(
    params?: PaginationParams & { keyword?: string },
  ): Promise<ResponseModel<Post[]>> {
    return get<ResponseModel<Post[]>>(
      `${BASE_URL}/posts/feed`,
      params as Record<string, any>,
    );
  },

  /**
   * C3: GET /community/posts/{post_id}
   */
  getPost(postId: number): Promise<ResponseModel<Post>> {
    return get<ResponseModel<Post>>(`${BASE_URL}/posts/${postId}`);
  },

  /**
   * C1: POST /community/posts
   * 请求体: title, content, category, status?
   */
  createPost(data: PostCreate): Promise<ResponseModel<Post>> {
    return post<ResponseModel<Post>>(`${BASE_URL}/posts`, data);
  },

  /**
   * C4: PUT /community/posts/{post_id}
   * 请求体: title?, content?, category?, status? (全部可选)
   */
  editPost(
    postId: number,
    data: PostUpdate,
  ): Promise<ResponseModel<Post>> {
    return put<ResponseModel<Post>>(`${BASE_URL}/posts/${postId}`, data);
  },

  /**
   * C5: DELETE /community/posts/{post_id}
   * 响应: boolean
   */
  deletePost(postId: number): Promise<ResponseModel<boolean>> {
    return del<ResponseModel<boolean>>(`${BASE_URL}/posts/${postId}`);
  },

  /**
   * C6: POST /community/posts/{post_id}/comments
   * 请求体: content, parent_id?, post_id
   * 注意: post_id 同时存在于路径和请求体中 (契约要求)
   */
  createComment(
    postId: number,
    data: CommentCreate,
  ): Promise<ResponseModel<Comment>> {
    return post<ResponseModel<Comment>>(
      `${BASE_URL}/posts/${postId}/comments`,
      data,
    );
  },

  /**
   * C8: POST /community/posts/{post_id}/like
   * 响应: boolean (Toggle)
   */
  toggleLike(postId: number): Promise<ResponseModel<boolean>> {
    return post<ResponseModel<boolean>>(`${BASE_URL}/posts/${postId}/like`);
  },

  /**
   * C9: POST /community/users/{user_id}/follow
   * 响应: boolean (Toggle)
   */
  toggleFollow(userId: number): Promise<ResponseModel<boolean>> {
    return post<ResponseModel<boolean>>(
      `${BASE_URL}/users/${userId}/follow`,
    );
  },

  /**
   * C10: POST /community/posts/{post_id}/ai-review
   * 响应: string
   */
  triggerAiReview(postId: number): Promise<ResponseModel<string>> {
    return post<ResponseModel<string>>(
      `${BASE_URL}/posts/${postId}/ai-review`,
    );
  },

  /**
   * C7: GET /community/posts/{post_id}/comments
   * 查询参数: skip?, limit?
   */
  getPostComments(
    postId: number,
    params?: PaginationParams,
  ): Promise<ResponseModel<Comment[]>> {
    return get<ResponseModel<Comment[]>>(
      `${BASE_URL}/posts/${postId}/comments`,
      params as Record<string, any>,
    );
  },

  /**
   * C11: GET /community/hot-topics
   * 查询参数: skip?, limit?
   */
  getHotTopics(
    params?: PaginationParams,
  ): Promise<ResponseModel<HotTopic[]>> {
    return get<ResponseModel<HotTopic[]>>(
      `${BASE_URL}/hot-topics`,
      params as Record<string, any>,
    );
  },

  /**
   * C12: GET /community/active-users
   * 查询参数: skip?, limit?
   */
  getActiveUsers(
    params?: PaginationParams,
  ): Promise<ResponseModel<ActiveUser[]>> {
    return get<ResponseModel<ActiveUser[]>>(
      `${BASE_URL}/active-users`,
      params as Record<string, any>,
    );
  },
};
