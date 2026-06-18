# Week 3 Community 模块交接文档

> **生成日期**: 2026-06-17  
> **会话**: Session 4  
> **模块**: Community (社区)  
> **状态**: 类型/API/Store/Mock 100% 完成，视图核心功能 44% 完成，待浏览器联调验证

---

## 一、本次会话完成内容

### 1.1 完成的任务

| 任务 | 子项数 | 已完成 | 说明 |
|------|--------|--------|------|
| C-1 类型更新 | 9 | 9 | 100% - 完全重写 `community.types.ts` |
| C-2 API 更新 | 12 | 12 | 100% - 完全重写 `community.api.ts` |
| C-3 Store 适配 | 7 | 7 | 100% - 完全重写 `stores/community.ts` |
| C-4 视图适配 | 9 | 4 | 44% - 核心功能优先 |
| C-5 Mock 更新 | 6 | 6 | 100% - 完全重写 mock data + handler |
| C-6 联调验证 | 12 | 0 | 0% - 待浏览器验证 |

### 1.2 修改的文件

| 文件路径 | 修改类型 | 说明 |
|----------|----------|------|
| [src/api/types/community.types.ts](file:///d:/code/MianMianMaster/src/api/types/community.types.ts) | 重写 | 完全对齐契约 C1-C12 |
| [src/api/modules/community.api.ts](file:///d:/code/MianMianMaster/src/api/modules/community.api.ts) | 重写 | 12 个 API 函数全部对齐 |
| [src/stores/community.ts](file:///d:/code/MianMianMaster/src/stores/community.ts) | 重写 | 新增 editPost/deletePost，乐观更新 |
| [src/mock/data/community.mock.ts](file:///d:/code/MianMianMaster/src/mock/data/community.mock.ts) | 重写 | 字段对齐契约 |
| [src/mock/handlers/community.handler.ts](file:///d:/code/MianMianMaster/src/mock/handlers/community.handler.ts) | 重写 | 新增 PUT/DELETE，修正返回类型 |
| [src/views/Community.vue](file:///d:/code/MianMianMaster/src/views/Community.vue) | 修改 | 核心功能字段适配 |

---

## 二、关键设计决策

### 2.1 严格对齐契约 + 视图占位

契约 Post 响应不含 `author_name`/`author_avatar`/`is_liked`，HotTopic 不含 `participants`，ActiveUser 不含 `bio`。

**决策**: 类型严格对齐契约（移除这些字段），视图用占位值填充：
- 作者名 → "匿名用户"
- 作者头像 → "👤" emoji
- 点赞状态 → Store 本地维护 `likedPosts: Set<number>`
- 话题参与者数 → 移除显示
- 用户简介 → 移除显示

### 2.2 点赞/关注状态本地管理

契约 Post 响应不含 `is_liked`，但 toggle 接口返回 boolean。

**决策**: Store 维护本地状态：
- `likedPosts: Set<number>` - 已点赞的帖子 ID
- `followedUsers: Set<number>` - 已关注的用户 ID
- `isPostLiked(postId)` / `isUserFollowed(userId)` 方法访问
- `toggleLike` / `toggleFollow` 实现乐观更新 + 失败回滚

### 2.3 视图核心功能优先

**本次完成** (C-4.1/4.5/4.6/4.7):
- 帖子流渲染字段适配
- 点赞/关注 Toggle 交互 + 乐观更新
- 热门话题展示 (`posts_count`)
- 活跃用户列表 (`posts_count` + `followers_count`)

**留到下次** (C-4.2/4.3/4.4/4.8/4.9):
- 发帖表单 category 选择器
- 帖子详情页 ai_analysis_status / ai_review_content 显示
- 评论输入支持回复 (parent_id)
- 帖子编辑表单 (PostUpdate 全可选)
- 帖子删除确认 + 列表刷新

---

## 三、契约字段映射

### 3.1 Post 类型

| 契约字段 | 旧前端字段 | 新前端字段 | 说明 |
|----------|-----------|-----------|------|
| `id` | `id` | `id` | 不变 |
| `title` | `title` | `title` | 不变 |
| `content` | `content` | `content` | 不变 |
| `category` | `category` | `category` | PostCategory 联合类型 |
| `status?` | - | `status?` | 新增 PostStatus |
| `user_id` | `author_id` | `user_id` | 重命名 |
| `ai_analysis_status` | - | `ai_analysis_status` | 新增 AiAnalysisStatus |
| `ai_review_content?` | `ai_review_content?` | `ai_review_content?` | 不变 |
| `created_at` | `created_at` | `created_at` | 不变 |
| `updated_at` | `updated_at` | `updated_at` | 不变 |
| `likes_count?` | `likes_count` | `likes_count?` | 改为可选 |
| `comments_count?` | `comments_count` | `comments_count?` | 改为可选 |
| - | `author_name?` | - | 移除（用占位值） |
| - | `author_avatar?` | - | 移除（用占位值） |
| - | `is_liked?` | - | 移除（Store 本地维护） |

### 3.2 Comment 类型

| 契约字段 | 旧前端字段 | 新前端字段 |
|----------|-----------|-----------|
| `id` | `id` | `id` |
| `post_id` | `post_id` | `post_id` |
| `user_id` | `author_id` | `user_id` |
| `content` | `content` | `content` |
| `parent_id?` | `parent_id?` | `parent_id?` |
| `created_at` | `created_at` | `created_at` |
| `updated_at` | - | `updated_at` (新增) |
| - | `author_name?` | - (移除) |
| - | `replies?` | - (移除) |

### 3.3 HotTopic 类型

| 契约字段 | 旧前端字段 | 新前端字段 |
|----------|-----------|-----------|
| `id` | `id` | `id` |
| `title` | `title` | `title` |
| `posts_count?` | `posts` | `posts_count?` |
| `category` | - | `category` (新增) |
| - | `participants` | - (移除) |

### 3.4 ActiveUser 类型

| 契约字段 | 旧前端字段 | 新前端字段 |
|----------|-----------|-----------|
| `id` | `id` | `id` |
| `username` | `name` | `username` |
| `avatar_url?` | `avatar` | `avatar_url?` |
| `posts_count?` | `posts` | `posts_count?` |
| `followers_count?` | `followers` | `followers_count?` |
| - | `bio` | - (移除) |

### 3.5 API 返回类型变化

| API 函数 | 旧返回类型 | 新返回类型 |
|----------|-----------|-----------|
| `deletePost` | `ResponseModel<string>` | `ResponseModel<boolean>` |
| `toggleLike` | `ResponseModel<LikeResult>` | `ResponseModel<boolean>` |
| `toggleFollow` | `ResponseModel<FollowResult>` | `ResponseModel<boolean>` |
| `triggerAiReview` | `ResponseModel<AiReviewResult>` | `ResponseModel<string>` |
| `editPost` | 参数 `PostCreate` | 参数 `PostUpdate` (全可选) |

---

## 四、Store 新增功能

### 4.1 新增 State

```typescript
const likedPosts = ref<Set<number>>(new Set());      // 本地点赞状态
const followedUsers = ref<Set<number>>(new Set());   // 本地关注状态
```

### 4.2 新增 Getters

```typescript
function isPostLiked(postId: number): boolean
function isUserFollowed(userId: number): boolean
```

### 4.3 新增 Actions

```typescript
async function editPost(postId: number, data: PostUpdate): Promise<boolean>
async function deletePost(postId: number): Promise<boolean>
```

### 4.4 修改的 Actions

- `createPost(data: PostCreate)`: 参数从 `{title, content}` 改为 `PostCreate` (含 category)
- `createComment(postId, content, parentId?)`: 新增 parentId 参数
- `toggleLike(postId)`: 实现乐观更新 + 失败回滚
- `toggleFollow(userId)`: 实现乐观更新 + 失败回滚

---

## 五、Mock Handler 新增

### 5.1 新增端点

- `PUT /community/posts/{post_id}` (C4) - 编辑帖子
- `DELETE /community/posts/{post_id}` (C5) - 删除帖子

### 5.2 修正返回类型

- `POST /community/posts/{post_id}/like`: 返回 `boolean` (原 `{liked, likes_count}`)
- `POST /community/users/{user_id}/follow`: 返回 `boolean` (原 `{following}`)
- `POST /community/posts/{post_id}/ai-review`: 返回 `string` (原 `{task_id, status}`)

### 5.3 Mock 本地状态

Mock handler 内部维护：
- `likedPostIds: Set<number>` - 模拟点赞状态
- `followedUserIds: Set<number>` - 模拟关注状态

---

## 六、质量门禁验证

| 验证项 | 结果 | 说明 |
|--------|------|------|
| `vue-tsc --noEmit` | ✅ 零错误 | exit code 0 |
| `vite build` | ✅ 成功 | 19.32s, Community chunk 54.13 kB |
| `vitest run` | ✅ 78/78 通过 | 9 个测试文件全部通过 |

---

## 七、待完成工作

### 7.1 视图适配 (C-4 剩余 5 项)

| 任务 | 优先级 | 说明 |
|------|--------|------|
| C-4.2 发帖表单 category 选择器 | 高 | 当前表单只有 title/content，需加 category 下拉 |
| C-4.3 帖子详情显示 AI 状态 | 中 | 显示 ai_analysis_status + ai_review_content |
| C-4.4 评论回复 parent_id | 中 | 评论输入支持回复指定评论 |
| C-4.8 帖子编辑表单 | 中 | PostUpdate 全可选字段编辑 |
| C-4.9 帖子删除确认 | 中 | 删除按钮 + 确认弹窗 + 列表刷新 |

### 7.2 联调验证 (C-6 全部 12 项)

所有 12 个端点待浏览器验证：
- Mock 模式功能验证
- 真实后端联调 (localhost:8081)

### 7.3 Backend Gaps

| 缺失字段 | 影响范围 | 当前处理 | 建议 |
|----------|----------|----------|------|
| Post.author_name | 帖子作者名显示 | 占位"匿名用户" | 后端在 Post 响应中添加 author_name |
| Post.author_avatar | 帖子作者头像 | 占位"👤" | 后端在 Post 响应中添加 author_avatar |
| Post.is_liked | 点赞状态显示 | Store 本地维护 | 后端在 Post 响应中添加 is_liked |
| HotTopic.participants | 话题参与者数 | 移除显示 | 后端在 HotTopic 响应中添加 participants |
| ActiveUser.bio | 用户简介 | 移除显示 | 后端在 ActiveUser 响应中添加 bio |

---

## 八、下一个 Agent 接手指南

### 8.1 优先级建议

1. **高**: 完成 C-4.2 (发帖表单 category) - 阻塞发帖功能
2. **高**: 浏览器验证 C-6.1~C-6.12 - 确认所有端点工作正常
3. **中**: 完成 C-4.3/C-4.4/C-4.8/C-4.9 - 完善社区功能

### 8.2 关键文件

- 类型: [src/api/types/community.types.ts](file:///d:/code/MianMianMaster/src/api/types/community.types.ts)
- API: [src/api/modules/community.api.ts](file:///d:/code/MianMianMaster/src/api/modules/community.api.ts)
- Store: [src/stores/community.ts](file:///d:/code/MianMianMaster/src/stores/community.ts)
- Mock 数据: [src/mock/data/community.mock.ts](file:///d:/code/MianMianMaster/src/mock/data/community.mock.ts)
- Mock Handler: [src/mock/handlers/community.handler.ts](file:///d:/code/MianMianMaster/src/mock/handlers/community.handler.ts)
- 视图: [src/views/Community.vue](file:///d:/code/MianMianMaster/src/views/Community.vue)

### 8.3 注意事项

1. **点赞状态**: 刷新页面后 `likedPosts` 会丢失，因为契约不返回 `is_liked`。如需持久化，考虑 localStorage。
2. **评论回复**: `parent_id` 已在类型和 Store 中支持，但视图未实现回复 UI。
3. **AI 点评**: `triggerAiReview` 返回 string (任务 ID)，但 `ai_analysis_status` 是异步更新的，需要轮询或 SSE 推送。
4. **测试用户**: user_id=109 (testuser)，Mock 中创建帖子/评论使用此 ID。
