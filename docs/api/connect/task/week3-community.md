# Week 3: Community 模块契约漂移修复

> **阶段**: Week 3 — P2 增值功能  
> **模块**: Community(社区)  
> **总端点数**: 12 (来自 `api-contract-summary.md`)  
> **优先级**: P2 — 社区互动完整功能  
> **前置依赖**: Week 1 完成 (Auth + User)  
> **契约基准**: [api-contract-summary.md](./api-contract-summary.md) § Community  
> **对应总体进度**: [progress.md](./progress.md)

---

## 一、目标与范围

### 1.1 目标

确保 Community(社区) 模块前端代码与后端 API 契约完全对齐，实现完整的社区互动功能（发帖/评论/点赞/关注/AI 点评/热门话题/活跃用户）。

### 1.2 范围

| 模块 | 端点数 | 涉及前端文件 |
|------|--------|-------------|
| Community | 12 | `community.types.ts`, `community.api.ts`, `stores/community.ts`, `Community.vue` |

### 1.3 验收标准

- [ ] 所有 12 个端点前端调用签名与 `api-contract-summary.md` 100% 一致
- [ ] TypeScript 编译零错误 (`vue-tsc --noEmit`)
- [ ] Vite 构建成功 (`vite build`)
- [ ] 完成发帖 → 评论 → 点赞 → 关注 → AI 点评 全流程端到端验证

---

## 二、契约摘要 (来自 api-contract-summary.md)

<details>
<summary>展开查看 Community 模块完整契约</summary>

| # | 端点 | 方法 | 认证 | 关键字段 |
|---|------|------|------|----------|
| C1 | `/api/v1/community/posts` | POST | 是 | 请求: `title`, `content`, `category`, `status`? ⏐ 响应: `title`, `content`, `category`, `status`?, `id`, `user_id`, `ai_analysis_status`, `ai_review_content`?, `created_at`, `updated_at`, `likes_count`?, `comments_count`? |
| C2 | `/api/v1/community/posts/feed` | GET | 否 | 查询: `skip`?, `limit`?, `keyword`? ⏐ 响应数组: 同 C1 |
| C3 | `/api/v1/community/posts/{post_id}` | GET | 否 | 路径: `post_id` ⏐ 响应: 同 C1 |
| C4 | `/api/v1/community/posts/{post_id}` | PUT | 是 | 路径: `post_id` ⏐ 请求: `title`?, `content`?, `category`?, `status`? ⏐ 响应: 同 C1 |
| C5 | `/api/v1/community/posts/{post_id}` | DELETE | 是 | 路径: `post_id` ⏐ 响应: `boolean` |
| C6 | `/api/v1/community/posts/{post_id}/comments` | POST | 是 | 路径: `post_id` ⏐ 请求: `content`, `parent_id`?, `post_id` ⏐ 响应: `content`, `parent_id`?, `id`, `post_id`, `user_id`, `created_at`, `updated_at` |
| C7 | `/api/v1/community/posts/{post_id}/comments` | GET | 否 | 路径: `post_id` ⏐ 查询: `skip`?, `limit`? ⏐ 响应数组: 同 C6 |
| C8 | `/api/v1/community/posts/{post_id}/like` | POST | 是 | 路径: `post_id` ⏐ 响应: `boolean` (Toggle) |
| C9 | `/api/v1/community/users/{user_id}/follow` | POST | 是 | 路径: `user_id` ⏐ 响应: `boolean` (Toggle) |
| C10 | `/api/v1/community/posts/{post_id}/ai-review` | POST | 是 | 路径: `post_id` ⏐ 响应: `string` |
| C11 | `/api/v1/community/hot-topics` | GET | 否 | 查询: `skip`?, `limit`? ⏐ 响应数组: `id`, `title`, `posts_count`?, `category` |
| C12 | `/api/v1/community/active-users` | GET | 否 | 查询: `skip`?, `limit`? ⏐ 响应数组: `id`, `username`, `avatar_url`?, `posts_count`?, `followers_count`? |

</details>

---

## 三、涉及文件

| 文件路径 | 角色 | 说明 |
|----------|------|------|
| `src/api/types/community.types.ts` | 类型定义 | `Post`, `PostCreate`, `PostUpdate`, `PostCategory`, `Comment`, `CommentCreate`, `HotTopic`, `ActiveUser`, `AiReviewResult` |
| `src/api/modules/community.api.ts` | API 调用 | 12 个 API 函数 (含 `editPost`, `deletePost`) |
| `src/stores/community.ts` | 状态管理 | 社区帖子/评论/点赞/关注状态 |
| `src/views/Community.vue` | 页面组件 | 社区主页（帖子列表/热门话题/活跃用户） |
| `src/mock/handlers/community.handler.ts` | Mock 处理器 | 12 端点 Mock |

