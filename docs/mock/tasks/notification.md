# Notification 模块 — 实施计划

> **模块**: 消息通知（Notification）  
> **优先级**: P1 — 提升用户体验  
> **后端前缀**: `/api/v1/notifications`  
> **预估数据量**: 5 条通知 + 1 套偏好设置  
> **依赖**: Auth 模块

---

## 0. 前置确认

- [ ] 确认 `notifications` 表 Schema（含 `title`, `content`, `type`, `is_read`, `link` 等）
- [ ] 确认 `notification_preferences` 表 Schema（或合并到 users 表）
- [ ] 确认 `device_tokens` 表 Schema（推送设备 Token，如后端已实现）
- [ ] 确认通知生成机制（面试邀请、社区互动、学习提醒等由哪些业务事件触发）
- [ ] 确认前端轮询策略（无 WebSocket 推送，建议每 30 秒轮询 `/unread-count`）

---

## 1. 数据库表创建

### 1.1 通知表

- [ ] 1.1.1 确认 `notifications` 表结构

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键 |
| user_id | integer | 外键 → users.id |
| title | varchar | 通知标题 |
| content | text | 通知内容 |
| type | varchar | 类型（interview / community / learning / system） |
| is_read | boolean | 是否已读 |
| link | varchar | 跳转链接（可为 null） |
| created_at | timestamp | 创建时间 |

### 1.2 通知偏好表（需后端新增接口）

- [ ] 1.2.1 确认是否需要新建 `notification_preferences` 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键 |
| user_id | integer | 外键 → users.id |
| email_notifications | boolean | 邮件通知 |
| push_notifications | boolean | 推送通知 |
| interview_reminders | boolean | 面试提醒 |
| community_updates | boolean | 社区更新 |
| learning_reminders | boolean | 学习提醒 |

### 1.3 设备 Token 表（需后端新增接口）

- [ ] 1.3.1 确认是否需要新建 `device_tokens` 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | integer | 主键 |
| user_id | integer | 外键 → users.id |
| token | varchar | 设备 Token |
| platform | varchar | 平台（ios / android / web） |
| created_at | timestamp | 注册时间 |

---

## 2. 种子数据插入

### 2.1 通知数据（5 条，user_id=1）

- [ ] 2.1.1 插入通知

| ID | 标题 | 类型 | 已读 | 时间 | 链接 | 内容 |
|----|------|------|------|------|------|------|
| 1 | 面试邀请 | interview | 否 | 2026-05-30T10:00:00Z | /interview | 您收到了一份来自字节跳动的前端开发面试邀请，请及时确认。 |
| 2 | 社区互动 | community | 否 | 2026-05-29T14:30:00Z | /community | 您的帖子《Vue3 组合式 API 最佳实践》获得了 15 个点赞。 |
| 3 | 学习提醒 | learning | 是 | 2026-05-28T09:00:00Z | /knowledge | 您收藏的题库《React 面试高频题》已有 3 天未练习，快来复习吧！ |
| 4 | 系统维护通知 | system | 是 | 2026-05-27T16:00:00Z | null | 系统将于本周六 02:00-04:00 进行例行维护，届时服务将暂停。 |
| 5 | 面试报告已生成 | interview | 否 | 2026-05-31T08:00:00Z | /report | 您的游戏式面试关卡 3 报告已生成，点击查看详细评分。 |

### 2.2 通知偏好设置（user_id=1）

- [ ] 2.2.1 插入通知偏好

```json
{
  "user_id": 1,
  "email_notifications": true,
  "push_notifications": true,
  "interview_reminders": true,
  "community_updates": false,
  "learning_reminders": true
}
```

---

## 3. API 接口验证

- [ ] 3.1 `GET /notifications` — 获取消息列表（验证分页）
- [ ] 3.2 `GET /notifications/unread-count` — 获取未读消息总数（红点用）
- [ ] 3.3 `PUT /notifications/{id}/read` — 单条标记已读
- [ ] 3.4 `PUT /notifications/read-all` — 一键全部已读

---

## 4. ⚠️ 需后端新增的接口

以下接口在 Mock 中存在但后端 API 清单中无对应实现：

- [ ] 4.1 `GET /notifications/preferences` — 获取通知偏好设置（建议合并到 User 模块）
- [ ] 4.2 `PUT /notifications/preferences` — 更新通知偏好设置（建议合并到 User 模块）
- [ ] 4.3 `POST /notifications/device-token` — 设备 Token 注册（建议新增推送模块）

---

## 5. 验证清单

- [ ] 5.1 调用 `GET /notifications` 返回 5 条通知
- [ ] 5.2 调用 `GET /notifications/unread-count` 返回 3（未读通知数）
- [ ] 5.3 调用 `PUT /notifications/1/read` 标记已读，`unread-count` 变为 2
- [ ] 5.4 调用 `PUT /notifications/read-all` 一键已读，`unread-count` 变为 0
- [ ] 5.5 验证分页：`GET /notifications?skip=0&limit=2` 只返回 2 条