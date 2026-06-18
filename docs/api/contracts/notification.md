# Notification 模块 — 接口契约摘要

> 自动生成自 `docs/api/schemas/notification.openapi.json`
> 用途: 给 AI Agent 提供精简接口契约上下文，替代原始 OpenAPI JSON

## GET `/notifications`

> 获取通知列表

- **认证**: ✓
- **标签**: notification

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `skip` | query | `number` |  |  |
| `limit` | query | `number` |  |  |

### 响应: `ResponseModel_List_Notification_`

数据载体: `Notification[]`

## GET `/notifications/unread-count`

> 获取未读通知数量

- **认证**: ✓
- **标签**: notification

### 响应: `ResponseModel_int_`

数据载体: `number`

## PUT `/notifications/{notification_id}/read`

> 标记单条通知已读

- **认证**: ✓
- **标签**: notification

### 参数

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `notification_id` | path | `number` | ✓ |  |

### 响应: `ResponseModel_str_`

数据载体: `string`

## PUT `/notifications/read-all`

> 全部标记已读

- **认证**: ✓
- **标签**: notification

### 响应: `ResponseModel_str_`

数据载体: `string`

## GET `/notifications/preferences`

> 获取通知偏好设置

- **认证**: ✓
- **标签**: notification

### 响应: `ResponseModel_NotificationPreferences_`

数据载体: `NotificationPreferences`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `email_notifications` | `boolean` | ✓ |  |
| `push_notifications` | `boolean` | ✓ |  |
| `interview_reminders` | `boolean` | ✓ |  |
| `community_updates` | `boolean` | ✓ |  |
| `learning_reminders` | `boolean` | ✓ |  |

## PUT `/notifications/preferences`

> 更新通知偏好设置

- **认证**: ✓
- **标签**: notification

### 请求体: `NotificationPreferencesUpdate`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `email_notifications` | `boolean` |  |  |
| `push_notifications` | `boolean` |  |  |
| `interview_reminders` | `boolean` |  |  |
| `community_updates` | `boolean` |  |  |
| `learning_reminders` | `boolean` |  |  |

### 响应: `ResponseModel_NotificationPreferences_`

数据载体: `NotificationPreferences`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `email_notifications` | `boolean` | ✓ |  |
| `push_notifications` | `boolean` | ✓ |  |
| `interview_reminders` | `boolean` | ✓ |  |
| `community_updates` | `boolean` | ✓ |  |
| `learning_reminders` | `boolean` | ✓ |  |

## POST `/notifications/device-token`

> 注册设备推送令牌

- **认证**: ✓
- **标签**: notification

### 请求体: `DeviceTokenRegisterRequest`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `token` | `string` | ✓ |  |
| `platform` | `string` | ✓ |  |

### 响应: `ResponseModel_str_`

数据载体: `string`