---

## 四、差异分析 (Diff 检查清单)

### 4.1 帖子接口

#### `POST /community/posts` (创建帖子)

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| `title` | `PostCreate.title` | [ ] | | |
| `content` | `PostCreate.content` | [ ] | | |
| `category` | `PostCreate.category` | [ ] | | |
| `status` (?) | `PostCreate.status`? | [ ] | | |
| : 响应 `ai_analysis_status` | `Post.ai_analysis_status` | [ ] | | |
| : 响应 `ai_review_content` (?) | `Post.ai_review_content`? | [ ] | | |
| : 响应 `likes_count` (integer?) | `Post.likes_count`? | [ ] | | |
| : 响应 `comments_count` (integer?) | `Post.comments_count`? | [ ] | | |

#### `GET /community/posts/feed` (帖子流)

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| 查询 `keyword` (?) | `getFeed()` 参数 | [ ] | | |
| 响应: 同创建响应 | `Post[]` | [ ] | | |

#### `GET /community/posts/{post_id}` (帖子详情)

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| 路径参数 `post_id` | `getPost(postId)` | [ ] | | |

#### `PUT /community/posts/{post_id}` (编辑帖子)

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| 全部请求字段可选 | `PostUpdate` (所有字段 ?) | [ ] | | |

#### `DELETE /community/posts/{post_id}` (删除帖子)

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| 响应 `boolean` | `deletePost()` 返回值 | [ ] | | |

### 4.2 评论接口

#### `POST /community/posts/{post_id}/comments` (创建评论)

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| `content` | `CommentCreate.content` | [ ] | | |
| `parent_id` (integer?) | `CommentCreate.parent_id`? | [ ] | | |
| `post_id` (integer) | `CommentCreate.post_id` | [ ] | | |

#### `GET /community/posts/{post_id}/comments` (评论列表)

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| 查询: `skip`?, `limit`? | 分页参数 | [ ] | | |
| 响应: `parent_id`? | `Comment.parent_id`? | [ ] | | |

### 4.3 互动接口

#### `POST /community/posts/{post_id}/like` (Toggle 点赞)

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| 路径参数 `post_id` | `toggleLike(postId)` | [ ] | | |
| 响应 `boolean` | 返回值 | [ ] | | |

#### `POST /community/users/{user_id}/follow` (Toggle 关注)

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| 路径参数 `user_id` | `toggleFollow(userId)` | [ ] | | |
| 响应 `boolean` | 返回值 | [ ] | | |

#### `POST /community/posts/{post_id}/ai-review` (AI 点评)

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| 路径参数 `post_id` | `triggerAiReview(postId)` | [ ] | | |
| 响应 `string` | `ResponseModel<string>` | [ ] | | |

### 4.4 发现页接口

#### `GET /community/hot-topics` (热门话题)

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| `id` | `HotTopic.id` | [ ] | | |
| `title` | `HotTopic.title` | [ ] | | |
| `posts_count` (integer?) | `HotTopic.posts_count`? | [ ] | | |
| `category` | `HotTopic.category` | [ ] | | |

#### `GET /community/active-users` (活跃用户)

| 契约字段 | 前端类型 | 匹配 | 漂移描述 | 修复方案 |
|----------|---------|------|----------|----------|
| `id` | `ActiveUser.id` | [ ] | | |
| `username` | `ActiveUser.username` | [ ] | | |
| `avatar_url` (string?) | `ActiveUser.avatar_url`? | [ ] | | |
| `posts_count` (integer?) | `ActiveUser.posts_count`? | [ ] | | |
| `followers_count` (integer?) | `ActiveUser.followers_count`? | [ ] | | |

---

## 五、修复任务检查清单

### Task C-1: 类型文件更新 (`community.types.ts`)

- [x] C-1.1 核对 `PostCreate` 包含 `category`, `status`?
- [x] C-1.2 核对 `PostUpdate` 所有字段可选 (`title`?, `content`?, `category`?, `status`?)
- [x] C-1.3 核对 `Post` 包含 `ai_analysis_status`, `ai_review_content`?, `likes_count`?, `comments_count`?
- [x] C-1.4 核对 `PostCategory` 联合类型与后端一致
- [x] C-1.5 核对 `CommentCreate` 包含 `parent_id`? + `post_id`
- [x] C-1.6 核对 `Comment` 包含 `parent_id`?, `post_id`, `user_id`
- [x] C-1.7 核对 `HotTopic` 字段 (`posts_count`?, `category`)
- [x] C-1.8 核对 `ActiveUser` 字段 (`posts_count`?, `followers_count`?)
- [x] C-1.9 核对 `AiReviewResult` 或直接使用 `string` (直接使用 `string`)

