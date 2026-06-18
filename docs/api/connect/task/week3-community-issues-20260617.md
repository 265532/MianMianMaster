# Week 3 Community 模块 — 待解决问题记录

> **生成日期**: 2026-06-17  
> **会话**: Session 4  
> **用途**: 记录 Community 模块契约对齐过程中发现的问题和决策，供后续解决

---

## 一、契约字段缺失问题

### 1.1 Post 响应缺失字段

| 缺失字段 | 用途 | 当前处理 | 影响程度 | 建议解决方案 |
|----------|------|----------|----------|-------------|
| `author_name` | 显示帖子作者名 | 占位文本"匿名用户" | 🟡 中 | 后端在 Post 响应中添加 `author_name?: string` |
| `author_avatar` | 显示作者头像 | 占位 emoji "👤" | 🟡 中 | 后端在 Post 响应中添加 `author_avatar?: string` |
| `is_liked` | 显示当前用户是否已点赞 | Store 本地维护 `likedPosts: Set<number>` | 🔴 高 | 后端在 Post 响应中添加 `is_liked?: boolean` |

**问题详情**:
- 契约 C1/C2/C3 响应中 Post 对象只包含 `user_id`，不包含作者名称和头像
- 前端无法显示"谁发了这个帖子"，只能显示"匿名用户"
- 点赞状态 `is_liked` 不在响应中，导致刷新页面后点赞状态丢失（Store 本地状态不持久化）

**当前实现**:
```typescript
// Store 本地维护点赞状态
const likedPosts = ref<Set<number>>(new Set());
function isPostLiked(postId: number): boolean {
  return likedPosts.value.has(postId);
}
```

**建议**:
1. 短期: 保持当前占位方案，前端可用 localStorage 持久化 `likedPosts`
2. 长期: 后端在 Post 响应中添加 `author_name`/`author_avatar`/`is_liked` 字段

---

### 1.2 HotTopic 响应缺失字段

| 缺失字段 | 用途 | 当前处理 | 影响程度 | 建议解决方案 |
|----------|------|----------|----------|-------------|
| `participants` | 显示话题参与者数量 | 移除显示 | 🟢 低 | 后端在 HotTopic 响应中添加 `participants?: number` |

**问题详情**:
- 契约 C11 响应中 HotTopic 对象只有 `id`/`title`/`posts_count?`/`category`
- 前端原本显示"X 帖子 · Y 参与者"，现在只显示"X 帖子"
- 视觉上略显单薄，但不影响核心功能

---

### 1.3 ActiveUser 响应缺失字段

| 缺失字段 | 用途 | 当前处理 | 影响程度 | 建议解决方案 |
|----------|------|----------|----------|-------------|
| `bio` | 显示用户个人简介 | 移除显示 | 🟢 低 | 后端在 ActiveUser 响应中添加 `bio?: string` |
| `is_following` | 显示当前用户是否已关注 | Store 本地维护 `followedUsers: Set<number>` | 🟡 中 | 后端在 ActiveUser 响应中添加 `is_following?: boolean` |

**问题详情**:
- 契约 C12 响应中 ActiveUser 对象只有 `id`/`username`/`avatar_url?`/`posts_count?`/`followers_count?`
- 用户详情模态框原本显示 bio，现在移除
- 关注状态不在响应中，刷新页面后关注状态丢失

---

## 二、异步任务状态问题

### 2.1 AI 点评异步状态轮询

**问题**: 
- 契约 C10 `POST /community/posts/{post_id}/ai-review` 返回 `string`（任务 ID）
- Post 响应中有 `ai_analysis_status` 字段 (pending/processing/completed/failed)
- 但前端无法实时获取 AI 点评完成状态

**当前实现**:
- Mock 中触发 AI 点评后，立即将 `ai_analysis_status` 设为 "processing"
- 前端无法知道何时变为 "completed"

**建议解决方案**:
1. **轮询方案**: 前端定时调用 `GET /community/posts/{post_id}` 检查 `ai_analysis_status`
2. **SSE/WebSocket 推送**: 后端通过 SSE 或 WebSocket 推送状态更新
3. **确认后端实现**: 需要与后端确认 AI 点评的异步处理机制

**风险**: W3-2 (见 week3-community.md 风险表)

---

## 三、视图功能缺失问题

### 3.1 本次未完成的视图功能

