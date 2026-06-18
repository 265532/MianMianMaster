# Learning 模块 — 接口契约摘要

> 自动生成自 `docs/api/schemas/learning.openapi.json`
> 用途: 给 AI Agent 提供精简接口契约上下文，替代原始 OpenAPI JSON

## POST `/learning/courses`

> 创建课程

- **认证**: ✓
- **标签**: learning

### 请求体: `CourseCreate`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | `string` | ✓ |  |
| `description` | `string` |  |  |
| `category` | `string` |  |  |
| `difficulty` | `string` |  |  |

### 响应: `ResponseModel_Course_`

数据载体: `Course`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `number` | ✓ |  |
| `title` | `string` | ✓ |  |
| `description` | `string` |  |  |
| `category` | `string` |  |  |
| `difficulty` | `string` |  |  |
| `created_at` | `string` | ✓ |  |
| `updated_at` | `string` | ✓ |  |

## GET `/learning/courses`

> 获取课程列表

- **认证**: ✗
- **标签**: learning

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `skip` | query | `number` |  |  |
| `limit` | query | `number` |  |  |
| `type` | query | `string` |  | 课程类型筛选，如 practice 表示题库 |

### 响应: `ResponseModel_List_Course_`

数据载体: `Course[]`

## POST `/learning/materials`

> 添加学习资料

- **认证**: ✓
- **标签**: learning

### 请求体: `MaterialCreate`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `course_id` | `number` | ✓ |  |
| `title` | `string` | ✓ |  |
| `type` | `string` |  |  |
| `url` | `string` |  |  |

### 响应: `ResponseModel_Material_`

数据载体: `Material`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `number` | ✓ |  |
| `course_id` | `number` | ✓ |  |
| `title` | `string` | ✓ |  |
| `type` | `string` |  |  |
| `url` | `string` |  |  |
| `created_at` | `string` | ✓ |  |

## POST `/learning/progress/update`

> 更新学习进度

- **认证**: ✓
- **标签**: learning

### 请求体: `ProgressUpdateRequest`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `course_id` | `number` | ✓ |  |
| `progress` | `number` | ✓ | 进度百分比 0-100 |

### 响应: `ResponseModel_LearningProgress_`

数据载体: `LearningProgress`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `number` | ✓ |  |
| `user_id` | `number` | ✓ |  |
| `course_id` | `number` | ✓ |  |
| `progress` | `number` | ✓ |  |
| `updated_at` | `string` | ✓ |  |

## GET `/learning/progress/{course_id}`

> 获取课程学习进度

- **认证**: ✓
- **标签**: learning

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `course_id` | path | `number` | ✓ |  |

### 响应: `ResponseModel_LearningProgress_`

数据载体: `LearningProgress`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `number` | ✓ |  |
| `user_id` | `number` | ✓ |  |
| `course_id` | `number` | ✓ |  |
| `progress` | `number` | ✓ |  |
| `updated_at` | `string` | ✓ |  |

## POST `/learning/collections`

> 添加到收藏夹

- **认证**: ✓
- **标签**: learning

### 请求体: `AddToCollectionRequest`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | `string` | ✓ |  |
| `description` | `string` |  |  |
| `question_ids` | `number[]` |  |  |
| `category` | `string` |  |  |
| `difficulty` | `string` |  |  |

### 响应: `ResponseModel_Collection_`

数据载体: `Collection`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `number` | ✓ |  |
| `title` | `string` | ✓ |  |
| `description` | `string` |  |  |
| `question_count` | `number` |  |  |
| `category` | `string` |  |  |
| `difficulty` | `string` |  |  |
| `saved_at` | `string` |  |  |
| `last_practiced` | `string` |  |  |

## GET `/learning/collections`

> 获取收藏夹列表

- **认证**: ✓
- **标签**: learning

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `skip` | query | `number` |  |  |
| `limit` | query | `number` |  |  |

### 响应: `ResponseModel_List_Collection_`

数据载体: `Collection[]`

## POST `/learning/wrong-questions`

> 记录错题

- **认证**: ✓
- **标签**: learning

### 请求体: `RecordWrongQuestionRequest`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `question` | `string` | ✓ |  |
| `user_answer` | `string` |  |  |
| `correct_answer` | `string` |  |  |
| `explanation` | `string` |  |  |
| `category` | `string` |  |  |
| `difficulty` | `string` |  |  |

### 响应: `ResponseModel_WrongQuestion_`

数据载体: `WrongQuestion`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `number` | ✓ |  |
| `question` | `string` | ✓ |  |
| `user_answer` | `string` |  |  |
| `correct_answer` | `string` |  |  |
| `explanation` | `string` |  |  |
| `category` | `string` |  |  |
| `difficulty` | `string` |  |  |
| `mistake_count` | `number` |  |  |
| `last_mistake_at` | `string` |  |  |
| `status` | `string` |  |  |

## GET `/learning/wrong-questions`

> 获取错题列表

- **认证**: ✓
- **标签**: learning

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `skip` | query | `number` |  |  |
| `limit` | query | `number` |  |  |

### 响应: `ResponseModel_List_WrongQuestion_`

数据载体: `WrongQuestion[]`

## POST `/learning/wrong-questions/{question_id}/master`

> 标记错题已掌握

- **认证**: ✓
- **标签**: learning

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `question_id` | path | `number` | ✓ |  |

### 响应: `ResponseModel_str_`

数据载体: `string`

## POST `/learning/badges`

> 创建徽章

- **认证**: ✓
- **标签**: learning

### 请求体: `CreateBadgeRequest`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | `string` | ✓ |  |
| `description` | `string` |  |  |
| `icon_url` | `string` |  |  |

### 响应: `ResponseModel_Badge_`

数据载体: `Badge`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `number` | ✓ |  |
| `name` | `string` | ✓ |  |
| `description` | `string` |  |  |
| `icon_url` | `string` |  |  |
| `created_at` | `string` | ✓ |  |

## GET `/learning/badges`

> 获取所有徽章列表

- **认证**: ✗
- **标签**: learning

### 响应: `ResponseModel_List_Badge_`

数据载体: `Badge[]`

## POST `/learning/badges/award/{badge_id}`

> 授予徽章给当前用户

- **认证**: ✓
- **标签**: learning

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `badge_id` | path | `number` | ✓ |  |

### 响应: `ResponseModel_UserBadge_`

数据载体: `UserBadge`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `number` | ✓ |  |
| `badge_id` | `number` | ✓ |  |
| `badge` | `Badge` |  |  |
| ↳ `id` | `number` | ✓ |  |
| ↳ `name` | `string` | ✓ |  |
| ↳ `description` | `string` |  |  |
| ↳ `icon_url` | `string` |  |  |
| ↳ `created_at` | `string` | ✓ |  |
| `awarded_at` | `string` | ✓ |  |

## GET `/learning/my-badges`

> 获取我的徽章

- **认证**: ✓
- **标签**: learning

### 响应: `ResponseModel_List_UserBadge_`

数据载体: `UserBadge[]`