### Task C-2: API 调用函数更新 (`community.api.ts`)

- [x] C-2.1 `createPost()` 参数含 `category` 和 `status`?
- [x] C-2.2 `getFeed()` 支持 `keyword`? 查询参数
- [x] C-2.3 `getPost()` 路径参数 `post_id`
- [x] C-2.4 `editPost()` 参数为 `PostUpdate` (全部可选)
- [x] C-2.5 `deletePost()` 返回 `boolean`
- [x] C-2.6 `createComment()` 参数含 `parent_id`? + `post_id`
- [x] C-2.7 `getPostComments()` 支持分页
- [x] C-2.8 `toggleLike()` 路径参数 `post_id`，返回 `boolean`
- [x] C-2.9 `toggleFollow()` 路径参数 `user_id`，返回 `boolean`
- [x] C-2.10 `triggerAiReview()` 路径参数 `post_id`，返回 `string`
- [x] C-2.11 `getHotTopics()` 支持分页
- [x] C-2.12 `getActiveUsers()` 支持分页

### Task C-3: Store 层适配 (`stores/community.ts`)

- [x] C-3.1 帖子列表状态 (`feed`, `loading`, `hasMore`)
- [x] C-3.2 帖子 CRUD action (`createPost`, `getFeed`, `getPost`, `editPost`, `deletePost`)
- [x] C-3.3 评论 action (`createComment`, `getComments`)
- [x] C-3.4 点赞/关注切换 action (`toggleLike`, `toggleFollow`)
- [x] C-3.5 AI 点评触发 action (`triggerAiReview`)
- [x] C-3.6 热门话题/活跃用户 (`hotTopics`, `activeUsers`)
- [x] C-3.7 点赞/关注状态本地乐观更新 (optimistic update)

### Task C-4: 视图组件适配