| 任务 | 说明 | 优先级 |
|------|------|--------|
| C-4.2 发帖表单 category 选择器 | 当前发帖表单只有 title/content，缺少 category 下拉选择 | 高 |
| C-4.3 帖子详情显示 AI 状态 | 帖子详情模态框未显示 `ai_analysis_status` 和 `ai_review_content` | 中 |
| C-4.4 评论回复 parent_id | 评论输入不支持回复指定评论（平铺显示） | 中 |
| C-4.8 帖子编辑表单 | 缺少编辑帖子的 UI 入口和表单 | 中 |
| C-4.9 帖子删除确认 | 缺少删除帖子的 UI 入口和确认弹窗 | 中 |

**影响**:
- 发帖功能无法使用（缺少 category 必填字段）
- AI 点评结果无法在 UI 中展示
- 评论只能平铺，无法嵌套回复
- 帖子作者无法编辑/删除自己的帖子

---

## 四、数据一致性问题

### 4.1 帖子流分页

**问题**:
- 契约 C2 `GET /community/posts/feed` 响应为 `Post[]` 数组，无 `total` 字段
- Store 中 `pagination.total` 只能用 `posts.value.length` 兜底
- 导致 `hasMore` computed 永远为 false，无法触发 `loadMore`

**当前实现**:
```typescript
// Store
pagination.value.total = posts.value.length; // 兜底
const hasMore = computed(() => posts.value.length < pagination.value.total); // 永远 false
```

**建议**:
1. 确认后端是否支持分页（skip/limit 参数已发送，但响应无 total）
2. 如果后端返回空数组表示无更多数据，可改为判断响应长度 < pageSize

---

### 4.2 评论计数同步

**问题**:
- 创建评论后，Store 乐观更新 `post.comments_count + 1`
- 但下次 `fetchPosts` 时，后端返回的 `comments_count` 可能与本地不一致
- 如果乐观更新失败回滚，计数可能错乱

**当前实现**: 已实现失败回滚，但建议后端在 Post 响应中保证 `comments_count` 准确

---

## 五、测试用户问题

### 5.1 Mock 用户 ID

**当前**: Mock 中创建帖子/评论使用 `user_id: 109` (testuser)

**问题**: 
- 真实后端联调时，需要确认 testuser 的 user_id 是否为 109
- 如果不一致，Mock 数据中的 `user_id` 需要调整

**建议**: 联调时先调用 `GET /auth/me` 确认当前用户 ID

---

## 六、决策记录

### 6.1 用户确认的决策

| 问题 | 用户选择 | 理由 |
|------|----------|------|
| Community.vue 视图依赖契约中不存在的字段如何处理？ | 严格对齐契约 + 视图占位 | 与 Matching.vue 处理方式一致 |
| Community.vue 视图适配的范围？ | 核心功能优先 (C-4.1/4.5/4.6/4.7) | 保证本次任务完整性 |
| 点赞状态 is_liked 如何维护？ | 前端本地状态管理 | 契约不返回 is_liked |

### 6.2 额外要求

- 用户要求将所有问题记录在单独的 md 文档中（即本文档）
- 用户要求每次完成任务后更新 checklist 和生成交接文档

---

## 七、后续行动项

| # | 行动项 | 负责方 | 优先级 | 状态 |
|---|--------|--------|--------|------|
| 1 | 完成 C-4.2 发帖表单 category 选择器 | 前端 | 高 | 待办 |
| 2 | 完成 C-4.3 帖子详情 AI 状态显示 | 前端 | 中 | 待办 |
| 3 | 完成 C-4.4 评论回复 parent_id | 前端 | 中 | 待办 |
| 4 | 完成 C-4.8/C-4.9 帖子编辑/删除 | 前端 | 中 | 待办 |
| 5 | 浏览器验证 C-6.1~C-6.12 | 前端 | 高 | 待办 |
| 6 | 确认后端是否在 Post 响应添加 author_name/author_avatar/is_liked | 后端 | 中 | 待确认 |
| 7 | 确认 AI 点评异步状态推送机制 | 后端 | 中 | 待确认 |
| 8 | 确认帖子流分页是否支持 total 字段 | 后端 | 低 | 待确认 |
| 9 | 确认 testuser 的 user_id | 前端 | 低 | 待确认 |

---

*本文档将随问题解决进度持续更新。*
