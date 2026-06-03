# Week 4: Business + Role + System 模块契约漂移修复

> **阶段**: Week 4 — P3 管理后台  
> **模块**: Business(业务配置) + Role(权限管理) + System(系统管理)  
> **总端点数**: 19 (Business 9 + Role 5 + System 5)  
> **优先级**: P3 — 管理后台功能  
> **前置依赖**: Week 1 完成 (Auth 认证)  
> **契约基准**: [api-contract-summary.md](./api-contract-summary.md) § Business / RBAC / System  
> **对应总体进度**: [progress.md](./progress.md)

---

## 一、目标与范围

### 1.1 目标

确保 Business(业务配置)、Role(权限管理)、System(系统管理) 三个 P3 模块的前端代码与后端 API 契约完全对齐，使管理员可以管理角色/权限/业务配置/审计日志。

### 1.2 范围

| 模块 | 端点数 | 涉及前端文件 |
|------|--------|-------------|
| Business | 9 | `business.types.ts`, `business.api.ts`, `stores/knowledge.ts` (评估是否需要独立 Store) |
| Role | 5 | `role.types.ts`, `role.api.ts` |
| System | 5 | `system.types.ts`, `system.api.ts`, `stores/notification.ts` (公告部分) |

> **注意**: Business/Role/System 主要为管理后台接口，当前前端可能没有对应的 View 页面。组件适配项仅在对应页面存在时执行。

### 1.3 验收标准

- [ ] 所有 19 个端点前端调用签名与 `api-contract-summary.md` 100% 一致
- [ ] TypeScript 编译零错误 (`vue-tsc --noEmit`)
- [ ] Vite 构建成功 (`vite build`)
- [ ] 管理后台接口 Mock 模式验证通过

---

## 二、模块 H: Business (业务配置) — 9 端点

### 2.1 契约摘要

<details>
<summary>展开查看 Business 模块完整契约</summary>

| # | 端点 | 方法 | 认证 | 关键字段 |
|---|------|------|------|----------|
| H1 | `/api/v1/business/knowledge-graph` | GET | 是 | 响应数组: `concept_name`, `description`?, `parent_id`?, `tags`?, `id`, `created_at`, `updated_at`, `children`? (KnowledgeGraph[]) |
| H2 | `/api/v1/business/knowledge-graph` | POST | 是 | 请求: `concept_name`, `description`?, `parent_id`?, `tags`? ⏐ 响应: 同上 + `children`? |
| H3 | `/api/v1/business/ai-strategy` | GET | 是 | 响应数组: `name`, `model_name`, `temperature`?, `max_tokens`?, `system_prompt`, `is_active`?, `id`, `created_at`, `updated_at` |
| H4 | `/api/v1/business/ai-strategy` | POST | 是 | 请求: 同 H3 请求字段 ⏐ 响应: 同上 |
| H5 | `/api/v1/business/interview-config` | GET | 是 | 响应数组: `name`, `video_resolution`?, `audio_codec`?, `enable_recording`?, `max_duration_minutes`?, `job_position_id`?, `strategy_id`?, `max_rounds`?, `id`, `created_at`, `updated_at` |
| H6 | `/api/v1/business/interview-config` | POST | 是 | 请求: 同 H5 请求字段 ⏐ 响应: 同上 |
| H7 | `/api/v1/business/interview-session` | GET | 是 | 响应数组: `candidate_id`, `config_id`, `strategy_id`?, `status`?, `current_round`?, `summary`?, `id`, `score`?, `feedback`?, `start_time`?, `end_time`?, `created_at` |
| H8 | `/api/v1/business/interview-session` | POST | 是 | 请求: `candidate_id`, `config_id`, `strategy_id`?, `status`?, `current_round`?, `summary`? ⏐ 响应: 同上 |
| H9 | `/api/v1/business/agent-state` | GET | 是 | 响应数组: `status`, `current_session_id`?, `metadata_info`?, `id`, `agent_id`, `agent_type`, `last_heartbeat` |

</details>

### 2.2 涉及文件

| 文件 | 角色 |
|------|------|
| `src/api/types/business.types.ts` | 类型: `KnowledgeGraph`, `KnowledgeGraphCreate`, `AiStrategy`, `AiStrategyCreate`, `InterviewConfig`, `InterviewConfigCreate`, `InterviewSession`, `InterviewSessionCreate`, `AgentState` |
| `src/api/modules/business.api.ts` | API: 9 个 API 函数 |
| `src/stores/knowledge.ts` | Store: 知识图谱数据可能复用 |

