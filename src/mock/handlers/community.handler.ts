import type MockAdapter from "axios-mock-adapter";
import {
  mockPosts,
  mockComments,
  mockHotTopics,
  mockActiveUsers,
} from "../data/community.mock";

function success<T>(
  data: T,
): [number, { code: number; message: string; data: T }] {
  return [200, { code: 200, message: "success", data }];
}

export function registerCommunityHandlers(mock: MockAdapter): void {
  mock.onGet("/community/posts/feed").reply(() => {
    return success(mockPosts);
  });

  mock.onGet(/\/community\/posts\/\d+$/).reply((config) => {
    const postId = parseInt(config.url?.split("/").pop() ?? "0");
    const post = mockPosts.find((p) => p.id === postId);
    if (post) {
      return success(post);
    }
    return [404, { code: 404, message: "POST_NOT_FOUND", data: null }];
  });

  mock.onPost("/community/posts").reply((config) => {
    const data = JSON.parse(config.data);
    return success({
      id: Date.now(),
      title: data.title || "",
      content: data.content || "",
      author_id: 1,
      author_name: "王同学",
      author_avatar: "🧑‍💻",
      likes_count: 0,
      comments_count: 0,
      is_liked: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  });

  mock.onPost(/\/community\/posts\/\d+\/comments$/).reply((config) => {
    const data = JSON.parse(config.data);
    const postId = parseInt(config.url?.split("/")[3] ?? "0");
    return success({
      id: Date.now(),
      post_id: postId,
      author_id: 1,
      author_name: "王同学",
      content: data.content,
      created_at: new Date().toISOString(),
    });
  });

  mock.onPost(/\/community\/posts\/\d+\/like$/).reply((config) => {
    const postId = parseInt(config.url?.split("/")[3] ?? "0");
    const post = mockPosts.find((p) => p.id === postId);
    const wasLiked = post?.is_liked ?? false;
    return success({
      liked: !wasLiked,
      likes_count: (post?.likes_count ?? 0) + (wasLiked ? -1 : 1),
    });
  });

  mock.onPost(/\/community\/users\/\d+\/follow$/).reply(() => {
    return success({ following: true });
  });

  mock.onPost(/\/community\/posts\/\d+\/ai-review$/).reply(() => {
    return success({
      task_id: "task_" + Date.now(),
      status: "pending",
    });
  });

  mock.onGet("/community/hot-topics").reply(() => {
    return success(mockHotTopics);
  });

  mock.onGet("/community/active-users").reply(() => {
    return success(mockActiveUsers);
  });

  mock.onGet(/\/community\/posts\/\d+\/comments$/).reply((config) => {
    const postId = parseInt(config.url?.split("/")[3] ?? "0");
    const comments = mockComments[postId] || [];
    return success(comments);
  });

  console.log("[Mock] Community handlers registered");
}
