# Community 模块 — 接口契约摘要

> 自动生成自 `docs/api/schemas/community.openapi.json`
> 用途: 给 AI Agent 提供精简接口契约上下文，替代原始 OpenAPI JSON

## POST `/community/posts`

> 发布帖子

- **认证**: ✓
- **标签**: community

### 请求体: `PostCreate`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | `string` | ✓ |  |
| `content` | `string` | ✓ |  |
| `category` | `string` | ✓ |  |

### 响应: `ResponseModel_Post_`

数据载体: `Post`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `number` | ✓ |  |
| `title` | `string` | ✓ |  |
| `content` | `string` | ✓ |  |
| `category` | `string` | ✓ |  |
| `author_id` | `number` | ✓ |  |
| `author_name` | `string` |  |  |
| `author_avatar` | `string` |  |  |
| `likes_count` | `number` |  |  |
| `comments_count` | `number` |  |  |
| `is_liked` | `boolean` |  |  |
| `ai_review_content` | `string` |  |  |
| `created_at` | `string` | ✓ |  |
| `updated_at` | `string` | ✓ |  |

## GET `/community/posts/feed`

> 获取帖子流

- **认证**: ✗
- **标签**: community

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `skip` | query | `number` |  |  |
| `limit` | query | `number` |  |  |
| `keyword` | query | `string` |  |  |

### 响应: `ResponseModel_List_Post_`

数据载体: `Post[]`

## GET `/community/posts/{post_id}`

> 获取帖子详情

- **认证**: ✗
- **标签**: community

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `post_id` | path | `number` | ✓ |  |

### 响应: `ResponseModel_Post_`

数据载体: `Post`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `number` | ✓ |  |
| `title` | `string` | ✓ |  |
| `content` | `string` | ✓ |  |
| `category` | `string` | ✓ |  |
| `author_id` | `number` | ✓ |  |
| `author_name` | `string` |  |  |
| `author_avatar` | `string` |  |  |
| `likes_count` | `number` |  |  |
| `comments_count` | `number` |  |  |
| `is_liked` | `boolean` |  |  |
| `ai_review_content` | `string` |  |  |
| `created_at` | `string` | ✓ |  |
| `updated_at` | `string` | ✓ |  |

## PUT `/community/posts/{post_id}`

> 编辑帖子

- **认证**: ✓
- **标签**: community

### 请求体: `PostUpdate`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | `string` |  |  |
| `content` | `string` |  |  |
| `category` | `string` |  |  |

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `post_id` | path | `number` | ✓ |  |

### 响应: `ResponseModel_Post_`

数据载体: `Post`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `number` | ✓ |  |
| `title` | `string` | ✓ |  |
| `content` | `string` | ✓ |  |
| `category` | `string` | ✓ |  |
| `author_id` | `number` | ✓ |  |
| `author_name` | `string` |  |  |
| `author_avatar` | `string` |  |  |
| `likes_count` | `number` |  |  |
| `comments_count` | `number` |  |  |
| `is_liked` | `boolean` |  |  |
| `ai_review_content` | `string` |  |  |
| `created_at` | `string` | ✓ |  |
| `updated_at` | `string` | ✓ |  |

## DELETE `/community/posts/{post_id}`

> 删除帖子

- **认证**: ✓
- **标签**: community

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `post_id` | path | `number` | ✓ |  |

### 响应: `ResponseModel_str_`

数据载体: `string`

## GET `/community/posts/{post_id}/comments`

> 获取帖子评论列表

- **认证**: ✓
- **标签**: community

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `post_id` | path | `number` | ✓ |  |

### 响应: `ResponseModel_List_Comment_`

数据载体: `Comment[]`

## POST `/community/posts/{post_id}/comments`

> 发表评论

- **认证**: ✓
- **标签**: community

### 请求体: `CommentCreate`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `content` | `string` | ✓ |  |
| `parent_id` | `number` |  | 楼中楼回复目标评论ID |

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `post_id` | path | `number` | ✓ |  |

### 响应: `ResponseModel_Comment_`

数据载体: `Comment`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `number` | ✓ |  |
| `post_id` | `number` | ✓ |  |
| `author_id` | `number` | ✓ |  |
| `author_name` | `string` |  |  |
| `content` | `string` | ✓ |  |
| `parent_id` | `number` |  |  |
| `replies` | `Comment[]` |  |  |
| ↳ `id` | `number` | ✓ |  |
| ↳ `post_id` | `number` | ✓ |  |
| ↳ `author_id` | `number` | ✓ |  |
| ↳ `author_name` | `string` |  |  |
| ↳ `content` | `string` | ✓ |  |
| ↳ ... 还有 3 个嵌套字段 | | | |
| `created_at` | `string` | ✓ |  |

## POST `/community/posts/{post_id}/like`

> 切换点赞状态

- **认证**: ✓
- **标签**: community

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `post_id` | path | `number` | ✓ |  |

### 响应: `ResponseModel_LikeResult_`

数据载体: `LikeResult`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `liked` | `boolean` | ✓ |  |
| `likes_count` | `number` | ✓ |  |

## POST `/community/users/{user_id}/follow`

> 切换关注状态

- **认证**: ✓
- **标签**: community

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `user_id` | path | `number` | ✓ |  |

### 响应: `ResponseModel_FollowResult_`

数据载体: `FollowResult`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `following` | `boolean` | ✓ |  |

## POST `/community/posts/{post_id}/ai-review`

> 触发 AI 点评

- **认证**: ✓
- **标签**: community

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `post_id` | path | `number` | ✓ |  |

### 响应: `ResponseModel_AiReviewResult_`

数据载体: `AiReviewResult`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `task_id` | `string` | ✓ |  |
| `status` | `string` | ✓ |  |
| `ai_review_content` | `string` |  |  |

## GET `/community/hot-topics`

> 获取热门话题

- **认证**: ✗
- **标签**: community

### 响应: `ResponseModel_List_HotTopic_`

数据载体: `HotTopic[]`

## GET `/community/active-users`

> 获取活跃用户

- **认证**: ✗
- **标签**: community

### 响应: `ResponseModel_List_ActiveUser_`

数据载体: `ActiveUser[]`