### 2.3 差异分析

| 接口 | 关键契约字段 | 匹配 | 漂移描述 | 修复方案 |
|------|------------|------|----------|----------|
| Knowledge Graph | 响应 `children`? (递归) | [ ] | | |
| Knowledge Graph | 请求 `tags`? (string[]) | [ ] | | |
| AI Strategy | `model_name`, `temperature`?, `max_tokens`?, `system_prompt` | [ ] | | |
| Interview Config | `video_resolution`?, `audio_codec`?, `max_duration_minutes`?, `job_position_id`?, `strategy_id`? | [ ] | | |
| Interview Session | `candidate_id`, `config_id`, `feedback`? | [ ] | | |
| Agent State | `agent_id`, `agent_type`, `current_session_id`?, `metadata_info`? (object), `last_heartbeat` | [ ] | | |

### 2.4 修复任务检查清单

#### Task H-1: 类型文件更新 (`business.types.ts`)

- [ ] H-1.1 核对 `KnowledgeGraph` 包含 `children`? (递归)
- [ ] H-1.2 核对 `KnowledgeGraphCreate` 包含 `tags`?
- [ ] H-1.3 核对 `AiStrategy` 所有字段 (`model_name`, `temperature`?, `max_tokens`?, `system_prompt`, `is_active`?)
- [ ] H-1.4 核对 `InterviewConfig` 所有字段
- [ ] H-1.5 核对 `InterviewSession` 所有字段 (含 `feedback`?)
- [ ] H-1.6 核对 `AgentState` 字段 (`agent_id`, `agent_type`, `metadata_info`?, `last_heartbeat`)

#### Task H-2: API 函数更新 (`business.api.ts`)

- [ ] H-2.1 `listKnowledgeGraph()` / `createKnowledgeGraph()` 签名对齐
- [ ] H-2.2 `listAiStrategy()` / `createAiStrategy()` 签名对齐
- [ ] H-2.3 `listInterviewConfig()` / `createInterviewConfig()` 签名对齐
- [ ] H-2.4 `listInterviewSession()` / `createInterviewSession()` 签名对齐
- [ ] H-2.5 `listAgentState()` 签名对齐

#### Task H-3: Store 评估

- [ ] H-3.1 `knowledgeStore` 是否复用 KnowledgeGraph CRUD
- [ ] H-3.2 是否需要独立 `businessStore` (管理后台)

#### Task H-4: 联调验证 (Mock)

- [ ] H-4.1 `GET/POST /business/knowledge-graph` — 知识图谱
- [ ] H-4.2 `GET/POST /business/ai-strategy` — AI 策略
- [ ] H-4.3 `GET/POST /business/interview-config` — 面试配置
- [ ] H-4.4 `GET/POST /business/interview-session` — 面试会话
- [ ] H-4.5 `GET /business/agent-state` — Agent 状态

---

## 三、模块 I: Role (权限管理) — 5 端点

### 3.1 契约摘要

<details>
<summary>展开查看 Role 模块完整契约</summary>

| # | 端点 | 方法 | 认证 | 关键字段 |
|---|------|------|------|----------|
| I1 | `/api/v1/rbac/roles` | GET | 是 | 响应数组: `name`, `description`?, `parent_id`?, `id`, `created_at`, `updated_at`, `permissions`? (Permission[]) |
| I2 | `/api/v1/rbac/roles` | POST | 是 | 请求: `name`, `description`?, `parent_id`?, `permission_ids`? ⏐ 响应: 同 I1 + `permissions`? |
| I3 | `/api/v1/rbac/roles/{role_id}/permissions` | POST | 是 | 路径: `role_id` ⏐ 请求: (空，permission_ids 在注册时?) ⏐ 响应: 同 I1 |
| I4 | `/api/v1/rbac/users/{user_id}/roles` | POST | 是 | 路径: `user_id` ⏐ 请求: (role_ids?) ⏐ 响应: `string` |
| I5 | `/api/v1/rbac/permissions` | GET | 是 | 响应数组: `name`, `description`?, `resource`, `action`, `id`, `created_at`, `updated_at` |

</details>

### 3.2 涉及文件

| 文件 | 角色 |
|------|------|
| `src/api/types/role.types.ts` | 类型: `Role`, `RoleCreate`, `Permission`, `AssignRolePermissions`, `AssignUserRoles` |
| `src/api/modules/role.api.ts` | API: 5 个 API 函数 |

