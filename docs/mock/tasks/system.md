# System 模块 — 实施计划

> **模块**: 系统管理（System）  
> **优先级**: P3 — 管理后台专用  
> **后端前缀**: `/api/v1/system`  
> **预估数据量**: 3 条配置 + 2 条公告  
> **依赖**: Auth 模块（需要管理员权限）

---

## 0. 前置确认

- [ ] 确认 `system_configs` 表 Schema（key-value 配置）
- [ ] 确认 `system_announcements` 表是否需要新建（当前后端无此接口）
- [ ] 确认 `system_health` 接口是否需要新增（当前后端无此接口，或已有 `/health` 端点）
- [ ] 确认 `audit_logs` 表 Schema（审计日志）
- [ ] 确认管理员权限配置（RBAC）

---

## 1. 数据库表创建

### 1.1 系统配置表

- [ ] 1.1.1 确认 `system_configs` 表结构

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键 |
| key | varchar | 配置键（唯一） |
| value | varchar | 配置值 |
| description | varchar | 描述 |

### 1.2 系统公告表（需后端新增接口）

- [ ] 1.2.1 确认是否需要新建 `system_announcements` 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键 |
| title | varchar | 公告标题 |
| content | text | 公告内容 |
| type | varchar | 类型（info / maintenance / warning） |
| start_time | timestamp | 开始时间 |
| end_time | timestamp | 结束时间（可为 null） |
| is_active | boolean | 是否生效 |

### 1.3 审计日志表

- [ ] 1.3.1 确认 `audit_logs` 表结构（如后端已实现）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键 |
| user_id | integer | 外键 → users.id |
| action | varchar | 操作类型 |
| resource | varchar | 操作资源 |
| detail | jsonb | 操作详情 |
| ip_address | varchar | IP 地址 |
| created_at | timestamp | 操作时间 |

---

## 2. 种子数据插入

### 2.1 系统配置（3 条）

- [ ] 2.1.1 插入系统配置

| key | value | description |
|-----|-------|-------------|
| max_interview_sessions | 10 | 用户最大同时进行面试会话数 |
| ai_review_enabled | true | 是否启用 AI 评审功能 |
| daily_question_limit | 50 | 每日刷题上限 |

### 2.2 系统公告（2 条）

- [ ] 2.2.1 插入系统公告

| ID | 标题 | 类型 | 开始时间 | 结束时间 | 状态 |
|----|------|------|----------|----------|------|
| 1 | 新功能上线：AI 简历诊断 | info | 2026-05-25T00:00:00Z | 2026-06-25T00:00:00Z | active |
| 2 | 系统升级维护通知 | maintenance | 2026-05-28T00:00:00Z | null | active |

公告内容：

**公告 1**: "我们推出了全新的 AI 简历诊断功能，帮助您快速发现简历中的不足并提供优化建议。"

**公告 2**: "系统将于 2026-06-01 02:00-04:00 进行升级维护，届时部分功能可能暂时不可用。"

### 2.3 系统健康状态（仅参考，不入库）

> **注意**: `GET /system/health` 返回的是实时系统状态，不需要种子数据。Mock 中的参考值：
> ```json
> { "status": "healthy", "version": "0.1.0", "uptime": 86400, "database": "connected", "redis": "connected" }
> ```

---

## 3. API 接口验证

- [ ] 3.1 `GET /system/config` — 获取系统配置列表（需要 `config:read` 权限）
- [ ] 3.2 `POST /system/config` — 创建系统配置（需要 `config:create` 权限）
- [ ] 3.3 `GET /system/audit-log` — 获取审计日志（需要 `audit_log:read` 权限）

---

## 4. ⚠️ 需后端新增的接口

以下接口在 Mock 中存在但后端 API 清单中无对应实现：

- [ ] 4.1 `GET /system/health` — 健康检查（建议新增运维接口，或使用已有 `/health` 端点）
- [ ] 4.2 `GET /system/announcements` — 系统公告（建议新增公告模块）

---

## 5. 验证清单

- [ ] 5.1 管理员登录后调用 `GET /system/config` 返回 3 条配置
- [ ] 5.2 调用 `POST /system/config` 新增配置项
- [ ] 5.3 普通用户调用 `GET /system/config` 返回 403（权限不足）
- [ ] 5.4 调用 `GET /system/audit-log` 返回审计日志（分页）
- [ ] 5.5 调用 `GET /system/health` 返回系统健康状态（如已实现）