# Job 模块 — 接口契约摘要

> 自动生成自 `docs/api/schemas/job.openapi.json`
> 用途: 给 AI Agent 提供精简接口契约上下文，替代原始 OpenAPI JSON

## POST `/jobs`

> 创建岗位

- **认证**: ✓
- **标签**: job

### 请求体: `JobPositionCreate`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | `string` | ✓ |  |
| `description` | `string` |  |  |
| `company` | `string` |  |  |
| `location` | `string` |  |  |
| `salary_range` | `string` |  |  |
| `requirements` | `string[]` |  |  |

### 响应: `ResponseModel_JobPosition_`

数据载体: `JobPosition`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `number` | ✓ |  |
| `title` | `string` | ✓ |  |
| `description` | `string` |  |  |
| `company` | `string` |  |  |
| `location` | `string` |  |  |
| `salary_range` | `string` |  |  |
| `requirements` | `string[]` |  |  |
| `created_at` | `string` | ✓ |  |
| `updated_at` | `string` | ✓ |  |

## GET `/jobs`

> 获取岗位列表

- **认证**: ✗
- **标签**: job

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `skip` | query | `number` |  |  |
| `limit` | query | `number` |  |  |

### 响应: `ResponseModel_List_JobPosition_`

数据载体: `JobPosition[]`

## GET `/jobs/{job_id}/skill-tree`

> 获取岗位技能树

- **认证**: ✗
- **标签**: job

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `job_id` | path | `number` | ✓ |  |

### 响应: `ResponseModel_SkillTreeNode_`

数据载体: `SkillTreeNode`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `number` | ✓ |  |
| `name` | `string` | ✓ |  |
| `category` | `string` |  |  |
| `level` | `number` |  |  |
| `is_required` | `boolean` | ✓ |  |
| `has_required_child` | `boolean` | ✓ |  |
| `children` | `SkillTreeNode[]` |  |  |
| ↳ `id` | `number` | ✓ |  |
| ↳ `name` | `string` | ✓ |  |
| ↳ `category` | `string` |  |  |
| ↳ `level` | `number` |  |  |
| ↳ `is_required` | `boolean` | ✓ |  |
| ↳ ... 还有 2 个嵌套字段 | | | |

## GET `/jobs/{job_id}/match`

> 获取岗位匹配度

- **认证**: ✓
- **标签**: job

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `job_id` | path | `number` | ✓ |  |

### 响应: `ResponseModel_JobMatchResult_`

数据载体: `JobMatchResult`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `job_id` | `number` | ✓ |  |
| `match_score` | `number` | ✓ |  |
| `matched_skills` | `string[]` |  |  |
| `missing_skills` | `string[]` |  |  |