- [x] C-4.1 [Community.vue](file:///d:/code/MianMianMaster/src/views/Community.vue) 帖子流渲染使用 Store 数据
- [ ] C-4.2 发帖表单: `category` 选择器 + 可选 `status` (留到下次)
- [ ] C-4.3 帖子详情页: 显示 `ai_analysis_status` / `ai_review_content` (留到下次)
- [ ] C-4.4 评论输入: 支持回复 (`parent_id`) (留到下次)
- [x] C-4.5 点赞/关注按钮 Toggle 交互 + 乐观更新
- [x] C-4.6 热门话题展示 (`posts_count`)
- [x] C-4.7 活跃用户列表 (`posts_count` + `followers_count`)
- [ ] C-4.8 帖子编辑表单 (`PostUpdate` 全可选) (留到下次)
- [ ] C-4.9 帖子删除确认 + 成功后列表刷新 (留到下次)

### Task C-5: Mock 数据更新

- [x] C-5.1 Mock 帖子数据包含 `ai_analysis_status`, `ai_review_content`, `likes_count`, `comments_count`
- [x] C-5.2 Mock 评论数据包含 `parent_id`
- [x] C-5.3 Mock 热门话题包含 `posts_count`, `category`
- [x] C-5.4 Mock 活跃用户包含 `posts_count`, `followers_count`
- [x] C-5.5 Toggle like/follow Mock 返回 `boolean`
- [x] C-5.6 AI review Mock 返回 `string`

### Task C-6: 联调验证

- [ ] C-6.1 `POST /community/posts` — 发帖成功，显示 `ai_analysis_status` (待浏览器验证)
- [ ] C-6.2 `GET /community/posts/feed` — 帖子流加载 + `keyword` 搜索 (待浏览器验证)
- [ ] C-6.3 `GET /community/posts/{id}` — 帖子详情 (含 like/comment 计数) (待浏览器验证)
- [ ] C-6.4 `PUT /community/posts/{id}` — 编辑帖子 (部分字段更新) (待浏览器验证)
- [ ] C-6.5 `DELETE /community/posts/{id}` — 删除帖子 (待浏览器验证)
- [ ] C-6.6 `POST /community/posts/{id}/comments` — 发评论 + 回复 (`parent_id`) (待浏览器验证)
- [ ] C-6.7 `GET /community/posts/{id}/comments` — 评论列表分页 (待浏览器验证)
- [ ] C-6.8 `POST /community/posts/{id}/like` — Toggle 点赞 (待浏览器验证)
- [ ] C-6.9 `POST /community/users/{id}/follow` — Toggle 关注 (待浏览器验证)
- [ ] C-6.10 `POST /community/posts/{id}/ai-review` — AI 点评触发 (待浏览器验证)
- [ ] C-6.11 `GET /community/hot-topics` — 热门话题 (待浏览器验证)
- [ ] C-6.12 `GET /community/active-users` — 活跃用户 (待浏览器验证)

---

## 六、Week 3 进度跟踪

### 6.1 模块进度

| 模块 | 端点数 | 漂移点 | 类型 | API | Store | 组件 | Mock | 联调 | 完成率 |
|------|--------|--------|------|-----|-------|------|------|------|--------|
| Community | 12 | [x] | [x] | [x] | [x] | [~] | [x] | [ ] | ~65% |

> 组件适配 ~44% (4/9)，联调验证待浏览器测试

### 6.2 任务进度

| 任务 | 子项数 | 已完成 | 进度 | 负责人 | 计划完成 | 实际完成 | 状态 |
|------|--------|--------|------|--------|----------|----------|------|
| Diff 分析 | 32 | 32 | 100% | AI | 2026-06-17 | 2026-06-17 | ✅ |
| 类型更新 | 9 | 9 | 100% | AI | 2026-06-17 | 2026-06-17 | ✅ |
| API 更新 | 12 | 12 | 100% | AI | 2026-06-17 | 2026-06-17 | ✅ |
| Store 适配 | 7 | 7 | 100% | AI | 2026-06-17 | 2026-06-17 | ✅ |
| 组件适配 | 9 | 4 | 44% | AI | - | - | 🟡 |
| Mock 更新 | 6 | 6 | 100% | AI | 2026-06-17 | 2026-06-17 | ✅ |
| 联调验证 | 12 | 0 | 0% | - | - | - | 🔴 |

### 6.3 Week 3 质量门禁

- [x] `vue-tsc --noEmit` 零错误
- [x] `vite build` 构建成功
- [ ] Mock 模式: 社区页面全部功能正常 (待浏览器验证)
- [ ] 浏览器验证: 发帖 → 评论 → 点赞 → 关注 → AI 点评 全流程 (待浏览器验证)
- [x] Toggle 交互 (like/follow) 乐观更新无闪烁 (代码层已实现)

---

## 七、风险与问题记录

### Week 3 特定风险

| # | 风险 | 影响 | 对策 | 状态 |
|---|------|------|------|------|
| W3-1 | Toggle like/follow 乐观更新实现复杂 | 🟡 中 | 先实现简单刷新，后优化乐观更新 | [x] 已实现乐观更新+回滚 |
| W3-2 | AI 点评为异步触发，需轮询 `ai_analysis_status` | 🟡 中 | 确认后端是否有 WebSocket/SSE 推送，否则轮询 | [ ] 待确认 |
| W3-3 | 评论嵌套回复 (`parent_id`) UI 复杂度高 | 🟢 低 | 优先展示平铺评论，后续优化嵌套 | [ ] |
| W3-4 | 帖子 feed 无限滚动需要 `skip`/`limit` 正确分页 | 🟢 低 | 已有 PaginatedData 基础设施 | [x] Store 已实现 |
| W3-5 | 契约 Post 响应不含 `is_liked`/`author_name`/`author_avatar` | 🟡 中 | 前端本地维护 `likedPosts` Set，作者信息用占位值 | [x] 已处理 |
| W3-6 | 契约 HotTopic 不含 `participants`，ActiveUser 不含 `bio` | 🟢 低 | 移除相关 DOM 显示 | [x] 已处理 |

### Week 3 问题记录

| # | 日期 | 问题描述 | 影响 | 解决方案 | 状态 |
|---|------|----------|------|----------|------|
| 1 | 2026-06-17 | 契约 Post 响应不含 `is_liked` 字段，无法直接显示点赞状态 | 🟡 中 | Store 维护 `likedPosts: Set<number>` 本地状态，通过 `isPostLiked(postId)` 方法访问 | ✅ |
| 2 | 2026-06-17 | 契约 Post 响应不含 `author_name`/`author_avatar` | 🟢 低 | 视图用占位文本"匿名用户"和占位 emoji "👤" | ✅ |
| 3 | 2026-06-17 | 契约 ActiveUser 不含 `bio` 字段 | 🟢 低 | 移除用户详情模态框中的 bio 显示 | ✅ |
| 4 | 2026-06-17 | 契约 HotTopic 不含 `participants` 字段 | 🟢 低 | 移除热门话题详情和侧边栏中的参与者数显示 | ✅ |

---

## 八、变更记录

| 日期 | 变更 | 作者 |
|------|------|------|
| 2026-06-03 | 初始化 Week 3 子任务文档 | AI |
| 2026-06-17 | Session 4: 完成 C-1~C-3、C-5 全部 + C-4 核心功能 (4/9) | AI |