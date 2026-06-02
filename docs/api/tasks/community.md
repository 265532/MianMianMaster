# Community 模块联调任务清单

> **优先级**: P2 — 社交增值功能  
> **后端前缀**: `/api/v1/community`  
> **后端接口数量**: 9 个端点  
> **现有文件**: [community.api.ts](file:///d:/code/MianMianMaster/src/api/modules/community.api.ts) | [community.types.ts](file:///d:/code/MianMianMaster/src/api/types/community.types.ts) | [community.handler.ts](file:///d:/code/MianMianMaster/src/mock/handlers/community.handler.ts) | [community Store](file:///d:/code/MianMianMaster/src/stores/community.ts) | [Community.vue](file:///d:/code/MianMianMaster/src/views/Community.vue)

---

## 前置条件

- [ ] Auth + User 联调完成
- [ ] Celery Worker 已启动（AI 点评异步任务）

---

## 差异分析

> ⚠️ **前端多出 2 个端点**（`/hot-topics` GET + `/active-users` GET），不在后端规范中。
> 可降级为前端计算（从帖子数据派生），或与后端确认是否添加。

> ⚠️ **前端 `getPostComments` 没有独立后端端点**，后端规范中评论通过 `GET /posts/{id}` 的详情返回。需确认评论获取方式。

---

## Task 1: 端点签名对齐

| # | 端点 | 方法 | 前端方法 | 状态 |
|---|------|------|----------|------|
| 1.1 | `/community/posts/feed` | GET | `communityApi.getPosts()` | [ ] |
| 1.2 | `/community/posts/{post_id}` | GET | `communityApi.getPost()` | [ ] |
| 1.3 | `/community/posts` | POST | `communityApi.createPost()` | [ ] |
| 1.4 | `/community/posts/{post_id}` | PUT | `communityApi.editPost()` | [ ] |
| 1.5 | `/community/posts/{post_id}` | DEL | `communityApi.deletePost()` | [ ] |
| 1.6 | `/community/posts/{post_id}/comments` | POST | `communityApi.createComment()` | [ ] |
| 1.7 | `/community/posts/{post_id}/like` | POST | `communityApi.toggleLike()` | [ ] |
| 1.8 | `/community/users/{user_id}/follow` | POST | `communityApi.toggleFollow()` | [ ] |
| 1.9 | `/community/posts/{post_id}/ai-review` | POST | `communityApi.triggerAiReview()` | [ ] |

---

## Task 2: 类型定义对齐

- [ ] 2.1 `Post` 类型字段对齐：`id`/`title`/`content`/`type`（`interview_review`/`real_questions`/`experience`）/`author_name`/`likes_count`/`comments_count`/`ai_review_content`/`created_at`
- [ ] 2.2 `Comment` 支持楼中楼：`parent_id` 字段
- [ ] 2.3 `LikeResult` 包含 `is_liked`/`likes_count`
- [ ] 2.4 `FollowResult` 包含 `is_followed`
- [ ] 2.5 `AiReviewResult` 包含状态字段

---

## Task 3: 帖子 CRUD 验证

- [ ] 3.1 **信息流**: `GET /posts/feed` → 分页 `skip`/`limit` + `keyword` 搜索
- [ ] 3.2 **创建帖子**: `POST /posts` → 选择 `type`（`interview_review`/`real_questions`/`experience`）
- [ ] 3.3 **帖子详情**: `GET /posts/{id}` → 包含评论列表
- [ ] 3.4 **编辑帖子**: `PUT /posts/{id}` → 仅作者可编辑
- [ ] 3.5 **删除帖子**: `DELETE /posts/{id}` → 仅作者可删除

---

## Task 4: 社交互动验证

- [ ] 4.1 **发表评论**: `POST /posts/{id}/comments` → 支持 `parent_id` 楼中楼
- [ ] 4.2 **点赞**: `POST /posts/{id}/like` → 切换状态（点赞/取消）
- [ ] 4.3 **关注用户**: `POST /users/{id}/follow` → 切换状态（关注/取消）
- [ ] 4.4 **楼中楼展示**: 评论嵌套渲染正确

---

## Task 5: AI 点评验证

- [ ] 5.1 **触发点评**: `POST /posts/{id}/ai-review` → Celery 异步
- [ ] 5.2 **轮询结果**: 前端轮询 `GET /posts/{id}` 检查 `ai_review_content`
- [ ] 5.3 **点评展示**: `ai_review_content` 渲染在帖子详情页

---

## Task 6: 前端页面验证

- [ ] 6.1 [Community.vue](file:///d:/code/MianMianMaster/src/views/Community.vue) 帖子列表/评论/热门话题/活跃用户正常（已完成 Store 对接）
- [ ] 6.2 SkeletonLoader 骨架屏在加载时正确显示
- [ ] 6.3 EmptyState 空状态占位符在无帖子时显示
- [ ] 6.4 LoadMore "加载更多" 分页功能正常

---

## Task 7: 超范围端点降级

- [ ] 7.1 `getHotTopics()` → 从帖子数据 `GET /posts/feed` 派生计算（按参与度排序）
- [ ] 7.2 `getActiveUsers()` → 从评论/点赞数据派生计算
- [ ] 7.3 `getPostComments()` → 合并到 `getPost()` 详情中获取

---

## 依赖关系

```
Auth + User → Community
Community → 无后续依赖
```