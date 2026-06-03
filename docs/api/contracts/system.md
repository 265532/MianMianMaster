# System 模块 — 接口契约摘要

> 自动生成自 `docs/api/schemas/system.openapi.json`
> 用途: 给 AI Agent 提供精简接口契约上下文，替代原始 OpenAPI JSON

## GET `/system/config`

> 获取系统配置列表

- **认证**: ✓
- **标签**: system

### 响应: `ResponseModel_List_SystemConfig_`

数据载体: `SystemConfig[]`

## POST `/system/config`

> 创建系统配置项

- **认证**: ✓
- **标签**: system

### 请求体: `SystemConfigCreate`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `key` | `string` | ✓ |  |
| `value` | `string` | ✓ |  |
| `description` | `string` |  |  |

### 响应: `ResponseModel_SystemConfig_`

数据载体: `SystemConfig`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `key` | `string` | ✓ |  |
| `value` | `string` | ✓ |  |
| `description` | `string` |  |  |

## GET `/system/health`

> 获取系统健康状态

- **认证**: ✗
- **标签**: system

### 响应: `ResponseModel_SystemHealth_`

数据载体: `SystemHealth`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `status` | `string` | ✓ |  |
| `version` | `string` | ✓ |  |
| `uptime` | `number` | ✓ |  |
| `database` | `string` | ✓ |  |
| `redis` | `string` | ✓ |  |

## GET `/system/announcements`

> 获取系统公告列表

- **认证**: ✗
- **标签**: system

### 响应: `ResponseModel_List_SystemAnnouncement_`

数据载体: `SystemAnnouncement[]`

## GET `/system/audit-log`

> 获取审计日志（分页）

- **认证**: ✓
- **标签**: system

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `skip` | query | `number` |  |  |
| `limit` | query | `number` |  |  |

### 响应: `ResponseModel_List_AuditLog_`

数据载体: `AuditLog[]`