### 3.3 差异分析

| 接口 | 契约字段 | 匹配 | 漂移描述 | 修复方案 |
|------|---------|------|----------|----------|
| `GET /roles` | 响应 `parent_id`? | [ ] | | |
| `GET /roles` | 响应 `permissions`? (Permission[]) | [ ] | | |
| `POST /roles` | 请求 `parent_id`? + `permission_ids`? | [ ] | | |
| `POST /roles/{id}/permissions` | 请求体为空 | [ ] | | |
| `GET /permissions` | `resource`, `action` 字段 | [ ] | | |

### 3.4 修复任务检查清单

#### Task I-1: 类型文件更新 (`role.types.ts`)

- [ ] I-1.1 核对 `Role` 包含 `parent_id`?, `permissions`?
- [ ] I-1.2 核对 `RoleCreate` 包含 `parent_id`? + `permission_ids`?
- [ ] I-1.3 核对 `Permission` 包含 `resource`, `action`
- [ ] I-1.4 核对 `AssignRolePermissions` / `AssignUserRoles` 类型

#### Task I-2: API 函数更新 (`role.api.ts`)

- [ ] I-2.1 `listRoles()` / `createRole()` 签名对齐
- [ ] I-2.2 `assignPermissionsToRole()` 路径参数 `role_id`
- [ ] I-2.3 `assignRoleToUser()` 路径参数 `user_id`
- [ ] I-2.4 `listPermissions()` 签名对齐

#### Task I-3: 联调验证 (Mock)

- [ ] I-3.1 `GET/POST /rbac/roles` — 角色列表与创建
- [ ] I-3.2 `POST /rbac/roles/{id}/permissions` — 角色分配权限
- [ ] I-3.3 `POST /rbac/users/{id}/roles` — 用户分配角色
- [ ] I-3.4 `GET /rbac/permissions` — 权限列表

---

## 四、模块 J: System (系统管理) — 5 端点

### 4.1 契约摘要

<details>
<summary>展开查看 System 模块完整契约</summary>

| # | 端点 | 方法 | 认证 | 关键字段 |
|---|------|------|------|----------|
| J1 | `/api/v1/system/config` | GET | 是 | 响应数组: `key`, `value` (object), `description`?, `id`, `updated_at` |
| J2 | `/api/v1/system/config` | POST | 是 | 请求: `key`, `value` (object), `description`? ⏐ 响应: 同 J1 |
| J3 | `/api/v1/system/audit-log` | GET | 是 | 响应数组: `user_id`?, `action`, `resource`, `ip_address`?, `details`? (object), `id`, `created_at` |
| J4 | `/api/v1/system/health` | GET | 否 | 响应: `status`, `version`, `checks` (object), `timestamp` |
| J5 | `/api/v1/system/announcements` | GET | 否 | 响应数组: `id`, `title`, `content`, `is_active`?, `priority`?, `published_at`?, `expires_at`?, `created_at` |

</details>

### 4.2 涉及文件

| 文件 | 角色 |
|------|------|
| `src/api/types/system.types.ts` | 类型: `SystemConfig`, `SystemConfigCreate`, `AuditLog`, `HealthStatus`, `Announcement` |
| `src/api/modules/system.api.ts` | API: 5 个 API 函数 |
| `src/stores/notification.ts` | Store: 公告可能通过通知 Store 暴露 |

### 4.3 差异分析

| 接口 | 契约字段 | 匹配 | 漂移描述 | 修复方案 |
|------|---------|------|----------|----------|
| `GET /config` | `value` 类型为 `object` | [ ] | | |
| `POST /config` | `value` 类型为 `object` | [ ] | | |
| `GET /audit-log` | `user_id`?, `ip_address`?, `details`? (object) | [ ] | | |
| `GET /health` | `checks` (object), `version`, `timestamp` | [ ] | | |
| `GET /announcements` | `is_active`?, `priority`?, `published_at`?, `expires_at`? | [ ] | | |

### 4.4 修复任务检查清单

#### Task J-1: 类型文件更新 (`system.types.ts`)

- [ ] J-1.1 核对 `SystemConfig` / `SystemConfigCreate` (`value: object`)
- [ ] J-1.2 核对 `AuditLog` 所有字段 (`user_id`?, `ip_address`?, `details`?)
- [ ] J-1.3 核对 `HealthStatus` (`status`, `version`, `checks`, `timestamp`)
- [ ] J-1.4 核对 `Announcement` (`is_active`?, `priority`?, `published_at`?, `expires_at`?)

