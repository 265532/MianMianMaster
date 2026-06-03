# User 模块 — 接口契约摘要

> 自动生成自 `docs/api/schemas/user.openapi.json`
> 用途: 给 AI Agent 提供精简接口契约上下文，替代原始 OpenAPI JSON

## GET `/user/profile`

> 获取当前用户画像

- **认证**: ✓
- **标签**: user

### 响应: `ResponseModel_User_`

数据载体: `User`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | `string` | ✓ |  |
| `email` | `string` | ✓ |  |
| `phone` | `string` |  |  |
| `is_active` | `boolean` |  |  |
| `id` | `number` | ✓ |  |
| `created_at` | `string` | ✓ |  |
| `updated_at` | `string` | ✓ |  |
| `roles` | `Role[]` |  |  |
| ↳ `name` | `string` | ✓ |  |
| ↳ `description` | `string` |  |  |
| ↳ `parent_id` | `number` |  |  |
| ↳ `id` | `number` | ✓ |  |
| ↳ `created_at` | `string` | ✓ |  |
| ↳ ... 还有 2 个嵌套字段 | | | |
| `profile` | `UserProfile` |  |  |
| ↳ `avatar_url` | `string` |  |  |
| ↳ `education` | `string` |  |  |
| ↳ `target_position` | `string` |  |  |
| ↳ `work_years` | `number` |  |  |
| ↳ `id` | `number` | ✓ |  |
| ↳ ... 还有 3 个嵌套字段 | | | |

## PUT `/user/profile`

> 更新当前用户画像

- **认证**: ✓
- **标签**: user

### 请求体: `UserProfileUpdate`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `avatar_url` | `string` |  |  |
| `education` | `string` |  |  |
| `target_position` | `string` |  |  |
| `work_years` | `number` |  |  |

### 响应: `ResponseModel_UserProfile_`

数据载体: `UserProfile`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `avatar_url` | `string` |  |  |
| `education` | `string` |  |  |
| `target_position` | `string` |  |  |
| `work_years` | `number` |  |  |
| `id` | `number` | ✓ |  |
| `user_id` | `number` | ✓ |  |
| `created_at` | `string` | ✓ |  |
| `updated_at` | `string` | ✓ |  |

## POST `/user/security/change-password`

> 修改密码

- **认证**: ✓
- **标签**: user

### 请求体: `ChangePasswordRequest`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `old_password` | `string` | ✓ |  |
| `new_password` | `string` | ✓ |  |

### 响应: `ResponseModel_str_`

数据载体: `string`

## POST `/user/security/change-phone`

> 修改手机号

- **认证**: ✓
- **标签**: user

### 请求体: `ChangePhoneRequest`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `new_phone` | `string` | ✓ |  |
| `code` | `string` | ✓ |  |

### 响应: `ResponseModel_str_`

数据载体: `string`

## GET `/user/interview-history`

> 获取模拟面试历史记录（分页）

- **认证**: ✓
- **标签**: user

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `skip` | query | `number` |  |  |
| `limit` | query | `number` |  |  |

### 响应: `ResponseModel_InterviewHistoryResponse_`

数据载体: `InterviewHistoryResponse`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `items` | `InterviewHistoryItem[]` | ✓ |  |
| ↳ `id` | `number` | ✓ |  |
| ↳ `date` | `string` | ✓ | YYYY-MM-DD |
| ↳ `company` | `string` | ✓ |  |
| ↳ `position` | `string` | ✓ |  |
| ↳ `round` | `string` | ✓ | 一面/二面/三面/HR面 |
| ↳ ... 还有 6 个嵌套字段 | | | |
| `total` | `number` | ✓ |  |
| `page` | `number` | ✓ |  |
| `page_size` | `number` | ✓ |  |

## GET `/user/ability-data`

> 获取当前用户能力评估数据（按岗位分组）

- **认证**: ✓
- **标签**: user

### 响应: `ResponseModel_AbilityDataMap_`

数据载体: `Record<string, AbilityDataItem>`

## GET `/user/game-interview-data`

> 获取游戏化面试数据（统计/关卡/成就/排行榜）

- **认证**: ✓
- **标签**: user

### 响应: `ResponseModel_GameInterviewDataResponse_`

数据载体: `GameInterviewDataResponse`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `stats` | `GameStatItem[]` | ✓ |  |
| ↳ `label` | `string` | ✓ |  |
| ↳ `value` | `string` | ✓ |  |
| `levels` | `GameLevel[]` | ✓ |  |
| ↳ `id` | `number` | ✓ |  |
| ↳ `name` | `string` | ✓ |  |
| ↳ `title` | `string` | ✓ |  |
| ↳ `status` | `string` | ✓ |  |
| ↳ `progress` | `number` | ✓ |  |
| ↳ ... 还有 13 个嵌套字段 | | | |
| `achievements` | `GameAchievement[]` | ✓ |  |
| ↳ `id` | `number` | ✓ |  |
| ↳ `name` | `string` | ✓ |  |
| ↳ `description` | `string` | ✓ |  |
| ↳ `unlocked` | `boolean` | ✓ |  |
| ↳ `unlockedAt` | `string` |  |  |
| ↳ ... 还有 2 个嵌套字段 | | | |
| `leaderboard` | `LeaderboardEntry[]` | ✓ |  |
| ↳ `rank` | `number` | ✓ |  |
| ↳ `name` | `string` | ✓ |  |
| ↳ `score` | `number` | ✓ |  |
| ↳ `avatar` | `string` | ✓ |  |
| ↳ `isCurrentUser` | `boolean` |  |  |

## GET `/user/resume`

> 获取当前用户简历数据

- **认证**: ✓
- **标签**: user

### 响应: `ResponseModel_ResumeData_`

数据载体: `ResumeData`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `basic_info` | `ResumeBasicInfo` | ✓ |  |
| ↳ `name` | `string` | ✓ |  |
| ↳ `major` | `string` | ✓ |  |
| ↳ `grade` | `string` | ✓ |  |
| ↳ `school` | `string` | ✓ |  |
| `education` | `ResumeEducation[]` | ✓ |  |
| ↳ `school` | `string` | ✓ |  |
| ↳ `degree` | `string` | ✓ |  |
| ↳ `major` | `string` | ✓ |  |
| ↳ `period` | `string` | ✓ |  |
| `experience` | `ResumeExperience[]` | ✓ |  |
| ↳ `company` | `string` | ✓ |  |
| ↳ `position` | `string` | ✓ |  |
| ↳ `period` | `string` | ✓ |  |
| ↳ `description` | `string` | ✓ |  |
| `skills` | `string[]` | ✓ |  |
| `projects` | `ResumeProject[]` | ✓ |  |
| ↳ `name` | `string` | ✓ |  |
| ↳ `role` | `string` | ✓ |  |
| ↳ `period` | `string` | ✓ |  |
| ↳ `description` | `string` | ✓ |  |

## POST `/user/resume/diagnose`

> 诊断当前用户简历

- **认证**: ✓
- **标签**: user

### 响应: `ResponseModel_ResumeDiagnosisResult_`

数据载体: `ResumeDiagnosisResult`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `overall_score` | `number` | ✓ |  |
| `strengths` | `string[]` | ✓ |  |
| `weaknesses` | `string[]` | ✓ |  |
| `match_rate` | `MatchRateItem[]` | ✓ |  |
| ↳ `position` | `string` | ✓ |  |
| ↳ `rate` | `number` | ✓ |  |
| `suggestions` | `string[]` | ✓ |  |
