# Assessment 模块 — 接口契约摘要

> 自动生成自 `docs/api/schemas/assessment.openapi.json`
> 用途: 给 AI Agent 提供精简接口契约上下文，替代原始 OpenAPI JSON

## GET `/assessments`

> 获取测评列表

- **认证**: ✓
- **标签**: assessment

### 响应: `ResponseModel_List_Assessment_`

数据载体: `Assessment[]`

## POST `/assessments`

> 创建测评

- **认证**: ✓
- **标签**: assessment

### 请求体: `AssessmentCreate`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | `string` |  |  |
| `questions` | `AssessmentQuestion[]` | ✓ |  |

### 响应: `ResponseModel_Assessment_`

数据载体: `Assessment`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `number` | ✓ |  |
| `title` | `string` |  |  |
| `type` | `string` |  |  |
| `created_at` | `string` | ✓ |  |

## POST `/assessments/submit`

> 提交测评答案

- **认证**: ✓
- **标签**: assessment

### 请求体: `AssessmentSubmit`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `assessment_id` | `number` | ✓ |  |
| `answers` | `AssessmentAnswerItem[]` | ✓ |  |

### 响应: `ResponseModel_AssessmentResult_`

数据载体: `AssessmentResult`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `number` | ✓ |  |
| `assessment_id` | `number` | ✓ |  |
| `score` | `number` |  |  |
| `details` | `Record<string, unknown>` |  |  |
| `created_at` | `string` | ✓ |  |

## GET `/assessments/{assessment_id}/result`

> 获取测评结果

- **认证**: ✓
- **标签**: assessment

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `assessment_id` | path | `number` | ✓ |  |

### 响应: `ResponseModel_AssessmentResult_`

数据载体: `AssessmentResult`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `number` | ✓ |  |
| `assessment_id` | `number` | ✓ |  |
| `score` | `number` |  |  |
| `details` | `Record<string, unknown>` |  |  |
| `created_at` | `string` | ✓ |  |
