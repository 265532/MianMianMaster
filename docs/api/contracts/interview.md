# Interview 模块 — 接口契约摘要

> 自动生成自 `docs/api/schemas/interview.openapi.json`
> 用途: 给 AI Agent 提供精简接口契约上下文，替代原始 OpenAPI JSON

## POST `/interview/sessions`

> 创建面试会话

- **认证**: ✓
- **标签**: interview

### 请求体: `InterviewSessionCreate`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `job_title` | `string` | ✓ |  |
| `company` | `string` |  |  |
| `type` | `string` |  |  |
| `max_rounds` | `number` |  |  |

### 响应: `ResponseModel_InterviewSession_`

数据载体: `InterviewSession`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `string` | ✓ |  |
| `job_title` | `string` | ✓ |  |
| `company` | `string` |  |  |
| `status` | `string` | ✓ |  |
| `type` | `string` |  |  |
| `max_rounds` | `number` |  |  |
| `current_round` | `number` |  |  |
| `created_at` | `string` | ✓ |  |
| `started_at` | `string` |  |  |
| `ended_at` | `string` |  |  |
| `total_score` | `number` |  |  |
| `feedback` | `string` |  |  |
| `details` | `Record<string, unknown>` |  |  |

## GET `/interview/sessions`

> 获取面试会话列表

- **认证**: ✓
- **标签**: interview

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `skip` | query | `number` |  |  |
| `limit` | query | `number` |  |  |
| `status` | query | `string` |  | 按状态筛选: scheduled/in_progress/completed/cancelled |

### 响应: `ResponseModel_List_InterviewSession_`

数据载体: `InterviewSession[]`

## GET `/interview/sessions/{session_id}`

> 获取面试会话详情

- **认证**: ✓
- **标签**: interview

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `session_id` | path | `string` | ✓ |  |

### 响应: `ResponseModel_InterviewSession_`

数据载体: `InterviewSession`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `string` | ✓ |  |
| `job_title` | `string` | ✓ |  |
| `company` | `string` |  |  |
| `status` | `string` | ✓ |  |
| `type` | `string` |  |  |
| `max_rounds` | `number` |  |  |
| `current_round` | `number` |  |  |
| `created_at` | `string` | ✓ |  |
| `started_at` | `string` |  |  |
| `ended_at` | `string` |  |  |
| `total_score` | `number` |  |  |
| `feedback` | `string` |  |  |
| `details` | `Record<string, unknown>` |  |  |

## POST `/interview/sessions/{session_id}/start`

> 开始面试会话

- **认证**: ✓
- **标签**: interview

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `session_id` | path | `string` | ✓ |  |

### 响应: `ResponseModel_InterviewSession_`

数据载体: `InterviewSession`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `string` | ✓ |  |
| `job_title` | `string` | ✓ |  |
| `company` | `string` |  |  |
| `status` | `string` | ✓ |  |
| `type` | `string` |  |  |
| `max_rounds` | `number` |  |  |
| `current_round` | `number` |  |  |
| `created_at` | `string` | ✓ |  |
| `started_at` | `string` |  |  |
| `ended_at` | `string` |  |  |
| `total_score` | `number` |  |  |
| `feedback` | `string` |  |  |
| `details` | `Record<string, unknown>` |  |  |

## POST `/interview/sessions/{session_id}/chat`

> 面试对话（SSE 流式）

- **认证**: ✓
- **标签**: interview

### 请求体: `ChatRequest`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `message` | `string` | ✓ | 用户发送的面试回答 |

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `session_id` | path | `string` | ✓ |  |

## POST `/interview/sessions/{session_id}/end`

> 结束面试会话

- **认证**: ✓
- **标签**: interview

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `session_id` | path | `string` | ✓ |  |

### 响应: `ResponseModel_InterviewSession_`

数据载体: `InterviewSession`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `string` | ✓ |  |
| `job_title` | `string` | ✓ |  |
| `company` | `string` |  |  |
| `status` | `string` | ✓ |  |
| `type` | `string` |  |  |
| `max_rounds` | `number` |  |  |
| `current_round` | `number` |  |  |
| `created_at` | `string` | ✓ |  |
| `started_at` | `string` |  |  |
| `ended_at` | `string` |  |  |
| `total_score` | `number` |  |  |
| `feedback` | `string` |  |  |
| `details` | `Record<string, unknown>` |  |  |

## POST `/interview/sessions/{session_id}/cancel`

> 取消面试会话

- **认证**: ✓
- **标签**: interview

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `session_id` | path | `string` | ✓ |  |

### 响应: `ResponseModel_InterviewSession_`

数据载体: `InterviewSession`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `string` | ✓ |  |
| `job_title` | `string` | ✓ |  |
| `company` | `string` |  |  |
| `status` | `string` | ✓ |  |
| `type` | `string` |  |  |
| `max_rounds` | `number` |  |  |
| `current_round` | `number` |  |  |
| `created_at` | `string` | ✓ |  |
| `started_at` | `string` |  |  |
| `ended_at` | `string` |  |  |
| `total_score` | `number` |  |  |
| `feedback` | `string` |  |  |
| `details` | `Record<string, unknown>` |  |  |

## GET `/interview/sessions/{session_id}/report`

> 获取面试报告

- **认证**: ✓
- **标签**: interview

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `session_id` | path | `string` | ✓ |  |

### 响应: `ResponseModel_InterviewReport_`

数据载体: `InterviewReport`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `session_id` | `string` | ✓ |  |
| `status` | `string` | ✓ |  |
| `overall_score` | `number` |  |  |
| `dimensions` | `Record<string, unknown>` |  |  |
| `strengths` | `string[]` |  |  |
| `weaknesses` | `string[]` |  |  |
| `suggestions` | `string[]` |  |  |
| `generated_at` | `string` |  |  |

## GET `/interview/questions`

> 获取面试题库

- **认证**: ✗
- **标签**: interview

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `category` | query | `string` |  |  |
| `difficulty` | query | `string` |  |  |
| `type` | query | `string` |  |  |

### 响应: `ResponseModel_List_InterviewQuestion_`

数据载体: `InterviewQuestion[]`

## GET `/interview/game/levels`

> 获取游戏化面试关卡列表

- **认证**: ✓
- **标签**: interview

### 响应: `ResponseModel_List_GameLevel_`

数据载体: `GameLevel[]`

## GET `/interview/game/stats`

> 获取游戏化面试统计数据

- **认证**: ✓
- **标签**: interview

### 响应: `ResponseModel_GameStats_`

数据载体: `GameStats`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `completedLevels` | `number` | ✓ |  |
| `totalQuestions` | `number` | ✓ |  |
| `correctRate` | `string` | ✓ |  |
| `certifications` | `number` | ✓ |  |
| `streak` | `string` | ✓ |  |
| `totalScore` | `string` | ✓ |  |

## GET `/interview/game/achievements`

> 获取游戏化面试成就列表

- **认证**: ✓
- **标签**: interview

### 响应: `ResponseModel_List_GameAchievement_`

数据载体: `GameAchievement[]`

## GET `/interview/game/leaderboard`

> 获取游戏化面试排行榜

- **认证**: ✓
- **标签**: interview

### 响应: `ResponseModel_List_LeaderboardEntry_`

数据载体: `LeaderboardEntry[]`
