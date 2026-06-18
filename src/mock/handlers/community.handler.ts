import type MockAdapter from "axios-mock-adapter";
import {
  mockPosts,
  mockComments,
  mockHotTopics,
  mockActiveUsers,
} from "../data/community.mock";
import type { Post, Comment } from "@/api/types/community.types";

function success<T>(
  data: T,
): [number, { code: number; message: string; data: T }] {
  return [200, { code: 200, message: "success", data }];
}

function notFound(msg: string): [number, { code: number; message: string; data: null }] {
  return [404, { code: 404, message: msg, data: null }];
}

/**
 * Community Mock Handlers (契约对齐 C1-C12)
 */
export function registerCommunityHandlers(mock: MockAdapter): void {
  // ===== C2: GET /community/posts/feed =====
  mock.onGet("/community/posts/feed").reply((config) => {
    const params = config.params || {};
    const keyword: string | undefined = params.keyword;
    let result = [...mockPosts];
    if (keyword) {
      const lower = keyword.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(lower) ||
          p.content.toLowerCase().includes(lower),
      );
    }
    return success(result);
  });

  // ===== C3: GET /community/posts/{post_id} =====
  mock.onGet(/\/community\/posts\/\d+$/).reply((config) => {
    const postId = parseInt(config.url?.split("/").pop() ?? "0");
    const post = mockPosts.find((p) => p.id === postId);
    if (post) {
      return success(post);
    }
    return notFound("POST_NOT_FOUND");
  });

  // ===== C1: POST /community/posts =====
  mock.onPost("/community/posts").reply((config) => {
    const data = JSON.parse(config.data);
    const now = new Date().toISOString();
    const newPost: Post = {
      id: Date.now(),
      title: data.title || "",
      content: data.content || "",
      category: data.category || "interview_review",
      status: data.status || "published",
      user_id: 109, // 测试用户
      ai_analysis_status: "pending",
      created_at: now,
      updated_at: now,
      likes_count: 0,
      comments_count: 0,
    };
    mockPosts.unshift(newPost);
    return success(newPost);
  });

  // ===== C4: PUT /community/posts/{post_id} =====
  mock.onPut(/\/community\/posts\/\d+$/).reply((config) => {
    const postId = parseInt(config.url?.split("/").pop() ?? "0");
    const data = JSON.parse(config.data);
    const index = mockPosts.findIndex((p) => p.id === postId);
    if (index === -1) {
      return notFound("POST_NOT_FOUND");
    }
    const updated: Post = {
      ...mockPosts[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    mockPosts[index] = updated;
    return success(updated);
  });

  // ===== C5: DELETE /community/posts/{post_id} =====
  mock.onDelete(/\/community\/posts\/\d+$/).reply((config) => {
    const postId = parseInt(config.url?.split("/").pop() ?? "0");
    const index = mockPosts.findIndex((p) => p.id === postId);
    if (index === -1) {
      return notFound("POST_NOT_FOUND");
    }
    mockPosts.splice(index, 1);
    delete mockComments[postId];
    return success(true);
  });

  // ===== C6: POST /community/posts/{post_id}/comments =====
  mock.onPost(/\/community\/posts\/\d+\/comments$/).reply((config) => {
    const data = JSON.parse(config.data);
    const postId = parseInt(config.url?.split("/")[3] ?? "0");
    const now = new Date().toISOString();
    const newComment: Comment = {
      id: Date.now(),
      post_id: data.post_id ?? postId,
      user_id: 109, // 测试用户
      content: data.content,
      parent_id: data.parent_id,
      created_at: now,
      updated_at: now,
    };
    if (!mockComments[postId]) {
      mockComments[postId] = [];
    }
    mockComments[postId].push(newComment);

    // 更新帖子评论计数
    const post = mockPosts.find((p) => p.id === postId);
    if (post) {
      post.comments_count = (post.comments_count ?? 0) + 1;
    }
    return success(newComment);
  });

  // ===== C7: GET /community/posts/{post_id}/comments =====
  mock.onGet(/\/community\/posts\/\d+\/comments$/).reply((config) => {
    const postId = parseInt(config.url?.split("/")[3] ?? "0");
    const comments = mockComments[postId] || [];
    return success(comments);
  });

  // ===== C8: POST /community/posts/{post_id}/like (Toggle, 返回 boolean) =====
  // 本地维护点赞状态用于 Mock
  const likedPostIds = new Set<number>();
  mock.onPost(/\/community\/posts\/\d+\/like$/).reply((config) => {
    const postId = parseInt(config.url?.split("/")[3] ?? "0");
    const post = mockPosts.find((p) => p.id === postId);
    if (!post) {
      return notFound("POST_NOT_FOUND");
    }
    const wasLiked = likedPostIds.has(postId);
    if (wasLiked) {
      likedPostIds.delete(postId);
      post.likes_count = Math.max((post.likes_count ?? 0) - 1, 0);
    } else {
      likedPostIds.add(postId);
      post.likes_count = (post.likes_count ?? 0) + 1;
    }
    return success(!wasLiked);
  });

  // ===== C9: POST /community/users/{user_id}/follow (Toggle, 返回 boolean) =====
  const followedUserIds = new Set<number>();
  mock.onPost(/\/community\/users\/\d+\/follow$/).reply((config) => {
    const userId = parseInt(config.url?.split("/")[3] ?? "0");
    const wasFollowed = followedUserIds.has(userId);
    if (wasFollowed) {
      followedUserIds.delete(userId);
    } else {
      followedUserIds.add(userId);
    }
    return success(!wasFollowed);
  });

  // ===== C10: POST /community/posts/{post_id}/ai-review (返回 string) =====
  mock.onPost(/\/community\/posts\/\d+\/ai-review$/).reply((config) => {
    const postId = parseInt(config.url?.split("/")[3] ?? "0");
    const post = mockPosts.find((p) => p.id === postId);
    if (!post) {
      return notFound("POST_NOT_FOUND");
    }
    // 模拟异步任务: 更新状态为 processing
    post.ai_analysis_status = "processing";
    const taskId = `task_${Date.now()}_${postId}`;
    return success(taskId);
  });

  // ===== C11: GET /community/hot-topics =====
  mock.onGet("/community/hot-topics").reply(() => {
    return success(mockHotTopics);
  });

  // ===== C12: GET /community/active-users =====
  mock.onGet("/community/active-users").reply(() => {
    return success(mockActiveUsers);
  });

  console.log("[Mock] Community handlers registered (C1-C12)");
}
