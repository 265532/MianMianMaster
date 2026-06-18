# Business 模块 — 接口契约摘要

> 自动生成自 `docs/api/schemas/business.openapi.json`
> 用途: 给 AI Agent 提供精简接口契约上下文，替代原始 OpenAPI JSON

## GET `/business/knowledge-graph`

> List Knowledge Graph

- **认证**: ✓
- **标签**: business

### 响应: `ResponseModel_List_KnowledgeGraph__`

数据载体: `KnowledgeGraph[]`

## POST `/business/knowledge-graph`

> Create Knowledge Graph

- **认证**: ✓
- **标签**: business

### 请求体: `KnowledgeGraphCreate`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `concept_name` | `string` | ✓ |  |
| `description` | `string` |  |  |
| `parent_id` | `number` |  |  |
| `tags` | `string[]` |  |  |

### 响应: `ResponseModel_KnowledgeGraph_`

数据载体: `KnowledgeGraph`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `concept_name` | `string` | ✓ |  |
| `description` | `string` |  |  |
| `parent_id` | `number` |  |  |
| `tags` | `string[]` |  |  |
| `id` | `number` | ✓ |  |
| `created_at` | `string` | ✓ |  |
| `updated_at` | `string` | ✓ |  |
| `children` | `KnowledgeGraph[]` |  |  |
| ↳ `concept_name` | `string` | ✓ |  |
| ↳ `description` | `string` |  |  |
| ↳ `parent_id` | `number` |  |  |
| ↳ `tags` | `string[]` |  |  |
| ↳ `id` | `number` | ✓ |  |
| ↳ ... 还有 3 个嵌套字段 | | | |

## GET `/business/ai-strategy`

> List Ai Strategy

- **认证**: ✓
- **标签**: business

### 响应: `ResponseModel_List_AIStrategy__`

数据载体: `AIStrategy[]`

## POST `/business/ai-strategy`

> Create Ai Strategy

- **认证**: ✓
- **标签**: business

### 请求体: `AIStrategyCreate`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | `string` | ✓ |  |
| `model_name` | `string` | ✓ |  |
| `temperature` | `number` |  |  |
| `max_tokens` | `number` |  |  |
| `system_prompt` | `string` | ✓ |  |
| `is_active` | `boolean` |  |  |

### 响应: `ResponseModel_AIStrategy_`

数据载体: `AIStrategy`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | `string` | ✓ |  |
| `model_name` | `string` | ✓ |  |
| `temperature` | `number` |  |  |
| `max_tokens` | `number` |  |  |
| `system_prompt` | `string` | ✓ |  |
| `is_active` | `boolean` |  |  |
| `id` | `number` | ✓ |  |
| `created_at` | `string` | ✓ |  |
| `updated_at` | `string` | ✓ |  |

## GET `/business/interview-config`

> List Interview Config

- **认证**: ✓
- **标签**: business

### 响应: `ResponseModel_List_InterviewConfig__`

数据载体: `InterviewConfig[]`

## POST `/business/interview-config`

> Create Interview Config

- **认证**: ✓
- **标签**: business

### 请求体: `InterviewConfigCreate`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | `string` | ✓ |  |
| `video_resolution` | `string` |  |  |
| `audio_codec` | `string` |  |  |
| `enable_recording` | `boolean` |  |  |
| `max_duration_minutes` | `number` |  |  |
| `job_position_id` | `number` |  |  |
| `strategy_id` | `number` |  |  |
| `max_rounds` | `number` |  |  |

### 响应: `ResponseModel_InterviewConfig_`

数据载体: `InterviewConfig`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | `string` | ✓ |  |
| `video_resolution` | `string` |  |  |
| `audio_codec` | `string` |  |  |
| `enable_recording` | `boolean` |  |  |
| `max_duration_minutes` | `number` |  |  |
| `job_position_id` | `number` |  |  |
| `strategy_id` | `number` |  |  |
| `max_rounds` | `number` |  |  |
| `id` | `number` | ✓ |  |
| `created_at` | `string` | ✓ |  |
| `updated_at` | `string` | ✓ |  |

## GET `/business/interview-session`

> List Interview Session

- **认证**: ✓
- **标签**: business

### 响应: `ResponseModel_List_InterviewSession__`

数据载体: `InterviewSession[]`

## POST `/business/interview-session`

> Create Interview Session

- **认证**: ✓
- **标签**: business

### 请求体: `InterviewSessionCreate`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `candidate_id` | `number` | ✓ |  |
| `config_id` | `number` | ✓ |  |
| `strategy_id` | `number` |  |  |
| `status` | `string` |  |  |
| `current_round` | `number` |  |  |
| `summary` | `string` |  |  |

### 响应: `ResponseModel_InterviewSession_`

数据载体: `InterviewSession`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `candidate_id` | `number` | ✓ |  |
| `config_id` | `number` | ✓ |  |
| `strategy_id` | `number` |  |  |
| `status` | `string` |  |  |
| `current_round` | `number` |  |  |
| `summary` | `string` |  |  |
| `id` | `number` | ✓ |  |
| `score` | `number` |  |  |
| `feedback` | `string` |  |  |
| `start_time` | `string` |  |  |
| `end_time` | `string` |  |  |
| `created_at` | `string` | ✓ |  |

## GET `/business/agent-state`

> List Agent State

- **认证**: ✓
- **标签**: business

### 响应: `ResponseModel_List_AgentState__`

数据载体: `AgentState[]`