#### Task J-2: API 函数更新 (`system.api.ts`)

- [ ] J-2.1 `listSystemConfigs()` / `createSystemConfig()` 签名对齐
- [ ] J-2.2 `getAuditLogs()` 签名对齐
- [ ] J-2.3 `getHealthStatus()` 签名对齐
- [ ] J-2.4 `getAnnouncements()` 签名对齐 + 分页(如有)

#### Task J-3: 联调验证 (Mock)

- [ ] J-3.1 `GET/POST /system/config` — 系统配置
- [ ] J-3.2 `GET /system/audit-log` — 审计日志
- [ ] J-3.3 `GET /system/health` — 健康检查
- [ ] J-3.4 `GET /system/announcements` — 系统公告

---

## 五、Week 4 进度跟踪

### 5.1 模块进度

| 模块 | 端点数 | 漂移点 | 类型 | API | Store | 组件 | Mock | 联调 | 完成率 |
|------|--------|--------|------|-----|-------|------|------|------|--------|
| Business | 9 | [ ] | [ ] | [ ] | [ ] | N/A | [ ] | [ ] | 0% |
| Role | 5 | [ ] | [ ] | [ ] | N/A | N/A | [ ] | [ ] | 0% |
| System | 5 | [ ] | [ ] | [ ] | [ ] | N/A | [ ] | [ ] | 0% |

### 5.2 任务进度

| 任务 | 子项数 | 已完成 | 进度 | 负责人 | 计划完成 | 实际完成 | 状态 |
|------|--------|--------|------|--------|----------|----------|------|
| Business: Diff 分析 | 6 | 0 | 0% | - | - | - | 🔴 |
| Business: 类型更新 | 6 | 0 | 0% | - | - | - | 🔴 |
| Business: API 更新 | 5 | 0 | 0% | - | - | - | 🔴 |
| Business: Store 评估 | 2 | 0 | 0% | - | - | - | 🔴 |
| Business: 联调验证 | 5 | 0 | 0% | - | - | - | 🔴 |
| Role: Diff 分析 | 5 | 0 | 0% | - | - | - | 🔴 |
| Role: 类型更新 | 4 | 0 | 0% | - | - | - | 🔴 |
| Role: API 更新 | 4 | 0 | 0% | - | - | - | 🔴 |
| Role: 联调验证 | 4 | 0 | 0% | - | - | - | 🔴 |
| System: Diff 分析 | 5 | 0 | 0% | - | - | - | 🔴 |
| System: 类型更新 | 4 | 0 | 0% | - | - | - | 🔴 |
| System: API 更新 | 4 | 0 | 0% | - | - | - | 🔴 |
| System: 联调验证 | 4 | 0 | 0% | - | - | - | 🔴 |

### 5.3 Week 4 质量门禁

- [ ] `vue-tsc --noEmit` 零错误
- [ ] `vite build` 构建成功
- [ ] Mock 模式: Business/Role/System 接口均可正常调用
- [ ] 管理后台 Mock 数据符合契约定义

---

## 六、风险与问题记录

### Week 4 特定风险

| # | 风险 | 影响 | 对策 | 状态 |
|---|------|------|------|------|
| W4-1 | Business 模块 `knowledge-graph` 与 `stores/knowledge.ts` 可能有命名冲突 | Business | 评估字段差异，确认是否共用 `KnowledgeGraph` 类型 | [ ] |
| W4-2 | `SystemConfig.value` 为 `object` 类型，前端需处理序列化 | System | JSON.stringify/parse 处理 | [ ] |
| W4-3 | `AgentState.metadata_info` 为 `object`，具体结构未定 | Business | 使用 `Record<string, unknown>` 或与后端对齐 | [ ] |
| W4-4 | Role/System 接口可能缺少 Mock handler | Role, System | Week 4 前补充 | [ ] |
| W4-5 | 管理后台 View 页面可能未实现 | Business, Role, System | 仅确保 API 层对齐，View 层后续开发 | [ ] |

### Week 4 问题记录

| # | 日期 | 问题描述 | 影响模块 | 解决方案 | 状态 |
|---|------|----------|----------|----------|------|
| - | - | 暂无 | - | - | - |

---

## 七、变更记录

| 日期 | 变更 | 作者 |
|------|------|------|
| 2026-06-03 | 初始化 Week 4 子任务文档 | AI |