import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { communityApi } from "@/api/modules/community.api";
import type {
  Post,
  PostCreate,
  PostUpdate,
  Comment,
  CommentCreate,
  HotTopic,
  ActiveUser,
} from "@/api/types/community.types";

/**
 * Community Store
 * 契约对齐: C1-C12
 * 注意: 契约 Post 响应不含 is_liked 字段，前端本地维护 likedPosts 状态
 */
export const useCommunityStore = defineStore("community", () => {
  // ===== State =====
  const posts = ref<Post[]>([]);
  const currentPost = ref<Post | null>(null);
  const comments = ref<Record<number, Comment[]>>({});
  const hotTopics = ref<HotTopic[]>([]);
  const activeUsers = ref<ActiveUser[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  /**
   * 本地维护的点赞状态 (前端 gap: 契约 Post 响应不含 is_liked)
   * key: postId, value: true=已点赞
   */
  const likedPosts = ref<Set<number>>(new Set());

  /**
   * 本地维护的关注状态 (前端 gap: 契约 ActiveUser 响应不含 is_following)
   * key: userId, value: true=已关注
   */
  const followedUsers = ref<Set<number>>(new Set());

  // ===== Getters =====
  const hasMore = computed(() => posts.value.length < pagination.value.total);

  /**
   * 判断帖子是否已点赞 (本地状态)
   */
  function isPostLiked(postId: number): boolean {
    return likedPosts.value.has(postId);
  }

  /**
   * 判断用户是否已关注 (本地状态)
   */
  function isUserFollowed(userId: number): boolean {
    return followedUsers.value.has(userId);
  }

  // ===== Actions =====

  /**
   * C2: 获取帖子流
   */
  async function fetchPosts(params?: {
    keyword?: string;
    page?: number;
  }): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const response = await communityApi.getPosts({
        skip: ((params?.page || 1) - 1) * pagination.value.pageSize,
        limit: pagination.value.pageSize,
        keyword: params?.keyword,
      });
      const data = response.data;
      posts.value = Array.isArray(data) ? data : [];

      // 契约响应为数组，无 total 字段；本地用长度兜底
      pagination.value.total = posts.value.length;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || err?.message || "获取帖子失败";
      console.error("[Community] fetchPosts error:", err);
    } finally {
      loading.value = false;
    }
  }

  /**
   * C3: 获取帖子详情
   */
  async function fetchPost(postId: number): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const response = await communityApi.getPost(postId);
      currentPost.value = response.data;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || err?.message || "获取帖子详情失败";
      console.error("[Community] fetchPost error:", err);
    } finally {
      loading.value = false;
    }
  }

  /**
   * C1: 创建帖子
   */
  async function createPost(data: PostCreate): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const response = await communityApi.createPost(data);
      const newPost = response.data;
      posts.value.unshift(newPost);
      return true;
    } catch (err: any) {
      error.value = err?.response?.data?.message || err?.message || "发布失败";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * C4: 编辑帖子
   */
  async function editPost(
    postId: number,
    data: PostUpdate,
  ): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const response = await communityApi.editPost(postId, data);
      const updatedPost = response.data;

      // 更新列表中的帖子
      const index = posts.value.findIndex((p) => p.id === postId);
      if (index !== -1) {
        posts.value[index] = updatedPost;
      }
      // 更新当前帖子
      if (currentPost.value?.id === postId) {
        currentPost.value = updatedPost;
      }
      return true;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || err?.message || "编辑帖子失败";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * C5: 删除帖子
   */
  async function deletePost(postId: number): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      await communityApi.deletePost(postId);
      // 从列表中移除
      posts.value = posts.value.filter((p) => p.id !== postId);
      // 清理相关评论
      delete comments.value[postId];
      // 清理点赞状态
      likedPosts.value.delete(postId);
      // 清理当前帖子
      if (currentPost.value?.id === postId) {
        currentPost.value = null;
      }
      return true;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message || err?.message || "删除帖子失败";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * C7: 获取评论列表
   */
  async function fetchComments(postId: number): Promise<void> {
    try {
      const response = await communityApi.getPostComments(postId);
      comments.value[postId] = response.data;
    } catch (err: any) {
      console.error("[Community] fetchComments error:", err);
    }
  }

  /**
   * C6: 创建评论
   * 注意: 契约要求 post_id 同时在路径和请求体中
   */
  async function createComment(
    postId: number,
    content: string,
    parentId?: number,
  ): Promise<boolean> {
    try {
      const commentData: CommentCreate = {
        content,
        post_id: postId,
        parent_id: parentId,
      };
      const response = await communityApi.createComment(postId, commentData);
      const newComment = response.data;

      if (!comments.value[postId]) {
        comments.value[postId] = [];
      }
      comments.value[postId].push(newComment);

      // 乐观更新评论计数
      const post = posts.value.find((p) => p.id === postId);
      if (post) {
        post.comments_count = (post.comments_count ?? 0) + 1;
      }
      if (currentPost.value?.id === postId) {
        currentPost.value.comments_count =
          (currentPost.value.comments_count ?? 0) + 1;
      }
      return true;
    } catch (err: any) {
      error.value = err?.response?.data?.message || err?.message || "评论失败";
      throw err;
    }
  }

  /**
   * C8: Toggle 点赞
   * 响应: boolean (true=已点赞, false=已取消)
   * 本地维护 likedPosts 状态 + 乐观更新 likes_count
   */
  async function toggleLike(postId: number): Promise<boolean | null> {
    // 乐观更新: 先切换本地状态
    const wasLiked = likedPosts.value.has(postId);
    if (wasLiked) {
      likedPosts.value.delete(postId);
    } else {
      likedPosts.value.add(postId);
    }

    // 乐观更新计数
    const post = posts.value.find((p) => p.id === postId);
    if (post) {
      post.likes_count = (post.likes_count ?? 0) + (wasLiked ? -1 : 1);
    }
    if (currentPost.value?.id === postId) {
      currentPost.value.likes_count =
        (currentPost.value.likes_count ?? 0) + (wasLiked ? -1 : 1);
    }

    try {
      const response = await communityApi.toggleLike(postId);
      const nowLiked = response.data;

      // 根据后端真实响应校正本地状态
      if (nowLiked !== !wasLiked) {
        if (nowLiked) {
          likedPosts.value.add(postId);
        } else {
          likedPosts.value.delete(postId);
        }
        // 校正计数
        if (post) {
          post.likes_count = (post.likes_count ?? 0) + (nowLiked ? 1 : -1);
        }
        if (currentPost.value?.id === postId) {
          currentPost.value.likes_count =
            (currentPost.value.likes_count ?? 0) + (nowLiked ? 1 : -1);
        }
      }
      return nowLiked;
    } catch (err: any) {
      console.error("[Community] toggleLike error:", err);
      // 回滚乐观更新
      if (wasLiked) {
        likedPosts.value.add(postId);
      } else {
        likedPosts.value.delete(postId);
      }
      if (post) {
        post.likes_count = (post.likes_count ?? 0) + (wasLiked ? 1 : -1);
      }
      if (currentPost.value?.id === postId) {
        currentPost.value.likes_count =
          (currentPost.value.likes_count ?? 0) + (wasLiked ? 1 : -1);
      }
      return null;
    }
  }

  /**
   * C9: Toggle 关注
   * 响应: boolean (true=已关注, false=已取消)
   * 本地维护 followedUsers 状态
   */
  async function toggleFollow(userId: number): Promise<boolean | null> {
    const wasFollowed = followedUsers.value.has(userId);
    // 乐观更新
    if (wasFollowed) {
      followedUsers.value.delete(userId);
    } else {
      followedUsers.value.add(userId);
    }

    try {
      const response = await communityApi.toggleFollow(userId);
      const nowFollowed = response.data;

      // 校正本地状态
      if (nowFollowed !== !wasFollowed) {
        if (nowFollowed) {
          followedUsers.value.add(userId);
        } else {
          followedUsers.value.delete(userId);
        }
      }
      return nowFollowed;
    } catch (err: any) {
      console.error("[Community] toggleFollow error:", err);
      // 回滚
      if (wasFollowed) {
        followedUsers.value.add(userId);
      } else {
        followedUsers.value.delete(userId);
      }
      return null;
    }
  }

  /**
   * C10: 触发 AI 点评
   * 响应: string (任务 ID 或提示信息)
   */
  async function triggerAiReview(postId: number): Promise<string | null> {
    try {
      const response = await communityApi.triggerAiReview(postId);
      return response.data;
    } catch (err: any) {
      console.error("[Community] triggerAiReview error:", err);
      return null;
    }
  }

  /**
   * C11: 获取热门话题
   */
  async function fetchHotTopics(): Promise<void> {
    try {
      const response = await communityApi.getHotTopics();
      hotTopics.value = response.data;
    } catch (err: any) {
      console.error("[Community] fetchHotTopics error:", err);
    }
  }

  /**
   * C12: 获取活跃用户
   */
  async function fetchActiveUsers(): Promise<void> {
    try {
      const response = await communityApi.getActiveUsers();
      activeUsers.value = response.data;
    } catch (err: any) {
      console.error("[Community] fetchActiveUsers error:", err);
    }
  }

  /**
   * 加载更多帖子
   */
  async function loadMore(): Promise<void> {
    if (!hasMore.value || loading.value) return;
    pagination.value.page++;
    await fetchPosts({ page: pagination.value.page });
  }

  return {
    // State
    posts,
    currentPost,
    comments,
    hotTopics,
    activeUsers,
    loading,
    error,
    pagination,
    likedPosts,
    followedUsers,
    // Getters
    hasMore,
    // Actions
    isPostLiked,
    isUserFollowed,
    fetchPosts,
    fetchPost,
    createPost,
    editPost,
    deletePost,
    fetchComments,
    createComment,
    toggleLike,
    toggleFollow,
    triggerAiReview,
    fetchHotTopics,
    fetchActiveUsers,
    loadMore,
  };
});
